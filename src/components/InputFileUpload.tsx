import React from "react";
import type {
  FieldValues,
  Control,
  Path,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";

import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
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
      <p className="mb-1 mt-1 text-sm leading-5 text-gray-500">{subtitle}</p>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, name, ref, value } }) => {
          if (value && Array.isArray(value) && value.length > 0) {
            return (
              <>
                {value.map((file: File) => {
                  return (
                    <>
                      <div
                        key={file.name}
                        className="my-4 grid grid-cols-3 items-start gap-x-10"
                      >
                        <div className="col-span-2">
                          <p className="max-w-xs text-sm  text-gray-500">
                            {file.name}{" "}
                          </p>
                          <span className="text-sm text-gray-300">
                            ({(file.size / (1024 * 1024)).toFixed(2)} mb)
                          </span>
                        </div>

                        <Button
                          text="Delete File"
                          onClickHandler={() => {
                            const newValue = value.filter(
                              (item: File) => item.name !== file.name
                            );
                            setValue(name, newValue);
                          }}
                          variant="outline"
                        />
                      </div>
                    </>
                  );
                })}
                <FileDropzone
                  onChange={(e) => {
                    onChange([...value, ...e]);
                  }}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                />
              </>
            );
          }

          if (value && Array.isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            setValue(name, null);
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
