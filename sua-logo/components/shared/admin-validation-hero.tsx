import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { initials, patientCode } from '@/lib/utils'
import { VALIDATION_STATE_LABEL, VALIDATION_STATE_VARIANT, type ValidationState } from '@/lib/validation-status'

export function AdminValidationHero({
  patientId,
  patientName,
  state,
}: {
  patientId: string
  patientName: string
  state: ValidationState
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-navy-900">
            {initials(patientName)}
          </div>
          <div>
            <div className="text-xl font-extrabold text-navy-900">{patientName}</div>
            <div className="text-[13px] text-navy-200">{patientCode(patientId)}</div>
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-navy-200">Status</div>
          <Badge variant={VALIDATION_STATE_VARIANT[state]}>{VALIDATION_STATE_LABEL[state]}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
