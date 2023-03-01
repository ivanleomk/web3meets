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
  "partner_id" uuid PRIMARY KEY NOT NULL,
  "partner_name" text NOT NULL,
  "website" text,
  "telegram_handle" text,
  "twitter_id" text,
  "stripe_account_id" text,
  "active" boolean,
  "approved" boolean,
  "open_to_sponsor" boolean,
  "bio" text DEFAULT null
);

CREATE TABLE "Event" (
  "event_id" uuid PRIMARY KEY,
  "fallback_name" text,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "event_title" text NOT NULL,
  "featured" bool NOT NULL DEFAULT false,
  "our_pick" bool NOT NULL DEFAULT false,
  "event_type" text DEFAULT 'Free',
  "stripe_event_id" text DEFAULT null,
  "remarks" text NOT NULL DEFAULT '',
  "partnered" bool NOT NULL DEFAULT false,
  "event_description" text,
  "partner_id" uuid DEFAULT null,
  "scheduled_post" timestamptz,
  "online" boolean,
  "rsvp_link" text DEFAULT null,
  "country" text DEFAULT 'Singapore',
  "city" text DEFAULT 'Singapore',
  "location" text DEFAULT null
);

CREATE TABLE "PromotionalMaterial" (
  "event_id" uuid NOT NULL,
  "material_id" serial PRIMARY KEY NOT NULL,
  "image_url" text NOT NULL,
  "original_name" text NOT NULL
);

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE;

ALTER TABLE "UserPartnerOwnership" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("partner_id") REFERENCES "Partner" ("partner_id");

ALTER TABLE "PromotionalMaterial" ADD FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE CASCADE;
