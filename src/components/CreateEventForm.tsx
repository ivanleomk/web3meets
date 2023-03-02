import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldError, useForm } from "react-hook-form";
import { useOrganizationContext } from "../context/OrganizationContext";
import { Event } from "../types/database";
import {
  type eventCreationInputType,
  eventCreationSchema,
  eventType,
  eventLocation,
  City,
  Country,
} from "../types/event";
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
    formState: { isSubmitting, errors },
    control,
  } = useForm<eventCreationInputType>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: initialValue ? initialValue : undefined,
  });

  const { partners } = useOrganizationContext();

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8"
      >
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
        <Input
          subtitle="Where is the event being held?"
          label="Location"
          errorMessage={errors?.location}
          htmlFor="Location"
          autocomplete=""
          type="text"
          {...register("location")}
        />
        <div />

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

        <InputSelect
          control={control}
          name="partner_id"
          label="Organizing Partner"
          subtitle="Which organization is organizing this event?"
          errorMessage={errors?.partner_id}
          options={
            !partners
              ? []
              : partners?.map((item) => {
                  return {
                    label: item.Partner.partner_name,
                    value: item.partner_id,
                  };
                })
          }
        />
        <div />
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

        <InputRadioGroup
          control={control}
          name="event_type"
          label="Event Type"
          subtitle="Do participants need to pay for this event?"
          options={[eventType.free, eventType.paid, eventType.mix].map(
            (item) => {
              return {
                id: item,
                title: item,
              };
            }
          )}
          errorMessage={errors?.event_type}
        />
        <InputRadioGroup
          control={control}
          name="online"
          label="Online Event"
          subtitle="Is this an online event"
          options={[eventLocation.online, eventLocation.offline].map((item) => {
            return {
              id: item,
              title: item,
            };
          })}
          errorMessage={errors?.online}
        />

        <InputTextarea
          label="Event Description"
          subtitle="Please provide a short description of your event"
          {...register("event_description")}
          errorMessage={errors?.event_description}
        />
        <InputFileUpload
          setValue={setValue}
          control={control}
          name="images"
          errorMessage={errors?.images as FieldError}
          label="Banner Image"
          subtitle="We only accept .png, .jpg and .jpeg files less than 5 mb."
        />

        <SubmitButton isSubmitting={isSubmitting} buttonText={buttonText} />
      </form>
    </>
  );
};

export default CreateEventForm;
