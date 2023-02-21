import Link from "next/link";
import React from "react";

const ResetPassword = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-center  lg:px-8">
      <p className="text-base font-semibold leading-8 ">{":)"}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">
        Password Reset succesful
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-center sm:mt-6">
        We&apos;ve just sent over a one-time password reset. Do check your spam
        mail if you haven&apos;t recieved it
      </p>
    </div>
  );
};

export default ResetPassword;
