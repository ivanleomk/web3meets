import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { type NextPage } from "next";
import { Header } from "../components/Header";
import SectionHeader from "../components/SectionHeader";
import EventPage from "../components/EventPage";
import { Database } from "../types/database-raw";

import { api } from "../utils/api";
import { getServerSideProps } from "./dashboard/partner";
import { adminServerSupabaseInstance } from "../server/supabase/sharedInstance";
import { convertDateToTimestamptz } from "../utils/date";
import { type sEventAndPartnerInfoAndPromotionalMaterial } from "../types/database";

type Props = {
  events: EventAndPartnerInfoAndPromotionalMaterial[];
};

const Home = ({ events }: Props) => {
  console.log(events);

  return (
    <>
      <EventPage events={events} />
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await adminServerSupabaseInstance
    .from("Event")
    .select("*,Partner(*),PromotionalMaterial(*)")
    .gt("starts_at", convertDateToTimestamptz(new Date()));

  return {
    props: {
      events: data,
    },
    revalidate: 120, // In seconds
  };
}

export default Home;
