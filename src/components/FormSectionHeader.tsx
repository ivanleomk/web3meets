import React from "react";

type Props = {
  text: string;
};

const FormSectionHeader = ({ text }: Props) => {
  return (
    <div className="col-span-2">
      <h3 className="text-lg font-semibold leading-6 text-gray-900">{text}</h3>
    </div>
  );
};

export default FormSectionHeader;
