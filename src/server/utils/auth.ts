import { TRPCError } from "@trpc/server";
import { adminServerSupabaseInstance } from "../supabase/sharedInstance";

export const hasAdminPrivileges = async (user_id: string) => {
  const { data, error } = await adminServerSupabaseInstance
    .from("User")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  console.log(data, error);

  if (error || !data) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User does not have valid permissions. Please try again later",
    });
  }
  return data.admin;
};

export const isOrganizationAdmin = async (
  partner_id: string | null,
  user_id: string
) => {
  if (!partner_id) {
    return hasAdminPrivileges(user_id);
  }

  const { data: userPermission, error: userPermissionsError } =
    await adminServerSupabaseInstance
      .from("UserPartnerOwnership")
      .select("*")
      .eq("partner_id", partner_id)
      .eq("user_id", user_id)
      .maybeSingle();

  if (!userPermission || userPermissionsError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User does not have valid permissions. Please try again later",
    });
  }
};

export const isOrganizationEvent = async (
  partner_id: string,
  event_id: string
) => {
  const { data: eventInformation, error: eventInformationError } =
    await adminServerSupabaseInstance
      .from("Event")
      .select("*")
      .eq("partner_id", partner_id)
      .eq("event_id", event_id)
      .maybeSingle();

  if (!eventInformation || eventInformationError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User does not have valid permissions. Please try again later",
    });
  }
};
