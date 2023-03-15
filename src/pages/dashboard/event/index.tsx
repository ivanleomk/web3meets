import {
  createServerSupabaseClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Button } from "../../../components/Button";
import CreateEventForm from "../../../components/CreateEventForm";
import SectionHeader from "../../../components/SectionHeader";
import {
  adminServerSupabaseInstance,
  serverSupabaseInstance,
} from "../../../server/supabase/sharedInstance";
import { Event, Partner, PromotionalMaterial } from "../../../types/database";
import {
  City,
  Country,
  eventCreationInputType,
  eventLocation,
  eventPaymentType,
} from "../../../types/event";
import { EVENT_IMAGE_BUCKET } from "../../../types/storage";
import { api } from "../../../utils/api";
import { uploadFiles } from "../../../utils/file";

type Props = {
  EventInformation: Event & { PromotionalMaterial: PromotionalMaterial[] };
  PartnerInformation: Partner;
};

const EventPage = ({ EventInformation, PartnerInformation }: Props) => {
  console.log(EventInformation, PartnerInformation);
  const router = useRouter();
  const { event_id } = router.query;
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialFallbackImage, setInitialFallbackImage] = useState<
    null | string
  >(null);

  const supabaseClient = useSupabaseClient();

  const { mutateAsync: updateEvent } = api.event.updateEvent.useMutation();
  const { mutateAsync: deleteImages } = api.event.deleteAllImages.useMutation();
  const { mutateAsync: uploadImages } = api.event.uploadImages.useMutation();

  useEffect(() => {
    const non_hosted_images = EventInformation.PromotionalMaterial.filter(
      (item) => {
        return !item.image_url.includes(
          process.env.NEXT_PUBLIC_IMAGE_BUCKET as string
        );
      }
    );

    if (non_hosted_images.length > 0) {
      // User has chosen to provide a banner image which is not hosted on our servers. Therefore we just set fallback_image to the value;
      setLoading(false);
      setInitialFallbackImage(non_hosted_images.at(0)?.image_url ?? null);
      return;
    }

    const existingImages = EventInformation.PromotionalMaterial.map(
      async (item) => {
        const path = `${item.image_url}`;
        const response = await fetch(path);
        const blob = await response.blob();
        const file = new File([blob], item.original_name as string, {
          type: blob.type,
        });
        return file;
      }
    );

    Promise.all(existingImages)
      .then((res) => {
        setFiles(res);
        setLoading(false);
      })
      .catch((err) => {
        toast.warning(err);
      });
  }, [EventInformation.PromotionalMaterial]);

  if (loading) {
    return (
      <>
        <Button variant="outline" href="/dashboard" text="Back to Dashboard" />
        <div className="-mb-12" />
        <SectionHeader title={"Update Event Information"} subtitle={""}>
          <ClipLoader />
        </SectionHeader>
      </>
    );
  }

  const processedEventInformation: eventCreationInputType & {
    event_id: string;
  } = {
    ...EventInformation,
    starts_at: new Date(EventInformation.starts_at),
    ends_at: new Date(EventInformation.ends_at),
    city: {
      value: EventInformation.city as City,
      label: EventInformation.city as City,
    },
    country: {
      value: EventInformation.country as Country,
      label: EventInformation.country as Country,
    },
    event_type: EventInformation.event_type as eventPaymentType,
    partner_id: {
      value: EventInformation.partner_id,
      label:
        EventInformation.partner_id === process.env.NEXT_PUBLIC_NONE_PARTNER
          ? "Input My Own"
          : PartnerInformation.partner_name,
    },
    online: EventInformation.online
      ? eventLocation.online
      : eventLocation.offline,
    images: files,
    category: {
      value: EventInformation.category,
      label: EventInformation.category,
    },
    fallback_image: initialFallbackImage,
    fallback_name: EventInformation?.fallback_name,
  };

  return (
    <>
      <Button variant="outline" href="/dashboard" text="Back to Dashboard" />
      <div className="-mb-12" />
      <SectionHeader title={"Update Event Information"} subtitle={""}>
        <CreateEventForm
          initialValue={processedEventInformation}
          initialUploadImage={initialFallbackImage === null}
          onSubmit={async (data) => {
            const responseObj = {
              event_id: event_id as string,
              ...data,
            };

            try {
              // TODO: Optimization here maybe? But it's really just a single SQL query so not much is needed
              await deleteImages({
                event_id: event_id as string,
                partner_id: data.partner_id.value,
              });
              await updateEvent(responseObj);

              // User has provided images
              if (data.images) {
                await uploadFiles(
                  data.images,
                  supabaseClient,
                  uploadImages,
                  event_id as string
                );
              }
            } catch (err) {
              console.log(err);
              toast.warning(
                "Unable to update event. Please try again later or contact support if this issue persists"
              );
              return;
            }
            toast.success("Succesfully updated event details.");
          }}
          buttonText="Update Event Details"
        />
      </SectionHeader>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  const { event_id } = ctx.query;
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id;

  // Step 1 : Get Event data
  const { data: EventInformation, error: EventInformationError } =
    await adminServerSupabaseInstance
      .from("Event")
      .select("*,PromotionalMaterial(*)")
      .eq("event_id", event_id)
      .maybeSingle();

  if (!EventInformation || EventInformationError) {
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=event_page&reason=no_event_information",
        permanent: false,
      },
    };
  }

  // We check to see two things - (1) Is the user an admin of this organization or (2) does this user have admin rights
  const { data, error } = await adminServerSupabaseInstance
    .from("User")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=event_page&reason=invalid_credentials",
        permanent: false,
      },
    };
  }

  if (
    EventInformation.partner_id === process.env.NEXT_PUBLIC_NONE_PARTNER &&
    EventInformation.user_id != user_id &&
    !data?.admin
  ) {
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=event_page&reason=invalid_credentials",
        permanent: false,
      },
    };
  }

  if (data?.admin || EventInformation.user_id == user_id) {
    return {
      props: {
        EventInformation,
      },
    };
  }

  const partner_id = EventInformation.partner_id as string;

  // Step 2 : Get partner ownership data
  const { data: PartnerOwnershipData, error: PartnerOwnershipDataError } =
    await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*,Partner(*)")
      .eq("partner_id", partner_id)
      .eq("user_id", user_id)
      .maybeSingle();

  if (!PartnerOwnershipData || PartnerOwnershipDataError) {
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=event_page&reason=invalid_credentials",
        permanent: false,
      },
    };
  }

  return {
    props: {
      EventInformation,
      PartnerInformation: PartnerOwnershipData.Partner,
    },
  };
};

export default EventPage;
