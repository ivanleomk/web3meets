import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import { type UserPartnerOwnershipWithPartner } from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import OrganizationStatus from "./OrganizationStatus";
import WarningModal from "./WarningModal";

type Props = {
  data: UserPartnerOwnershipWithPartner;
};

const OrganizationTableRow = ({ data }: Props) => {
  const {
    approved,
    Partner: {
      partner_id,
      partner_name,
      website,
      telegram_handle,
      twitter_id,
      approved: organizationApproved,
    },
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
        <OrganizationStatus active={approved ? approved : false} />
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
              // Optimistic Updates set here
              utils.partner.getAllPartners.setData(undefined, (old) => {
                return old?.filter((item) => {
                  item.partner_id !== partner_id;
                });
              });
            }}
            userActionText="Confirm"
            buttonText="Delete Membership"
            title="Delete Membership "
            subtitle={`Are you sure you wish to delete your membership from the ${partner_name} organization? This action is non-reversible and only an administrator will be able to add you back in the future.`}
          />
          <Button
            variant="solid"
            color="gray"
            href={`/dashboard/partner?partner_id=${partner_id}`}
            text="Update Org"
          />
        </div>
      </td>
    </tr>
  );
};

export default OrganizationTableRow;
