import React from "react";
import type {
  FieldValues,
  Control,
  Path,
  FieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

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
  creatable?: boolean;
};

const InputSelect = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
  errorMessage,
  options,
  creatable = false,
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
          if (creatable) {
            return (
              <CreatableSelect
                value={value}
                onChange={(e) => onChange(e)}
                onBlur={onBlur}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                options={options}
              />
            );
          }
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
          {errorMessage.message as unknown as string}
        </p>
      ) : null}
    </div>
  );
};

export default InputSelect;
