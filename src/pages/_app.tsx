import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <div className="mx-auto h-screen max-w-7xl px-2">
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  );
};

export default api.withTRPC(MyApp);
