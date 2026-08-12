import { cn } from '@/lib/utils'
import type { PatientStatus } from '@/types'

const STEP_LABELS = ['Cadastro', 'Pagamento', 'Consulta médica', 'Validação', 'Documentos prontos']

const STATUS_INDEX: Record<PatientStatus, number> = {
  cadastro_incompleto: 0,
  aguardando_pagamento: 1,
  aguardando_medico: 2,
  retido_admin: 3,
  concluido: 4,
}

export function PatientStepper({ status }: { status: PatientStatus }) {
  const current = STATUS_INDEX[status]

  // Shortened labels for mobile
  const MOBILE_LABELS = ['Cadastro', 'Pagamento', 'Consulta', 'Validação', 'Documentos']

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-1">
      {STEP_LABELS.map((label, i) => {
        const done = i < current || status === 'concluido'
        const active = i === current && status !== 'concluido'
        const mobileLabel = MOBILE_LABELS[i]

        return (
          <div key={label} className="flex flex-1 items-center gap-2 sm:min-w-0 sm:flex-col sm:items-center sm:text-center">
            <div
              className={cn(
                'flex flex-shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-primary-on sm:text-[15px] h-7 w-7 sm:h-[38px] sm:w-[38px]',
                done && 'bg-teal-500',
                active && 'bg-brand-500 ring-4 ring-brand-100',
                !done && !active && 'bg-line-300 text-navy-100'
              )}
            >
              {done ? '✓' : i + 1}
            </div>
            <div className={cn('font-bold leading-tight text-[11px] sm:w-full sm:min-w-0 sm:break-words sm:text-[11.5px]', active || done ? 'text-navy-700' : 'text-navy-100')}>
              <span className="sm:hidden">{mobileLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
