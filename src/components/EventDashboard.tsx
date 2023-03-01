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
import { EVENT_IMAGE_BUCKET } from "../types/storage";

type Props = {
  initialMode: Modes;
  setInitialMode: (m: Modes) => void;
};

const EventDashboard = ({ initialMode, setInitialMode }: Props) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { mutateAsync: uploadImages } = api.event.uploadImages.useMutation();
  const utils = api.useContext();

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

    let res;
    try {
      res = await mutateAsync(submitData);
    } catch (err) {
      toast.warning("Unable to save event data. Please try again.");
      return;
    }

    const event_id = res.event_id;
    const files = submitData.images as File[];
    // First we create the new folder
    if (files) {
      const fileUploads = files?.map((file) => {
        const fileExtension = file.name.split(".").pop();
        const filePath = `${event_id}/${uuidv4()}.${fileExtension}`;
        return supabaseClient.storage
          .from(EVENT_IMAGE_BUCKET)
          .upload(filePath, file);
      });
      const fileUploadResult = await Promise.all(fileUploads);

      const fileNames = fileUploadResult?.map((file, id) => {
        if (file.error) {
          toast.warning(
            "Unable to upload event promotional images. Please try uploading them again."
          );
        }
        const filePath = file.data?.path;
        return {
          image_url: `${process.env.NEXT_PUBLIC_IMAGE_BUCKET}/${filePath}`,
          file_name: files[id]?.name as string,
        };
      });

      try {
        await uploadImages({
          event_id,
          images: fileNames,
        });
      } catch (err) {
        toast.warning("Unable to save event data. Please try again.");
        return;
      }
    }
    void utils.event.getUserEvents.invalidate();
    toast.success("Succesfully saved event in database.");
    setInitialMode("View");
  };

  if (allEventsError) {
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
        <p className="mt-20 text-center text-sm leading-5">
          Unexpected error encountered - please try refreshing the page or
          contact support if this issue persists
        </p>
      </SectionHeader>
    );
  }

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
