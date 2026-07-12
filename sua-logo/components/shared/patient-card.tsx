import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn, initials, patientCode } from '@/lib/utils'
import type { Patient, PatientStatus } from '@/types'

const STATUS_LABEL: Record<PatientStatus, string> = {
  cadastro_incompleto: 'Cadastro incompleto',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_medico: 'Na fila',
  retido_admin: 'Em validação',
  concluido: 'Concluído',
}

const STATUS_VARIANT: Record<PatientStatus, 'default' | 'amber' | 'teal' | 'brand'> = {
  cadastro_incompleto: 'default',
  aguardando_pagamento: 'amber',
  aguardando_medico: 'amber',
  retido_admin: 'brand',
  concluido: 'teal',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  pix: 'pix',
  card: 'cartão',
}

export function PatientCard({
  patient,
  docsComplete,
  href,
  accent = 'teal',
}: {
  patient: Patient
  docsComplete: boolean
  href: string
  accent?: 'teal' | 'admin'
}) {
  const name = patient.personal_data?.full_name || 'Paciente'
  const triage = patient.triage
  const hasTriage = Boolean(triage?.main_symptom)
  const paid = Boolean(patient.payment?.confirmed)
  const methodLabel = patient.payment?.method ? PAYMENT_METHOD_LABEL[patient.payment.method] ?? patient.payment.method : null

  return (
    <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
              accent === 'admin' ? 'bg-admin-100 text-admin-500' : 'bg-teal-100 text-navy-900'
            )}
          >
            {initials(name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-navy-800">{name}</div>
            <div className="text-[13px] text-navy-200">{patientCode(patient.id)}</div>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[patient.status]}>{STATUS_LABEL[patient.status]}</Badge>
      </div>

      {hasTriage && (
        <div className="border-t border-line-100 px-4 py-4 text-sm text-navy-600 sm:px-6">
          <div className="mb-2 text-xs font-extrabold tracking-wide text-navy-200">CONSULTA</div>
          <div className="flex flex-col gap-1.5">
            <p className="line-clamp-2"><span className="text-navy-300">😊 Sintomas:</span> {triage.main_symptom}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-100 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {docsComplete && <Badge variant="teal">✓ Docs enviados</Badge>}
          {paid && <Badge variant="teal">✓ Pago{methodLabel ? ` (${methodLabel})` : ''}</Badge>}
          {patient.clinical?.saved_by_doctor && <Badge variant="brand">✓ Prontuário do médico</Badge>}
        </div>
        <Link
          href={href}
          className={cn(
            'w-full rounded-[4px] px-5 py-2.5 text-center text-sm font-bold sm:w-auto',
            accent === 'admin' ? 'bg-admin-500 text-white' : 'bg-teal-500 text-primary-on'
          )}
        >
          Visualizar
        </Link>
      </div>
    </div>
  )
}
