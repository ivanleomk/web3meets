import React, { useState } from "react";
import { toast } from "react-toastify";
import { ORGANIZATION_FIELDS } from "../config/organization";
import { type UserPartnerOwnershipWithPartner } from "../types/database";
import { type CreateOrganizationInput } from "../types/partner";
import { api } from "../utils/api";
import { Button } from "./Button";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationTable from "./OrganizationTable";
import OrganizationTableRow from "./OrganizationTableRow";

const OrganizationDashboard = () => {
  const [mode, setMode] = useState<"Create" | "View">("View");

  const { data, isLoading } = api.partner.getAllPartners.useQuery(undefined, {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  const utils = api.useContext();

  const newPartnerMutation = api.partner.createPartner.useMutation({
    onError: (err) => {
      toast.warning(err.message);
    },
    onSuccess: () => {
      toast.success(
        "New organization succesfully created. Please wait for confirmation from our team for changes to reflect."
      );
      void utils.partner.getAllPartners.invalidate();
    },
  });

  const onSubmit = (data: CreateOrganizationInput) => {
    const { partner_name, website, twitter_id, telegram_handle } = data;

    newPartnerMutation.mutate({
      partner_name,
      website,
      twitter_id,
      telegram_handle,
    });

    setMode("View");
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
              errorMessage="No User Organizations found"
              headerFields={ORGANIZATION_FIELDS}
              renderComponent={(data: UserPartnerOwnershipWithPartner) => {
                return <OrganizationTableRow data={data} />;
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
