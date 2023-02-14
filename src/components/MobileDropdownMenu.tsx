import React from "react";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import MobileNavLink from "./MobileNavLink";
import { ChevronUpIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { LINKS } from "../config/links";
import { Button } from "./Button";

const MobileDropdownMenu = () => {
  return (
    <Popover className="lg:hidden">
      {({ open }) => (
        <>
          <Popover.Button
            className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
            aria-label="Toggle site navigation"
          >
            {({ open }) =>
              open ? (
                <ChevronUpIcon className="light:text-white h-6 w-6 dark:text-black" />
              ) : (
                <Bars3Icon className="light:text-white h-6 w-6 dark:text-black" />
              )
            }
          </Popover.Button>
          <AnimatePresence initial={false}>
            {open && (
              <>
                <Popover.Overlay
                  static
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                />
                <Popover.Panel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: -32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -32,
                    transition: { duration: 0.2 },
                  }}
                  className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                >
                  <div className="space-y-4">
                    {LINKS.map((item, idx) => {
                      return <MobileNavLink key={idx} {...item} />;
                    })}
                  </div>
                  <div className="mt-8 flex flex-col gap-4">
                    <Button text="Log In" variant="outline" href="/login" />
                    <Button
                      text="Sign Up"
                      variant="solid"
                      color="gray"
                      href="/signup"
                    />
                  </div>
                </Popover.Panel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
};

export default MobileDropdownMenu;
