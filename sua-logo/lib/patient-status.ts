import type { PatientStatus } from '@/types'

// Rótulo e cor do selo de status usados nos cards de lista (médico e admin).
export const PATIENT_STATUS_LABEL: Record<PatientStatus, string> = {
  cadastro_incompleto: 'Cadastro incompleto',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_medico: 'Na fila do médico',
  retido_admin: 'Na fila do Admin',
  concluido: 'Concluído',
}

export const PATIENT_STATUS_VARIANT: Record<PatientStatus, 'red' | 'amber' | 'teal'> = {
  cadastro_incompleto: 'red',
  aguardando_pagamento: 'amber',
  aguardando_medico: 'amber',
  retido_admin: 'amber',
  concluido: 'teal',
}
