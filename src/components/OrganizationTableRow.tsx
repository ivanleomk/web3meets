import React from "react";
import { UserPartnerOwnershipWithPartner } from "../types/database";
import OrganizationStatus from "./OrganizationStatus";

type Props = {
  data: UserPartnerOwnershipWithPartner;
};

const OrganizationTableRow = ({ data }: Props) => {
  const {
    approved,
    Partner: { name, website, telegram_handle, twitter_id },
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
        <OrganizationStatus active={approved ? approved : false} />
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Edit
        </a>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Delete
        </a>
      </td>
    </tr>
  );
};

export default OrganizationTableRow;
