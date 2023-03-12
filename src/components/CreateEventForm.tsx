import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldError, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useOrganizationContext } from "../context/OrganizationContext";
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
import { Button } from "./Button";
import FormBox from "./FormBox";
import FormSectionHeader from "./FormSectionHeader";
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
};

const CreateEventForm = ({ initialValue, onSubmit, buttonText }: Props) => {
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

  const { mutate, isLoading } = api.crawler.getEventDataFromUrl.useMutation({
    onSuccess: async (data) => {
      if (data?.organizer) {
        setValue("partner_id", {
          value: process.env.NEXT_PUBLIC_NONE_PARTNER as string,
          label: "Input my own",
        });
        setValue("fallback_name", data?.organizer?.name);
      }
      if (data?.startDate) {
        setValue("starts_at", new Date(data?.startDate));
      }
      if (data?.endDate) {
        setValue("ends_at", new Date(data?.endDate));
      }

      if (data?.description) {
        setValue("event_description", data?.description);
      }

      if (data?.name) {
        setValue("event_title", data?.name);
      }

      if (data?.location) {
        const online = data?.location["@type"] == "VirtualLocation";
        setValue(
          "online",
          online ? eventLocation.online : eventLocation.offline
        );
        setValue(
          "location",
          online ? data?.location["url"] : data?.location["name"]
        );
        if (online) {
          setValue("city", {
            value: City.NA,
            label: City.NA,
          });
          setValue("country", {
            value: Country.NA,
            label: Country.NA,
          });
        } else {
          const country = data?.location?.address?.addressCountry;
          const city = data?.location?.address?.addressLocality;

          if (country === "SG") {
            setValue("country", {
              value: Country.Singapore,
              label: Country.Singapore,
            });
          }

          if (city === "Singapore") {
            setValue("city", {
              value: City.Singapore,
              label: City.Singapore,
            });
          }
        }
      }
      if (data["@type"]) {
        const category = data["@type"] as string;
        let found = false;

        eventCategories.forEach((item) => {
          if (
            item.toLowerCase().toLowerCase() === category.toLowerCase() ||
            (item.toLowerCase().replace(/\s/g, "") === category.toLowerCase() &&
              !found)
          ) {
            found = true;
            setValue("category", {
              value: item,
              label: item,
            });
          }
        });

        if (!found) {
          setValue("category", {
            value: "Networking",
            label: "Networking",
          });
        }
      }

      if (data["offers"]) {
        // We need to see if there are any prices at all
        let paidOffersCount = 0;
        let freeOffersCount = 0;
        // Offer is not being parsed correctly - fix this. We are getting 0,1,2,3,4,5
        const offers = data["offers"];

        for (let i = 0; i < offers.length; i++) {
          const item = offers[i];
          if (item?.price !== undefined) {
            freeOffersCount += 1;
          } else if (item?.highPrice == 0 && item?.lowPrice == 0) {
            freeOffersCount += 1;
          } else {
            paidOffersCount += 1;
          }
        }

        if (freeOffersCount === data["offers"].length) {
          setValue("event_type", eventPaymentType.free);
        } else if (paidOffersCount === data["offers"].length) {
          setValue("event_type", eventPaymentType.paid);
        } else {
          setValue("event_type", eventPaymentType.mix);
        }
      }

      if (data["image"]) {
        const response = await fetch(data["image"]);
        const blob = await response.blob();
        const file = new File([blob], `${data?.name}_promo_image.jpeg`, {
          type: blob.type,
        });
        setValue("images", [file]);
      }

      toast.success("Succesfully crawled data from RSVP link");
    },
    onError: () => {
      toast.warning("Unable to generate data from RSVP link");
    },
  });

  const { partners } = useOrganizationContext();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
        <div className="flex w-full justify-end">
          {watch("rsvp_link") ? (
            <Button
              variant="outline"
              color="gray"
              submitType={false}
              text="Crawl Data from RSVP Link"
              onClickHandler={() => {
                const rsvp_link = getValues("rsvp_link");
                if (!rsvp_link?.includes("eventbrite")) {
                  toast.warning("Unable to crawl data from given url");
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
        <FormBox sectionHeader="Event Information">
          <Input
            subtitle="What is your event called?"
            label="Event Title"
            errorMessage={errors?.event_title}
            htmlFor="Name"
            autocomplete=""
            type="text"
            {...register("event_title")}
          />
          <Input
            subtitle="Where do people RSVP for this event?"
            label="RSVP Link"
            errorMessage={errors?.rsvp_link}
            htmlFor="RSVP Link"
            autocomplete=""
            type="text"
            {...register("rsvp_link")}
          />
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
                  ].concat(
                    partners?.map((item) => {
                      return {
                        label: item.Partner.partner_name,
                        value: item.partner_id,
                      };
                    })
                  )
            }
          />
          {watch("partner_id")?.value ===
          process.env.NEXT_PUBLIC_NONE_PARTNER ? (
            <Input
              subtitle="Please provide a name for the organization that will be organising this event."
              label="Organisation name"
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
            label="Event Location"
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
            options={[eventLocation.online, eventLocation.offline].map(
              (item) => {
                return {
                  id: item,
                  title: item,
                };
              }
            )}
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
          <InputFileUpload
            setValue={setValue}
            control={control}
            name="images"
            errorMessage={errors?.images as FieldError}
            label="Banner Image"
            subtitle="Include an image file to promote the event, if available (We only accept .png, .jpg and .jpeg files less than 5 mb.)"
          />
        </FormBox>

        <SubmitButton isSubmitting={isSubmitting} buttonText={buttonText} />
      </form>
    </>
  );
};

export default CreateEventForm;
