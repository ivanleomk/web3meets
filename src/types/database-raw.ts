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
          approved: boolean
          category: string
          city: string | null
          country: string | null
          ends_at: string
          event_description: string | null
          event_id: string
          event_title: string
          event_type: string | null
          fallback_name: string | null
          featured: boolean
          location: string | null
          online: string
          our_pick: boolean
          partner_id: string
          partnered: boolean
          remarks: string
          rsvp_link: string | null
          scheduled_post: string | null
          starts_at: string
          stripe_event_id: string | null
          user_id: string | null
        }
        Insert: {
          approved: boolean
          category?: string
          city?: string | null
          country?: string | null
          ends_at: string
          event_description?: string | null
          event_id?: string
          event_title: string
          event_type?: string | null
          fallback_name?: string | null
          featured?: boolean
          location?: string | null
          online: string
          our_pick?: boolean
          partner_id: string
          partnered?: boolean
          remarks?: string
          rsvp_link?: string | null
          scheduled_post?: string | null
          starts_at: string
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          category?: string
          city?: string | null
          country?: string | null
          ends_at?: string
          event_description?: string | null
          event_id?: string
          event_title?: string
          event_type?: string | null
          fallback_name?: string | null
          featured?: boolean
          location?: string | null
          online?: string
          our_pick?: boolean
          partner_id?: string
          partnered?: boolean
          remarks?: string
          rsvp_link?: string | null
          scheduled_post?: string | null
          starts_at?: string
          stripe_event_id?: string | null
          user_id?: string | null
        }
      }
      Partner: {
        Row: {
          active: boolean | null
          approved: boolean | null
          bio: string | null
          open_to_sponsor: boolean | null
          partner_id: string
          partner_name: string
          stripe_account_id: string | null
          telegram_handle: string | null
          twitter_id: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          approved?: boolean | null
          bio?: string | null
          open_to_sponsor?: boolean | null
          partner_id?: string
          partner_name: string
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          approved?: boolean | null
          bio?: string | null
          open_to_sponsor?: boolean | null
          partner_id?: string
          partner_name?: string
          stripe_account_id?: string | null
          telegram_handle?: string | null
          twitter_id?: string | null
          website?: string | null
        }
      }
      PromotionalMaterial: {
        Row: {
          event_id: string
          image_url: string
          material_id: number
          original_name: string
        }
        Insert: {
          event_id: string
          image_url: string
          material_id?: number
          original_name: string
        }
        Update: {
          event_id?: string
          image_url?: string
          material_id?: number
          original_name?: string
        }
      }
      User: {
        Row: {
          admin: boolean
          avatar_url: string | null
          email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          admin?: boolean
          avatar_url?: string | null
          email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          admin?: boolean
          avatar_url?: string | null
          email?: string
          user_id?: string
          user_name?: string | null
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
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
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
