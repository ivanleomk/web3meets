import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import HTMLParser from "node-html-parser";
import { json } from "stream/consumers";

const EVENT_CATEGORIES = [
  "Hackathon",
  "Meetup",
  "Seminar",
  "Exhibition",
  "Conference",
  "Workshop",
  "Twitter Spaces",
  "Networking",
  "Panel",
  "Demo Day",
  "Party",
  "Focus Group Discussion",
];

export const crawlerRouter = createTRPCRouter({
  getEventDataFromUrl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;
      const response = await fetch(url);
      const body = await response.text();

      const root = HTMLParser.parse(body);
      const jsonData = root
        .getElementsByTagName("script")
        .find((div) => div.rawAttrs === 'type="application/ld+json"')?.text;

      if (!jsonData) {
        return {};
      }

      const responseObj = JSON.parse(jsonData);

      return responseObj;
    }),
});
