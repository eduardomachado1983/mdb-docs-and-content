import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTimeBR, initials } from '@/lib/utils'
import type { Patient } from '@/types'

export function ConsultationSummaryHero({ patient }: { patient: Patient }) {
  const patientName = patient.personal_data?.full_name || 'Paciente'

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-5 p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-bold text-brand-700">
            {initials(patientName)}
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-wide text-navy-200">CONSULTA CONCLUÍDA</div>
            <h1 className="text-xl font-extrabold text-navy-900">{patientName}</h1>
            <div className="text-[13px] text-navy-200">Concluída em {formatDateTimeBR(patient.updated_at)}</div>
          </div>
        </div>
        <Badge variant="teal">✓ Concluído</Badge>
      </CardContent>
    </Card>
  )
}
