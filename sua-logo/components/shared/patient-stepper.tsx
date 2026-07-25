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

  return (
    <div className="flex min-w-0 items-start justify-between gap-1 sm:gap-2">
      {STEP_LABELS.map((label, i) => {
        const done = i < current || status === 'concluido'
        const active = i === current && status !== 'concluido'
        return (
          <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:gap-2 text-center">
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-primary-on sm:h-[38px] sm:w-[38px] sm:text-[15px]',
                done && 'bg-teal-500',
                active && 'bg-brand-500 ring-4 ring-brand-100',
                !done && !active && 'bg-line-300 text-navy-100'
              )}
            >
              {done ? '✓' : i + 1}
            </div>
            <div className={cn('w-full min-w-0 break-words text-[10px] font-bold leading-tight sm:max-w-[90px] sm:text-[11.5px]', active || done ? 'text-navy-700' : 'text-navy-100')}>
              {label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
