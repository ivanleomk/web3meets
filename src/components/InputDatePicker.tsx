import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
};

const InputDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
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
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={value}
            onChange={onChange}
            className="block  appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        )}
      />
    </div>
  );
};

export default InputDatePicker;

{
  /* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */
}
