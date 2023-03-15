export const ORGANIZATION_FIELDS = [
  "Name",
  "Website",
  "Telegram Handle",
  "Twitter ID",
  "Membership",
  "Organization",
  "Edit/Delete",
].map((item) => {
  return { label: item, sr_value: item };
});

export const EVENT_FIELDS = [
  "Name",
  "Approval Status",
  "Start Time",
  "End Time",
  "Online",
  "RSVP Link",
  "Edit/Delete",
].map((item) => {
  return {
    label: item,
    sr_value: item,
  };
});
