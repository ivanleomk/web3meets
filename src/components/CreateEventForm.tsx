import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {
  type eventCreationInputType,
  eventCreationSchema,
  recurrence,
} from "../types/event";
import { Button } from "./Button";
import Input from "./Input";
import InputDatePicker from "./InputDatePicker";
import InputRadioGroup from "./InputRadioGroup";
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
    formState: { isSubmitting, errors },
    control,
  } = useForm<eventCreationInputType>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: initialValue ? initialValue : undefined,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8"
      >
        <Input
          label="Event Title"
          errorMessage={errors?.event_title}
          htmlFor="Name"
          autocomplete=""
          type="text"
          {...register("event_title")}
        />
        <div />
        <InputDatePicker
          label="Event Start Time"
          control={control}
          name="starts_at"
          subtitle="What time does your event start at?"
        />
        <InputDatePicker
          label="Event End Time"
          control={control}
          name="ends_at"
          subtitle="What time does your event end at?"
        />
        <InputRadioGroup
          control={control}
          name="paid_event"
          label="Event Type"
          subtitle="Do participants need to pay for this event?"
          options={["Yes", "No"].map((item) => {
            return {
              id: item,
              title: item,
            };
          })}
        />
        <InputRadioGroup
          control={control}
          name="paid_event"
          label="Recurring Event?"
          subtitle="Is this a recurring event?"
          options={[
            recurrence.SingleEvent,
            recurrence.Weekly,
            recurrence.Biweekly,
            recurrence.Monthly,
          ].map((item) => {
            return {
              id: item,
              title: item,
            };
          })}
        />

        <InputTextarea
          label="Event Description"
          subtitle="Please provide a short description of your event"
        />

        <SubmitButton isSubmitting={isSubmitting} buttonText={buttonText} />
      </form>
    </>
  );
};

export default CreateEventForm;
