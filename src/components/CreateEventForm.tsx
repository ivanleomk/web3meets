import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useOrganizationContext } from "../context/OrganizationContext";
import { useUserContext } from "../context/UserContext";
import { Event } from "../types/database";
import {
  type eventCreationInputType,
  eventCreationSchema,
  eventPaymentType,
  eventLocation,
  City,
  Country,
  eventCategories,
} from "../types/event";
import { api } from "../utils/api";
import { eventResponse } from "../utils/crawler";
import { Button } from "./Button";
import FormBox from "./FormBox";
import FormToggle from "./FormToggle";
import Input from "./Input";
import InputDatePicker from "./InputDatePicker";
import InputFileUpload from "./InputFileUpload";
import InputRadioGroup from "./InputRadioGroup";
import InputSelect from "./InputSelect";
import InputTextarea from "./InputTextarea";
import SubmitButton from "./SubmitButton";

type Props = {
  initialValue?: eventCreationInputType | undefined;
  onSubmit: (data: eventCreationInputType) => void;
  buttonText: string;
  initialUploadImage?: boolean;
};

const CreateEventForm = ({
  initialValue,
  onSubmit,
  buttonText,
  initialUploadImage = true,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
    watch,
    control,
  } = useForm<eventCreationInputType>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: initialValue ? initialValue : undefined,
  });

  const { isAuthenticated } = useUserContext();
  const [uploadImage, setUploadImage] = useState(initialUploadImage);

  const { mutate, isLoading } = api.crawler.getEventDataFromUrl.useMutation({
    onSuccess: (data) => {
      const {
        cover_url,
        category,
        city,
        address,
        country,
        onlineEvent,
        title,
        description,
        endsAt,
        startsAt,
        eventOrganiserName,
        eventPaymentType,
      } = data as eventResponse;

      if (cover_url) {
        setValue("fallback_image", cover_url);
        setUploadImage(false);
      }

      if (onlineEvent) {
        setValue("online", onlineEvent);
      }

      if (eventOrganiserName && eventOrganiserName?.length > 0) {
        setValue("partner_id", {
          value: process.env.NEXT_PUBLIC_NONE_PARTNER as string,
          label: "Input my own",
        });
        setValue("fallback_name", eventOrganiserName);
      }

      if (description) {
        setValue("event_description", description);
      }

      if (startsAt) {
        setValue("starts_at", new Date(startsAt));
      }

      if (endsAt) {
        setValue("ends_at", new Date(endsAt));
      }

      if (title) {
        setValue("event_title", title);
      }

      if (country) {
        setValue("country", {
          value: country,
          label: country,
        });
      }

      if (city) {
        setValue("city", {
          value: city,
          label: city,
        });
      }

      if (category) {
        setValue("category", {
          value: category,
          label: category,
        });
      }
      if (eventPaymentType) {
        setValue("event_type", eventPaymentType);
      }

      if (cover_url) {
        setValue("fallback_image", cover_url);
      }

      if (address) {
        setValue("location", address);
      }

      console.log(data);
      toast.success("Succesfully crawled data from RSVP link");
    },
    onError: () => {
      toast.warning("Unable to generate data from RSVP link");
    },
  });

  const { partners, partnerOptions } = useOrganizationContext();
  const { userMetadata } = useUserContext();

  const partnerList = userMetadata?.isAdmin
    ? partnerOptions?.map((item) => {
        return {
          label: item.partner_name,
          value: item.partner_id,
        };
      })
    : partners.map((item) => {
        return {
          label: item.Partner.partner_name,
          value: item.partner_id,
        };
      });

  useEffect(() => {
    if (
      isAuthenticated &&
      partners.length > 0 &&
      !initialValue?.fallback_name
    ) {
      const chosenPartner = partners.at(0);
      setValue("partner_id", {
        label: chosenPartner?.Partner.partner_name as string,
        value: chosenPartner?.partner_id as string,
      });
    } else {
      setValue("partner_id", {
        value: process.env.NEXT_PUBLIC_NONE_PARTNER as string,
        label: "Input my own",
      });
    }
  }, [setValue, isAuthenticated, partners, initialValue]);

  return (
    <div className="mx-auto mb-10 max-w-7xl">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
        <FormBox sectionHeader="Event Information">
          <div>
            <Input
              subtitle="Where do people RSVP for this event?"
              label="RSVP Link"
              errorMessage={errors?.rsvp_link}
              htmlFor="RSVP Link"
              autocomplete=""
              type="text"
              {...register("rsvp_link")}
            />
            <div className="my-4 flex justify-end">
              {watch("rsvp_link") ? (
                <Button
                  variant="outline"
                  color="gray"
                  submitType={false}
                  text="Retrieve Data from RSVP Link"
                  onClickHandler={() => {
                    const rsvp_link = getValues("rsvp_link");
                    console.log(rsvp_link);
                    if (
                      !rsvp_link?.includes("eventbrite") &&
                      !rsvp_link?.includes("lu.ma")
                    ) {
                      toast.warning("Unable to retrieve data from given url");
                      return;
                    }
                    mutate({
                      url: rsvp_link,
                    });
                  }}
                  isSubmitting={isLoading}
                  disabled={isLoading}
                />
              ) : null}
            </div>
          </div>
          <Input
            subtitle="What is your event called?"
            label="Event Title"
            errorMessage={errors?.event_title}
            htmlFor="Name"
            autocomplete=""
            type="text"
            {...register("event_title")}
          />

          {isAuthenticated ? (
            <InputSelect
              control={control}
              name="partner_id"
              label="Organizing Partner"
              subtitle="Which organization is organizing this event?"
              errorMessage={errors?.partner_id}
              options={
                !partners
                  ? [
                      {
                        label: "Input my own",
                        value: process.env.NEXT_PUBLIC_NONE_PARTNER as string,
                      },
                    ]
                  : [
                      {
                        label: "Input my own",
                        value: process.env.NEXT_PUBLIC_NONE_PARTNER as string,
                      },
                    ].concat(partnerList ?? [])
              }
            />
          ) : null}
          {watch("partner_id")?.value ===
            process.env.NEXT_PUBLIC_NONE_PARTNER || !isAuthenticated ? (
            <Input
              subtitle="Please provide a name for the organization that will be organising this event."
              label="Organisation Name"
              errorMessage={undefined}
              htmlFor="fallback name"
              autocomplete=""
              type="text"
              {...register("fallback_name")}
            />
          ) : null}
        </FormBox>

        <FormBox sectionHeader="Event Location">
          <InputSelect
            control={control}
            name="city"
            label="City"
            subtitle="Which city is this event being held in?"
            errorMessage={errors?.city}
            options={[City.Singapore, City.NA].map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />

          <InputSelect
            control={control}
            name="country"
            label="Country"
            subtitle="Which country is this event being held in?"
            errorMessage={errors?.country}
            options={[Country.Singapore, Country.NA].map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />

          <Input
            subtitle="Where is the event being held?"
            label="Address"
            errorMessage={errors?.location}
            htmlFor="Location"
            autocomplete=""
            type="text"
            {...register("location")}
          />
          <InputRadioGroup
            control={control}
            name="online"
            label="Online Event"
            subtitle="Is this an online event"
            options={[
              eventLocation.online,
              eventLocation.offline,
              eventLocation.hybrid,
            ].map((item) => {
              return {
                id: item,
                title: item,
              };
            })}
            errorMessage={errors?.online}
          />
        </FormBox>
        <FormBox sectionHeader="Event Date and Time">
          <InputDatePicker
            label="Event Start Time"
            control={control}
            name="starts_at"
            subtitle="What time does your event start at?"
            errorMessage={errors?.starts_at}
          />
          <InputDatePicker
            label="Event End Time"
            control={control}
            name="ends_at"
            subtitle="What time does your event end at?"
            errorMessage={errors?.ends_at}
          />
        </FormBox>
        <FormBox sectionHeader="Event Details">
          <InputSelect
            control={control}
            name="category"
            label="Event Category"
            subtitle="What category of event does this fall under?"
            errorMessage={errors?.category}
            options={eventCategories.map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />

          <InputRadioGroup
            control={control}
            name="event_type"
            label="Event Type"
            subtitle="Do participants need to pay for this event?"
            options={[
              eventPaymentType.free,
              eventPaymentType.paid,
              eventPaymentType.mix,
            ].map((item) => {
              return {
                id: item,
                title: item,
              };
            })}
            errorMessage={errors?.event_type}
          />
          {/* <InputSelect /> */}

          <InputTextarea
            label="Event Description"
            subtitle="Include any additional information about the event, such as a schedule or speaker lineup"
            {...register("event_description")}
            errorMessage={errors?.event_description}
          />

          <div className="space-y-4">
            {uploadImage ? (
              <InputFileUpload
                setValue={setValue}
                control={control}
                name="images"
                errorMessage={errors?.images as FieldError}
                label="Banner Image"
                subtitle="Include an image file to promote the event, if available (We only accept .png, .jpg and .jpeg files less than 5 mb.)"
              />
            ) : (
              <Input
                subtitle="Please provide a link to a banner image"
                label="Banner Image"
                errorMessage={errors?.fallback_image}
                htmlFor="fallback_image"
                autocomplete=""
                type="text"
                {...register("fallback_image")}
              />
            )}
            <FormToggle
              labelTitle="Upload File"
              labelText="Upload a custom banner image or provide a link to one"
              enabled={uploadImage}
              setEnabled={(enabled: boolean) => {
                setUploadImage(enabled);
                if (enabled) {
                  setValue("fallback_image", null);
                } else {
                  setValue("images", null);
                }
              }}
            />
          </div>
        </FormBox>

        <SubmitButton isSubmitting={isSubmitting} buttonText={buttonText} />
      </form>
    </div>
  );
};

export default CreateEventForm;
