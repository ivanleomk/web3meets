import React, { type ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onClickHandler?: () => void;
  buttonText?: string;
  topPadding?: boolean;
};

const SectionHeader = ({
  title,
  subtitle,
  children,
  onClickHandler,
  buttonText,
  topPadding = true,
}: Props) => {
  if (!onClickHandler || !buttonText) {
    return (
      <div className={topPadding ? "mt-20" : ""}>
        <div className="flex items-center  justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
        {children}
      </div>
    );
  }

  return (
    <div className=" border-gray-200  px-1">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          <Button
            text={buttonText}
            onClickHandler={onClickHandler}
            variant="outline"
            color="gray"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;
