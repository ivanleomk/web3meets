import React from "react";
import { toast } from "react-toastify";
import { ORGANIZATION_FIELDS } from "../config/organization";
import { useOrganizationContext } from "../context/OrganizationContext";
import { type UserPartnerOwnershipWithPartner } from "../types/database";

import { type CreateOrganizationInput } from "../types/partner";
import { api } from "../utils/api";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationTable from "./OrganizationTable";
import OrganizationTableRow from "./OrganizationTableRow";
import SectionHeader from "./SectionHeader";

type Props = {
  initialMode: "Create" | "View";
  setInitialMode: (s: "Create" | "View") => void;
};

const OrganizationDashboard = ({ initialMode, setInitialMode }: Props) => {
  const { isPartnersLoading, partners } = useOrganizationContext();

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

    setInitialMode("View");
  };

  return (
    <SectionHeader
      title={
        initialMode === "View"
          ? "Current Organization Memberships"
          : "Create a new organization"
      }
      subtitle={
        initialMode === "View"
          ? "Here are a list of all the organizations which you're a member of"
          : "We just need a few more details in order to create your new organization."
      }
      onClickHandler={() => {
        if (initialMode === "Create") {
          setInitialMode("View");
        } else {
          setInitialMode("Create");
        }
      }}
      buttonText={
        initialMode === "Create"
          ? "View All Organizations"
          : "Create New Organization"
      }
    >
      {initialMode === "Create" ? (
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
