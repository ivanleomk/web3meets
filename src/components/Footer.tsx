import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="mt-4 mb-10 border-t border-slate-900/5">
        <div className="my-4 flex flex-col items-center justify-center">
          <Logo />
          <p className="prose text-md text-center font-bold text-gray-700">
            Web3Meets
          </p>
        </div>

        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          © 2023 Web3Meets. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
