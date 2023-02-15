import React, { useState } from "react";
import { Button } from "./Button";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationTable from "./OrganizationTable";

const OrganizationDashboard = () => {
  const [mode, setMode] = useState<"Create" | "View">("Create");
  return (
    <>
      <div className=" border-gray-200  px-1">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Current Organizations
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Here are all the organizations that you can create events for
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
        <div className="px-2">
          {mode === "Create" ? (
            <CreateOrganizationForm />
          ) : (
            <OrganizationTable />
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationDashboard;
