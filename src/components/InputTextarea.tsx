import React, { forwardRef, type LegacyRef } from "react";
import { type FieldError } from "react-hook-form";

type Props = {
  label: string;
  subtitle: string;
  name: string;
  errorMessage: FieldError | undefined;
};

const InputTextarea = forwardRef(
  (
    { label, subtitle, name, errorMessage, ...props }: Props,
    ref: LegacyRef<HTMLTextAreaElement>
  ) => {
    return (
      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          {label}
        </label>
        <p className="text-sm leading-5 text-gray-500">{subtitle}</p>
        <div className="mt-1">
          <textarea
            ref={ref}
            rows={4}
            name={name}
            id={name}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...props}
          />
        </div>
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errorMessage.message}
          </p>
        ) : null}
      </div>
    );
  }
);

InputTextarea.displayName = "InputText";

export default InputTextarea;
