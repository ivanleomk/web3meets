import { type SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, type NextRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import LoginPassword from "../components/LoginPassword";
import useAuthCheck from "../hooks/use-auth-check";
import { type userAuthEmailAndPasswordType } from "../types/auth";
import { api } from "../utils/api";
import { signUpUserWithPassword } from "../utils/auth";

const SignUp = () => {
  const isExistingUser = api.user.isExistingUser.useMutation();
  const router = useRouter();
  const { redirectedFrom } = router.query;

  const handleUserSignup = async (
    credentials: userAuthEmailAndPasswordType,
    supabaseClient: SupabaseClient,
    router: NextRouter,
    redirectTo: undefined | string
  ) => {
    console.log(credentials);
    await isExistingUser
      .mutateAsync({
        userEmail: credentials.email,
      })
      .then((res) => {
        console.log(res);
        if (res) {
          toast.warning(
            "Sign up failed. Please try signing in instead if you have an account."
          );
          return;
        }
        return signUpUserWithPassword(
          credentials,
          supabaseClient,
          router,
          redirectTo
        );
      });
  };

  useAuthCheck(redirectedFrom as string);

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
        onSubmitHandler={handleUserSignup}
      />
    </div>
  );
};

export default SignUp;
