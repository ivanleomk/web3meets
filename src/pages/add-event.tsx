import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React from "react";
import { toast } from "react-toastify";
import CreateEventForm from "../components/CreateEventForm";
import SectionHeader from "../components/SectionHeader";
import { EVENT_IMAGE_BUCKET } from "../types/storage";
import { api } from "../utils/api";
import { uploadFiles } from "../utils/file";

const AddEvent = () => {
  const supabaseClient = useSupabaseClient();

  const { mutateAsync: uploadImages } =
    api.event.unauthorizedUploadImages.useMutation();

  const { mutateAsync: createEvent } =
    api.event.unauthorizedCreateNewEvent.useMutation({});
  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        title="Create a new event"
        subtitle="Submit a new event to be listed on our platform! Our team will review and update the details of the new event accordingly. Please allow for 1-2 working days for changes to be reflected."
      >
        <CreateEventForm
          initialValue={undefined}
          buttonText="Submit New Event"
          onSubmit={async (event) => {
            try {
              const res = await createEvent(event);
              const { event_id } = res;

              if (!event.images) {
                toast.success("Succesfully created event");
                return;
              }

              const fileUploads = event.images?.map(
                (file: File, idx: number) => {
                  const fileExtension = file.name.split(".").pop();
                  const filePath = `${event_id}/${idx}.${fileExtension}`;
                  return supabaseClient.storage
                    .from(EVENT_IMAGE_BUCKET)
                    .upload(filePath, file);
                }
              );
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
                  file_name: event.images[id]?.name as string,
                };
              });

              await uploadImages({
                images: fileNames,
                event_id,
              });
              toast.success("Succesfully created event.");
            } catch {
              toast.warning(
                "Unable to create new event. Please try again later."
              );
            }
          }}
        />
      </SectionHeader>
    </div>
  );
};

export default AddEvent;
