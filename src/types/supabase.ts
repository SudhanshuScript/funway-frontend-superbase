export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      franchises: {
        Row: {
          id: string
          company_name: string
          owner_name: string | null
          contact_number: string | null
          email: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          tax_id: string | null
          tax_percentage: number | null
          tax_inclusive: boolean | null
          payment_gateway: string | null
          payment_api_key: string | null
          call_center_number: string | null
          telegram_channel_id: string | null
          status: string | null
          default_currency: string | null
          timezone: string | null
          language: string | null
          welcome_message: string | null
          theme_color: string | null
          logo_url: string | null
          inactivity_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_name: string
          owner_name?: string | null
          contact_number?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          tax_id?: string | null
          tax_percentage?: number | null
          tax_inclusive?: boolean | null
          payment_gateway?: string | null
          payment_api_key?: string | null
          call_center_number?: string | null
          telegram_channel_id?: string | null
          status?: string | null
          default_currency?: string | null
          timezone?: string | null
          language?: string | null
          welcome_message?: string | null
          theme_color?: string | null
          logo_url?: string | null
          inactivity_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string
          owner_name?: string | null
          contact_number?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          tax_id?: string | null
          tax_percentage?: number | null
          tax_inclusive?: boolean | null
          payment_gateway?: string | null
          payment_api_key?: string | null
          call_center_number?: string | null
          telegram_channel_id?: string | null
          status?: string | null
          default_currency?: string | null
          timezone?: string | null
          language?: string | null
          welcome_message?: string | null
          theme_color?: string | null
          logo_url?: string | null
          inactivity_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          franchise_id: string | null
          name: string
          role: string | null
          phone: string | null
          email: string | null
          telegram_id: string | null
          ip_restrictions: string[] | null
          access_level: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          franchise_id?: string | null
          name: string
          role?: string | null
          phone?: string | null
          email?: string | null
          telegram_id?: string | null
          ip_restrictions?: string[] | null
          access_level?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          franchise_id?: string | null
          name?: string
          role?: string | null
          phone?: string | null
          email?: string | null
          telegram_id?: string | null
          ip_restrictions?: string[] | null
          access_level?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_franchise_id_fkey"
            columns: ["franchise_id"]
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          role: string | null
          franchise_id: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          role?: string | null
          franchise_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          role?: string | null
          franchise_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_franchise_id_fkey"
            columns: ["franchise_id"]
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          description: string | null
          allergens: string[]
          vegetarian: boolean
          gluten_free: boolean
          dairy_free: boolean
          popular: boolean
          franchise_id: string | null
          image_url: string | null
          satisfaction_score: number | null
          available: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          description?: string | null
          allergens?: string[]
          vegetarian?: boolean
          gluten_free?: boolean
          dairy_free?: boolean
          popular?: boolean
          franchise_id?: string | null
          image_url?: string | null
          satisfaction_score?: number | null
          available?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          description?: string | null
          allergens?: string[]
          vegetarian?: boolean
          gluten_free?: boolean
          dairy_free?: boolean
          popular?: boolean
          franchise_id?: string | null
          image_url?: string | null
          satisfaction_score?: number | null
          available?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_franchise_id_fkey"
            columns: ["franchise_id"]
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_session_mappings: {
        Row: {
          id: string
          menu_item_id: string | null
          session_id: string | null
          available: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          session_id?: string | null
          available?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          session_id?: string | null
          available?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_session_mappings_menu_item_id_fkey"
            columns: ["menu_item_id"]
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_session_mappings_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      sessions: {
        Row: {
          booked_count: number | null
          created_at: string | null
          deactivated_at: string | null
          deactivated_by: string | null
          deactivation_reason: string | null
          duration: number
          end_time: string | null
          franchise_id: string | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          is_special_date: boolean | null
          max_capacity: number
          name: string
          notes: string | null
          recurring_type: string | null
          special_addons: string[] | null
          special_conditions: string | null
          special_date_name: string | null
          special_pricing: number | null
          start_date: string
          start_time: string
          type: string
          updated_at: string | null
        }
        Insert: {
          booked_count?: number | null
          created_at?: string | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          deactivation_reason?: string | null
          duration: number
          end_time?: string | null
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          is_special_date?: boolean | null
          max_capacity: number
          name: string
          notes?: string | null
          recurring_type?: string | null
          special_addons?: string[] | null
          special_conditions?: string | null
          special_date_name?: string | null
          special_pricing?: number | null
          start_date: string
          start_time: string
          type: string
          updated_at?: string | null
        }
        Update: {
          booked_count?: number | null
          created_at?: string | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          deactivation_reason?: string | null
          duration?: number
          end_time?: string | null
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          is_special_date?: boolean | null
          max_capacity?: number
          name?: string
          notes?: string | null
          recurring_type?: string | null
          special_addons?: string[] | null
          special_conditions?: string | null
          special_date_name?: string | null
          special_pricing?: number | null
          start_date?: string
          start_time?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_franchise_id_fkey"
            columns: ["franchise_id"]
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
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
}
