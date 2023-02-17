import React from "react";
import { UserPartnerOwnershipWithPartner } from "../types/database";
import { Button } from "./Button";
import OrganizationStatus from "./OrganizationStatus";

type Props = {
  data: UserPartnerOwnershipWithPartner;
};

const OrganizationTableRow = ({ data }: Props) => {
  const {
    approved,
    Partner: { name, website, telegram_handle, twitter_id, active },
  } = data;
  return (
    <tr key={name}>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {name}
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
          <Button
            variant="outline"
            color="gray"
            onClickHandler={() => {
              alert("Deleting Membership");
            }}
            text="Delete Membership"
          />
          <Button
            variant="solid"
            color="gray"
            onClickHandler={() => {
              alert("Deleting Membership");
            }}
            text="Update Org"
          />
        </div>
      </td>
    </tr>
  );
};

export default OrganizationTableRow;
