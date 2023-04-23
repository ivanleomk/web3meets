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
import Head from "next/head";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

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
        <Analytics />
        <OrganizationWrapper>
          <Header />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-WVF22WMN2E" />
          <Script
            id="Google Tag"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-WVF22WMN2E');
              `,
            }}
          />

          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta charSet="utf-8" />
            <title>Web3Meets</title>
            <meta
              name="description"
              content="Your one stop shop for all things web3 related in SEA"
            />
          </Head>

          <div className="-pb-10 px-4 md:px-10">
            <Component {...pageProps} />
            <ToastContainer />
          </div>
          {/* <Footer /> */}
        </OrganizationWrapper>
      </UserWrapper>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);
