import { RadioGroup } from "@headlessui/react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { joinClassNames } from "../utils/css";

type Props<T extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
  }[];
  errorMessage: FieldError | undefined;
  orientation?: "vertical" | "horizontal";
};

const InputRadioGroup = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
  options,
  errorMessage,
  orientation = "vertical",
}: Props<T>) => {
  if (orientation == "vertical") {
    return (
      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          {label}
        </label>
        <p className="text-sm leading-5 text-gray-500">{subtitle}</p>
        <fieldset className="mt-4">
          <div className="space-y-4">
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, onBlur, name, ref, value } }) => {
                return (
                  <>
                    {options.map((item) => {
                      return (
                        <div className="flex items-center" key={item.id}>
                          <input
                            name={name}
                            checked={value === item.id}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={ref}
                            type="radio"
                            value={item.id}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label className="ml-3 block text-sm font-medium text-gray-700">
                            {item.title}
                          </label>
                        </div>
                      );
                    })}
                  </>
                );
              }}
            />
          </div>
          {errorMessage ? (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errorMessage.message}
            </p>
          ) : null}
        </fieldset>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">{label}</h2>
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, name, value } }) => {
          return (
            <RadioGroup
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              className="mt-2"
            >
              <div className="grid grid-cols-2 gap-1 text-left ">
                {options &&
                  options.map((option) => {
                    return (
                      <RadioGroup.Option
                        key={option.id}
                        value={option.id}
                        className={joinClassNames(
                          value === option.id
                            ? "border-2  bg-gray-200 active:text-white/80"
                            : "border-none border-gray-200 bg-white  text-black",
                          "flex cursor-pointer items-center justify-center rounded-md px-2 py-2  text-[12px] shadow-none ring-0 transition-colors hover:bg-opacity-20 sm:flex-1"
                        )}
                      >
                        <RadioGroup.Label as="span">
                          {option.title}
                        </RadioGroup.Label>
                      </RadioGroup.Option>
                    );
                  })}
              </div>
            </RadioGroup>
          );
        }}
      />
    </div>
  );
};

export default InputRadioGroup;
