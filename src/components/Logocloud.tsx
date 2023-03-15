import Image from "next/image";
import React from "react";
import { PARTNERS } from "../config/partners";

const LogoCloud = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h1 className="text-left text-2xl font-extrabold">Our Partners</h1>
        <p className="text-md text-left font-semibold text-gray-600">
          Officially Partnered, Curated and Featured events from
        </p>
        <div className="mt-6 grid grid-cols-2 gap-1 md:grid-cols-3 lg:mt-8">
          {PARTNERS.map((item) => {
            return (
              <div
                key={item.label}
                className="col-span-1 flex justify-center py-8 px-8"
              >
                <div className="flex max-h-12 items-center justify-center">
                  <Image
                    src={item.itemPath}
                    alt={`${item.label} Logo`}
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
