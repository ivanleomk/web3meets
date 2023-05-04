import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const joinClassNames = (...args: string[]) => {
  return args.join(" ");
};

export const formatTelegramMessage = (
  title: string,
  event_type: string,
  event_start: Date,
  event_end: Date,
  rsvp_link: string,
  location: string
) => {
  const dateStart = format(event_start, "EEEE, d MMM yyyy");
  const dateEnd = format(event_end, "EEEE, d MMM yyyy");
  const timeStart = format(event_start, "ha");
  const timeEnd = format(event_end, "ha");

  // // 🗓 Date: Thu, 27 Apr 2023
  // // ⏰ Time: 7PM - 9PM

  const formattedDate =
    dateStart === dateEnd
      ? `🗓 *Date*: ${dateStart}\n⏰ *Time*: ${timeStart} - ${timeEnd}`
      : `🗓 *Date* : ${dateStart} ${timeStart} - ${dateEnd} ${timeEnd}`;

  const formattedMessage =
    `🎤 *Event*: ${title}\n💡 *Type*: ${event_type}\n${formattedDate}\n\n🚀 *RSVP*: ${rsvp_link}\n\n📍 *Location*: ${location}\n\n⚠️ Comment below to find other event goers!`.replace(
      /[\|\-.!=()#]/g,
      "\\$&"
    );

  return formattedMessage;
};
