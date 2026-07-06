import { cn } from '@/lib/utils'

interface WizardStep {
  title: string
}

const STATUS_LABEL = { done: 'Concluído', current: 'Em andamento', pending: 'Pendente' } as const

export function WizardStepper({ steps, current }: { steps: WizardStep[]; current: number }) {
  return (
    <div className="rounded-2xl border border-line-200 bg-white p-6 shadow-[0_10px_30px_rgba(20,50,90,.06)]">
      <div className="flex items-center">
        {steps.map((_, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'pending'
          return (
            <div key={n} className="flex flex-1 items-center last:flex-none">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold',
                  state === 'done' && 'bg-teal-500 text-white',
                  state === 'current' && 'border-2 border-brand-500 bg-white text-brand-500',
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
      <div className="mt-3 grid gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'pending'
          return (
            <div key={step.title}>
              <div className="mb-0.5 text-[10.5px] font-bold tracking-wide text-navy-100">STEP {n}</div>
              <div className={cn('mb-1.5 text-sm font-bold', state === 'pending' ? 'text-navy-200' : 'text-navy-800')}>
                {step.title}
              </div>
              <span
                className={cn(
                  'inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                  state === 'done' && 'bg-teal-100 text-teal-600',
                  state === 'current' && 'bg-brand-100 text-brand-500',
                  state === 'pending' && 'border border-line-300 text-navy-100'
                )}
              >
                {STATUS_LABEL[state]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
