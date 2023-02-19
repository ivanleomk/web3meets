CREATE TABLE "User" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "admin" boolean NOT NULL DEFAULT false
);

CREATE TABLE "UserPartnerOwnership" (
  "user_id" uuid NOT NULL,
  "partner_id" uuid NOT NULL,
  "approved" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Partner" (
  "partner_id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4,
  "partner_name" text UNIQUE NOT NULL,
  "website" text UNIQUE NOT NULL DEFAULT '',
  "telegram_handle" text UNIQUE,
  "twitter_id" text UNIQUE,
  "stripe_account_id" text UNIQUE DEFAULT null,
  "active" bool NOT NULL DEFAULT false,
  "open_to_sponsor" boolean NOT NULL DEFAULT false,
  "approved" bool NOT NULL DEFAULT false,
  "bio" text NOT NULL DEFAULT ''
);

CREATE TABLE "Event" (
  "event_id" serial PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "title" text NOT NULL,
  "featured" bool NOT NULL DEFAULT false,
  "our_pick" bool NOT NULL DEFAULT false,
  "location_id" serial,
  "paid" bool NOT NULL DEFAULT false,
  "stripe_event_id" text,
  "remarks" text NOT NULL DEFAULT '',
  "partnered" bool NOT NULL DEFAULT false,
  "event_series_id" serial NOT NULL,
  "partner_id" uuid,
  "scheduled_post" timestamptz
);

CREATE TABLE "PromotionalMaterial" (
  "event_id" serial NOT NULL,
  "material_id" serial PRIMARY KEY NOT NULL,
  "image_url" text NOT NULL
);

CREATE TABLE "EventSeries" (
  "event_series_id" serial PRIMARY KEY,
  "recurring" text,
  "start_date" timestamptz,
  "end_date" timestamptz
);

CREATE TABLE "Location" (
  "location_id" serial PRIMARY KEY,
  "address" text,
  "google_maps_link" text,
  "city_id" serial
);

CREATE TABLE "City" (
  "city_id" serial PRIMARY KEY,
  "country_id" serial
);

CREATE TABLE "Country" (
  "country_id" serial PRIMARY KEY,
  "country_name" text
);

CREATE UNIQUE INDEX ON "UserPartnerOwnership" ("user_id", "partner_id");

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE;

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id");

ALTER TABLE "Event" ADD FOREIGN KEY ("event_series_id") REFERENCES "EventSeries" ("event_series_id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id");

ALTER TABLE "Event" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id");

ALTER TABLE "PromotionalMaterial" ADD FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id");

ALTER TABLE "Location" ADD FOREIGN KEY ("city_id") REFERENCES "City" ("city_id");

ALTER TABLE "City" ADD FOREIGN KEY ("country_id") REFERENCES "Country" ("country_id");
