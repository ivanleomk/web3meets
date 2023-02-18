import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type {
  GetServerSidePropsContext,
  PreviewData} from "next";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import UserDashboard from "../components/UserDashboardContainer";

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

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default Dashboard;
