'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { useOrders } from '@/lib/mock-auth'
import { ORDER_STATUSES, getNextStatus, getStatusMeta } from '@/lib/order-status'
import { formatBRL } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export default function AdminPedidosPage() {
  const { orders, updateOrder } = useOrders()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const list = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const approve = (id: string) => {
    updateOrder(id, { status: 'aprovado' }, 'Aprovado pelo farmacêutico', 'aprovado')
    toast.success('Pedido aprovado!')
  }
  const reject = (id: string) => {
    updateOrder(id, { status: 'recusado' }, 'Recusado pela farmácia', 'recusado')
    toast.warning('Pedido recusado')
  }
  const advance = (id: string, status: OrderStatus) => {
    const nextStatus = getNextStatus(status)
    if (!nextStatus) return
    updateOrder(id, { status: nextStatus }, `Avançado: ${getStatusMeta(nextStatus).label}`, nextStatus)
    toast.success(`Avançado: ${getStatusMeta(nextStatus).label}`)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-0.5 text-lg font-black text-navy-800">📦 Gestão de Pedidos</h2>
        <p className="mb-3.5 text-[12px] text-navy-300">
          {orders.length} pedidos · {orders.filter((o) => o.status === 'em_analise').length} em análise
        </p>
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          <FilterChip active={filter === 'all'} label="Todos" icon="📋" count={orders.length} onClick={() => setFilter('all')} />
          {ORDER_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s.key).length
            if (!count) return null
            return <FilterChip key={s.key} active={filter === s.key} label={s.label} icon={s.icon} count={count} color={s.color} onClick={() => setFilter(s.key)} />
          })}
        </div>
        {list.map((o) => {
          const nextStatus = getNextStatus(o.status)
          return (
            <Card key={o.id} className="mb-2.5 p-3.5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[12px] font-black text-brand-600">{o.orderNumber}</span>
                    <OrderStatusPill status={o.status} />
                    {o.prescription.uploaded ? (
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold ${o.prescription.validated ? 'bg-success-50 text-success-600' : 'bg-amber-50 text-amber-600'}`}>
                        {o.prescription.validated ? '✅' : '⏳'} Receita
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-error-50 px-2 py-1 text-[11px] font-bold text-error-500">❌ Sem Receita</span>
                    )}
                  </div>
                  <p className="mb-0.5 text-[12px] font-bold text-navy-800">👤 {o.customerName}</p>
                  <p className="mb-0.5 text-[11px] text-navy-300">{o.items.map((i) => `💊 ${i.productName} × ${i.qty}`).join(' | ')}</p>
                  <p className="text-[10px] text-navy-100">📅 {o.createdAt} · ⚡ {o.paymentMethod} · {o.shippingAddress}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2 text-[14px] font-black text-brand-600">{formatBRL(o.totalCents)}</div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {o.status === 'em_analise' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => approve(o.id)}>✅ Aprovar</Button>
                        <Button variant="destructive" size="sm" onClick={() => reject(o.id)}>❌ Recusar</Button>
                      </>
                    )}
                    {nextStatus && o.status !== 'em_analise' && (
                      <Button variant="success" size="sm" onClick={() => advance(o.id, o.status)}>➡ Avançar</Button>
                    )}
                    <Link href={`/admin/pedidos/${o.id}`}><Button variant="outline" size="sm">Detalhes</Button></Link>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </main>
    </div>
  )
}

function FilterChip({ active, label, icon, count, color, onClick }: { active: boolean; label: string; icon: string; count: number; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap"
      style={active ? { borderColor: color ?? '#1b3f6e', background: color ?? '#1b3f6e', color: '#fff' } : { borderColor: '#cddcec', background: '#fff', color: '#6a7c93' }}
    >
      {icon} {label} {count > 0 && `(${count})`}
    </button>
  )
}
