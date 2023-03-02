export const convertDateToTimestamptz = (d: Date) => {
  const timestamp = d.toISOString().replace("T", " ");
  const timestampWithoutSeconds = timestamp.substring(0, 19);
  return `${timestampWithoutSeconds}+00`;
};
