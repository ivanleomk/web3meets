import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { joinClassNames } from "../utils/css";
import { useUserContext } from "../context/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function UserAvatarDropdown() {
  const { userMetadata } = useUserContext();
  const supabaseClient = useSupabaseClient();

  return (
    <Menu as="div" className="hidden text-left lg:relative lg:inline-block">
      <div>
        <Menu.Button>
          <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
            <svg
              className="h-full w-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="space-y-2 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/settings"
                  className={joinClassNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Account Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    supabaseClient.auth
                      .signOut()
                      .then(() => {
                        toast.success("Successfully signed out of account");
                      })
                      .catch(() => {
                        toast.warning(
                          "Unable to sign user out. Unexpected error encountered."
                        );
                      });
                  }}
                  className={joinClassNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
