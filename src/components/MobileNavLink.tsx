import { Popover } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { type LinkMetadata } from "../types/links";

const MobileNavLink = ({ label, href }: LinkMetadata) => {
  return (
    <Popover.Button className="block text-base leading-7 tracking-tight text-gray-700">
      <Link href={href}>{label}</Link>
    </Popover.Button>
  );
};

export default MobileNavLink;
