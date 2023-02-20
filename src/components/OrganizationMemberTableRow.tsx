import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { type UserPartnerOwnershipWithUser } from "../types/database";
import { api } from "../utils/api";
import OrganizationStatus from "./OrganizationStatus";
import WarningModal from "./WarningModal";

type Props = {
  data: UserPartnerOwnershipWithUser;
  adminAccess: boolean;
  organizationName: string;
};

const OrganizationMemberTableRow = ({
  data,
  adminAccess,
  organizationName,
}: Props) => {
  console.log(data);
  const { approved, partner_id } = data;
  const { email, user_id } = data.User;
  const router = useRouter();

  const { mutate: updateOrganization } =
    api.partner.verifyValidOrganization.useMutation({
      onSuccess: (res) => {
        if (res) {
          void router.push("/dashboard");
        }
        toast.success("Succesfully deleted administrator from organization");
      },
      onError: (err) => {
        toast.warning(err.message);
      },
    });

  const { mutate } = api.partner.deletePartnerAdministrator.useMutation({
    onSuccess: () => {
      // toast.success("Succesfully deleted administrator from organization");
      updateOrganization({ partner_id });
    },
    onError: () => {
      toast.warning(
        "Unable to delete user. Please contact support if this issue persists"
      );
    },
  });

  return (
    <tr key={email}>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {email}
      </td>
      <td className="ml-4 whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        <OrganizationStatus active={approved} />
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
        <div className="flex flex-col space-y-4 text-left">
          <WarningModal
            variant="outline"
            disabled={adminAccess}
            color="gray"
            onClickHandler={() => {
              mutate({
                partner_id,
                user_id_deleting: user_id,
              });
            }}
            userActionText="Confirm"
            buttonText="Delete User"
            title="Delete User "
            subtitle={`Are you sure you wish to remove this user as a administrator from the ${organizationName} organization? `}
          />
        </div>
      </td>
    </tr>
  );
};

export default OrganizationMemberTableRow;
