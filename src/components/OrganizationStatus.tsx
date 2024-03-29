import React from "react";
import { joinClassNames } from "../utils/string";

type Props = {
  active: boolean;
};

const OrganizationStatus = ({ active }: Props) => {
  return (
    <span
      className={joinClassNames(
        active ? "bg-green-100  text-green-800" : "bg-red-400  text-red-800",
        "inline-flex rounded-full py-1 px-2 text-xs font-semibold leading-5"
      )}
    >
      {active ? "Active" : "Pending Approval"}
    </span>
  );
};

export default OrganizationStatus;
