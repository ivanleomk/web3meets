import { add, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminServerSupabaseInstance } from "src/server/supabase/sharedInstance";
import { Event } from "src/types/database";
import { convertDateToTimestamptz } from "src/utils/date";
import { formatTelegramMessage } from "src/utils/string";
import { bot, sendTelegramMessage } from "src/utils/telebot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await adminServerSupabaseInstance
    .from("scheduledMessages")
    .select("*,Event(*)")
    .lt(
      "scheduled_date",
      convertDateToTimestamptz(add(new Date(), { minutes: 15 }))
    )
    .eq("sent", false);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const currentTime = format(new Date(), "EEEE, d MMM yyyy");

  // Now we iterate and send the message via the bot
  for (const post of data) {
    if (!post.Event) {
      continue;
    }
    const { event_title, category, starts_at, ends_at, rsvp_link, location } =
      post?.Event as unknown as Event;
    const { id, chat_id } = post;
    // In case server gives us the timing in a non UTC Time
    const formattedMessage = formatTelegramMessage(
      event_title,
      category,
      utcToZonedTime(starts_at, "Asia/Singapore"),
      utcToZonedTime(ends_at, "Asia/Singapore"),
      rsvp_link ?? "To Be Announced",
      location ?? "To Be Confirmed unpon registration"
    );

    const res = await sendTelegramMessage(formattedMessage, chat_id);
    const { message_id } = res;

    const { data, error: insertionError } = await adminServerSupabaseInstance
      .from("scheduledMessages")
      .update({
        message_id,
        message_datetime_sent: convertDateToTimestamptz(new Date()),
        message_text_sent: formattedMessage,
        sent: true,
      })
      .eq("id", id)
      .select("*");

    if (insertionError || !data) {
      void sendTelegramMessage(
        `Unable to update db for id of ${message_id} at ${currentTime} due to ${
          insertionError?.message ?? "unknown error"
        }`,
        "-935273478"
      );
    }
  }

  res.status(200).json({ message: "Success" });
}
