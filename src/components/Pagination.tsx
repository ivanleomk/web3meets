import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "./Button";

type Props = {
  next: () => void;
  prev: () => void;
};

const Pagination = ({ next, prev }: Props) => {
  return (
    <div className="flex w-full items-center justify-between border-t border-gray-200 bg-white py-4 ">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          text="Previous"
          onClickHandler={() => prev()}
        />

        <Button variant="outline" text="Next" onClickHandler={() => next()} />
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav
            className="isolate inline-flex space-x-4 "
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              text="Previous"
              onClickHandler={() => prev()}
            />

            <Button
              variant="outline"
              text="Next"
              onClickHandler={() => next()}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
