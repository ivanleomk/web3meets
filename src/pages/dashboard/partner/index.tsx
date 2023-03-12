import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import ActionModal from "../../../components/ActionModal";
import AddNewAdministrator from "../../../components/AddNewAdministrator";

import { Button } from "../../../components/Button";
import CreateOrganizationForm from "../../../components/CreateOrganizationForm";
import EventRow from "../../../components/EventRow";
import OrganizationMemberTableRow from "../../../components/OrganizationMemberTableRow";
import OrganizationStatus from "../../../components/OrganizationStatus";
import OrganizationTable from "../../../components/OrganizationTable";
import SectionHeader from "../../../components/SectionHeader";
import { EVENT_FIELDS } from "../../../config/organization";

import { adminServerSupabaseInstance } from "../../../server/supabase/sharedInstance";
import {
  type UserPartnerOwnershipWithUser,
  type Partner,
  type Event,
  type UserPartnerOwnershipWithUserAndPartner,
} from "../../../types/database";
import { api } from "../../../utils/api";

type Props = {
  partnerInformationAndMembers: UserPartnerOwnershipWithUserAndPartner[];
  currentEvents: Event[];
};

const PartnerPage = ({
  partnerInformationAndMembers,
  currentEvents,
}: Props) => {
  const router = useRouter();
  const { partner_id } = router.query;

  const { data: UserPartnershipOwnershipAndMembersData } =
    api.partner.getPartnerInformation.useQuery(
      {
        partner_id: partner_id as string,
      },
      {
        // Every 30s
        refetchInterval: 30000,
        initialData: partnerInformationAndMembers,
      }
    );

  const { data: OrganizationEventList } = api.event.getPartnerEvents.useQuery(
    {
      partner_id: partner_id as string,
    },
    {
      // Every 30s
      refetchInterval: 30000,
      initialData: currentEvents,
    }
  );

  const { mutate } = api.partner.updatePartnerDetails.useMutation({
    onSuccess: () => {
      toast.success("Succesfully updated information on Organization");
    },
    onError: () => {
      toast.success(
        "Unable to update database with requested changes. Please try again later or contact support if this topic persists."
      );
    },
  });

  const PartnerMetadata =
    UserPartnershipOwnershipAndMembersData.length >= 1
      ? (UserPartnershipOwnershipAndMembersData.at(0)?.Partner as Partner)
      : null;

  const MemberMetadata = UserPartnershipOwnershipAndMembersData.map(
    (partnerOwnership) => {
      const { approved, User, user_id, partner_id } = partnerOwnership;
      return {
        approved,
        User,
        user_id,
        partner_id,
      };
    }
  );
  const user = useUser();
  const userAdminRightsForOrganization =
    UserPartnershipOwnershipAndMembersData.find((item) => {
      return item.user_id == user?.id;
    });

  const organizationIsApproved = PartnerMetadata?.approved as boolean;
  const userIsApproved = userAdminRightsForOrganization?.approved as boolean;
  const hasOrganizationAdminRights = organizationIsApproved && userIsApproved;

  return (
    <div className="mx-auto max-w-6xl">
      <Button href="/dashboard" variant="outline" text="Return to Dashboard" />

      <h2 className="mt-10 mb-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {PartnerMetadata?.partner_name}
      </h2>
      <div className="mb-4">
        <OrganizationStatus
          active={PartnerMetadata?.approved ? PartnerMetadata?.approved : false}
        />
      </div>

      <SectionHeader
        title="Current Information"
        subtitle="Here are the current details for your organization"
      >
        <CreateOrganizationForm
          buttonText="Update Changes"
          initialValue={
            PartnerMetadata
              ? {
                  partner_name: PartnerMetadata.partner_name,
                  twitter_id: PartnerMetadata.twitter_id,
                  // User must submit a valid url for changes to be commited so this will always be non-null
                  website: PartnerMetadata.website,
                  telegram_handle: PartnerMetadata.telegram_handle,
                  bio: PartnerMetadata.bio ?? undefined,
                }
              : undefined
          }
          onSubmit={(data) => {
            const { partner_name, website, telegram_handle, twitter_id, bio } =
              data;
            const partner_id = PartnerMetadata?.partner_id as string;
            mutate({
              partner_id,
              partner_name,
              website: website,
              telegram_handle,
              twitter_id,
              bio,
            });
          }}
        />
      </SectionHeader>

      <SectionHeader
        title={"Members"}
        subtitle={
          "Here are the accounts with admin access to your organization"
        }
      >
        <OrganizationTable
          data={MemberMetadata as UserPartnerOwnershipWithUser[]}
          isLoading={false}
          errorMessage="Unable to fetch data on organization members. Please try again later"
          headerFields={["Email", "Approval Status"].map((item) => {
            return {
              label: item,
              sr_value: item,
            };
          })}
          renderComponent={(data: UserPartnerOwnershipWithUser) => {
            return (
              <OrganizationMemberTableRow
                organizationName={PartnerMetadata?.partner_name as string}
                data={data}
                adminAccess={!hasOrganizationAdminRights}
              />
            );
          }}
        />
        <div className="mt-16 flex w-full justify-end">
          <ActionModal
            buttonText="Add New User"
            variant="solid"
            modalTitle="Add New User"
            modalSubtitle={
              "Simply fill in the user's email address and we'll send over an invite to him to join your organisation if the email exists in our database"
            }
            metadata={{
              partner_id: PartnerMetadata?.partner_id as string,
            }}
            disabled={!hasOrganizationAdminRights}
          >
            <AddNewAdministrator />
          </ActionModal>
        </div>
      </SectionHeader>

      <SectionHeader
        title="Events Organised"
        subtitle="Here are all the events that you've organised under this organisation"
      >
        <OrganizationTable
          data={OrganizationEventList ? OrganizationEventList : []}
          isLoading={false}
          errorMessage="No Events found"
          headerFields={EVENT_FIELDS}
          renderComponent={(data) => {
            return <EventRow data={data} />;
          }}
        />
        <div className="mt-16 flex w-full justify-end">
          <Button
            text="Create New Event"
            href={`/dashboard?mode=Events&view=create`}
          />
        </div>
      </SectionHeader>
    </div>
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

  const { partner_id } = ctx.query;
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id;

  const { data, error } = await adminServerSupabaseInstance
    .from("UserPartnerOwnership")
    .select("*,User(*),Partner(*)")
    .eq("partner_id", partner_id)
    .eq("user_id", user_id);

  if (error || !data) {
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=partner_page&reason=invalid_credentials",
        permanent: false,
      },
    };
  }

  const { data: currentEvents, error: currentEventsError } =
    await adminServerSupabaseInstance
      .from("Event")
      .select("*")
      .eq("partner_id", partner_id);

  if (currentEventsError) {
    toast.warning("Unable to fetch list of events");
    return {
      redirect: {
        destination:
          "/dashboard?redirected_from=partner_page&reason=invalid_events",
        permanent: false,
      },
    };
  }

  return {
    props: {
      partnerInformationAndMembers: data,
      currentEvents: currentEvents ? currentEvents : [],
    },
  };
};

export default PartnerPage;
