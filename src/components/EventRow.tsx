import { format } from "date-fns";
import React from "react";
import { Event } from "../types/database";
import { Button } from "./Button";
import WarningModal from "./WarningModal";

type Props = {
  data: Event;
};

const EventRow = ({ data }: Props) => {
  const { event_title, starts_at, ends_at, online, rsvp_link } = data;
  const formattedStart = format(new Date(starts_at), "MMM dd yyyy,hh:mm aa");
  const formattedEnd = format(new Date(ends_at), "MMM dd yyyy, hh:mm aa");
  return (
    <tr key={event_title}>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {event_title}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {formattedStart}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {formattedEnd}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {online ? "Yes" : "No"}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {rsvp_link ? rsvp_link : "No Link Provided"}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <div className="flex flex-col space-y-4 text-left">
          <WarningModal
            variant="outline"
            color="gray"
            onClickHandler={() => {
              alert("Deleting event");
            }}
            userActionText="Confirm"
            buttonText="Delete Event"
            title="Delete Event "
            subtitle={`Are you sure you wish to delete event ${event_title}. This action is non reversible`}
          />
          <Button
            variant="solid"
            color="gray"
            href={`/dashboard/`}
            text="Update Org"
          />
        </div>
      </td>
    </tr>
  );
};

export default EventRow;
