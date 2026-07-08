'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppHeader } from '@/components/shared/app-header'
import { Card } from '@/components/ui/card'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { getStatusMeta } from '@/lib/order-status'
import { useOrders } from '@/lib/mock-auth'
import { formatBRL } from '@/lib/utils'

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { orders } = useOrders()
  const order = orders.find((o) => o.id === id)

  if (!order) return notFound()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AppHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 overflow-auto p-[18px]">
        <Link href="/pedidos" className="mb-3 inline-block text-[12px] font-bold text-navy-300 hover:text-brand-600">← Meus Pedidos</Link>
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-black text-navy-800">Pedido {order.orderNumber}</h2>
            <OrderStatusPill status={order.status} />
          </div>
          <p className="mb-4 text-[11px] text-navy-100">📅 {order.createdAt} · ⚡ {order.paymentMethod}</p>

          <p className="mb-2 text-[10px] font-bold uppercase text-navy-100">Itens</p>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between border-b border-line-100 py-1.5 text-[12px]">
              <span>💊 {it.productName} × {it.qty}</span>
              <span className="font-bold text-brand-600">{formatBRL(it.unitPriceCents * it.qty)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-line-200 pt-2.5 text-[14px] font-black">
            <span>Total</span>
            <span className="text-brand-600">{formatBRL(order.totalCents)}</span>
          </div>

          <p className="mb-2 mt-4 text-[10px] font-bold uppercase text-navy-100">Endereço de entrega</p>
          <p className="text-[12px] text-navy-800">{order.shippingAddress}</p>

          {order.trackingCode && (
            <div className="mt-3 rounded-lg border-l-[3px] border-success-500 bg-success-50 px-3 py-2 text-[12px] text-success-600">
              🚚 Rastreio: <strong>{order.trackingCode}</strong>
            </div>
          )}

          <p className="mb-2.5 mt-4 text-[10px] font-bold uppercase text-navy-100">Histórico</p>
          {order.history.map((event, i) => {
            const meta = getStatusMeta(event.status)
            return (
              <div key={i} className="mb-2.5 flex gap-2.5">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: meta.bg }}>
                  {meta.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: meta.color }}>{meta.label}</p>
                  <p className="text-[11px] text-navy-300">{event.note}</p>
                  <p className="text-[10px] text-navy-100">{event.date}</p>
                </div>
              </div>
            )
          })}
        </Card>
      </main>
    </div>
  )
}
