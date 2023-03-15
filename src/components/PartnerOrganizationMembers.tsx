import React from "react";
import { UserPartnerOwnershipWithUser } from "../types/database";

type Props = {
  users: UserPartnerOwnershipWithUser[];
};

const PartnerOrganizationMembers = ({ users }: Props) => {
  return (
    <>
      <p className="my-4 font-semibold text-gray-800">Our Team</p>
      <ul
        role="list"
        className="ml-5 grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
      >
        {users.map((person) => (
          <li key={person.User.user_id}>
            <div className="flex items-center gap-x-6">
              <div>
                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                  {person.User.user_name}
                </h3>
                <p className="text-md">{person.User.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PartnerOrganizationMembers;
