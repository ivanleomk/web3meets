import React, { useState } from "react";
import type {
  FieldValues,
  Control,
  Path,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";

import { Controller } from "react-hook-form";
import { Button } from "./Button";
import FileDropzone from "./FileDropzone";
import Dropzone from "react-dropzone";

type Props<T extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  errorMessage: FieldError | undefined;
  setValue: UseFormSetValue<T>;
  maxFiles?: number;
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
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          console.log(value);
          return (
            <>
              {value?.map((file: File) => {
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
              <Dropzone
                onDrop={(e) => {
                  if (!value) {
                    onChange(e);
                  } else {
                    onChange([...value, ...e]);
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input {...getInputProps()} />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </>
          );
        }}
      />
      {/* <Controller
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
                {value.length < maxFiles ? (
                  <FileDropzone
                    onChange={(e) => {
                      onChange([...value, ...e]);
                    }}
                    onBlur={onBlur}
                    name={name}
                  />
                ) : null}
              </>
            );
          }

          return (
            <FileDropzone onChange={onChange} onBlur={onBlur} name={name} />
          );
        }}
      /> */}
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errorMessage.message}
        </p>
      ) : null}
    </div>
  );
};

export default InputFileUpload;
