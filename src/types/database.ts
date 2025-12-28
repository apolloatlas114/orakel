// Database types generated from Supabase schema
// These types match the database schema exactly

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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          reputation_score: number
          total_predictions: number
          correct_predictions: number
          accuracy_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          reputation_score?: number
          total_predictions?: number
          correct_predictions?: number
          accuracy_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          reputation_score?: number
          total_predictions?: number
          correct_predictions?: number
          accuracy_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          category: 'sports' | 'politics' | 'crypto' | 'entertainment' | 'science' | 'other'
          status: 'draft' | 'live' | 'upcoming' | 'closed' | 'resolved'
          image_url: string | null
          end_date: string
          resolution_date: string | null
          resolved_outcome: boolean | null
          resolution_source: string | null
          market_quote: number
          market_quote_change: number
          oracle_quote: number
          oracle_quote_change: number
          crowd_quote: number
          crowd_quote_change: number
          total_volume: number
          total_votes: number
          yes_votes: number
          no_votes: number
          tags: string[]
          external_links: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category?: 'sports' | 'politics' | 'crypto' | 'entertainment' | 'science' | 'other'
          status?: 'draft' | 'live' | 'upcoming' | 'closed' | 'resolved'
          image_url?: string | null
          end_date: string
          resolution_date?: string | null
          resolved_outcome?: boolean | null
          resolution_source?: string | null
          market_quote?: number
          market_quote_change?: number
          oracle_quote?: number
          oracle_quote_change?: number
          crowd_quote?: number
          crowd_quote_change?: number
          total_volume?: number
          total_votes?: number
          yes_votes?: number
          no_votes?: number
          tags?: string[]
          external_links?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'sports' | 'politics' | 'crypto' | 'entertainment' | 'science' | 'other'
          status?: 'draft' | 'live' | 'upcoming' | 'closed' | 'resolved'
          image_url?: string | null
          end_date?: string
          resolution_date?: string | null
          resolved_outcome?: boolean | null
          resolution_source?: string | null
          market_quote?: number
          market_quote_change?: number
          oracle_quote?: number
          oracle_quote_change?: number
          crowd_quote?: number
          crowd_quote_change?: number
          total_volume?: number
          total_votes?: number
          yes_votes?: number
          no_votes?: number
          tags?: string[]
          external_links?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          event_id: string
          vote: 'yes' | 'no'
          confidence: number
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          vote: 'yes' | 'no'
          confidence?: number
          amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          vote?: 'yes' | 'no'
          confidence?: number
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          event_id: string
          parent_id: string | null
          content: string
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          parent_id?: string | null
          content: string
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          parent_id?: string | null
          content?: string
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          user_id: string
          comment_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          comment_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          comment_id?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'prediction' | 'event' | 'system' | 'social'
          title: string
          message: string
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: 'prediction' | 'event' | 'system' | 'social'
          title: string
          message: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'prediction' | 'event' | 'system' | 'social'
          title?: string
          message?: string
          link?: string | null
          read?: boolean
          created_at?: string
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
      event_status: 'draft' | 'live' | 'upcoming' | 'closed' | 'resolved'
      event_category: 'sports' | 'politics' | 'crypto' | 'entertainment' | 'science' | 'other'
      vote_type: 'yes' | 'no'
      notification_type: 'prediction' | 'event' | 'system' | 'social'
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type DbEvent = Database['public']['Tables']['events']['Row']
export type DbEventInsert = Database['public']['Tables']['events']['Insert']
export type DbEventUpdate = Database['public']['Tables']['events']['Update']

export type DbVote = Database['public']['Tables']['votes']['Row']
export type DbVoteInsert = Database['public']['Tables']['votes']['Insert']
export type DbVoteUpdate = Database['public']['Tables']['votes']['Update']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert']

export type DbNotification = Database['public']['Tables']['notifications']['Row']
export type DbNotificationInsert = Database['public']['Tables']['notifications']['Insert']
