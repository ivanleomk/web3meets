import React, { useState } from "react";
import { type Event, type ScheduledMessages } from "src/types/database";
import { format } from "date-fns";
import { Button } from "./Button";
import { toast } from "react-toastify";
import { api } from "src/utils/api";
import ReactDatePicker from "react-datepicker";
import WarningModal from "./WarningModal";
import { formatTelegramMessage } from "src/utils/string";
import MessageStatus from "./MessageStatus";
import { GROUP_TO_ID } from "src/config/telegram";
import Select from "react-select";

export type MessageAndEvent = ScheduledMessages & { Event: Event };

type Props = {
  item: MessageAndEvent;
};

const ScheduledPostRow = ({ item }: Props) => {
  const utils = api.useContext();
  const { mutate: updatePostDate, isLoading: isUpdatingPostDate } =
    api.post.modifyPostDate.useMutation({
      onSuccess: () => {
        toast.success("Successfully updated post date");
        void utils.post.getAllPosts.invalidate();
      },
      onError: (err) => {
        toast.warning(err.message);
      },
    });
  const { mutate: deletePost, isLoading: isDeletingPost } =
    api.post.deleteScheduledPost.useMutation({
      onSuccess: () => {
        toast.success("Successfully deleted post");
        void utils.post.getAllPosts.invalidate();
      },
    });

  const { mutate: sendMessage, isLoading: sendingMessage } =
    api.admin.sendMessage.useMutation({
      onSuccess: () => {
        toast.success(`Successfully sent message to group!`);
        void utils.post.getAllPosts.invalidate();
      },
    });

  const [currDate, setCurrDate] = useState(new Date(item.scheduled_date));
  const selectedGroup = GROUP_TO_ID.find(
    (group) => group.value === item.chat_id
  );
  const [currGroup, setCurrGroup] = useState(selectedGroup);

  return (
    <li key={item.id} className="grid grid-cols-4 items-start py-4">
      <div>
        {item.scheduled_date ? (
          <div>
            <time
              dateTime={format(new Date(item.scheduled_date), "EEE, MMM d")}
              className="w-40 flex-none"
            >
              {format(new Date(item.scheduled_date), "EEE, MMM d h:mm aa")}
            </time>
            {item.sent && item.message_datetime_sent
              ? "(Sent at " +
                format(
                  new Date(item.message_datetime_sent),
                  "EEEE, d MMM yyyy hh:mma"
                ) +
                ")"
              : ""}
          </div>
        ) : (
          <p>No Scheduled Time yet</p>
        )}
        <div className="flex flex-col items-start">
          <p
            className={
              item.sent
                ? "mt-2 flex-auto sm:mt-0"
                : " mt-2 flex-auto font-semibold sm:mt-0 "
            }
          >
            {item?.Event?.event_title as string}{" "}
          </p>
          <div className="h-4" />
          <MessageStatus active={item.sent} />
        </div>
      </div>
      <div>
        <p className="my-2 ">
          {format(new Date(item.Event.starts_at), "dd MMM yyyy, hh:mm aa")}
        </p>
      </div>
      <div>
        <p className="my-2 ">
          {format(new Date(item.scheduled_date), "dd MMM yyyy, hh:mm aa")}
        </p>
        <p className="text-bold font-mono underline">
          {GROUP_TO_ID.find((group) => group.value === item.chat_id)?.label}
        </p>
      </div>

      <div className="flex  flex-col space-y-2">
        <ReactDatePicker
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-25 sm:text-sm"
          placeholderText="No Date Selected"
          selected={currDate}
          onChange={(e) => {
            if (!e) {
              setCurrDate(new Date(item.scheduled_date));
            } else {
              setCurrDate(e);
            }
          }}
          disabled={item.sent}
          showTimeSelect={true}
          timeIntervals={15}
          dateFormat="MMMM d, yyyy hh:mm aa"
        />
        <Select
          value={currGroup}
          onChange={(e) => {
            if (!e) {
              return;
            }
            setCurrGroup(e);
          }}
          isDisabled={item.sent}
          className="mt-2"
          options={GROUP_TO_ID}
        />
        <div className="flex items-center space-x-2">
          <Button
            text="Update Date"
            variant="outline"
            isSubmitting={isUpdatingPostDate}
            disabled={isUpdatingPostDate || item.sent}
            onClickHandler={() => {
              if (!currGroup?.value) {
                throw new Error("Invalid Group Config");
              }
              // Should not happen since every event added to this scheduled messages must have a date
              updatePostDate({
                id: item.id,
                date: currDate,
                chat_id: currGroup?.value,
              });
            }}
          />
          <WarningModal
            title="Warning"
            subtitle="Are you sure you wish to remove this post from the posting schedule?"
            isSubmitting={isDeletingPost}
            disabled={isDeletingPost || item.sent}
            onClickHandler={() => {
              deletePost({ id: item.id });
            }}
            userActionText="Delete Scheduled Post"
            buttonText="Remove From Schedule"
            variant="solid"
            color="red"
          />
          <WarningModal
            title="Warning"
            subtitle="Are you sure you wish to send this scheduled post ahead of time"
            isSubmitting={sendingMessage}
            disabled={sendingMessage || item.sent}
            onClickHandler={() => {
              const {
                event_id,
                event_title,
                category,
                starts_at,
                ends_at,
                rsvp_link,
                location,
              } = item.Event;
              sendMessage({
                event_id,
                event_title,
                category: category ?? "",
                starts_at: new Date(starts_at),
                ends_at: new Date(ends_at),
                rsvp_link: rsvp_link ?? "To be Confirmed",
                location: location ?? "To Be Confirmed upon signup",
                id: item.id,
                group_id: item.chat_id,
              });
            }}
            userActionText="Send Message Now"
            buttonText="Send Message"
            variant="solid"
            color="cyan"
          >
            <div className="my-6 ml-2 rounded-md bg-slate-100 px-4 py-4 text-sm leading-6">
              <p className="whitespace-pre-wrap">
                {formatTelegramMessage(
                  item.Event.event_title,
                  item.Event.category as string,
                  new Date(item.Event.starts_at),
                  new Date(item.Event.ends_at),
                  item.Event.rsvp_link ?? "To be Confirmed",
                  item.Event.location ?? "To Be Confirmed upon signup"
                )}
              </p>
            </div>
          </WarningModal>
        </div>
      </div>
    </li>
  );
};

export default ScheduledPostRow;
