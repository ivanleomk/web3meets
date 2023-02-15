import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { type NextPage } from "next";
import { Header } from "../components/Header";
import { Database } from "../types/database-raw";

import { api } from "../utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return <>Index Page</>;
};

export default Home;
