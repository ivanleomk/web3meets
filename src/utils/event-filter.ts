import { add } from "date-fns";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";
import { eventPaymentType } from "../types/event";
import {
  eventLocationFilter,
  eventTypeFilter,
  type refinedEventFilterType,
} from "../types/event-filter";

export const filterEventByStartAndEndDate = (
  events: EventAndPartnerInfoAndPromotionalMaterial[],
  filterOption: refinedEventFilterType
) => {
  return events.filter((event) => {
    const eventStartDate = new Date(event.starts_at);
    const startDate = filterOption.starts_at as Date;
    const endDate = filterOption.ends_at as Date;

    if (!filterOption.starts_at && !filterOption.ends_at) {
      return true;
    }

    if (!filterOption.ends_at) {
      return eventStartDate > startDate;
    }

    if (!filterOption.starts_at) {
      return eventStartDate < add(endDate, { days: 1 });
    }
    return (
      eventStartDate >= startDate && eventStartDate < add(endDate, { days: 1 })
    );
  });
};

export const filterEventByEventLocation = (
  events: EventAndPartnerInfoAndPromotionalMaterial[],
  filterOption: refinedEventFilterType
) => {
  if (filterOption.event_location == eventLocationFilter.any) {
    return events;
  }

  return events.filter((item) => {
    return item.online === filterOption.event_location;
  });
};

export const filterEventsByEventPrice = (
  events: EventAndPartnerInfoAndPromotionalMaterial[],
  filterOption: refinedEventFilterType
) => {
  if (filterOption.event_type == eventTypeFilter.any) {
    return events;
  }

  return events.filter((item) => {
    if (filterOption.event_type === eventTypeFilter.mix) {
      return item.event_type === eventPaymentType.mix;
    }

    return item.event_type == filterOption.event_type;
  });
};

export const filterEventsByStartTime = (
  events: EventAndPartnerInfoAndPromotionalMaterial[],
  filterOption: refinedEventFilterType
) => {
  // We are looking at the time of the event

  const values = filterOption.start_to_end;
  const start = values[0] as number;
  const end = values[1] as number;

  return events.filter((item) => {
    const itemStart = new Date(item.starts_at).getHours();
    return start <= itemStart && itemStart <= end;
  });
};
