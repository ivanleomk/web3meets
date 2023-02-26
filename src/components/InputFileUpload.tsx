import React from "react";
import { useDropzone } from "react-dropzone";
import {
  FieldValues,
  Control,
  Path,
  FieldError,
  useForm,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "./Button";
import FileDropzone from "./FileDropzone";

type Props<T extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  errorMessage: FieldError | undefined;
  setValue: UseFormSetValue<T>;
};

const InputFileUpload = <T extends FieldValues>({
  label,
  subtitle,
  control,
  name,
  errorMessage,
  setValue,
}: Props<T>) => {
  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        {label}
      </label>
      <p className="mb-1 text-sm leading-5 text-gray-500">{subtitle}</p>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, name, ref, value } }) => {
          if (value) {
            const file = value[0] as File;
            return (
              <div className="mt-4 flex items-center justify-between">
                <p className="mt-2 max-w-xs text-sm  text-gray-500">
                  Uploaded File : {file.name}
                </p>
                <Button
                  text="Delete File"
                  onClickHandler={() => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    setValue(name, null);
                  }}
                  variant="outline"
                />
              </div>
            );
          }
          return (
            <FileDropzone
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
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

export default InputFileUpload;
