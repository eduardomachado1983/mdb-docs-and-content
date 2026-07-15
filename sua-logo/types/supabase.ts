// Tipos gerados manualmente a partir de supabase/migrations/001_initial_schema.sql
// Regenerar com `pnpm supabase:types` quando o projeto estiver linkado.

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
          role: 'patient' | 'doctor' | 'admin'
          crm: string | null
          specialty: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'patient' | 'doctor' | 'admin'
          crm?: string | null
          specialty?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          user_id: string
          status: 'cadastro_incompleto' | 'aguardando_pagamento' | 'aguardando_medico' | 'retido_admin' | 'concluido'
          personal_data: Json
          triage: Json
          payment: Json
          clinical: Json
          admin_validation: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: Database['public']['Tables']['patients']['Row']['status']
          personal_data?: Json
          triage?: Json
          payment?: Json
          clinical?: Json
          admin_validation?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['patients']['Insert']>
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          patient_id: string
          type: 'identity' | 'address' | 'previous_consultation'
          filename: string
          storage_path: string
          mime_type: string | null
          size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          type: 'identity' | 'address' | 'previous_consultation'
          filename: string
          storage_path: string
          mime_type?: string | null
          size_bytes?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
        Relationships: []
      }
      chat_history: {
        Row: {
          id: string
          patient_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['chat_history']['Insert']>
        Relationships: []
      }
      payment_transactions: {
        Row: {
          id: string
          patient_id: string
          reference_id: string
          amount: number
          method: string | null
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          gateway_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          reference_id: string
          amount: number
          method?: string | null
          status?: Database['public']['Tables']['payment_transactions']['Row']['status']
          gateway_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['payment_transactions']['Insert']>
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          id: string
          phone: string
          contact_name: string | null
          unread_count: number
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          contact_name?: string | null
          unread_count?: number
          last_message_at?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['whatsapp_conversations']['Insert']>
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          id: string
          conversation_id: string
          direction: 'inbound' | 'outbound'
          content: string
          wa_message_id: string | null
          status: 'received' | 'sent' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          direction: 'inbound' | 'outbound'
          content: string
          wa_message_id?: string | null
          status?: 'received' | 'sent' | 'failed'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['whatsapp_messages']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
