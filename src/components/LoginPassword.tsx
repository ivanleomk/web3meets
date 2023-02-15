import {
  type SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter, type NextRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { type USER_AUTH_EMAIL_AND_PASSWORD } from "../types/auth";
import { type Database } from "../types/database-raw";
import Input from "./Input";

type Props = {
  redirectTo?: string | undefined;
  buttonText?: string;
  onSubmitHandler: (
    credentials: USER_AUTH_EMAIL_AND_PASSWORD,
    supabaseClient: SupabaseClient,
    router: NextRouter,
    redirectTo: undefined | string
  ) => Promise<void>;
};

const LoginPassword = ({ redirectTo, buttonText, onSubmitHandler }: Props) => {
  const supabaseClient = useSupabaseClient<Database>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<USER_AUTH_EMAIL_AND_PASSWORD>();
  const router = useRouter();

  const onSubmit = async (credentials: USER_AUTH_EMAIL_AND_PASSWORD) => {
    await onSubmitHandler(credentials, supabaseClient, router, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <Input
        label="Email"
        errorMessage={
          errors?.email ? "Please enter a valid email address" : undefined
        }
        htmlFor="email"
        autocomplete="email"
        type="email"
        {...register("email", { required: true })}
      />
      <Input
        label="Password"
        errorMessage={
          errors?.password
            ? "Password must have a minimum length of 6 characters"
            : undefined
        }
        htmlFor="password"
        autocomplete="password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: 6,
        })}
      />
      <div className="mt-4">
        <button
          disabled={isSubmitting}
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-gray-800  py-3 px-4 text-sm font-medium text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80"
        >
          {isSubmitting ? (
            <>
              <ClipLoader color="white" size={20} />
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginPassword;
