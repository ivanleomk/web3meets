import { RadioGroup } from "@headlessui/react";
import {
  StarIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { Button } from "../../components/Button";
import EventCardDateTime from "../../components/EventCardDateTime";
import EventCardLocation from "../../components/EventCardLocation";
import { adminServerSupabaseInstance } from "../../server/supabase/sharedInstance";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../../types/database";

type Props = {
  event: EventAndPartnerInfoAndPromotionalMaterial;
};

const Event = ({ event }: Props) => {
  return (
    <>
      <Button
        text="See other events"
        showBackArrow={true}
        variant="outline"
        href="/"
      />
      <div className="mx-auto mt-10 max-w-4xl">
        <div className="aspect-w-1 aspect-h-1 max-h- col-span-3 overflow-hidden rounded-lg ">
          <img
            src={event.PromotionalMaterial.at(0)?.image_url}
            alt={`Event Banner Image for ${event.event_title}`}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {event.event_title}
          </h1>
          {event.Partner ? (
            <Link href={`/partner/${event.Partner.partner_id}`}>
              <p className="text-md sm:text-md mt-2 text-gray-900">
                by{" "}
                {event?.Partner?.partner_name
                  ? event?.Partner?.partner_name
                  : event.fallback_name}
              </p>
            </Link>
          ) : (
            <p className="text-md sm:text-md mt-2 text-gray-900">
              by {event.fallback_name}
            </p>
          )}
          <div className="mt-3 flex items-center ">
            <ClockIcon
              className="h-5 w-5 flex-shrink-0 text-green-500"
              aria-hidden="true"
            />
            <div className="ml-4 flex space-x-3">
              <EventCardDateTime eventTime={event.starts_at} />
              <div>-</div>
              <EventCardDateTime eventTime={event.ends_at} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <MapIcon
              className="mr-4 h-5 w-5 flex-shrink-0 text-green-500"
              aria-hidden="true"
            />

            <EventCardLocation city={event.city} country={event.country} />
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <div className="w-fit rounded-md border  bg-gray-200 bg-opacity-50 p-1 px-2 text-[12px] text-gray-700">
              {event.event_type}
            </div>
            <div className="ml-1 w-fit rounded-md border  bg-gray-200 bg-opacity-50 p-1 px-2 text-[12px] text-gray-700">
              {event.online ? "Online" : "Offline"}
            </div>
          </div>

          {event.rsvp_link ? (
            <Button
              additionalStyling="my-6"
              href={event.rsvp_link}
              text="Register Here"
            />
          ) : null}
          <div className="mt-4 space-y-6">
            <p className="text-bold text-lg">Details</p>
            <p className="text-base text-gray-500">{event.event_description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetServerSideProps = async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { event_id } = ctx.params;

  const { data, error } = await adminServerSupabaseInstance
    .from("Event")
    .select("*,Partner(*),PromotionalMaterial(*)")
    .eq("event_id", event_id)
    .maybeSingle();

  if (!data || error) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {
      event: data,
    },
    // Every 10 mins we refresh cache i guess TODO: Enable manual refresh of cache.
    revalidate: 600,
  };
};

export async function getStaticPaths() {
  if (process.env.NODE_ENV === "development") {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const { data, error } = await adminServerSupabaseInstance
    .from("Event")
    .select("*")
    .order("starts_at", {
      ascending: false,
    });

  if (!data || error) {
    throw new Error("Unable to generate paths");
  }

  const paths = data.map((item) => {
    return {
      params: {
        event_id: item.event_id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default Event;
