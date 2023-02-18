import { type ForwardedRef, forwardRef } from "react";
import type { FieldError } from "react-hook-form";

type Props = {
  label?: string;
  helpText?: string | undefined;
  errorMessage?: FieldError | undefined;
  htmlFor: string;
  type: string;
  autocomplete: string;
};
const Input = forwardRef(
  (
    {
      label,
      helpText,
      errorMessage,
      htmlFor,
      type,
      autocomplete,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div>
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <input
            id={htmlFor}
            ref={ref}
            type={type}
            autoComplete={autocomplete}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...props}
          />
          {errorMessage ? (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errorMessage.message}
            </p>
          ) : null}
          {helpText && !errorMessage ? (
            <p className="mt-2 text-xs text-gray-400" id="email-error">
              {helpText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
