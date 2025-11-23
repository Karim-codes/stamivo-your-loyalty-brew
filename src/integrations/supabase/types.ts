export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          address: string | null
          business_name: string
          business_size: string | null
          business_type: string
          created_at: string
          daily_customers: number | null
          had_previous_loyalty: boolean | null
          id: string
          is_public: boolean | null
          logo_url: string | null
          opening_hours: Json | null
          owner_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_name: string
          business_size?: string | null
          business_type: string
          created_at?: string
          daily_customers?: number | null
          had_previous_loyalty?: boolean | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          opening_hours?: Json | null
          owner_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_name?: string
          business_size?: string | null
          business_type?: string
          created_at?: string
          daily_customers?: number | null
          had_previous_loyalty?: boolean | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          opening_hours?: Json | null
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          allow_multiple_scans: boolean | null
          auto_verify: boolean | null
          business_id: string
          coffee_types: string[] | null
          created_at: string
          id: string
          is_active: boolean | null
          reward_description: string
          reward_type: string
          stamps_required: number
          updated_at: string
        }
        Insert: {
          allow_multiple_scans?: boolean | null
          auto_verify?: boolean | null
          business_id: string
          coffee_types?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          reward_description: string
          reward_type: string
          stamps_required?: number
          updated_at?: string
        }
        Update: {
          allow_multiple_scans?: boolean | null
          auto_verify?: boolean | null
          business_id?: string
          coffee_types?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          reward_description?: string
          reward_type?: string
          stamps_required?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          business_id: string
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_reward_eligible: boolean | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_reward_eligible?: boolean | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_reward_eligible?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      rewards_redeemed: {
        Row: {
          business_id: string
          code_expires_at: string
          code_generated_at: string
          created_at: string
          customer_id: string
          failed_attempts: number | null
          id: string
          is_redeemed: boolean | null
          redeemed_at: string | null
          redemption_code: string
          stamp_card_id: string
          verified_by: string | null
        }
        Insert: {
          business_id: string
          code_expires_at: string
          code_generated_at?: string
          created_at?: string
          customer_id: string
          failed_attempts?: number | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          redemption_code: string
          stamp_card_id: string
          verified_by?: string | null
        }
        Update: {
          business_id?: string
          code_expires_at?: string
          code_generated_at?: string
          created_at?: string
          customer_id?: string
          failed_attempts?: number | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          redemption_code?: string
          stamp_card_id?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_redeemed_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_redeemed_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_redeemed_stamp_card_id_fkey"
            columns: ["stamp_card_id"]
            isOneToOne: false
            referencedRelation: "stamp_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_redeemed_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stamp_cards: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          id: string
          is_completed: boolean | null
          stamps_collected: number
          updated_at: string
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_completed?: boolean | null
          stamps_collected?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_completed?: boolean | null
          stamps_collected?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_cards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stamp_transactions: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          id: string
          scanned_at: string
          stamp_card_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          verified_by: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id: string
          id?: string
          scanned_at?: string
          stamp_card_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
          verified_by?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          scanned_at?: string
          stamp_card_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stamp_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_transactions_stamp_card_id_fkey"
            columns: ["stamp_card_id"]
            isOneToOne: false
            referencedRelation: "stamp_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_transactions_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "business" | "admin"
      transaction_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "business", "admin"],
      transaction_status: ["pending", "verified", "rejected"],
    },
  },
} as const
