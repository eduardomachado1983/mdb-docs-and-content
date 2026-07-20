import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface WizardStep {
  title: string
}

const STATUS_LABEL = { done: 'Concluído', current: 'Em andamento', pending: 'Pendente' } as const

export function WizardStepper({ steps, current }: { steps: WizardStep[]; current: number }) {
  return (
    <div className="mx-auto max-w-[540px]">
      {/* Desktop: a linha de conexão fica fora da coluna de cada etapa, para
          que título e tag de status fiquem centralizados exatamente abaixo
          do número (e não do número + linha juntos). */}
      <div className="hidden sm:flex sm:items-start">
        {steps.map((step, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'pending'
          return (
            <Fragment key={step.title}>
              <div className="flex w-[112px] shrink-0 flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold',
                    state === 'done' && 'bg-teal-500 text-primary-on',
                    state === 'current' && 'bg-navy-900 text-white',
                    state === 'pending' && 'border border-dashed border-line-300 bg-white text-navy-100'
                  )}
                >
                  {state === 'done' ? '✓' : n}
                </div>
                <div className={cn('mt-2 text-center text-sm font-bold', state === 'pending' ? 'text-navy-200' : 'text-navy-800')}>
                  {step.title}
                </div>
                <span
                  className={cn(
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                    state === 'done' && 'bg-teal-100 text-teal-600',
                    state === 'current' && 'bg-brand-100 text-brand-700',
                    state === 'pending' && 'border border-line-300 text-navy-100'
                  )}
                >
                  {STATUS_LABEL[state]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('mt-[19px] h-[2px] flex-1', state === 'done' ? 'bg-teal-500' : 'bg-line-200')} />
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Mobile: só os círculos lado a lado; os 4 títulos não cabem juntos,
          então mostra apenas o título da etapa atual, centralizado. */}
      <div className="flex items-center sm:hidden">
        {steps.map((_, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'pending'
          return (
            <div key={n} className="flex flex-1 items-center last:flex-none">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold',
                  state === 'done' && 'bg-teal-500 text-primary-on',
                  state === 'current' && 'bg-navy-900 text-white',
                  state === 'pending' && 'border border-dashed border-line-300 bg-white text-navy-100'
                )}
              >
                {state === 'done' ? '✓' : n}
              </div>
              {i < steps.length - 1 && (
                <div className={cn('mx-2 h-[2px] flex-1', state === 'done' ? 'bg-teal-500' : 'bg-line-200')} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 text-center text-sm font-bold text-navy-800 sm:hidden">
        {steps[current - 1]?.title}
      </div>
    </div>
  )
}
