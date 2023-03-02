import React from "react";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import MobileNavLink from "./MobileNavLink";
import { ChevronUpIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { LINKS, PROFILE_LINKS } from "../config/links";
import { Button } from "./Button";
import { useUserContext } from "../context/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import Logo from "./Logo";

const MobileDropdownMenu = () => {
  const { isAuthenticated } = useUserContext();
  const supabaseClient = useSupabaseClient();
  return (
    <Popover className="md:hidden">
      {({ open, close }) => (
        <>
          <Popover.Button
            className="relative z-20 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
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
                  className="fixed inset-0  bg-gray-300/60 backdrop-blur"
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
                      return (
                        <MobileNavLink
                          postClickHook={close}
                          key={idx}
                          {...item}
                        />
                      );
                    })}
                    <div className="border-b-2"></div>
                    {isAuthenticated ? (
                      <>
                        {PROFILE_LINKS.map((item, idx) => {
                          return (
                            <MobileNavLink
                              postClickHook={close}
                              key={idx}
                              {...item}
                            />
                          );
                        })}

                        <Button
                          text="Sign Out"
                          variant="solid"
                          color="gray"
                          additionalStyling="w-full"
                          onClickHandler={() => {
                            close();
                            supabaseClient.auth
                              .signOut()
                              .then(() => {
                                toast.success(
                                  "Succesfully signed out of account"
                                );
                              })
                              .catch(() => {
                                toast.warning("Unexpected error encountered");
                              });
                          }}
                        />
                      </>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Button
                          postClickHook={() => close()}
                          text="Log In"
                          variant="outline"
                          href="/login"
                        />
                        <Button
                          postClickHook={() => close()}
                          text="Sign Up"
                          variant="solid"
                          color="gray"
                          href="/signup"
                        />
                      </div>
                    )}
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
