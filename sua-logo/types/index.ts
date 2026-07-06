// ══════════════════════════════════════
// Tipos centrais do projeto
// ══════════════════════════════════════

export type Role = 'patient' | 'doctor' | 'admin'

export type PatientStatus =
  | 'cadastro_incompleto'
  | 'aguardando_pagamento'
  | 'aguardando_medico'
  | 'retido_admin'
  | 'concluido'

export interface Profile {
  id: string
  name: string
  role: Role
  crm?: string | null
  specialty?: string | null
  created_at: string
}

export interface PersonalData {
  full_name: string
  email: string
  cpf: string
  rg: string
  birth_date: string
  phone: string
}

export interface TriageData {
  main_symptom: string
  pain_location: string
  pain_intensity: number
  medical_history: string
}

export interface PaymentData {
  confirmed: boolean
  method?: string
  amount?: number
  confirmed_at?: string
  reference_id?: string
}

export interface ClinicalData {
  prescription?: string
  report?: string
  saved_by_doctor?: boolean
  saved_at?: string
}

export interface AdminValidation {
  identity_approved?: boolean
  financial_approved?: boolean
  clinical_approved?: boolean
  released_at?: string
  released_by?: string
}

export interface Patient {
  id: string
  user_id: string
  status: PatientStatus
  personal_data: PersonalData
  triage: TriageData
  payment: PaymentData
  clinical: ClinicalData
  admin_validation: AdminValidation
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  patient_id: string
  type: 'identity' | 'address'
  filename: string
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  created_at: string
}

export interface ChatMessage {
  id: string
  patient_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface PaymentTransaction {
  id: string
  patient_id: string
  reference_id: string
  amount: number
  method?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  gateway_response?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Status labels para exibição
export const STATUS_LABELS: Record<PatientStatus, string> = {
  cadastro_incompleto: 'Cadastro incompleto',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_medico: 'Aguardando atendimento médico',
  retido_admin: 'Aguardando validação final',
  concluido: 'Concluído',
}

// Mensagens de status para o paciente (linguagem humana)
export const STATUS_MESSAGES: Record<PatientStatus, { title: string; description: string }> = {
  cadastro_incompleto: {
    title: 'Complete seu cadastro',
    description: 'Preencha seus dados para iniciar a consulta.',
  },
  aguardando_pagamento: {
    title: 'Pagamento pendente',
    description: 'Seu cadastro está completo. Finalize o pagamento para entrar na fila.',
  },
  aguardando_medico: {
    title: 'Aguardando médico',
    description: 'Seu caso está com o médico. Normalmente respondemos em até 2 horas.',
  },
  retido_admin: {
    title: 'Em validação final',
    description: 'O médico emitiu seus documentos. Aguardando validação administrativa.',
  },
  concluido: {
    title: 'Tudo certo!',
    description: 'Seus documentos estão disponíveis para download.',
  },
}
