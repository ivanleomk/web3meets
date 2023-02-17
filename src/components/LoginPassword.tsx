import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter, type NextRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {
  userAuthEmailAndPasswordSchema,
  type userAuthEmailAndPasswordType,
} from "../types/auth";
import { type Database } from "../types/database-raw";
import Input from "./Input";

type Props = {
  redirectTo?: string | undefined;
  buttonText?: string;
  onSubmitHandler: (
    credentials: userAuthEmailAndPasswordType,
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
  } = useForm<userAuthEmailAndPasswordType>({
    resolver: zodResolver(userAuthEmailAndPasswordSchema),
  });
  const router = useRouter();

  const onSubmit = async (credentials: userAuthEmailAndPasswordType) => {
    await onSubmitHandler(credentials, supabaseClient, router, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <Input
        label="Email"
        errorMessage={errors?.email}
        htmlFor="email"
        autocomplete="email"
        type="email"
        {...register("email")}
      />
      <Input
        label="Password"
        errorMessage={errors?.password}
        htmlFor="password"
        autocomplete="password"
        type="password"
        {...register("password")}
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
