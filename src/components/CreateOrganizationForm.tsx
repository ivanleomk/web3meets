import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { USER_AUTH_EMAIL_AND_PASSWORD } from "../types/auth";
import { Database } from "../types/database-raw";
import { api } from "../utils/api";
import Input from "./Input";

type CreateOrganizationInput = {
  name: string;
  website: string;
  telegram_handle: string;
  twitter_id: string;
};

const CreateOrganizationForm = () => {
  const newPartnerMutation = api.partner.createPartner.useMutation({
    onError: (err) => {
      console.log(err);
      toast.warning("Unable to add new organization. Please try again later");
    },
    onSuccess: () => {
      toast.success(
        "Succesfully created New Organization. Please wait for an email from our team to confirm your ownership of the Organization."
      );
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateOrganizationInput>();

  const onSubmit = async (data: CreateOrganizationInput) => {
    const { name, website, twitter_id, telegram_handle } = data;
    await newPartnerMutation.mutateAsync({
      name,
      website,
      twitter_id,
      telegram_handle,
    });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-2 gap-4 gap-y-8"
      >
        <Input
          label="Name"
          errorMessage={
            errors?.name
              ? "Please enter a valid name for the new organization"
              : undefined
          }
          htmlFor="Name"
          autocomplete=""
          type="text"
          {...register("name", { required: true })}
        />
        <Input
          label="Website Address"
          errorMessage={
            errors?.name ? "Please enter a valid website address" : undefined
          }
          htmlFor="Website Address"
          autocomplete=""
          type="text"
          {...register("website", { required: true })}
        />
        <Input
          label="Telegram Handle"
          errorMessage={
            errors?.name ? "Please enter a valid Telegram handle" : undefined
          }
          htmlFor="Telegram Handle"
          autocomplete=""
          type="text"
          {...register("telegram_handle", { required: true })}
        />
        <Input
          label="Twitter Handle"
          errorMessage={
            errors?.name ? "Please enter a valid Twitter Handle" : undefined
          }
          htmlFor="Twitter Handle"
          autocomplete=""
          type="text"
          {...register("twitter_id", { required: true })}
        />
        <div className="col-span-2 flex items-center justify-center">
          <button
            disabled={isSubmitting}
            type="submit"
            className="flex max-w-md justify-center rounded-md border border-transparent bg-gray-800  py-3 px-4 text-sm font-medium text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80"
          >
            {isSubmitting ? (
              <>
                <ClipLoader color="white" size={20} />
              </>
            ) : (
              <>Create New Organization</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateOrganizationForm;
