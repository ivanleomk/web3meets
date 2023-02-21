import React from "react";
import { withFormik, type FormikProps } from "formik";
import FormDatePicker from "./FormDatePicker";
import FormOptionChoice from "./FormOptionChoice";
import RangeInput from "./rangeInput";

enum AdmissionFee {
  PAID = "PAID",
  FREE = "FREE",
  ANY = "ANY",
}

enum EventType {
  ONLINE = "ONLINE",
  InPerson = "In Person",
  ANY = "ANY",
}

const initialFormState = {
  city: "Singapore",
  from: null,
  to: null,
  startTime: 0,
  endTime: 24,
  admissionFee: AdmissionFee.ANY,
  eventType: EventType.ANY,
};

type filterFormState = {
  city: string;
  from: Date | null;
  to: Date | null;
  startTime: number;
  endTime: number;
  admissionFee: AdmissionFee;
  eventType: EventType;
};

type filterOptionsProps = FormikProps<filterFormState>;
type filterOptionsErrors = Partial<{
  [key in keyof filterFormState]: string;
}>;

const EventAdmissionFeeTypes: { name: string; value: AdmissionFee }[] = [
  {
    name: "Any",
    value: AdmissionFee.ANY,
  },
  {
    name: "Free",
    value: AdmissionFee.FREE,
  },
  {
    name: "Paid",
    value: AdmissionFee.PAID,
  },
];

const EventLocationTypes: { name: string; value: EventType }[] = [
  {
    name: "Any",
    value: EventType.ANY,
  },
  {
    name: "Online",
    value: EventType.ONLINE,
  },
  {
    name: "In Person",
    value: EventType.InPerson,
  },
];

const FilterOptions = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: filterOptionsProps) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 px-2 text-[12px] ">
      <FormDatePicker
        label="From"
        value={values.from}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        formKey="from"
      />
      <FormDatePicker
        label="To"
        value={values.to}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        formKey="to"
      />
      <FormOptionChoice
        label="Admission Fee"
        value={values.admissionFee}
        formKey={"admissionFee"}
        errors={errors}
        handleBlur={handleBlur}
        touched={touched}
        options={EventAdmissionFeeTypes}
        srText={"Admission Fee"}
        handleChange={handleChange}
      />
      <FormOptionChoice
        label="Event Location"
        value={values.eventType}
        formKey={"eventType"}
        errors={errors}
        handleBlur={handleBlur}
        touched={touched}
        options={EventLocationTypes}
        srText={"Event Location Types"}
        handleChange={handleChange}
      />
      <RangeInput
        label={"Starting Time"}
        step={1}
        min={0}
        max={24}
        value1FormKey={"startTime"}
        value2FormKey={"endTime"}
        value1={values.startTime}
        value2={values.endTime}
        touched={touched}
        errors={errors}
        fmtFunction={function (s1: number, s2: number): string {
          if (s2 === 24) {
            return `${s1}:00 - 23:59`;
          }
          return `${s1}:00 - ${s2}:00`;
        }}
      />
      <div className="mt-10 flex">
        <button
          onClick={() => handleReset()}
          className="mr-2 flex w-full items-center justify-center  bg-opacity-5 px-4 py-2 text-[12px] text-gray-700 transition-colors hover:bg-opacity-20 disabled:cursor-not-allowed disabled:hover:bg-opacity-5"
        >
          Reset
        </button>
        <button
          onClick={() => handleSubmit()}
          className="flex w-full items-center justify-center rounded-md border bg-opacity-50 px-4 py-2 text-[12px] text-gray-700 transition-colors hover:bg-opacity-20 disabled:cursor-not-allowed disabled:bg-opacity-50"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => {
    return initialFormState;
  },

  // Custom sync validation
  validate: (values) => {
    const errors: filterOptionsErrors = {};

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      console.log(values);
      setSubmitting(false);
    }, 1000);
  },
})(FilterOptions);
