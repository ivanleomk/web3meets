import Link from "next/link";
import React from "react";

const EmailConfirm = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-center  lg:px-8">
      <p className="text-base font-semibold leading-8 ">{":)"}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">
        Email Confirmation succesful
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-center sm:mt-6">
        We&apos;ve succesfully verified your email. Start exploring our site and
        what it has to offer today.
      </p>
      <div className="mt-10 flex justify-center">
        <Link href="/dashboard" className="text-sm font-semibold leading-7 ">
          Get Started <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirm;
