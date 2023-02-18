import React from "react";
import { toast } from "react-toastify";
import { UserPartnerOwnershipWithPartner } from "../types/database";
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
    Partner: { partner_name, website, telegram_handle, twitter_id, active },
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
        {partner_name}
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
        <OrganizationStatus active={active ? active : false} />
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <OrganizationStatus active={approved ? approved : false} />
      </td>

      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
        <div className="flex flex-col space-y-4 text-left">
          <WarningModal
            variant="outline"
            color="gray"
            onClickHandler={() => {
              deletePartner({ partner_name });
              // Optimistic Updates set here
              utils.partner.getAllPartners.setData(undefined, (old) =>
                old?.filter((item) => {
                  item.partner_name !== partner_name;
                })
              );
            }}
            userActionText="Confirm"
            buttonText="Delete Membership"
            title="Delete Membership "
            subtitle={`Are you sure you wish to delete your membership from the ${partner_name} organization? This action is non-reversible and only an administrator will be able to add you back in the future.`}
          />
          <Button
            variant="solid"
            color="gray"
            href={`/partners/${partner_name}`}
            text="Update Org"
          />
        </div>
      </td>
    </tr>
  );
};

export default OrganizationTableRow;
