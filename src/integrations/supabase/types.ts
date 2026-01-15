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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_cards: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          lang: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon?: string
          id?: string
          lang?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          lang?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          lang: string
          published_date: string | null
          reading_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          lang?: string
          published_date?: string | null
          reading_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          lang?: string
          published_date?: string | null
          reading_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      experience_stories: {
        Row: {
          caption: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          lang: string
          updated_at: string
        }
        Insert: {
          caption: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          lang?: string
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          display_order: number
          employment_type: string | null
          end_date: string | null
          id: string
          lang: string
          location: string | null
          position: string
          start_date: string
          technologies: string[] | null
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          lang?: string
          location?: string | null
          position: string
          start_date: string
          technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          lang?: string
          location?: string | null
          position?: string
          start_date?: string
          technologies?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_stats: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          lang: string
          number: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon?: string
          id?: string
          lang?: string
          number: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          lang?: string
          number?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          created_at: string
          display_order: number
          href: string
          id: string
          is_visible: boolean
          label: string
          lang: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          href: string
          id?: string
          is_visible?: boolean
          label: string
          lang?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          completion_date: string | null
          cover_image_url: string | null
          created_at: string
          demo_link: string | null
          display_order: number
          featured: boolean | null
          full_description: string | null
          gallery: string[] | null
          id: string
          lang: string
          published: boolean | null
          repo_link: string | null
          results: string[] | null
          short_description: string
          slug: string
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completion_date?: string | null
          cover_image_url?: string | null
          created_at?: string
          demo_link?: string | null
          display_order?: number
          featured?: boolean | null
          full_description?: string | null
          gallery?: string[] | null
          id?: string
          lang?: string
          published?: boolean | null
          repo_link?: string | null
          results?: string[] | null
          short_description: string
          slug: string
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completion_date?: string | null
          cover_image_url?: string | null
          created_at?: string
          demo_link?: string | null
          display_order?: number
          featured?: boolean | null
          full_description?: string | null
          gallery?: string[] | null
          id?: string
          lang?: string
          published?: boolean | null
          repo_link?: string | null
          results?: string[] | null
          short_description?: string
          slug?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          bio_long: string | null
          bio_short: string | null
          created_at: string
          email_icon_url: string | null
          hero_tag: string | null
          id: string
          lang: string
          linkedin_icon_url: string | null
          location: string | null
          location_icon_url: string | null
          name: string
          profile_image_url: string | null
          social_email: string | null
          social_linkedin: string | null
          title: string
          title_2: string | null
          title_3: string | null
          title_4: string | null
          updated_at: string
        }
        Insert: {
          bio_long?: string | null
          bio_short?: string | null
          created_at?: string
          email_icon_url?: string | null
          hero_tag?: string | null
          id?: string
          lang?: string
          linkedin_icon_url?: string | null
          location?: string | null
          location_icon_url?: string | null
          name?: string
          profile_image_url?: string | null
          social_email?: string | null
          social_linkedin?: string | null
          title?: string
          title_2?: string | null
          title_3?: string | null
          title_4?: string | null
          updated_at?: string
        }
        Update: {
          bio_long?: string | null
          bio_short?: string | null
          created_at?: string
          email_icon_url?: string | null
          hero_tag?: string | null
          id?: string
          lang?: string
          linkedin_icon_url?: string | null
          location?: string | null
          location_icon_url?: string | null
          name?: string
          profile_image_url?: string | null
          social_email?: string | null
          social_linkedin?: string | null
          title?: string
          title_2?: string | null
          title_3?: string | null
          title_4?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          display_order: number
          featured: boolean | null
          icon: string | null
          id: string
          lang: string
          name: string
          proficiency: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          featured?: boolean | null
          icon?: string | null
          id?: string
          lang?: string
          name: string
          proficiency?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          featured?: boolean | null
          icon?: string | null
          id?: string
          lang?: string
          name?: string
          proficiency?: number
          updated_at?: string
        }
        Relationships: []
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
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
