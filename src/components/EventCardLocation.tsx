import React from "react";
import { City } from "../types/event";

type Props = {
  city: string;
  country: string;
};

const EventCardLocation = ({ city, country }: Props) => {
  if (city == City.NA || country == City.NA) {
    return (
      <div className="mt-2 text-xs text-gray-700 xl:text-sm">Online Event</div>
    );
  }

  return (
    <div className="mt-2 text-xs text-gray-700 xl:text-sm">
      {city} - {country}
    </div>
  );
};

export default EventCardLocation;
