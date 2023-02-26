import React, { useState } from "react";
import { toast } from "react-toastify";
import { ORGANIZATION_FIELDS } from "../config/organization";
import { useOrganizationContext } from "../context/OrganizationContext";
import { UserPartnerOwnershipWithPartner } from "../types/database";

import { type CreateOrganizationInput } from "../types/partner";
import { api } from "../utils/api";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationTable from "./OrganizationTable";
import OrganizationTableRow from "./OrganizationTableRow";
import SectionHeader from "./SectionHeader";

const OrganizationDashboard = () => {
  const { isPartnersLoading, partners } = useOrganizationContext();
  const [mode, setMode] = useState<"Create" | "View">("View");

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
    <SectionHeader
      title={
        mode === "View"
          ? "Current Organization Memberships"
          : "Create a new organization"
      }
      subtitle={
        mode === "View"
          ? "Here are a list of all the organizations which you're a member of"
          : "We just need a few more details in order to create your new organization."
      }
      onClickHandler={() => {
        if (mode === "Create") {
          setMode("View");
        } else {
          setMode("Create");
        }
      }}
      buttonText={
        mode === "Create" ? "View All Organizations" : "Create New Organization"
      }
    >
      {mode === "Create" ? (
        <CreateOrganizationForm
          onSubmit={onSubmit}
          buttonText="Create New Organisation"
        />
      ) : (
        <OrganizationTable
          data={partners ? partners : []}
          isLoading={isPartnersLoading}
          errorMessage="No User Organizations found"
          headerFields={ORGANIZATION_FIELDS}
          renderComponent={(data: UserPartnerOwnershipWithPartner) => {
            return <OrganizationTableRow data={data} />;
          }}
        />
      )}
    </SectionHeader>
  );
};

export default OrganizationDashboard;
