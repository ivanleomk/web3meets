import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useUserContext } from "../context/UserContext";
import { Modes, Tabs } from "../types/dashboard";
import { UserPartnerOwnershipWithPartner } from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import EventDashboard from "./EventDashboard";
import InfoComponent from "./InfoComponent";

import OrganizationDashboard from "./OrganizationDashboard";

type Props = {
  initialTab: Tabs;
  setInitialTab: (s: Tabs) => void;
  initialMode: Modes;
  setInitialMode: (s: Modes) => void;
  tabs: Tabs[];
};

export default function UserDashboard({
  initialTab,
  initialMode,
  setInitialMode,
  setInitialTab,
  tabs,
}: Props) {
  const { userMetadata, isAuthenticated } = useUserContext();

  if (!isAuthenticated) {
    return (
      <div className="mt-10 flex items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  if (!userMetadata?.user_name) {
    return (
      <>
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Attention needed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Please configure a display name before creating your first
                  event.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button
          additionalStyling="mt-4 ml-4"
          variant="outline"
          text="Configure Your Display Name"
          href="/settings"
        />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          onChange={(e) => {
            setInitialTab(e.target.value as Tabs);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <div
              key={tab}
              className="relative -my-2 -mx-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]"
            >
              <AnimatePresence>
                {initialTab == tab && (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-gray-200"
                    layoutId="hoverTabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>
              <span
                key={tab}
                onClick={() => setInitialTab(tab)}
                className={
                  "relative z-10 cursor-pointer rounded-md px-3 py-2 text-sm font-medium"
                }
                aria-current={tab === initialTab ? "page" : undefined}
              >
                {tab}
              </span>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-10 px-1 md:px-4">
        {initialTab === "Organizations" ? (
          <OrganizationDashboard
            initialMode={initialMode}
            setInitialMode={setInitialMode}
          />
        ) : (
          <EventDashboard
            initialMode={initialMode}
            setInitialMode={setInitialMode}
          />
        )}
      </div>
    </div>
  );
}
