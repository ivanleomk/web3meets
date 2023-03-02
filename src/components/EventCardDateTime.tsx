import { format } from "date-fns";
import React from "react";

type Props = {
  eventTime: string;
};

const EventCardDateTime = ({ eventTime }: Props) => {
  return (
    <div>
      <div className="mt-1 text-xs text-gray-700 xl:mt-[-1px] xl:text-sm">
        {format(new Date(eventTime), "E, dd MMM")}
      </div>
      <div className="mt-0 text-[11px] text-gray-500 xl:mt-0 xl:text-[12px]">
        {format(new Date(eventTime), "hh:mm aa")}
      </div>
    </div>
  );
};

export default EventCardDateTime;
