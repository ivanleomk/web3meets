import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { type eventCreationInputType } from "../types/event";
import CreateEventForm from "./CreateEventForm";
import SectionHeader from "./SectionHeader";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import { type Modes } from "../types/dashboard";
import OrganizationTable from "./OrganizationTable";
import { EVENT_FIELDS } from "../config/organization";
import EventRow from "./EventRow";

type Props = {
  initialMode: Modes;
  setInitialMode: (m: Modes) => void;
};

const EventDashboard = ({ initialMode, setInitialMode }: Props) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { mutateAsync } = api.event.createNewEvent.useMutation();
  const {
    data: allEvents,
    error: allEventsError,
    isLoading,
  } = api.event.getUserEvents.useQuery(undefined, {
    refetchInterval: 120000,
    enabled: user !== null,
  });

  const onSubmit = async (data: eventCreationInputType) => {
    const submitData = { ...data };
    if (data.banner_image) {
      const fileData = data.banner_image[0] as File;
      const fileExtension = fileData.name.split(".").pop();

      // We have a valid file here - File name is generated base don title-promo-image-1
      const fileName = `${uuidv4()}-promo-image-1.${fileExtension}`;
      const res = await supabaseClient.storage
        .from("event-images")
        .upload(fileName, fileData, { upsert: true });

      if (res.error) {
        toast.warning("Unable to create new event. Please try again.");
      }

      const publicUrl = `https://zdhtczfwadgksdmbuggu.supabase.co/storage/v1/object/public/event-images/${fileName}`;
      submitData["banner_image"] = publicUrl;
    }
    console.log(submitData);

    try {
      await mutateAsync(submitData);
    } catch (err) {
      toast.warning("Unable to save event data. Please try again.");
      return;
    }

    toast.success("Succesfully saved event in database.");
    setInitialMode("View");
  };

  return (
    <SectionHeader
      title={initialMode === "Create" ? "Create a new event" : "All Events"}
      subtitle={
        initialMode === "Create"
          ? "We just need a few more details before we can create your new event"
          : "Here are a list of events which you can edit, delete for the organizations which you manage"
      }
      onClickHandler={() => {
        setInitialMode(initialMode === "Create" ? "View" : "Create");
      }}
      buttonText={
        initialMode === "Create" ? "View all events" : "Create new event"
      }
    >
      {initialMode === "View" ? (
        <OrganizationTable
          data={allEvents ? allEvents : []}
          isLoading={isLoading}
          errorMessage="No Events found"
          headerFields={EVENT_FIELDS}
          renderComponent={(data) => {
            return <EventRow data={data} />;
          }}
        />
      ) : (
        <CreateEventForm
          initialValue={undefined}
          buttonText="Create new event"
          onSubmit={onSubmit}
        />
      )}
    </SectionHeader>
  );
};

export default EventDashboard;
