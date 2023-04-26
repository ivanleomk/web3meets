import { format } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { type Event } from "../types/database";
import { api } from "../utils/api";
import { Button } from "./Button";
import OrganizationStatus from "./OrganizationStatus";
import WarningModal from "./WarningModal";
import ReactDatePicker from "react-datepicker";
import { formatTelegramMessage } from "src/utils/string";

type Props = {
  data: Event;
};

const EventApprovalRow = ({ data }: Props) => {
  const {
    event_title,
    scheduled_post,
    event_id,
    partner_id,
    approved,

    starts_at,
    ends_at,
    category,
    rsvp_link,
    location,
  } = data;
  const [showModal, setShowModal] = useState(false);

  const utils = api.useContext();
  const formattedPostDate = scheduled_post ? new Date(scheduled_post) : null;
  const [currPostDate, setCurrPostDate] = useState<Date | null>(
    formattedPostDate
  );

  const { mutate: sendMessage, isLoading: isSendingMessage } =
    api.admin.sendMessage.useMutation({
      onSuccess: () => {
        toast.success(`Succesfully sent message to group!`);
      },
      onError: (err) => {
        toast.warning(err.message);
      },
    });

  const { mutate, isLoading: deletingEventLoading } =
    api.event.deleteEvent.useMutation({
      onSuccess: async (res) => {
        await utils.admin.getEvents.invalidate();
        toast.success(`Succesfully deleted ${event_title} from database`);
      },
      onError: (err) => {
        toast.warning(err.message);
      },
    });

  const { mutate: updatePostDate, isLoading: isUpdatingPostDate } =
    api.admin.updatePostDate.useMutation({
      onSuccess: () => {
        toast.success("Succesfully updated scheduled post date");
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
        <OrganizationStatus active={approved ?? false} />
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <ReactDatePicker
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
          placeholderText="No Date Selected"
          selected={currPostDate}
          onChange={(e) => {
            setCurrPostDate(e);
          }}
          showTimeSelect={true}
          timeIntervals={15}
          dateFormat="MMMM d, yyyy hh:mm aa"
        />
        <div className="mt-4 flex space-x-4">
          <WarningModal
            buttonText="Send Now"
            onClickHandler={() => {
              sendMessage({
                event_id,
                event_title,
                category: category ?? "",
                starts_at: new Date(starts_at),
                ends_at: new Date(ends_at),
                rsvp_link: rsvp_link ?? "To be Confirmed",
                location: location ?? "To Be Confirmed upon signup",
              });
            }}
            title={"Warning"}
            subtitle="Are you sure you wish to send this message now?"
            userActionText="Send Now"
            isSubmitting={isSendingMessage}
            variant="outline"
            color="gray"
          >
            <div className="my-6 ml-2 rounded-md bg-slate-100 px-4 py-4 text-sm leading-6">
              <p className="whitespace-pre-wrap">
                {formatTelegramMessage(
                  event_title,
                  category ?? "Networking",
                  new Date(starts_at),
                  new Date(ends_at),
                  rsvp_link ?? "To be Confirmed",
                  location ?? "To Be Confirmed upon signup"
                )}
              </p>
            </div>
          </WarningModal>

          <Button
            text="Save"
            isSubmitting={isUpdatingPostDate}
            disabled={currPostDate == formattedPostDate}
            onClickHandler={() => {
              if (!currPostDate) {
                return;
              }
              updatePostDate({
                date: currPostDate,
                event_id: event_id,
              });
            }}
          />
        </div>
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
