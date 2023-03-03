CREATE TABLE "User" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "email" text UNIQUE NOT NULL,
  "admin" boolean NOT NULL DEFAULT false,
  "user_name" text,
  "avatar_url" text
);

CREATE TABLE "Partner" (
  "partner_id" uuid PRIMARY KEY NOT NULL DEFAULT UUID_generate_v4(),
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

CREATE TABLE "UserPartnerOwnership" (
  "user_id" uuid NOT NULL REFERENCES "User" ("user_id") ON DELETE CASCADE,
  "partner_id" uuid NOT NULL REFERENCES "Partner" ("partner_id") ON DELETE CASCADE,
  "approved" boolean NOT NULL DEFAULT false,
  
  PRIMARY KEY ("user_id","partner_id")
);

CREATE TABLE "Event" (
  "event_id" uuid PRIMARY KEY NOT NULL DEFAULT UUID_generate_v4(),
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
  "partner_id" uuid DEFAULT null REFERENCES "Partner" ("partner_id") ON DELETE CASCADE,
  "scheduled_post" timestamptz,
  "online" boolean,
  "rsvp_link" text DEFAULT null,
  "country" text DEFAULT 'Singapore',
  "city" text DEFAULT 'Singapore',
  "location" text DEFAULT null
);

CREATE TABLE "Registration"(
  "registration_id" serial NOT NULL PRIMARY KEY,
  "user_email" text NOT NULL,
  "event_id" uuid NOT NULL REFERENCES "Event" ("event_id") ON DELETE CASCADE,
  "user_id" uuid   REFERENCES "User" ("user_id") ON DELETE CASCADE
);

CREATE TABLE "PromotionalMaterial" (
  "event_id" uuid NOT NULL REFERENCES "Event" ("event_id") ON DELETE CASCADE,
  "material_id" serial PRIMARY KEY NOT NULL,
  "image_url" text NOT NULL,
  "original_name" text NOT NULL
);