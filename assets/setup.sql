CREATE TABLE "User" (
  "user_id" uuid PRIMARY KEY,
  "email" varchar,
  "admin" boolean
);

CREATE TABLE "UserPartnerOwnership" (
  "user_id" uuid,
  "partner_id" int,
  "approved" boolean
);

CREATE TABLE "Partner" (
  "partner_id" serial PRIMARY KEY,
  "name" varchar,
  "website" varchar,
  "telegram_handle" varchar,
  "twitter_id" varchar,
  "open_to_sponsor" boolean,
  "stripe_account_id" varchar,
  "active" bool
);

CREATE TABLE "Event" (
  "event_id" serial PRIMARY KEY,
  "user_id" uuid,
  "starts_at" timestamptz,
  "ends_at" timestamptz,
  "title" varchar,
  "featured" bool,
  "our_pick" bool,
  "location_id" serial,
  "paid" bool,
  "stripe_event_id" varchar,
  "remarks" varchar,
  "partnered" bool,
  "event_series_id" serial,
  "partner_id" serial,
  "scheduled_post" timestamptz,
  "poster_link" varchar
);

CREATE TABLE "EventSeries" (
  "event_series_id" serial PRIMARY KEY,
  "recurring" varchar,
  "start_date" timestamptz,
  "end_date" timestamptz
);

CREATE TABLE "Location" (
  "location_id" serial PRIMARY KEY,
  "address" varchar,
  "google_maps_link" varchar,
  "city_id" serial
);

CREATE TABLE "City" (
  "city_id" serial PRIMARY KEY,
  "country_id" serial
);

CREATE TABLE "Country" (
  "country_id" serial PRIMARY KEY,
  "country_name" varchar
);

CREATE UNIQUE INDEX ON "UserPartnerOwnership" ("user_id", "partner_id");

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE;

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id");

ALTER TABLE "Event" ADD FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id");

ALTER TABLE "Event" ADD FOREIGN KEY ("event_series_id") REFERENCES "EventSeries" ("event_series_id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id");

ALTER TABLE "Location" ADD FOREIGN KEY ("city_id") REFERENCES "City" ("city_id");

ALTER TABLE "City" ADD FOREIGN KEY ("country_id") REFERENCES "Country" ("country_id");
