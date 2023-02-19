import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import Input from "./Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateOrganizationInput,
  createOrganizationSchema,
} from "../types/partner";

type Props = {
  initialValue?: CreateOrganizationInput | undefined;
  onSubmit: (data: CreateOrganizationInput) => void;
  buttonText: string;
};

const CreateOrganizationForm = ({
  onSubmit,
  initialValue,
  buttonText,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: initialValue ? initialValue : undefined,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-2 gap-4 gap-y-8"
      >
        <Input
          label="Name"
          errorMessage={errors?.partner_name}
          htmlFor="Name"
          autocomplete=""
          type="text"
          {...register("partner_name")}
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
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register("bio")}
          />
        </div>

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
              <>{buttonText}</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateOrganizationForm;
