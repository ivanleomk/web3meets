import { type SupabaseClient } from "@supabase/supabase-js";
import { type NextRouter } from "next/router";
import { toast } from "react-toastify";
import { type USER_AUTH_EMAIL_AND_PASSWORD } from "../types/auth";

export const signInUserWithPassword = async (
  credentials: USER_AUTH_EMAIL_AND_PASSWORD,
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
    if (redirectTo) {
      await router.push(redirectTo);
    }
  }
};

export const signUpUserWithPassword = async (
  credentials: USER_AUTH_EMAIL_AND_PASSWORD,
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