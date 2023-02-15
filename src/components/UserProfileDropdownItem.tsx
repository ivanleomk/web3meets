import { Menu } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { type LinkMetadata } from "../types/links";
import { joinClassNames } from "../utils/string";

type Props = {
  linkMetadata: LinkMetadata;
};

const UserProfileDropdownItem = ({ linkMetadata }: Props) => {
  const { label, href } = linkMetadata;
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={href}
          className={joinClassNames(
            active ? "bg-gray-100" : "",
            "block px-4 py-2 text-sm text-gray-700"
          )}
        >
          {label}
        </Link>
      )}
    </Menu.Item>
  );
};

export default UserProfileDropdownItem;
