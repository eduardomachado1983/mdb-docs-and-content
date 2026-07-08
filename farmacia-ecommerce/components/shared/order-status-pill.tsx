import { getStatusMeta } from '@/lib/order-status'
import type { OrderStatus } from '@/types'

export function OrderStatusPill({ status, short }: { status: OrderStatus; short?: boolean }) {
  const meta = getStatusMeta(status)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold whitespace-nowrap"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span>{meta.icon}</span>
      {short ? meta.shortLabel : meta.label}
    </span>
  )
}

export function ControlledClassTag({ controlledClass }: { controlledClass: 'V' | 'A' | 'L' }) {
  if (controlledClass === 'V') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error-50 px-2.5 py-1 text-[11px] font-bold text-error-500">
        ⛔ Tarja Vermelha
      </span>
    )
  }
  if (controlledClass === 'A') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600">
        ⚠️ Tarja Amarela
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-bold text-success-600">
      ✅ Venda Livre
    </span>
  )
}
