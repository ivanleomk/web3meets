import { type LinkMetadata } from "../types/links";

export const LINKS: LinkMetadata[] = [
  {
    href: "/about-us",
    label: "About Us",
  },
  {
    href: "/",
    label: "Events",
  },
  {
    href: "/add-event",
    label: "Submit an Event",
  },
];

export const AUTHENTICATED_LINKS: LinkMetadata[] = [
  {
    href: "/about-us",
    label: "About Us",
  },
  {
    href: "/",
    label: "Events",
  },
  {
    href: "/dashboard?mode=Events&view=create",
    label: "Submit an Event",
  },
];

export const PROFILE_LINKS: LinkMetadata[] = [
  {
    href: "/settings",
    label: "Settings",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
];
