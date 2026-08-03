// Generated-style Supabase types matching supabase/schema.sql.
// Regenerate with: npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'entrepreneur' | 'investor' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['users']['Row']> & { id: string; email: string }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          sector: string
          location: string
          stage: string
          funding_requirement: number
          moca_score: number
          registration_number: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['business_profiles']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['business_profiles']['Row']>
      }
      funding_opportunities: {
        Row: {
          id: string
          organisation: string
          title: string
          description: string
          sector: string
          amount_min: number
          amount_max: number
          eligibility: string
          closing_date: string
          application_url: string | null
          logo_url: string | null
          featured: boolean
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['funding_opportunities']['Row']> & { organisation: string; title: string }
        Update: Partial<Database['public']['Tables']['funding_opportunities']['Row']>
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          category: string
          cover_image: string | null
          author: string
          published_at: string
          read_minutes: number
          status: string
        }
        Insert: Partial<Database['public']['Tables']['articles']['Row']> & { title: string; slug: string }
        Update: Partial<Database['public']['Tables']['articles']['Row']>
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          lessons_count: number
          duration_minutes: number
          level: string
          cover_image: string | null
          price: number
        }
        Insert: Partial<Database['public']['Tables']['courses']['Row']> & { title: string }
        Update: Partial<Database['public']['Tables']['courses']['Row']>
      }
      applications: {
        Row: {
          id: string
          user_id: string
          funding_opportunity_id: string
          status: string
          submitted_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['applications']['Row']> & {
          user_id: string
          funding_opportunity_id: string
        }
        Update: Partial<Database['public']['Tables']['applications']['Row']>
      }
      investors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          organisation: string
          focus_sectors: string[]
          ticket_min: number
          ticket_max: number
          bio: string
          logo_url: string | null
        }
        Insert: Partial<Database['public']['Tables']['investors']['Row']> & { name: string; organisation: string }
        Update: Partial<Database['public']['Tables']['investors']['Row']>
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          tag: string
          replies_count: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['community_posts']['Row']> & {
          user_id: string
          title: string
          body: string
        }
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>
      }
      products: {
        Row: {
          id: string
          user_id: string
          seller_name: string
          seller_phone: string
          business_name: string | null
          title: string
          description: string
          category: string
          price: number
          unit: string
          stock_quantity: number | null
          location: string
          image_url: string | null
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['products']['Row']> & {
          user_id: string
          seller_name: string
          seller_phone: string
          title: string
          description: string
          category: string
          price: number
          location: string
        }
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
        }
        Insert: { id?: string; email: string; subscribed_at?: string }
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Row']>
      }
    }
  }
}
