import React, { useState } from "react";
import { UserPartnerOwnershipWithPartner } from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import CreateOrganizationForm from "./CreateOrganizationForm";
import InfoComponent from "./InfoComponent";
import OrganizationTable from "./OrganizationTable";

const OrganizationDashboard = () => {
  const [mode, setMode] = useState<"Create" | "View">("View");

  const { data, isFetching } = api.partner.getAllPartners.useQuery(undefined, {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

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
            <CreateOrganizationForm />
          ) : (
            <OrganizationTable
              data={data ? (data as UserPartnerOwnershipWithPartner[]) : []}
              isFetching={isFetching}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
