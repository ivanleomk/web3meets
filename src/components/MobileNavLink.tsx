import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type LinkMetadata } from "../types/links";

type Props = {
  postClickHook?: () => void;
} & LinkMetadata;

const MobileNavLink = ({ label, href, postClickHook }: Props) => {
  const router = useRouter();
  return (
    <Popover.Button
      onClick={() => {
        void router.push(href);
        if (postClickHook) {
          postClickHook();
        }
      }}
      className="block w-full  text-left text-base leading-7 tracking-tight text-gray-700"
    >
      {label}
    </Popover.Button>
  );
};

export default MobileNavLink;
