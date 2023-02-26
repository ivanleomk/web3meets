import { useRouter } from "next/router";
import React from "react";
import UserDashboard from "../../components/UserDashboardContainer";

const tabs = ["Organizations", "Events"];

const Dashboard = () => {
  const router = useRouter();
  const query = router.query;
  const initialTab = query.mode ? "Events" : "Organizations";

  return (
    <div>
      <h2 className="my-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>
      <UserDashboard initialTab={initialTab} tabs={tabs} />
    </div>
  );
};

export default Dashboard;
