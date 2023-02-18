import { useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { type UserPartnerOwnershipWithPartner } from "../types/database";
import { type CreateOrganizationInput } from "../types/partner";
import { api } from "../utils/api";
import { Button } from "./Button";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationTable from "./OrganizationTable";

const OrganizationDashboard = () => {
  const [mode, setMode] = useState<"Create" | "View">("View");

  const { data, isLoading } = api.partner.getAllPartners.useQuery(undefined, {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  const utils = api.useContext();
  const user = useUser();

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
    setMode("View");
    await newMut;
  };

  return (
    <>
      <div className=" border-gray-200  px-1">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Current Organizations Memberships
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Here is a list of your organization memberships
            </p>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <Button
              text={
                mode === "Create"
                  ? "View All Organizations"
                  : "Create New Organization"
              }
              onClickHandler={() => {
                if (mode === "Create") {
                  setMode("View");
                } else {
                  setMode("Create");
                }
              }}
              variant="outline"
              color="gray"
            />
          </div>
        </div>
        <div className="">
          {mode === "Create" ? (
            <CreateOrganizationForm
              onSubmit={onSubmit}
              buttonText="Create New Organisation"
            />
          ) : (
            <OrganizationTable
              data={data ? (data as UserPartnerOwnershipWithPartner[]) : []}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
