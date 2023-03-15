import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import {
  Partner,
  type UserPartnerOwnershipWithPartner,
} from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import OrganizationStatus from "./OrganizationStatus";
import WarningModal from "./WarningModal";

type Props = {
  data: Partner;
};

const AdminOrganizationTableRow = ({ data }: Props) => {
  const {
    partner_id,
    partner_name,
    website,
    telegram_handle,
    twitter_id,
    approved: organizationApproved,
  } = data;

  const { mutate: deletePartner } = api.partner.deletePartner.useMutation({
    onSuccess: () => {
      toast.success(`Succesfully deleted ${partner_name}`);
    },
    onError: () => {
      toast.warning(`Error encountered when trying to delete ${partner_name}`);
    },
  });
  const utils = api.useContext();

  const { mutate: updatePartnerStatus } =
    api.admin.toggleOrganizationStatus.useMutation({
      onSuccess: () => {
        void utils.admin.getOrganisation.invalidate();
        void utils.partner.getAllPartners.invalidate();
        toast.success(`Succesfully updated ${partner_name}`);
      },
      onError: () => {
        toast.warning(
          `Error encountered when trying to update ${partner_name}`
        );
      },
    });

  return (
    <tr key={partner_name}>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        <Link href={`/partner/${partner_id}`}>{partner_name}</Link>
      </td>

      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {website}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {telegram_handle}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {twitter_id}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <OrganizationStatus
          active={organizationApproved ? organizationApproved : false}
        />
      </td>

      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
        <div className="flex flex-col space-y-4 text-left">
          <WarningModal
            variant="outline"
            color="gray"
            onClickHandler={() => {
              deletePartner({ partner_id });
              void utils.admin.getOrganisation.invalidate();
            }}
            userActionText="Confirm"
            buttonText="Delete Membership"
            title="Delete Membership "
            subtitle={`Are you sure you wish to delete your membership from the ${partner_name} organization? This action is non-reversible and only an administrator will be able to add you back in the future.`}
          />
          <Button
            variant="solid"
            color="cyan"
            href={`/dashboard/partner?partner_id=${partner_id}`}
            text="Update Organisation Details"
          />
          <Button
            variant="solid"
            color="gray"
            onClickHandler={() => {
              updatePartnerStatus({
                partner_id,
                status: !organizationApproved,
              });
            }}
            text={
              organizationApproved
                ? "Revoke Organization Approval"
                : "Approve Organization"
            }
          />
        </div>
      </td>
    </tr>
  );
};

export default AdminOrganizationTableRow;
