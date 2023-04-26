import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import Input from "../components/Input";
import SectionHeader from "../components/SectionHeader";
import { userResetEmailType, userResetEmailSchema } from "../types/auth";
import { Database } from "../types/database-raw";

const ResetPassword = () => {
  const supabaseClient = useSupabaseClient<Database>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<userResetEmailType>({
    resolver: zodResolver(userResetEmailSchema),
  });

  const router = useRouter();
  const onSubmit = async (credentials: userResetEmailType) => {
    await supabaseClient.auth
      .signInWithOtp({
        email: credentials.email,
      })
      .then((res) => {
        toast.success("Email Link Successfully sent");
        void router.push("/email-link");
      })
      .catch(() => {
        toast.success("Email Link Successfully sent");
      });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Forgot your password?"
        subtitle="Enter your email below for a one-time signup link"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4" />
          <Input
            label="Email"
            errorMessage={errors?.email}
            htmlFor="email"
            autocomplete="email"
            type="text"
            {...register("email")}
          />
          <div className="mt-10 flex items-center justify-center">
            <button
              className="inline-flex justify-center rounded-lg bg-gray-800 py-2 px-3 text-sm font-semibold text-white outline-2 outline-offset-2 transition-colors hover:bg-gray-900 active:bg-gray-800 active:text-white/80"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="white" size={20} />
                </>
              ) : (
                <>Get Magic Link</>
              )}
            </button>
          </div>
        </form>
      </SectionHeader>
    </div>
  );
};

export default ResetPassword;
