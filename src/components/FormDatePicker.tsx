import React from "react";
import DatePicker from "react-datepicker";
import {
  type FormikTouched,
  type FormikErrors,
  useFormikContext,
} from "formik";

type FormDatePickerProps<T> = {
  label: string;
  value: Date | null;
  formKey: keyof T;
  errors: FormikErrors<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: any;
  touched: FormikTouched<T>;
  fullWidth?: boolean;
};

const FormDatePicker = <T,>({
  label,
  formKey,
  errors,
  handleBlur,
  touched,
  value,
}: FormDatePickerProps<T>) => {
  const { setFieldValue } = useFormikContext();
  return (
    <div className="sm:col-span-3">
      <label
        htmlFor="first-name"
        className="block text-sm font-bold text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <DatePicker
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          selected={value}
          onChange={(val) => {
            console.log(val);
            setFieldValue(formKey as string, val);
          }}
          onBlur={handleBlur}
          name={formKey as string}
          dateFormat="Pp"
          minDate={new Date()}
          showTimeSelect
          placeholderText="DD/MM/YYYY"
        />
      </div>
      <p className="text-sm text-red-300 ">
        {errors?.[formKey] && touched?.[formKey]
          ? (errors[formKey] as string)
          : null}
      </p>
    </div>
  );
};

export default FormDatePicker;
