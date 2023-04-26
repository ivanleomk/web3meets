import React from "react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  errorMessage: FieldError | undefined;
  dateFormat?: string;
  showTimeSelect?: boolean;
  minDate?: null | Date;
};

const InputDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
  errorMessage,
  showTimeSelect = true,
  dateFormat = "MMMM d, yyyy hh:mm aa",
  minDate = null,
}: Props<T>) => {
  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        {label}
      </label>
      <p className="my-2 text-sm leading-5 text-gray-500">{subtitle}</p>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <DatePicker
              minDate={minDate}
              selected={value}
              onChange={onChange}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500  sm:text-sm"
              showTimeSelect={showTimeSelect}
              timeIntervals={15}
              dateFormat={dateFormat}
            />
          );
        }}
      />
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errorMessage.message}
        </p>
      ) : null}
    </div>
  );
};

export default InputDatePicker;
