export const findKeyByValue = (
  obj: { [property: string]: string },
  val: string,
  fallback: string
) => {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key) && obj[key] === val) {
      return key;
    }
  }
  return fallback;
};
