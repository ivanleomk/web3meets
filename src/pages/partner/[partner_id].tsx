import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { type GetServerSideProps } from "next";
import React from "react";
import { Button } from "../../components/Button";
import EventCard from "../../components/EventCard";
import PartnerContactDetails from "../../components/PartnerContactDetails";
import PartnerOrganizationMembers from "../../components/PartnerOrganizationMembers";
import PartnerPageEvents from "../../components/PartnerPageEvents";
import SectionHeader from "../../components/SectionHeader";
import { adminServerSupabaseInstance } from "../../server/supabase/sharedInstance";
import {
  type EventAndPartnerInfoAndPromotionalMaterial,
  type Partner,
  type UserPartnerOwnershipWithUser,
} from "../../types/database";

type Props = {
  events: EventAndPartnerInfoAndPromotionalMaterial[];
  partner: Partner;
  users: UserPartnerOwnershipWithUser[];
};

const PartnerPage = ({ users, events, partner }: Props) => {
  return (
    <div className="mx-auto max-w-6xl text-left">
      <Button href="/" text="Back to Event Dashboard" variant="outline" />

      <div className="mx-auto my-10 grid max-w-7xl gap-y-6  gap-x-8 px-6 lg:gap-y-20 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bio
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Learn more about {partner.partner_name}
          </p>
        </div>
        <div className="sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          <PartnerOrganizationMembers users={users} />
          <PartnerContactDetails partner={partner} />
        </div>
      </div>
      <PartnerPageEvents events={events} />
    </div>
  );
};

export const getStaticProps: GetServerSideProps = async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { partner_id } = ctx.params;

  const { data, error } = await adminServerSupabaseInstance
    .from("Event")
    .select("*,Partner(*),PromotionalMaterial(*)")
    .eq("partner_id", partner_id);

  console.log(data);

  const { data: partner_users, error: partner_users_error } =
    await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*,User(*)")
      .eq("partner_id", partner_id);

  const { data: partner_data, error: partner_data_error } =
    await adminServerSupabaseInstance
      .from("Partner")
      .select("*")
      .eq("partner_id", partner_id)
      .maybeSingle();

  if (!partner_data || partner_data_error) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {
      events: data,
      partner: partner_data,
      users: partner_users,
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
    .from("Partner")
    .select("*");

  if (!data || error) {
    throw new Error("Unable to generate paths");
  }

  const paths = data.map((item) => {
    return {
      params: {
        partner_id: item.partner_id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default PartnerPage;
