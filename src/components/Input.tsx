import { type ForwardedRef, forwardRef } from "react";
import { type FieldError } from "react-hook-form";

type Props = {
  label?: string;
  helpText?: string | undefined;
  errorMessage?: FieldError | undefined;
  htmlFor: string;
  type: string;
  autocomplete: string;
  subtitle?: string;
};
const Input = forwardRef(
  (
    {
      label,
      helpText,
      errorMessage,
      htmlFor,
      type,
      subtitle,
      autocomplete,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div>
        <label
          htmlFor={htmlFor}
          className="text-base font-semibold leading-6 text-gray-900"
        >
          {label}
        </label>
        {subtitle ? (
          <p className="my-2 text-sm leading-5 text-gray-500">{subtitle}</p>
        ) : null}
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
