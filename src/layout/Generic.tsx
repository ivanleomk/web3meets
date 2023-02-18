import { useRouter } from "next/router";
import React, { type ReactNode } from "react";
import Footer from "../components/Footer";
import { Header } from "../components/Header";

type GenericProps = {
  children: ReactNode;
};

const Generic = ({ children }: GenericProps) => {
  const router = useRouter();
  if (router.pathname === "/login" || router.pathname === "/signup")
    return <>{children}</>;
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4">{children}</div>
      <Footer />
    </>
  );
};

export default Generic;
