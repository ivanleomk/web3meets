import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import OrganizationDashboard from "./OrganizationDashboard";

const tabs = ["Organizations", "Events"];

export default function UserDashboard() {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

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
                {currentTab == tab && (
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
                onClick={() => setCurrentTab(tab)}
                className={
                  "relative z-10 cursor-pointer rounded-md px-3 py-2 text-sm font-medium"
                }
                aria-current={tab === currentTab ? "page" : undefined}
              >
                {tab}
              </span>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-10 px-1 md:px-4">
        {currentTab === "Organizations" ? (
          <OrganizationDashboard />
        ) : (
          <p>Events</p>
        )}
      </div>
    </div>
  );
}
