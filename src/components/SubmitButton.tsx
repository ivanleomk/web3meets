import React from "react";
import { ClipLoader } from "react-spinners";

type Props = {
  isSubmitting: boolean;
  buttonText: string;
};

const SubmitButton = ({ isSubmitting, buttonText }: Props) => {
  return (
    <div className="col-span-2 flex justify-end">
      <button
        disabled={isSubmitting}
        type="submit"
        className="flex max-w-md justify-center rounded-md border border-transparent bg-gray-800  py-2 px-2 text-sm font-medium text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80"
      >
        {isSubmitting ? (
          <>
            <ClipLoader color="white" size={20} />
          </>
        ) : (
          <>{buttonText}</>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
