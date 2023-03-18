import React, { type ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import usePagination from "../hooks/usePagination";
import { joinClassNames } from "../utils/string";
import Pagination from "./Pagination";

type Props<T> = {
  data: T[];
  isLoading: boolean;
  errorMessage: string;
  headerFields: {
    label: string;
    sr_value: string;
  }[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderComponent: (data: T) => ReactNode;
};

const OrganizationTable = <T,>({
  isLoading,
  data,
  errorMessage,
  headerFields,
  renderComponent,
}: Props<T>) => {
  const { currentData, next, prev } = usePagination<T>(data ? data : [], 10);

  if (isLoading) {
    return (
      <div className="mt-20 flex items-center justify-center">
        <ClipLoader color="black" size={30} />
      </div>
    );
  }

  if (currentData()?.length == 0) {
    return (
      <div className="my-20 text-center">
        <div className="center inline-block min-w-full py-2 align-middle text-sm sm:px-6 lg:px-8">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 flow-root px-2">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {headerFields.map((field, idx) => {
                    return (
                      <th
                        key={field.sr_value}
                        scope="col"
                        className={joinClassNames(
                          idx === 0
                            ? '"py-3 sm:pl-0" pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
                            : "px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                        )}
                      >
                        {field.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentData()?.map((item) => {
                  return renderComponent(item);
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination next={next} prev={prev} />
    </>
  );
};

export default OrganizationTable;
