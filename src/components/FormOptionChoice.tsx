import { RadioGroup } from "@headlessui/react";
import { joinClassNames } from "../utils/css";
import {
  type FormikErrors,
  type FormikTouched,
  useFormikContext,
} from "formik";

type FormOptionChoiceProps<T> = {
  label: string;
  value: string | null;
  formKey: keyof T;
  errors: FormikErrors<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: any;
  touched: FormikTouched<T>;
  options: {
    name: string;
    value: string;
  }[];
  srText: string;
};

const FormOptionChoice = <T,>({
  label,
  formKey,
  errors,
  handleBlur,
  touched,
  value,
  options,
}: FormOptionChoiceProps<T>) => {
  const { setFieldValue } = useFormikContext();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">{label}</h2>
      </div>

      <RadioGroup
        onChange={(v) => {
          setFieldValue(formKey as string, v);
        }}
        onBlur={handleBlur}
        value={value}
        name={formKey as string}
        className="mt-2"
      >
        <div className="grid grid-cols-3 gap-1 ">
          {options &&
            options.map((option) => {
              return (
                <RadioGroup.Option
                  key={option.name}
                  value={option.value}
                  className={joinClassNames(
                    value === option.value
                      ? "border-transparent bg-indigo-500 bg-opacity-50 text-white"
                      : "border-gray-200 bg-white text-black",
                    "flex cursor-pointer items-center justify-center rounded-md border-none p-1 px-2 text-[12px] shadow-none ring-0 transition-colors hover:bg-opacity-20 sm:flex-1"
                  )}
                >
                  <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                </RadioGroup.Option>
              );
            })}
        </div>
      </RadioGroup>
    </div>
  );
};

export default FormOptionChoice;
