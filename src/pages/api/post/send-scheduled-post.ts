import { add, format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminServerSupabaseInstance } from "src/server/supabase/sharedInstance";
import { Event } from "src/types/database";
import { convertDateToTimestamptz } from "src/utils/date";
import { formatTelegramMessage } from "src/utils/string";
import { bot } from "src/utils/telebot";

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
    console.log(error);
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
    const { id } = post;
    const formattedMessage = formatTelegramMessage(
      event_title,
      category,
      new Date(starts_at),
      new Date(ends_at),
      rsvp_link ?? "To Be Announced",
      location ?? "To Be Confirmed unpon registration"
    );

    const res = await bot.sendMessage(
      process.env.GROUP_ID as string,
      formattedMessage
    );
    const { message_id } = res;

    const { data, error: insertionError } = await adminServerSupabaseInstance
      .from("scheduledMessages")
      .update({
        message_id,
        message_datetime_sent: convertDateToTimestamptz(new Date()),
        message_text_sent: formattedMessage,
        sent: true,
      })
      .eq("id", id);

    if (insertionError || !data) {
      void bot.sendMessage(
        process.env.DEBUG_GROUP_ID as string,
        `Unable to update db for id of ${message_id} at ${currentTime} due to ${
          insertionError?.message ?? "unknown error"
        }`
      );
    }
  }

  res.status(200).json({ message: "Success" });
}
