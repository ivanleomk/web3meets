import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { type EventAndPartnerInfoAndPromotionalMaterial } from "../types/database";
import { joinClassNames } from "../utils/css";
import EventCard from "./EventCard";

type Props = {
  events: EventAndPartnerInfoAndPromotionalMaterial[];
};

type selection = "UPCOMING" | "PAST" | "ALL";

const selectOptions: selection[] = ["UPCOMING", "PAST", "ALL"];

const PartnerPageEvents = ({ events }: Props) => {
  const [selectedOption, setSelectedOption] = useState<selection>("UPCOMING");

  return (
    <div className="mx-auto grid max-w-7xl gap-y-20 gap-x-8 px-6 lg:px-8 xl:grid-cols-3">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Our Events
        </h2>
        <div className="mt-8">
          <div className="flex items-center justify-between"></div>

          <RadioGroup
            value={selectedOption}
            onChange={setSelectedOption}
            className="mt-2"
          >
            <RadioGroup.Label className="sr-only">See</RadioGroup.Label>
            <div className="mr-4 grid grid-cols-3 gap-3">
              {selectOptions.map((option) => (
                <RadioGroup.Option
                  key={option}
                  value={option}
                  className={({ checked }) =>
                    joinClassNames(
                      checked
                        ? "border-transparent bg-gray-800 text-white hover:bg-gray-800"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                      "flex cursor-pointer items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase focus:outline-none sm:flex-1"
                    )
                  }
                >
                  <RadioGroup.Label as="span">{option}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
        {events
          .filter((item) => {
            if (selectedOption === "ALL") {
              return true;
            } else if (selectedOption === "UPCOMING") {
              return new Date(item.starts_at) >= new Date();
            }
            return new Date(item.starts_at) < new Date();
          })
          .map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
      </div>
    </div>
  );
};

export default PartnerPageEvents;
