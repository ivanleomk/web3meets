import {
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Partner } from "../types/database";
import TelegramLogo from "./TelegramLogo";

type Props = {
  partner: Partner;
};

const PartnerContactDetails = ({ partner }: Props) => {
  const { telegram_handle, website, twitter_id, bio } = partner;

  return (
    <div>
      <p className="my-4 font-semibold text-gray-800">Contact Us</p>
      <div className="mb-16 ml-5 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
        {[
          {
            label: "Telegram ID",
            value: telegram_handle,
          },
          {
            label: "Website",
            value: website,
          },
          {
            label: "Twitter Account",
            value: twitter_id,
          },
        ].map((item) => {
          if (!item.value) {
            return null;
          }
          return (
            <div key={item.label}>
              <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-700">
                {item.label}
              </h3>
              <p className="border-l border-gray-200 pt-2 pl-6 not-italic text-gray-500">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnerContactDetails;
