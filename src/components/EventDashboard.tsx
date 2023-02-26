import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { type eventCreationInputType } from "../types/event";
import CreateEventForm from "./CreateEventForm";
import SectionHeader from "./SectionHeader";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { api } from "../utils/api";

type Mode = "View" | "Create";

const EventDashboard = () => {
  const [currentMode, setCurrentMode] = useState<Mode>("View");

  const supabaseClient = useSupabaseClient();
  const { mutateAsync } = api.event.createNewEvent.useMutation();

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
    setCurrentMode("View");
  };

  return (
    <SectionHeader
      title={currentMode === "Create" ? "Create a new event" : "All Events"}
      subtitle={
        currentMode === "Create"
          ? "We just need a few more details before we can create your new event"
          : "Here are a list of events which you can edit, delete for the organizations which you manage"
      }
      onClickHandler={() => {
        setCurrentMode(currentMode === "Create" ? "View" : "Create");
      }}
      buttonText={
        currentMode === "Create" ? "View all events" : "Create new event"
      }
    >
      {currentMode === "View" ? (
        <>Viewing All Events</>
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
