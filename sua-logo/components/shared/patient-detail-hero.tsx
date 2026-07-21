import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PATIENT_STATUS_LABEL, PATIENT_STATUS_VARIANT } from '@/lib/patient-status'
import { initials, patientCode } from '@/lib/utils'
import type { Patient } from '@/types'

export function PatientDetailHero({
  patient,
  docsComplete,
}: {
  patient: Patient
  docsComplete: boolean
}) {
  const patientName = patient.personal_data?.full_name || 'Paciente'
  const hasProntuario = Boolean(patient.clinical?.saved_by_doctor)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-navy-900">
            {initials(patientName)}
          </div>
          <div>
            <div className="text-xl font-extrabold text-navy-900">{patientName}</div>
            <div className="text-[13px] text-navy-200">{patientCode(patient.id)}</div>
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

        <div className="sm:w-[200px]">
          <div className="mb-1 text-xs font-semibold text-navy-200">Status</div>
          <Badge variant={PATIENT_STATUS_VARIANT[patient.status]}>{PATIENT_STATUS_LABEL[patient.status]}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
