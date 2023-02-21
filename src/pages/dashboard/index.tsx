import React from "react";
import UserDashboard from "../../components/UserDashboardContainer";

const Dashboard = () => {
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>
      <UserDashboard />
    </div>
  );
};

export default Dashboard;
