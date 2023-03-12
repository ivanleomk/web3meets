import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
  UseFormWatch,
} from "react-hook-form";
import {
  eventLocationFilter,
  eventTypeFilter,
  refinedEventFilterSchema,
  refinedEventFilterType,
} from "../types/event-filter";
import { Button } from "./Button";
import InputDatePicker from "./InputDatePicker";
import InputRadioGroup from "./InputRadioGroup";
import InputRangeSlider from "./InputRangeSlider";

type Props = {
  onSubmit: (data: refinedEventFilterType) => void;
  handleSubmit: UseFormHandleSubmit<refinedEventFilterType>;
  watch: UseFormWatch<refinedEventFilterType>;
  control: Control<refinedEventFilterType>;
  errors: FieldErrors<refinedEventFilterType>;
  resetHandler: () => void;
};

const EventFilters = ({
  onSubmit,
  handleSubmit,
  watch,
  control,
  errors,
  resetHandler,
}: Props) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    watch(handleSubmit(onSubmit));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  }, [handleSubmit, watch, onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputDatePicker
        control={control}
        name="starts_at"
        label={"Start Date"}
        subtitle={""}
        errorMessage={errors?.starts_at}
        dateFormat="dd MMM yyyy"
        showTimeSelect={false}
      />
      <div className="py-2" />
      <InputDatePicker
        control={control}
        name="ends_at"
        label={"End Date"}
        subtitle={""}
        errorMessage={errors?.ends_at}
        dateFormat="dd MMM yyyy"
        showTimeSelect={false}
      />
      <div className="py-2" />
      <InputRadioGroup
        control={control}
        name="event_type"
        label="Event Type"
        // subtitle="Do people need to pay for the event?"
        subtitle=""
        options={[
          eventTypeFilter.any,
          eventTypeFilter.free,
          eventTypeFilter.paid,
          "Both",
        ].map((item) => {
          return {
            id: item,
            title: item,
          };
        })}
        errorMessage={errors?.event_type}
        orientation="horizontal"
      />
      <div className="py-2" />
      <InputRadioGroup
        control={control}
        name="event_location"
        label="Event Location"
        subtitle=""
        options={[
          eventLocationFilter.any,
          eventLocationFilter.online,
          eventLocationFilter.offline,
        ].map((item) => {
          return {
            id: item,
            title: item,
          };
        })}
        errorMessage={errors?.event_type}
        orientation="horizontal"
      />
      <div className="py-2" />
      <InputRangeSlider
        label="Starting Time"
        control={control}
        name="start_to_end"
        step={1}
        min={0}
        max={24}
        fmtFunction={function (s1: number, s2: number): string {
          if (s2 === 24) {
            return `${s1}:00 - 23:59`;
          }
          return `${s1}:00 - ${s2}:00`;
        }}
      />

      <div className="">
        <Button
          variant="outline"
          text="Reset Filters"
          onClickHandler={() => {
            resetHandler();
          }}
          additionalStyling="w-full mt-4"
        />
      </div>
    </form>
  );
};

export default EventFilters;
