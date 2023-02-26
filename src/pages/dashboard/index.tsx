import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UserDashboard from "../../components/UserDashboardContainer";
import type { Modes, Tabs } from "../../types/dashboard";

const tabs: Tabs[] = ["Organizations", "Events"];

const Dashboard = () => {
  const router = useRouter();
  const query = router.query;
  const [initialTab, setInitialTab] = useState<Tabs>("Organizations");
  const [initialMode, setInitialMode] = useState<Modes>("View");

  useEffect(() => {
    if (query.mode) {
      setInitialTab(query.mode ? "Events" : "Organizations");
    }
    if (query.view) {
      setInitialMode(query.view ? "Create" : "View");
    }
  }, [query]);

  return (
    <div>
      <h2 className="my-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>
      <UserDashboard
        initialTab={initialTab}
        initialMode={initialMode}
        setInitialTab={setInitialTab}
        setInitialMode={setInitialMode}
        tabs={tabs}
      />
    </div>
  );
};

export default Dashboard;
