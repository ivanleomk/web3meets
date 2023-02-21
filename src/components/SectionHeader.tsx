import React, { type ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const SectionHeader = ({ title, subtitle, children }: Props) => {
  return (
    <div className="mt-20">
      <div className="flex items-center  justify-between">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
      {children}
    </div>
  );
};

export default SectionHeader;
