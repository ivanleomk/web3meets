import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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

const initialState = {
  event_type: eventTypeFilter.any,
  event_location: eventLocationFilter.any,
  start_to_end: [0, 24],
};

type Props = {
  onSubmit: (data: refinedEventFilterType) => void;
};

const EventFilters = ({ onSubmit }: Props) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<refinedEventFilterType>({
    resolver: zodResolver(refinedEventFilterSchema),
    defaultValues: initialState,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    watch(handleSubmit(onSubmit));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  }, [handleSubmit, watch, onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="" />
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
            reset(initialState);
          }}
          additionalStyling="w-full mt-4"
        />
      </div>
    </form>
  );
};

export default EventFilters;
