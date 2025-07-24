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
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'ammunition' | 'magazine' | 'accessory' | 'gear'
          caliber: string | null
          price: number
          stock_quantity: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'ammunition' | 'magazine' | 'accessory' | 'gear'
          caliber?: string | null
          price: number
          stock_quantity?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'ammunition' | 'magazine' | 'accessory' | 'gear'
          caliber?: string | null
          price?: number
          stock_quantity?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          monthly_budget: number
          status: 'active' | 'paused' | 'cancelled'
          next_billing_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monthly_budget: number
          status?: 'active' | 'paused' | 'cancelled'
          next_billing_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monthly_budget?: number
          status?: 'active' | 'paused' | 'cancelled'
          next_billing_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      stockpile_allocations: {
        Row: {
          id: string
          subscription_id: string
          product_id: string
          monthly_amount: number
          target_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          product_id: string
          monthly_amount: number
          target_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          product_id?: string
          monthly_amount?: number
          target_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      virtual_stockpile: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity_allocated: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity_allocated?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity_allocated?: number
          last_updated?: string
        }
      }
      shipments: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered'
          tracking_number: string | null
          shipping_address: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered'
          tracking_number?: string | null
          shipping_address: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered'
          tracking_number?: string | null
          shipping_address?: Json
          created_at?: string
          updated_at?: string
        }
      }
      shipment_items: {
        Row: {
          id: string
          shipment_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Insert: {
          id?: string
          shipment_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Update: {
          id?: string
          shipment_id?: string
          product_id?: string
          quantity?: number
          price_per_unit?: number
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
}
