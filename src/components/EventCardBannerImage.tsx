import Image from "next/image";
import React from "react";
import { type PromotionalMaterial } from "../types/database";

type Props = {
  PromotionalMaterial: PromotionalMaterial[];
  eventName: string;
};

const EventCardBannerImage = ({ PromotionalMaterial, eventName }: Props) => {
  if (!PromotionalMaterial || PromotionalMaterial.length < 1) {
    return (
      <div className="h-48 w-full overflow-hidden rounded-t-lg sm:h-52 sm:rounded-none">
        <div className="h-full w-full object-fill object-center sm:object-cover">
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-gray-200">
            <p className="text-center text-sm text-gray-400">
              Error : No Image Found
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-t-lg sm:h-52 sm:rounded-none">
      {/* We disable nextjs optimization for now */}
      <img
        alt={`Banner Image for ${eventName}`}
        src={PromotionalMaterial.at(0)?.image_url as string}
      />
    </div>
  );
};

export default EventCardBannerImage;
