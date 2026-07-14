import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { initials } from '@/lib/utils'
import type { Patient, PatientStatus } from '@/types'

const STATUS_LABEL: Record<PatientStatus, string> = {
  cadastro_incompleto: 'Cadastro incompleto',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_medico: 'Na fila do médico',
  retido_admin: 'Na fila do Admin',
  concluido: 'Concluído',
}

const STATUS_VARIANT: Record<PatientStatus, 'default' | 'amber' | 'teal'> = {
  cadastro_incompleto: 'default',
  aguardando_pagamento: 'amber',
  aguardando_medico: 'amber',
  retido_admin: 'amber',
  concluido: 'teal',
}

export function MedicoPatientCard({ patient, href }: { patient: Patient; href: string }) {
  const name = patient.personal_data?.full_name || 'Paciente'
  const cpf = patient.personal_data?.cpf || '—'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-navy-900">
          {initials(name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-navy-800">{name}</div>
          <div className="truncate text-[13px] text-navy-200">CPF: {cpf}</div>
        </div>
      </div>

      <div className="sm:w-[180px]">
        <div className="mb-1 text-xs font-semibold text-navy-200">Status</div>
        <Badge variant={STATUS_VARIANT[patient.status]}>{STATUS_LABEL[patient.status]}</Badge>
      </div>

      <Link
        href={href}
        className="rounded-[4px] border border-teal-500 bg-white px-6 py-2.5 text-center text-sm font-bold text-teal-600 transition hover:bg-teal-50 active:scale-[0.98]"
      >
        Visualizar
      </Link>
    </div>
  )
}
