import React from "react";
import ContactUs from "../components/ContactUs";
import HeroSection from "../components/HeroSection";
import LogoCloud from "../components/Logocloud";

const HomePage = () => {
  return (
    <div className="mx-auto mb-10 max-w-6xl px-4">
      <HeroSection />
      <LogoCloud />
      <ContactUs />
    </div>
  );
};

export default HomePage;
