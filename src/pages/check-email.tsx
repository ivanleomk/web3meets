import Link from "next/link";
import React from "react";

const CheckEmail = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-center  lg:px-8">
      <p className="text-base font-semibold leading-8 ">{":)"}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">
        Account Successfully created
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-center sm:mt-6">
        All that&apos;s left is to verify your email account. Do check spam if
        you haven&apos;t recieved our email.
      </p>
      <div className="mt-10 flex justify-center">
        <Link href="/login" className="text-sm font-semibold leading-7 ">
          Login now <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default CheckEmail;
