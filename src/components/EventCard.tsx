import { format } from "date-fns";
import React from "react";
import { EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";
import EventCardDateTime from "./EventCardDateTime";
import EventCardLocation from "./EventCardLocation";

type Props = {
  event: EventAndPartnerInfoAndPromotionalMaterial;
};

const EventCard = ({ event }: Props) => {
  return (
    <div className="grid grid-cols-12 sm:h-52">
      <div className="col-span-12 sm:col-span-5">
        <div className="h-48 w-full overflow-hidden rounded-t-lg sm:h-52 sm:rounded-none">
          <img
            className="h-full w-full object-fill object-center sm:object-cover"
            src={event.PromotionalMaterial.at(0)?.image_url as string}
          />
        </div>
      </div>
      <div className="col-span-12 sm:py-4  md:col-span-7">
        <div className="my-4 h-full sm:my-0 sm:ml-8 sm:flex sm:flex-col sm:px-0 md:px-4">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col pr-2">
              <div className="sm:text-md text-gray-900 sm:leading-5 xl:text-lg xl:leading-5">
                {event.event_title}
              </div>
              <p className="mt-0.5 text-xs text-gray-700">
                by{" "}
                {event.Partner
                  ? event.Partner.partner_name
                  : event.fallback_name}
              </p>
            </div>
            {true ? (
              <div className=" bg-red-00 right-4 top-4 block w-fit rounded-md border-2 p-1 px-2 text-[12px] text-gray-700 sm:hidden">
                Promoted
              </div>
            ) : null}
          </div>
          <div className="mt-2 flex flex-shrink-0 items-center text-left text-gray-700">
            <EventCardDateTime eventTime={event.starts_at} />
            <div className="mx-4 text-xs font-semibold text-gray-500">–</div>
            <EventCardDateTime eventTime={event.ends_at} />
          </div>
          <EventCardLocation city={event.city} country={event.country} />
          <div className="mt-4 flex justify-between">
            <div className="flex items-center">
              <div className="w-fit rounded-md border  bg-gray-200 bg-opacity-50 p-1 px-2 text-[12px] text-gray-700">
                {event.event_type}
              </div>
              <div className="ml-1 w-fit rounded-md border  bg-gray-200 bg-opacity-50 p-1 px-2 text-[12px] text-gray-700">
                {event.online ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
