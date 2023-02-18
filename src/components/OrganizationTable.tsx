import React from "react";
import { ClipLoader } from "react-spinners";
import { ORGANIZATION_FIELDS } from "../config/organization";
import { type UserPartnerOwnershipWithPartner } from "../types/database";
import { joinClassNames } from "../utils/string";
import OrganizationTableRow from "./OrganizationTableRow";

type Props = {
  data: UserPartnerOwnershipWithPartner[];
  isLoading: boolean;
};

const OrganizationTable = ({ isLoading, data }: Props) => {
  if (isLoading) {
    return (
      <div className="mt-20 flex items-center justify-center">
        <ClipLoader color="black" size={30} />
      </div>
    );
  }

  if (data?.length == 0) {
    return (
      <div className="my-20 text-center">
        <div className="center inline-block min-w-full py-2 align-middle text-sm sm:px-6 lg:px-8">
          No organization memberships found
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {ORGANIZATION_FIELDS.map((fieldName, idx) => {
                  return (
                    <th
                      key={fieldName}
                      scope="col"
                      className={joinClassNames(
                        idx === 0
                          ? '"py-3 sm:pl-0" pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
                          : "px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      )}
                    >
                      {fieldName}
                    </th>
                  );
                })}

                <th scope="col" className="relative py-3 pl-3 pr-6 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="relative py-3 pl-3 pr-6 sm:pr-0">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data?.map((item) => {
                return (
                  <OrganizationTableRow key={item.partner_name} data={item} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTable;
