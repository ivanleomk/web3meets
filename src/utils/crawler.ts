import {
  City,
  Country,
  eventCategories,
  eventLocation,
  eventPaymentType,
} from "../types/event";

export const getMeetupDetails = (jsonObj: any): eventResponse => {
  const data = jsonObj?.props?.pageProps?.event;

  if (!data) {
    return {
      cover_url: undefined,
      category: undefined,
      city: City.NA,
      country: Country.NA,
      address: undefined,
      onlineEvent: eventLocation.online,
      title: undefined,
      description: undefined,
      endsAt: undefined,
      startsAt: undefined,
      eventOrganiserName: undefined,
      eventPaymentType: eventPaymentType.free,
    };
  }

  const startsAt = data?.dateTime;
  const endsAt = data?.endTime;

  const title = data?.title;
  const imageUrl = data?.imageUrl;
  const name = data?.venue?.name;
  const address = data?.venue?.address;
  const { city, country } = getMeetupCountryAndCity(data);
  const eventOrganiserName = data?.group?.name;
  const price = data?.feeSettings
    ? eventPaymentType.paid
    : eventPaymentType.free;
  const onlineEvent =
    name === "Online event" ? eventLocation.online : eventLocation.offline;

  return {
    startsAt: startsAt,
    endsAt: endsAt,
    title: title,
    address:
      name === "Online event"
        ? "This is an online event"
        : `${name},${address}`,
    cover_url: imageUrl,
    category: undefined,
    city: city,
    country: country,
    onlineEvent: onlineEvent,
    description: undefined,
    eventOrganiserName: eventOrganiserName,
    eventPaymentType: price,
  };
};

const getMeetupCountryAndCity = (data: any) => {
  const country = data?.venue?.country;
  const city = data?.venue?.city;
  if (!country || !city) {
    return {
      country: Country.NA,
      city: City.NA,
    };
  }
  let parsedCountry = Country.NA;
  let parsedCity = City.NA;

  if (country === "sg") {
    parsedCountry = Country.Singapore;
  }
  if (city === "Singapore") {
    parsedCity = City.Singapore;
  }

  return {
    country: parsedCountry,
    city: parsedCity,
  };
};

export const getLumaDetails = (jsonObj: any): eventResponse => {
  const data = jsonObj?.props?.pageProps?.initialData?.data;
  const eventData = data?.event;
  const hostData = data?.hosts;

  if (!eventData) {
    return {
      cover_url: undefined,
      category: undefined,
      city: City.NA,
      country: Country.NA,
      address: undefined,
      onlineEvent: eventLocation.online,
      title: undefined,
      description: undefined,
      endsAt: undefined,
      startsAt: undefined,
      eventOrganiserName: undefined,
      eventPaymentType: eventPaymentType.free,
    };
  }

  const startsAt = eventData?.start_at;
  const endsAt = eventData?.end_at;
  const title = eventData?.name;
  const cover_url = eventData?.cover_url;
  const address = eventData?.geo_address_info?.address;
  const obfuscated = eventData?.geo_address_info?.mode === "obfuscated";
  const price = eventData?.ticket_price_cents
    ? eventPaymentType.paid
    : eventPaymentType.free;
  const onlineEvent =
    eventData?.location_type === "offline"
      ? eventLocation.offline
      : eventLocation.online;

  const eventOrganiserName =
    hostData?.length === 0 ? undefined : hostData?.at(0).name;

  return {
    startsAt: startsAt,
    endsAt: endsAt,
    title: title,
    address: obfuscated
      ? "Please register to see the location of this event."
      : address,
    cover_url,
    category: undefined,
    city: City.NA,
    country: Country.NA,
    onlineEvent: onlineEvent,
    description: undefined,
    eventOrganiserName: eventOrganiserName,
    eventPaymentType: price,
  };
};

export type eventResponse = {
  cover_url: string | undefined;
  category: string | undefined;
  city: City;
  country: Country;
  address: string | undefined;
  onlineEvent: eventLocation;
  title: string | undefined;
  description: string | undefined;
  endsAt: string | undefined;
  startsAt: string | undefined;
  eventOrganiserName: string | undefined;
  eventPaymentType: eventPaymentType;
};

export const getEventBriteDetails = (data: any): eventResponse => {
  const eventOrganiserName = data?.organizer?.name;
  const startsAt = data?.startDate;
  const endsAt = data?.endDate;
  const description = data?.description;
  const title = data?.name;
  const eventLocationType = data?.location["@type"] ?? "";
  const eventLocationValue =
    eventLocationType == "VirtualLocation"
      ? eventLocation.online
      : eventLocation.offline;

  const { city, country, address } = getEventBriteLocation(data);
  const category = findEventBriteCategory(data);
  const cover_url = data?.["image"];
  const eventPaymentType = getEventBriteCost(data);

  return {
    cover_url,
    category,
    city,
    address,
    country,
    onlineEvent: eventLocationValue,
    title,
    description,
    endsAt,
    startsAt,
    eventOrganiserName,
    eventPaymentType,
  };
};

const getEventBriteLocation = (data: any) => {
  const country = data?.location?.address?.addressCountry;
  const city = data?.location?.address?.addressLocality ?? "";
  let address = data?.location?.["name"];

  if (data?.location?.address?.streetAddress) {
    address += " ";
    address += data?.location?.address?.streetAddress;
  }

  if (!country || !city || !address) {
    return {
      country: Country.NA,
      city: City.NA,
      address: null,
    };
  }

  let parsedCountry = Country.NA;
  let parsedCity = City.NA;

  if (city === "Singapore") {
    parsedCity = City.Singapore;
  }

  if (country === "SG") {
    parsedCountry = Country.Singapore;
  }

  return {
    country: parsedCountry,
    city: parsedCity,
    address: address,
  };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const getEventBriteCost = (data: any) => {
  const offers = data["offers"];
  if (!offers) {
    return eventPaymentType.free;
  }
  let paidOffersCount = 0;
  let freeOffersCount = 0;

  for (let i = 0; i < offers.length; i++) {
    const item = offers[i];
    if (item?.price !== undefined) {
      freeOffersCount += 1;
    } else if (item?.highPrice == 0 && item?.lowPrice == 0) {
      freeOffersCount += 1;
    } else {
      paidOffersCount += 1;
    }
  }
  if (freeOffersCount === data["offers"].length) {
    return eventPaymentType.free;
  } else if (paidOffersCount === data["offers"].length) {
    return eventPaymentType.paid;
  } else {
    return eventPaymentType.mix;
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const findEventBriteCategory = (data: any) => {
  if (!data["@type"]) {
    return "Networking";
  }

  const category = data["@type"];
  for (let i = 0; i < eventCategories.length; i++) {
    if (eventCategories[i] === category) {
      return eventCategories[i];
    }

    if (i == eventCategories.length - 1) {
      return "Networking";
    }
  }
};
