import { useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { z } from "zod";
import { api } from "../utils/api";
import Input from "./Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateOrganizationInput,
  createOrganizationSchema,
} from "../types/partner";

type Props = {
  postFormHook: () => void;
};

const CreateOrganizationForm = ({ postFormHook }: Props) => {
  const newPartnerMutation = api.partner.createPartner.useMutation({
    onError: (err) => {
      console.log(err);
      toast.warning("Unable to add new organization. Please try again later");
    },
    onSuccess: () => {
      toast.success(
        "New organization succesfully created. Please wait for confirmation from our team for changes to reflect."
      );
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
  });
  const utils = api.useContext();
  const user = useUser();

  const onSubmit = async (data: CreateOrganizationInput) => {
    const { name, website, twitter_id, telegram_handle } = data;
    const newMut = newPartnerMutation.mutateAsync({
      partner_name: name,
      website,
      twitter_id,
      telegram_handle,
    });
    utils.partner.getAllPartners.setData(undefined, (old) => {
      const newObj = {
        approved: false,
        partner_name: name,
        user_id: user?.id as string,
        Partner: {
          partner_name: name,
          website,
          twitter_id: twitter_id ? twitter_id : "",
          telegram_handle: telegram_handle ? telegram_handle : "",
          open_to_sponsor: false,
          active: false,
          approved: false,
          stripe_account_id: "",
        },
      };

      if (!old) {
        return [newObj];
      }
      return [...old, newObj];
    });
    postFormHook();
    await newMut;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-2 gap-4 gap-y-8"
      >
        <Input
          label="Name"
          errorMessage={errors?.name}
          htmlFor="Name"
          autocomplete=""
          type="text"
          {...register("name")}
        />
        <Input
          label="Website Address"
          errorMessage={errors?.website}
          htmlFor="Website Address"
          autocomplete=""
          type="text"
          {...register("website")}
        />
        <Input
          label="Telegram Handle"
          errorMessage={errors?.telegram_handle}
          htmlFor="Telegram Handle"
          autocomplete=""
          type="text"
          {...register("telegram_handle")}
        />
        <Input
          label="Twitter Handle"
          errorMessage={errors?.twitter_id}
          htmlFor="Twitter Handle"
          autocomplete=""
          type="text"
          {...register("twitter_id")}
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
