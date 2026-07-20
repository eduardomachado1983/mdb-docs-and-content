import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PATIENT_STATUS_LABEL, PATIENT_STATUS_VARIANT } from '@/lib/patient-status'
import { initials, patientCode } from '@/lib/utils'
import type { Patient } from '@/types'

export function AdminPatientCard({
  patient,
  docsComplete,
  identifier,
  actionLabel,
  href,
}: {
  patient: Patient
  docsComplete: boolean
  identifier: 'cpf' | 'code'
  actionLabel: string
  href: string
}) {
  const name = patient.personal_data?.full_name || 'Paciente'
  const subtitle = identifier === 'cpf' ? `CPF: ${patient.personal_data?.cpf || '—'}` : patientCode(patient.id)
  const hasProntuario = Boolean(patient.clinical?.saved_by_doctor)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-navy-900">
          {initials(name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-navy-800">{name}</div>
          <div className="truncate text-[13px] text-navy-200">{subtitle}</div>
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold text-navy-200">Processos</div>
        <div className="flex flex-wrap items-center gap-2">
          {docsComplete && <Badge variant="teal">✓ Docs enviados</Badge>}
          {hasProntuario && <Badge variant="teal">✓ Prontuário do médico</Badge>}
          {!docsComplete && !hasProntuario && <span className="text-sm text-navy-200">—</span>}
        </div>
      </div>

      <div className="sm:w-[160px]">
        <div className="mb-1 text-xs font-semibold text-navy-200">Status</div>
        <Badge variant={PATIENT_STATUS_VARIANT[patient.status]}>{PATIENT_STATUS_LABEL[patient.status]}</Badge>
      </div>

      <Link
        href={href}
        className="rounded-[8px] border border-teal-500 bg-white px-6 py-2.5 text-center text-sm font-bold text-teal-600 transition hover:bg-teal-50 active:scale-[0.98]"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
