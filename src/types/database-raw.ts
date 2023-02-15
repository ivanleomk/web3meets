export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      City: {
        Row: {
          city_id: number
          country_id: number
        }
        Insert: {
          city_id?: number
          country_id?: number
        }
        Update: {
          city_id?: number
          country_id?: number
        }
      }
      Country: {
        Row: {
          country_id: number
          country_name: string | null
        }
        Insert: {
          country_id?: number
          country_name?: string | null
        }
        Update: {
          country_id?: number
          country_name?: string | null
        }
      }
      Event: {
        Row: {
          ends_at: string | null
          event_id: number
          event_series_id: number
          featured: boolean | null
          location_id: number
          our_pick: boolean | null
          paid: boolean | null
          partner_id: number
          partnered: boolean | null
          poster_link: string | null
          remarks: string | null
          scheduled_post: string | null
          starts_at: string | null
          stripe_event_id: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          ends_at?: string | null
          event_id?: number
          event_series_id?: number
          featured?: boolean | null
          location_id?: number
          our_pick?: boolean | null
          paid?: boolean | null
          partner_id?: number
          partnered?: boolean | null
          poster_link?: string | null
          remarks?: string | null
          scheduled_post?: string | null
          starts_at?: string | null
          stripe_event_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          ends_at?: string | null
          event_id?: number
          event_series_id?: number
          featured?: boolean | null
          location_id?: number
          our_pick?: boolean | null
          paid?: boolean | null
          partner_id?: number
          partnered?: boolean | null
          poster_link?: string | null
          remarks?: string | null
          scheduled_post?: string | null
          starts_at?: string | null
          stripe_event_id?: string | null
          title?: string | null
          user_id?: string | null
        }
      }
      EventSeries: {
        Row: {
          end_date: string | null
          event_series_id: number
          recurring: string | null
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          event_series_id?: number
          recurring?: string | null
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          event_series_id?: number
          recurring?: string | null
          start_date?: string | null
        }
      }
      Location: {
        Row: {
          address: string | null
          city_id: number
          google_maps_link: string | null
          location_id: number
        }
        Insert: {
          address?: string | null
          city_id?: number
          google_maps_link?: string | null
          location_id?: number
        }
        Update: {
          address?: string | null
          city_id?: number
          google_maps_link?: string | null
          location_id?: number
        }
      }
      Partner: {
        Row: {
          active: boolean | null
          name: string | null
          open_to_sponsor: boolean | null
          partner_id: number
          stripe_account_id: string | null
          telegram_handle: string | null
          twitter_id: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          name?: string | null
          open_to_sponsor?: boolean | null
          partner_id?: number
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          name?: string | null
          open_to_sponsor?: boolean | null
          partner_id?: number
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string | null
        }
      }
      User: {
        Row: {
          admin: boolean
          email: string | null
          user_id: string
        }
        Insert: {
          admin?: boolean
          email?: string | null
          user_id: string
        }
        Update: {
          admin?: boolean
          email?: string | null
          user_id?: string
        }
      }
      UserPartnerOwnership: {
        Row: {
          approved: boolean | null
          partner_id: number | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          partner_id?: number | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          partner_id?: number | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}