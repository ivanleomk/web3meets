import React, { Ref } from "react";
import { useForm } from "react-hook-form";
import {
  type CreateAdministratorInput,
  createNewAdministratorSchema,
} from "../types/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

type Props = {
  postClickHook?: (b: boolean) => void;
  closingRef?: React.MutableRefObject<null>;
  metadata?: Record<string, string>;
};

const AddNewAdministrator = ({
  postClickHook,
  closingRef,
  metadata,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateAdministratorInput>({
    resolver: zodResolver(createNewAdministratorSchema),
  });

  const { mutateAsync } = api.partner.addNewAdministrator.useMutation();
  const utils = api.useContext();

  const onSubmit = async (data: CreateAdministratorInput) => {
    if (!metadata || !metadata["partner_id"] || !postClickHook) {
      throw new Error("Invalid Parameters");
    }
    const { user_email } = data;
    const partner_id = metadata["partner_id"] as string;
    await mutateAsync({
      user_email,
      partner_id,
    });
    void utils.partner.getPartnerInformation.invalidate();
    toast.success("Succesfully added user!");
    postClickHook(false);
  };

  if (!postClickHook || !closingRef) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="email"
          className="block text-left text-sm font-medium text-gray-700"
        >
          User Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            {...register("user_email")}
          />
          {errors.user_email ? (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.user_email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? <ClipLoader color="white" size={20} /> : "Add User"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          onClick={() => postClickHook(false)}
          ref={closingRef}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddNewAdministrator;
