import Link from 'next/link'
import { initials } from '@/lib/utils'
import { STATUS_LABELS, type Patient } from '@/types'

const STATUS_PILL: Record<Patient['status'], string> = {
  cadastro_incompleto: 'bg-surface-page text-navy-500',
  aguardando_pagamento: 'bg-amber-100 text-amber-800',
  aguardando_medico: 'bg-brand-100 text-brand-500',
  retido_admin: 'bg-amber-100 text-amber-800',
  concluido: 'bg-teal-100 text-teal-600',
}

export function PatientListRow({ patient, href }: { patient: Patient; href: string }) {
  const name = (patient.personal_data as { full_name?: string })?.full_name || 'Paciente'
  const email = (patient.personal_data as { email?: string })?.email || '—'

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line-100 px-6 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-page text-[13px] font-bold text-navy-500">
          {initials(name)}
        </div>
        <div>
          <div className="text-sm font-bold text-navy-800">{name}</div>
          <div className="text-[13px] text-navy-200">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`rounded-full px-3 py-1.5 text-[13px] font-bold ${STATUS_PILL[patient.status]}`}>
          {STATUS_LABELS[patient.status]}
        </span>
        <Link href={href} className="text-sm font-bold text-brand-500">
          Abrir
        </Link>
      </div>
    </div>
  )
}
