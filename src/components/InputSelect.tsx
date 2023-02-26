import React from "react";
import {
  FieldValues,
  Control,
  Path,
  FieldError,
  Controller,
  PathValue,
} from "react-hook-form";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  errorMessage: FieldError | undefined;
  options: {
    value: string;
    label: string;
  }[];
};

const InputSelect = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
  errorMessage,
  options,
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
        render={({ field: { onChange, onBlur } }) => (
          <Select onChange={onChange} onBlur={onBlur} options={options} />
        )}
      />
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errorMessage.message}
        </p>
      ) : null}
    </div>
  );
};

export default InputSelect;
