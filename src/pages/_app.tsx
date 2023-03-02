import type { AppProps } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import {
  createBrowserSupabaseClient,
  type Session,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { type Database } from "../types/database-raw";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserWrapper } from "../context/UserContext";
import "react-datepicker/dist/react-datepicker.css";
import { OrganizationWrapper } from "../context/OrganizationContext";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  // Create a new supabase browser client on every first render.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [supabaseClient] = useState(() =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    createBrowserSupabaseClient<Database>()
  );

  return (
    // We do a bit of typescript errors here since this is an external package so we can't really perform strong type assertions without breaking the auto-complete
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <UserWrapper>
        <OrganizationWrapper>
          <Header />
          <div className="mx-auto mb-20 max-w-7xl px-4 md:px-10">
            <Component {...pageProps} />
            <ToastContainer />
          </div>
          <Footer />
        </OrganizationWrapper>
      </UserWrapper>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);
