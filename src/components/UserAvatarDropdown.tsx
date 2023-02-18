import { Menu, Transition } from "@headlessui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import React, { Fragment } from "react";
import { toast } from "react-toastify";
import { PROFILE_LINKS } from "../config/links";
import { joinClassNames } from "../utils/string";
import UserAvatarImage from "./UserAvatarImage";
import UserProfileDropdownItem from "./UserProfileDropdownItem";

const UserAvatarDropdown = () => {
  const supabaseClient = useSupabaseClient();
  return (
    <>
      <Menu as="div" className="relative ml-3 hidden md:block">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <UserAvatarImage />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <>
              {PROFILE_LINKS.map((item) => {
                return (
                  <UserProfileDropdownItem
                    key={item.href}
                    linkMetadata={item}
                  />
                );
              })}
            </>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    supabaseClient.auth
                      .signOut()
                      .then(() => {
                        toast.success("Succesfully signed out of account");
                      })
                      .catch(() => {
                        toast.warning(
                          "Unable to sign user out. Unexpected error encountered."
                        );
                      });
                  }}
                  className={joinClassNames(
                    active ? "bg-gray-100" : "",
                    "block w-full px-4 py-2 text-left text-sm text-gray-700"
                  )}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default UserAvatarDropdown;
