import { type SupabaseClient } from "@supabase/supabase-js";
import { EVENT_IMAGE_BUCKET } from "../types/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export const uploadFiles = async (
  files: File[],
  supabaseClient: SupabaseClient,
  uploadImages: (payload: {
    event_id: string;
    images: {
      image_url: string;
      file_name: string;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => Promise<any>,
  event_id: string
) => {
  if (!files) {
    return files;
  }
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
};
