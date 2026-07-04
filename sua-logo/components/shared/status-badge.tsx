import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type PatientStatus } from '@/types'

const VARIANT: Record<PatientStatus, 'default' | 'teal' | 'amber' | 'green' | 'red'> = {
  cadastro_incompleto: 'default',
  aguardando_pagamento: 'amber',
  aguardando_medico: 'teal',
  retido_admin: 'amber',
  concluido: 'green',
}

export function StatusBadge({ status }: { status: PatientStatus }) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
}
