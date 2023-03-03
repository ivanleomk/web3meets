import EventPage from "../components/EventPage";

import { adminServerSupabaseInstance } from "../server/supabase/sharedInstance";
import { convertDateToTimestamptz } from "../utils/date";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";

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

  // console.log(data);
  console.log(error);

  return {
    props: {
      events: data,
    },
    revalidate: 120, // In seconds
  };
}

export default Home;
