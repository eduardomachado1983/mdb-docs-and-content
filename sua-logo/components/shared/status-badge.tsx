import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type PatientStatus } from '@/types'

const VARIANT: Record<PatientStatus, 'default' | 'brand' | 'amber' | 'green'> = {
  cadastro_incompleto: 'default',
  aguardando_pagamento: 'amber',
  aguardando_medico: 'brand',
  retido_admin: 'amber',
  concluido: 'green',
}

export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge variant={VARIANT[status]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </Badge>
  )
}
