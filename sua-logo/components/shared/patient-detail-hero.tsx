import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { VideoCallButton } from '@/components/shared/video-call-button'
import { initials, patientCode } from '@/lib/utils'
import { STATUS_LABELS } from '@/types'
import type { Patient } from '@/types'

export function PatientDetailHero({
  patient,
  docsComplete,
}: {
  patient: Patient
  docsComplete: boolean
}) {
  const patientName = patient.personal_data?.full_name || 'Paciente'
  const paid = Boolean(patient.payment?.confirmed)

  return (
    <Card>
      <CardContent className="flex flex-wrap items-start justify-between gap-5 p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-navy-900">
            {initials(patientName)}
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-wide text-navy-200">DETALHES DO PACIENTE</div>
            <h1 className="text-xl font-extrabold text-navy-900">{patientName}</h1>
            <div className="text-[13px] text-navy-200">{patientCode(patient.id)}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="amber">{STATUS_LABELS[patient.status]}</Badge>
          {paid && <Badge variant="teal">✓ Pago</Badge>}
          {docsComplete && <Badge variant="teal">✓ Docs enviados</Badge>}
        </div>
        <div className="w-full border-t border-line-100 pt-5">
          <VideoCallButton patientId={patient.id} />
        </div>
      </CardContent>
    </Card>
  )
}
