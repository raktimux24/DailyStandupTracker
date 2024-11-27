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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      standups: {
        Row: {
          id: string
          user_id: string
          yesterday: string
          today: string
          blockers: string | null
          comments: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          yesterday: string
          today: string
          blockers?: string | null
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          yesterday?: string
          today?: string
          blockers?: string | null
          comments?: string | null
          created_at?: string
          updated_at?: string
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
  }
}