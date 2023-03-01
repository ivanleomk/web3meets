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
      Event: {
        Row: {
          city: string
          country: string
          ends_at: string
          event_description: string
          event_id: string
          event_title: string
          event_type: string
          featured: boolean
          location: string | null
          location_id: number
          online: boolean
          our_pick: boolean
          partner_id: string | null
          partnered: boolean
          rsvp_link: string | null
          scheduled_post: string | null
          starts_at: string
          stripe_event_id: string | null
        }
        Insert: {
          city?: string
          country?: string
          ends_at: string
          event_description?: string
          event_id?: string
          event_title: string
          event_type: string
          featured?: boolean
          location?: string | null
          location_id?: number
          online: boolean
          our_pick?: boolean
          partner_id?: string | null
          partnered?: boolean
          rsvp_link?: string | null
          scheduled_post?: string | null
          starts_at: string
          stripe_event_id?: string | null
        }
        Update: {
          city?: string
          country?: string
          ends_at?: string
          event_description?: string
          event_id?: string
          event_title?: string
          event_type?: string
          featured?: boolean
          location?: string | null
          location_id?: number
          online?: boolean
          our_pick?: boolean
          partner_id?: string | null
          partnered?: boolean
          rsvp_link?: string | null
          scheduled_post?: string | null
          starts_at?: string
          stripe_event_id?: string | null
        }
      }
      Partner: {
        Row: {
          active: boolean
          approved: boolean
          bio: string
          open_to_sponsor: boolean
          partner_id: string
          partner_name: string
          stripe_account_id: string | null
          telegram_handle: string | null
          twitter_id: string | null
          website: string
        }
        Insert: {
          active?: boolean
          approved?: boolean
          bio?: string
          open_to_sponsor?: boolean
          partner_id?: string
          partner_name: string
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string
        }
        Update: {
          active?: boolean
          approved?: boolean
          bio?: string
          open_to_sponsor?: boolean
          partner_id?: string
          partner_name?: string
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string
        }
      }
      PromotionalMaterial: {
        Row: {
          event_id: string | null
          image_url: string
          material_id: number
          original_name: string | null
        }
        Insert: {
          event_id?: string | null
          image_url: string
          material_id?: number
          original_name?: string | null
        }
        Update: {
          event_id?: string | null
          image_url?: string
          material_id?: number
          original_name?: string | null
        }
      }
      User: {
        Row: {
          admin: boolean
          email: string
          user_id: string
        }
        Insert: {
          admin?: boolean
          email: string
          user_id: string
        }
        Update: {
          admin?: boolean
          email?: string
          user_id?: string
        }
      }
      UserPartnerOwnership: {
        Row: {
          approved: boolean
          partner_id: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          partner_id: string
          user_id: string
        }
        Update: {
          approved?: boolean
          partner_id?: string
          user_id?: string
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
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
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
