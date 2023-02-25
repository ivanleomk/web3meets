import React from "react";

type Props = {
  label: string;
  subtitle: string;
};

const InputTextarea = ({ label, subtitle }: Props) => {
  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        {label}
      </label>
      <p className="text-sm leading-5 text-gray-500">{subtitle}</p>
      <div className="mt-1">
        <textarea
          rows={4}
          name="comment"
          id="comment"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          defaultValue={""}
        />
      </div>
    </div>
  );
};

export default InputTextarea;
