table User {
  // Derived from Supabase
  user_id uuid  [pk]
  email text
  admin boolean
}

table UserPartnerOwnership {
  user_id uuid
  partner_name text 
  approved boolean
  
  Indexes {
    (user_id, partner_id) [unique]
  }
}


Ref:  UserPartnerOwnership.user_id > User.user_id [delete:cascade]
Ref:  UserPartnerOwnership.partner_name > Partner.partner_name [delete:cascade]


table Partner {
  parter_name text [not null, unique]
  website text [null, unique]
  telegram_handle text [null, unique]
  twitter_id text [null,unique]
  // Internal Flag here
  stripe_account_id text [null,unique]
  // When a Partner wants to delete their acc - we indicate that it is inactive instead
  active bool [not null,default:false]
  open_to_sponsor boolean [not null,default:false]
  approved bool [not null,default:false]
}

table Event {
  event_id serial [pk]
  user_id uuid [not null]
  starts_at timestamptz [not null]
  ends_at timestamptz [not null]
  title text [not null]
  featured bool [not null,default:false]
  our_pick bool [not null,default:false]
  location_id serial [null]
  paid bool [not null,default:false]
  // In case we ever want to accept event $$
  stripe_event_id text [null]
  remarks text [not null, default:""]
  partnered bool  [not null,default:false]
  event_series_id serial  [not null]
  partner_id serial [ref: > Partner.partner_id]
  scheduled_post timestamptz [null]
}


Ref: Event.location_id > Location.location_id
Ref: Event.event_series_id > EventSeries.event_series_id [delete:cascade]
Ref: Event.user_id > User.user_id


table PromotionalMaterial {
  event_id serial 
  image_url text
}

Ref: PromotionalMaterial.event_id > Event.event_id

// Useful to help track recurring events - we specify end and start date
table EventSeries {
  event_series_id serial [pk] 
  recurring text // Support basic stuff like weekly, monthly,bi monthly
  //Thse can be null if recurring is set to null
  start_date timestamptz [null]
  end_date timestamptz  [null]
}

table Location {
  location_id serial [pk]
  address text 
  google_maps_link text
  city_id serial [ref: > City.city_id]
}

table City {
  city_id serial [pk]
  country_id serial [ref: > Country.country_id]
}

table Country {
  country_id serial [pk]
  country_name text 
}
   