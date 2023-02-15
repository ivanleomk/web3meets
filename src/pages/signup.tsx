import Link from "next/link";
import React from "react";
import LoginPassword from "../components/LoginPassword";
import { signUpUserWithPassword } from "../utils/auth";

const SignUp = () => {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign up for an account today
      </h2>
      <div className="mb-6 sm:mx-auto sm:w-full  sm:max-w-md">
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
      <LoginPassword
        buttonText="Sign Up"
        redirectTo="/check-email"
        onSubmitHandler={signUpUserWithPassword}
      />
    </div>
  );
};

export default SignUp;
