import { type SupabaseClient } from "@supabase/supabase-js";
import { type NextRouter } from "next/router";
import { toast } from "react-toastify";
import { type userAuthEmailAndPasswordType } from "../types/auth";

export const signInUserWithPassword = (getUserQuery: () => Promise<void>) => {
  return async (
    credentials: userAuthEmailAndPasswordType,
    supabaseClient: SupabaseClient,
    router: NextRouter,
    redirectTo: undefined | string
  ) => {
    const { email, password } = credentials;
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error?.message ? error?.message : "Error Encountered");
    } else {
      await getUserQuery();
      toast.success("Succesfully signed user in");

      if (redirectTo) {
        await router.push(redirectTo);
      }
    }
  };
};

export const signUpUserWithPassword = async (
  credentials: userAuthEmailAndPasswordType,
  supabaseClient: SupabaseClient,
  router: NextRouter,
  redirectTo: undefined | string
) => {
  const { email, password } = credentials;
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast.error(error?.message ? error?.message : "Error Encountered");
  } else {
    toast.success("Account succesfully created");
    if (redirectTo) {
      setTimeout(async () => {
        await router.push(redirectTo);
      }, 2000);
    }
  }
};
