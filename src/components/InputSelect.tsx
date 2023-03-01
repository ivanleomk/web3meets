import React from "react";
import type {
  FieldValues,
  Control,
  Path,
  FieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";
import { Controller, type PathValue } from "react-hook-form";
import Select from "react-select";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  errorMessage:
    | FieldError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
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
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <Select
              value={value}
              onChange={(e) => onChange(e)}
              onBlur={onBlur}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              options={options}
            />
          );
        }}
      />
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage.message?.toString as unknown as string}
        </p>
      ) : null}
    </div>
  );
};

export default InputSelect;
