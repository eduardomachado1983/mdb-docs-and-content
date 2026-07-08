'use client'

import Link from 'next/link'
import { AppHeader } from '@/components/shared/app-header'
import { Card } from '@/components/ui/card'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { OrderStepper } from '@/components/shared/order-stepper'
import { useAuth, useOrders } from '@/lib/mock-auth'
import { formatBRL } from '@/lib/utils'

export default function MeusPedidosPage() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const myOrders = orders.filter((o) => o.userId === user?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AppHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-3.5 text-lg font-black text-navy-800">📦 Meus Pedidos</h2>
        {myOrders.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-bold text-navy-100">Nenhum pedido ainda</p>
          </Card>
        ) : (
          myOrders.map((order) => (
            <Card key={order.id} className="mb-2.5 p-3.5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-black text-brand-600">{order.orderNumber}</span>
                    <OrderStatusPill status={order.status} />
                    {order.trackingCode && (
                      <span className="inline-flex items-center rounded-full bg-admin-50 px-2.5 py-1 text-[11px] font-bold text-admin-600">🚚 {order.trackingCode}</span>
                    )}
                  </div>
                  <div className="mb-0.5 text-[11px] text-navy-300">{order.items.map((i) => `💊 ${i.productName} × ${i.qty}`).join(' | ')}</div>
                  <div className="text-[10px] text-navy-100">📅 {order.createdAt}</div>
                </div>
                <div className="text-right">
                  <div className="mb-1.5 text-[14px] font-black text-brand-600">{formatBRL(order.totalCents)}</div>
                  <Link href={`/pedidos/${order.id}`} className="text-[12px] font-bold text-navy-500 hover:text-brand-600">Detalhes →</Link>
                </div>
              </div>
              <div className="mt-3 border-t border-line-100 pt-3">
                <OrderStepper status={order.status} />
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  )
}
