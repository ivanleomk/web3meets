import { type ReactNode } from "react";
import FormSectionHeader from "./FormSectionHeader";

type Props = {
  children: ReactNode;
  sectionHeader: string;
};

const FormBox = ({ children, sectionHeader }: Props) => {
  return (
    <>
      <div className="mt-4" />
      <FormSectionHeader text={sectionHeader} />
      <div className="my-6 grid grid-cols-1 gap-x-10 gap-y-10 border-4 border-gray-300 px-4 py-14 shadow  sm:rounded-lg lg:grid-cols-2 lg:gap-y-6 lg:px-10">
        {children}
      </div>
    </>
  );
};

export default FormBox;
