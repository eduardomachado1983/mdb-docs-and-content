'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { useOrders } from '@/lib/mock-auth'
import { getStatusMeta } from '@/lib/order-status'
import { formatBRL } from '@/lib/utils'

export default function AdminPedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { orders, updateOrder } = useOrders()
  const order = orders.find((o) => o.id === id)

  if (!order) return notFound()

  const validatePrescription = () => {
    updateOrder(order.id, { prescription: { ...order.prescription, validated: true } }, 'Receita validada')
    toast.success('Receita validada!')
  }
  const validateReport = () => {
    updateOrder(order.id, { medicalReport: { ...order.medicalReport, validated: true } }, 'Laudo validado')
    toast.success('Laudo validado!')
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 overflow-auto p-[18px]">
        <Link href="/admin/pedidos" className="mb-3 inline-block text-[12px] font-bold text-navy-300 hover:text-admin-600">← Gestão de Pedidos</Link>
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-black text-navy-800">Pedido {order.orderNumber}</h2>
            <OrderStatusPill status={order.status} />
          </div>

          <div className="mb-4 mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-page p-2.5">
              <p className="mb-1 text-[10px] font-bold uppercase text-navy-100">Cliente</p>
              <p className="text-[12px] font-extrabold">{order.customerName}</p>
              <p className="text-[11px] text-navy-300">{order.customerEmail}</p>
              <p className="mt-0.5 text-[11px] text-navy-300">{order.shippingAddress}</p>
            </div>
            <div className="rounded-lg bg-surface-page p-2.5">
              <p className="mb-1 text-[10px] font-bold uppercase text-navy-100">Pagamento</p>
              <p className="text-[12px] font-extrabold">⚡ {order.paymentMethod}</p>
              <p className="mt-0.5 text-lg font-black text-brand-600">{formatBRL(order.totalCents)}</p>
            </div>
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase text-navy-100">Itens</p>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between border-b border-line-100 py-1.5 text-[12px]">
              <span>💊 {it.productName} × {it.qty}</span>
              <span className="font-bold text-brand-600">{formatBRL(it.unitPriceCents * it.qty)}</span>
            </div>
          ))}

          <p className="mb-2 mt-4 text-[10px] font-bold uppercase text-navy-100">Documentos</p>
          {order.prescription.uploaded ? (
            <div className="mb-1.5 flex items-center justify-between rounded-lg border border-line-200 px-2.5 py-2">
              <span className="text-[12px]">📝 {order.prescription.filename}</span>
              {order.prescription.validated ? (
                <span className="rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-bold text-success-600">✅ Validada</span>
              ) : (
                <Button variant="success" size="sm" onClick={validatePrescription}>✅ Validar</Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border-l-[3px] border-amber-500 bg-amber-50 px-2.5 py-2 text-[12px] text-amber-600">⚠️ Receita não enviada</div>
          )}
          {order.medicalReport.uploaded && (
            <div className="mt-1.5 flex items-center justify-between rounded-lg border border-line-200 px-2.5 py-2">
              <span className="text-[12px]">📄 {order.medicalReport.filename}</span>
              {order.medicalReport.validated ? (
                <span className="rounded-full bg-admin-50 px-2.5 py-1 text-[11px] font-bold text-admin-600">✅ Validado</span>
              ) : (
                <Button variant="success" size="sm" onClick={validateReport}>✅ Validar</Button>
              )}
            </div>
          )}

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
                <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: meta.bg }}>
                  {meta.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: meta.color }}>{meta.label}</p>
                  <p className="text-[11px] text-navy-300">{event.note} · {event.date}</p>
                </div>
              </div>
            )
          })}
        </Card>
      </main>
    </div>
  )
}
