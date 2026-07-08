'use client'

import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { ORDER_STATUSES } from '@/lib/order-status'
import { useOrders } from '@/lib/mock-auth'
import { formatBRL } from '@/lib/utils'

const HISTORICAL_MONTHS = [
  { month: 'Jan', orders: 34, revenueCents: 420000 },
  { month: 'Fev', orders: 41, revenueCents: 580000 },
  { month: 'Mar', orders: 38, revenueCents: 510000 },
  { month: 'Abr', orders: 55, revenueCents: 790000 },
  { month: 'Mai', orders: 62, revenueCents: 920000 },
]

const TOP_PRODUCTS = [
  { name: 'Venvanse 50mg', sales: 42, revenueCents: 882000 },
  { name: 'Ritalina LA 20mg', sales: 38, revenueCents: 341600 },
  { name: 'Rivotril 2mg', sales: 31, revenueCents: 131700 },
  { name: 'Zolpidem 10mg', sales: 28, revenueCents: 154000 },
]

export default function AdminRelatoriosPage() {
  const { orders } = useOrders()
  const currentMonth = { month: 'Jun', orders: orders.length, revenueCents: orders.reduce((sum, o) => sum + o.totalCents, 0) }
  const months = [...HISTORICAL_MONTHS, currentMonth]
  const maxOrders = Math.max(...months.map((m) => m.orders))
  const maxRevenue = Math.max(...months.map((m) => m.revenueCents))
  const totalRevenue = months.reduce((sum, m) => sum + m.revenueCents, 0)
  const totalOrders = months.reduce((sum, m) => sum + m.orders, 0)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-0.5 text-lg font-black text-navy-800">📈 Relatórios</h2>
        <p className="mb-3.5 text-[12px] text-navy-300">Performance dos últimos 6 meses</p>

        <div className="mb-3.5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
          {[
            { label: 'Total Pedidos', value: String(totalOrders), color: '#1b3f6e' },
            { label: 'Faturamento', value: formatBRL(totalRevenue), color: '#166534' },
            { label: 'Ticket Médio', value: formatBRL(Math.round(totalRevenue / totalOrders)), color: '#6d28d9' },
            { label: 'Melhor Mês', value: 'Mai/25', color: '#92400e' },
          ].map((k) => (
            <Card key={k.label} className="p-2.5" style={{ borderTop: `3px solid ${k.color}` }}>
              <p className="mb-1 text-[10px] font-bold uppercase text-navy-100">{k.label}</p>
              <p className="text-base font-black" style={{ color: k.color }}>{k.value}</p>
            </Card>
          ))}
        </div>

        <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
          <Card className="p-3.5">
            <h3 className="mb-3.5 text-[12px] font-extrabold">📦 Pedidos por Mês</h3>
            <div className="flex h-[100px] items-end gap-1.5">
              {months.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-0.5">
                  <span className="text-[9px] font-black text-brand-600">{m.orders}</span>
                  <div className="w-full rounded-t bg-brand-500" style={{ height: `${(m.orders / maxOrders) * 80}px`, minHeight: 3 }} />
                  <span className="text-[8px] font-bold text-navy-100">{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-3.5">
            <h3 className="mb-3.5 text-[12px] font-extrabold">💰 Faturamento</h3>
            <div className="flex h-[100px] items-end gap-1.5">
              {months.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-0.5">
                  <span className="text-[8px] font-black text-success-600">R${Math.round(m.revenueCents / 100000)}k</span>
                  <div className="w-full rounded-t bg-success-500" style={{ height: `${(m.revenueCents / maxRevenue) * 80}px`, minHeight: 3 }} />
                  <span className="text-[8px] font-bold text-navy-100">{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Card className="p-3.5">
            <h3 className="mb-3 text-[12px] font-extrabold">📊 Status dos Pedidos</h3>
            {ORDER_STATUSES.map((s) => {
              const count = orders.filter((o) => o.status === s.key).length
              if (!count) return null
              const pct = Math.round((count / orders.length) * 100)
              return (
                <div key={s.key} className="mb-2">
                  <div className="mb-0.5 flex justify-between">
                    <span className="text-[11px] font-semibold">{s.icon} {s.shortLabel}</span>
                    <span className="text-[11px] font-black" style={{ color: s.color }}>{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-page">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              )
            })}
          </Card>
          <Card className="p-3.5">
            <h3 className="mb-3 text-[12px] font-extrabold">💊 Top Produtos</h3>
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2.5 border-b border-line-100 py-1.5">
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-brand-500 text-[10px] font-black text-white">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold">{p.name}</p>
                  <p className="text-[9px] text-navy-100">{p.sales} vendas</p>
                </div>
                <span className="text-[11px] font-black text-success-600">{formatBRL(p.revenueCents)}</span>
              </div>
            ))}
          </Card>
        </div>
      </main>
    </div>
  )
}
