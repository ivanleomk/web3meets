import { type Database } from "./database-raw";

type DatabaseTables = Database["public"]["Tables"];

// Generic Tables
export type EventSeries = DatabaseTables["EventSeries"]["Row"];
export type Event = DatabaseTables["Event"]["Row"];
export type User = DatabaseTables["User"]["Row"];
export type UserPartnerOwnership =
  DatabaseTables["UserPartnerOwnership"]["Row"];
export type Partner = DatabaseTables["Partner"]["Row"];
export type Country = DatabaseTables["Country"]["Row"];
export type City = DatabaseTables["City"]["Row"];
export type Location = DatabaseTables["Location"]["Row"];

// Operation-Specific Types are here
export type UserPartnerOwnershipWithPartner = UserPartnerOwnership & {
  Partner: Partner;
};

export type UserPartnerOwnershipWithUser = UserPartnerOwnership & {
  User: User;
};

export type UserPartnerOwnershipWithUserAndPartner = UserPartnerOwnership & {
  User: User;
  Partner: Partner;
};
