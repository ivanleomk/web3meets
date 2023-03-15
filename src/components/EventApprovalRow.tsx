import { format } from "date-fns";
import React from "react";
import { toast } from "react-toastify";
import { type Event } from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import OrganizationStatus from "./OrganizationStatus";
import WarningModal from "./WarningModal";

type Props = {
  data: Event;
};

const EventApprovalRow = ({ data }: Props) => {
  const {
    event_title,
    starts_at,
    ends_at,
    online,
    rsvp_link,
    event_id,
    partner_id,
    approved,
  } = data;
  const formattedStart = format(new Date(starts_at), "MMM dd yyyy,hh:mm aa");
  const formattedEnd = format(new Date(ends_at), "MMM dd yyyy, hh:mm aa");

  const utils = api.useContext();

  const { mutate, isLoading: deletingEventLoading } =
    api.event.deleteEvent.useMutation({
      onSuccess: async () => {
        await utils.admin.getEvents.invalidate();
        toast.success(`Succesfully deleted ${event_title} from database`);
      },
      onError: (err) => {
        toast.warning(err.message);
      },
    });

  const {
    mutate: deletePromotionalMaterial,
    isLoading: deletingMaterialLoading,
  } = api.event.deleteAllImages.useMutation({
    onSuccess: () => {
      void mutate({
        event_id,
        partner_id: partner_id as string,
      });
    },
    onError: (err) => {
      toast.warning(err.message);
    },
  });

  const { mutate: updateEventStatus } = api.admin.setEventStatus.useMutation({
    onSuccess: () => {
      toast.success("Succesfully updated event approval status");
      void utils.admin.getEvents.invalidate();
    },
    onError: (err) => {
      toast.warning(err.message);
    },
  });

  return (
    <tr key={event_title}>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {event_title}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <OrganizationStatus active={approved} />
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
              console.log({
                event_id: event_id,
                partner_id: partner_id as string,
              });
              deletePromotionalMaterial({
                event_id: event_id,
                partner_id: partner_id as string,
              });
            }}
            disabled={deletingEventLoading || deletingMaterialLoading}
            isSubmitting={deletingEventLoading || deletingMaterialLoading}
            userActionText="Confirm"
            buttonText="Delete Event"
            title="Delete Event "
            subtitle={`Are you sure you wish to delete event ${event_title}. This action is non reversible`}
          />

          <Button
            variant="solid"
            color="cyan"
            href={`/dashboard/event?event_id=${event_id}`}
            text="Modify Event Details"
          />
          <Button
            variant="solid"
            color="gray"
            onClickHandler={() => {
              updateEventStatus({
                event_id,
                status: !approved,
              });
            }}
            text={approved ? "Revoke Event Approval" : "Approve Event"}
          />
        </div>
      </td>
    </tr>
  );
};

export default EventApprovalRow;
