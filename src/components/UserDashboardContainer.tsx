import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modes, Tabs } from "../types/dashboard";
import { UserPartnerOwnershipWithPartner } from "../types/database";
import { api } from "../utils/api";
import EventDashboard from "./EventDashboard";

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
  console.log(initialMode);
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
