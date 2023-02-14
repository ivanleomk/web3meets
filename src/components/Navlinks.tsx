import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { type LinkMetadata } from "../types/links";
import { joinClassNames } from "../utils/string";

type NavLinkProps = {
  LinkItemMetadata: LinkMetadata[];
};

const Navlinks = ({ LinkItemMetadata }: NavLinkProps) => {
  const [currentLink, setCurrentLink] = useState(-1);

  return (
    <>
      {LinkItemMetadata.map((link, idx) => {
        return (
          <Link
            key={idx}
            href={link.href}
            onMouseEnter={() => setCurrentLink(idx)}
            onMouseLeave={() => setCurrentLink(-1)}
            className={joinClassNames(
              "relative -my-2 -mx-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]"
            )}
          >
            <AnimatePresence>
              {currentLink === idx && (
                <motion.span
                  className="absolute inset-0 rounded-lg bg-gray-100"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{link.label}</span>
          </Link>
        );
      })}
    </>
  );
};

export default Navlinks;
