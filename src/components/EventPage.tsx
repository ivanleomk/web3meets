import { FunnelIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";
import {
  eventLocationFilter,
  eventTypeFilter,
  refinedEventFilterSchema,
  refinedEventFilterType,
} from "../types/event-filter";
import {
  filterEventByEventLocation,
  filterEventByStartAndEndDate,
  filterEventsByEventPrice,
  filterEventsByStartTime,
} from "../utils/event-filter";
import EventCard from "./EventCard";
import EventFilters from "./EventFilters";
import MobileDialogPanel from "./MobileDialogPanel";

const initialState = {
  event_type: eventTypeFilter.any,
  event_location: eventLocationFilter.any,
  start_to_end: [0, 24],
};

type Props = {
  events: EventAndPartnerInfoAndPromotionalMaterial[];
};

export default function EventPage({ events }: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [existingEvents, setExistingEvents] = useState(events);

  const submitHandler = (data: refinedEventFilterType) => {
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

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    getValues,
  } = useForm<refinedEventFilterType>({
    resolver: zodResolver(refinedEventFilterSchema),
    defaultValues: initialState,
  });

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
            <EventFilters
              errors={errors}
              control={control}
              resetHandler={() => reset(initialState)}
              handleSubmit={handleSubmit}
              onSubmit={submitHandler}
              watch={watch}
              getValues={getValues}
            />
          </div>
        </MobileDialogPanel>

        <main className="">
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
                <EventFilters
                  errors={errors}
                  control={control}
                  resetHandler={() => reset(initialState)}
                  handleSubmit={handleSubmit}
                  onSubmit={submitHandler}
                  watch={watch}
                  getValues={getValues}
                />
              </div>

              <div className="sticky top-16 z-0 h-[calc(100vh-14rem)] overflow-y-scroll lg:col-span-3">
                {existingEvents?.length >= 1 ? (
                  existingEvents
                    .sort((a, b) => {
                      if (a.starts_at < b.starts_at) {
                        return -1;
                      }
                      if (a.starts_at > b.starts_at) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((event) => {
                      return <EventCard key={event.event_id} event={event} />;
                    })
                ) : (
                  <div className="mt-10 flex items-center justify-center">
                    <p>There are no listed events at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
