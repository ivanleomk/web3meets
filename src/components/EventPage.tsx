import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon } from "@heroicons/react/20/solid";
import FilterOptions from "./FilterOptions";
import MobileDialogPanel from "./MobileDialogPanel";
import EventFilters from "./EventFilters";
import { Event, Partner } from "../types/database";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";
import {
  filterEventByEventLocation,
  filterEventByStartAndEndDate,
  filterEventsByEventPrice,
  filterEventsByStartTime,
} from "../utils/event-filter";
import { refinedEventFilterType } from "../types/event-filter";
import EventCard from "./EventCard";

type Props = {
  events: EventAndPartnerInfoAndPromotionalMaterial[];
};

export default function EventPage({ events }: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [existingEvents, setExistingEvents] = useState(events);

  const handleSubmit = (data: refinedEventFilterType) => {
    const eventsWithValidStartDate = filterEventByStartAndEndDate(events, data);
    const eventsWithValidLocation = filterEventByEventLocation(
      eventsWithValidStartDate,
      data
    );
    const eventsWithValidPrice = filterEventsByEventPrice(
      eventsWithValidLocation,
      data
    );
    const eventsWithValidStartTime = filterEventsByStartTime(
      eventsWithValidPrice,
      data
    );

    setExistingEvents(eventsWithValidStartTime);
  };

  return (
    <div className="bg-white">
      <div>
        <MobileDialogPanel
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          title="Event Filters"
        >
          <div className="px-6">
            <h3 className="sr-only">Categories</h3>
            <EventFilters onSubmit={handleSubmit} />
          </div>
        </MobileDialogPanel>

        <main className="lg:8 mx-auto max-w-7xl">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Events
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Events
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="col-span-1 hidden lg:block">
                <h3 className="sr-only">Event Filters</h3>
                <EventFilters onSubmit={handleSubmit} />
              </div>

              <div className="lg:col-span-3">
                {existingEvents.map((event) => {
                  return <EventCard key={event.event_id} event={event} />;
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
