import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { TRPCError } from "@trpc/server";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { util } from "zod";
import CreateOrganizationForm from "../../../components/CreateOrganizationForm";
import { adminServerSupabaseInstance } from "../../../server/supabase/sharedInstance";
import {
  type UserPartnerOwnershipWithUser,
  type UserPartnerOwnershipWithPartner,
  Partner,
} from "../../../types/database";
import { type CreateOrganizationInput } from "../../../types/partner";
import { api } from "../../../utils/api";

type Props = {
  data: UserPartnerOwnershipWithPartner;
  members: UserPartnerOwnershipWithUser;
};

const PartnerPage = ({ data, members }: Props) => {
  const router = useRouter();
  const { partner_name } = router.query;

  const { data: PartnerData, error } =
    api.partner.getPartnerInformation.useQuery(
      {
        partner_name: partner_name as string,
      },
      {
        // Every 30s
        refetchInterval: 30000,
        initialData: data,
      }
    );
  const { mutate } = api.partner.updatePartnerDetails.useMutation({
    onSuccess: () => {
      toast.success("Succesfully updated metadata");
    },
  });
  const utils = api.useContext();

  if (!data || error) {
    return <p>Error encountered : Unable to fetch data</p>;
  }

  const organizationMetadata = PartnerData as UserPartnerOwnershipWithPartner;

  return (
    <div>
      <h2 className="my-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {partner_name}
      </h2>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Current Information
      </h3>
      <p className="mt-2 text-sm text-gray-700">
        Here are the existing details for your organization
      </p>
      <CreateOrganizationForm
        buttonText="Update Changes"
        initialValue={{
          name: organizationMetadata.Partner.partner_name,
          twitter_id: organizationMetadata.Partner?.twitter_id,
          // User must submit a valid url for changes to be commited so this will always be non-null
          website: organizationMetadata.Partner?.website,
          telegram_handle: organizationMetadata.Partner?.telegram_handle,
        }}
        onSubmit={(data) => {
          const { name, website, telegram_handle, twitter_id } = data;
          mutate({
            partner_name: name,
            website: website,
            telegram_handle,
            twitter_id,
          });
        }}
      />

      <h3 className="mt-20 text-lg font-medium leading-6 text-gray-900">
        Members
      </h3>
      <p className="mt-2 text-sm text-gray-700">
        Here are the accounts with admin access for your organization
      </p>
      {JSON.stringify(members)}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { partner_name } = ctx.query;

  const { data, error } = await adminServerSupabaseInstance
    .from("UserPartnerOwnership")
    .select("*, Partner(*)")
    .eq("partner_name", partner_name)
    .maybeSingle();

  if (!data || error) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const { data: members, error: membersError } =
    await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*,User(*)")
      .eq("partner_name", partner_name);

  if (membersError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to determine users with admin rights",
    });
  }

  return {
    props: {
      data: data as UserPartnerOwnershipWithPartner,
      members,
    },
  };
};

export default PartnerPage;
