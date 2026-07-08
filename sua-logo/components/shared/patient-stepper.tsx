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
    <div className="flex items-start justify-between gap-2">
      {STEP_LABELS.map((label, i) => {
        const done = i < current || status === 'concluido'
        const active = i === current && status !== 'concluido'
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
            <div
              className={cn(
                'flex h-[38px] w-[38px] items-center justify-center rounded-full text-[15px] font-extrabold text-primary-on',
                done && 'bg-teal-500',
                active && 'bg-brand-500 ring-4 ring-brand-100',
                !done && !active && 'bg-line-300 text-navy-100'
              )}
            >
              {done ? '✓' : i + 1}
            </div>
            <div className={cn('max-w-[90px] text-[11.5px] font-bold leading-tight', active || done ? 'text-navy-700' : 'text-navy-100')}>
              {label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
