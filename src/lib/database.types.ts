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
          created_at: string
          updated_at: string
          full_name: string | null
          email: string | null
          wallet_address: string
          coins: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email?: string | null
          wallet_address: string
          coins?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email?: string | null
          wallet_address?: string
          coins?: number
        }
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          photo_url: string
          square_footage: number | null
          year_built: number | null
          google_maps_url: string | null
          youtube_url: string | null
          amount: number
          initial_bid: number
          bid_increment: number
          bid_end_date: string
          additional_info: Json | null
          owner_id: string
          is_active: boolean
          highest_bidder_id: string | null
          highest_bid: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          photo_url: string
          square_footage?: number | null
          year_built?: number | null
          google_maps_url?: string | null
          youtube_url?: string | null
          amount: number
          initial_bid: number
          bid_increment: number
          bid_end_date: string
          additional_info?: Json | null
          owner_id: string
          is_active?: boolean
          highest_bidder_id?: string | null
          highest_bid?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          photo_url?: string
          square_footage?: number | null
          year_built?: number | null
          google_maps_url?: string | null
          youtube_url?: string | null
          amount?: number
          initial_bid?: number
          bid_increment?: number
          bid_end_date?: string
          additional_info?: Json | null
          owner_id?: string
          is_active?: boolean
          highest_bidder_id?: string | null
          highest_bid?: number | null
        }
      }
      bids: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          bidder_id: string
          amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          bidder_id: string
          amount: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          bidder_id?: string
          amount?: number
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