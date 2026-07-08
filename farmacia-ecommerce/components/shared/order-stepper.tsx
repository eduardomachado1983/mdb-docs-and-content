import { ORDER_STATUS_FLOW, type OrderStatus } from '@/types'
import { getStatusMeta } from '@/lib/order-status'

export function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)

  if (status === 'recusado') {
    return (
      <div className="rounded-lg bg-error-50 px-3 py-2 text-[12px] font-bold text-error-500">
        ❌ Pedido recusado — documentos não aprovados
      </div>
    )
  }

  return (
    <div className="flex">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const meta = getStatusMeta(step)
        const done = i <= currentIndex
        return (
          <div key={step} className="relative flex-1 text-center">
            {i < ORDER_STATUS_FLOW.length - 1 && (
              <div
                className="absolute left-1/2 top-2 h-0.5 w-full"
                style={{ background: done && i < currentIndex ? meta.color : '#E2E8F0' }}
              />
            )}
            <div
              className="relative z-10 mx-auto mb-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white"
              style={{ background: done ? meta.color : '#E2E8F0' }}
            >
              {done && i < currentIndex ? '✓' : ''}
            </div>
            <div className="text-[8px] font-bold leading-tight" style={{ color: done ? meta.color : '#94A3B8' }}>
              {meta.shortLabel}
            </div>
          </div>
        )
      })}
    </div>
  )
}
