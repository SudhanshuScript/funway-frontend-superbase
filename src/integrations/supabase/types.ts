export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          access_level: string | null
          created_at: string | null
          email: string | null
          franchise_id: string | null
          id: string
          ip_restrictions: string[] | null
          name: string
          phone: string | null
          role: string | null
          status: string | null
          telegram_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id?: string
          ip_restrictions?: string[] | null
          name: string
          phone?: string | null
          role?: string | null
          status?: string | null
          telegram_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id?: string
          ip_restrictions?: string[] | null
          name?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          telegram_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          address: string | null
          call_center_number: string | null
          city: string | null
          company_name: string
          contact_number: string | null
          country: string | null
          created_at: string | null
          default_currency: string | null
          email: string | null
          id: string
          inactivity_reason: string | null
          language: string | null
          logo_url: string | null
          owner_name: string | null
          payment_api_key: string | null
          payment_gateway: string | null
          state: string | null
          status: string | null
          tax_id: string | null
          tax_inclusive: boolean | null
          tax_percentage: number | null
          telegram_channel_id: string | null
          theme_color: string | null
          timezone: string | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          address?: string | null
          call_center_number?: string | null
          city?: string | null
          company_name: string
          contact_number?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          id?: string
          inactivity_reason?: string | null
          language?: string | null
          logo_url?: string | null
          owner_name?: string | null
          payment_api_key?: string | null
          payment_gateway?: string | null
          state?: string | null
          status?: string | null
          tax_id?: string | null
          tax_inclusive?: boolean | null
          tax_percentage?: number | null
          telegram_channel_id?: string | null
          theme_color?: string | null
          timezone?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          address?: string | null
          call_center_number?: string | null
          city?: string | null
          company_name?: string
          contact_number?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          id?: string
          inactivity_reason?: string | null
          language?: string | null
          logo_url?: string | null
          owner_name?: string | null
          payment_api_key?: string | null
          payment_gateway?: string | null
          state?: string | null
          status?: string | null
          tax_id?: string | null
          tax_inclusive?: boolean | null
          tax_percentage?: number | null
          telegram_channel_id?: string | null
          theme_color?: string | null
          timezone?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          category: string
          created_at: string | null
          dairy_free: boolean | null
          description: string | null
          franchise_id: string | null
          gluten_free: boolean | null
          id: string
          image_url: string | null
          name: string
          popular: boolean | null
          price: number
          satisfaction_score: number | null
          updated_at: string | null
          vegetarian: boolean | null
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          category: string
          created_at?: string | null
          dairy_free?: boolean | null
          description?: string | null
          franchise_id?: string | null
          gluten_free?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          popular?: boolean | null
          price: number
          satisfaction_score?: number | null
          updated_at?: string | null
          vegetarian?: boolean | null
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string
          created_at?: string | null
          dairy_free?: boolean | null
          description?: string | null
          franchise_id?: string | null
          gluten_free?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          popular?: boolean | null
          price?: number
          satisfaction_score?: number | null
          updated_at?: string | null
          vegetarian?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_session_map: {
        Row: {
          created_at: string | null
          id: string
          menu_id: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_id?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_session_map_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_session_map_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_session_mappings: {
        Row: {
          available: boolean | null
          created_at: string | null
          id: string
          menu_item_id: string | null
          session_id: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          session_id?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_session_mappings_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_session_mappings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          franchise_id: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
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
            isOneToOne: false
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
