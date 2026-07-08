'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { useOrders } from '@/lib/mock-auth'
import { MOCK_CUSTOMERS } from '@/lib/mock-data'
import { formatBRL, initials } from '@/lib/utils'

export default function AdminClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { orders } = useOrders()
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id)

  if (!customer) return notFound()

  const customerOrders = orders.filter((o) => o.userId === customer.id)
  const total = customerOrders.reduce((sum, o) => sum + o.totalCents, 0)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="mx-auto w-full max-w-[560px] flex-1 overflow-auto p-[18px]">
        <Link href="/admin/clientes" className="mb-3 inline-block text-[12px] font-bold text-navy-300 hover:text-admin-600">← Clientes</Link>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-black text-white">{initials(customer.name)}</div>
            <div>
              <h3 className="text-[15px] font-black text-navy-800">{customer.name}</h3>
              <p className="text-[11px] text-navy-100">{customer.email}</p>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2.5">
            {[
              ['CPF', customer.cpf ?? '—'],
              ['Telefone', customer.phone ?? '—'],
              ['Total de Pedidos', String(customerOrders.length)],
              ['Gasto Total', formatBRL(total)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-surface-page p-2.5">
                <p className="mb-0.5 text-[9px] font-bold uppercase text-navy-100">{label}</p>
                <p className="text-[12px] font-extrabold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mb-4 rounded-lg bg-surface-page p-2.5">
            <p className="mb-0.5 text-[9px] font-bold uppercase text-navy-100">Endereço</p>
            <p className="text-[12px]">{customer.address ? `${customer.address.street} — ${customer.address.city}, ${customer.address.state}` : 'Não informado'}</p>
          </div>
          {customerOrders.length > 0 && (
            <>
              <p className="mb-2 text-[10px] font-bold uppercase text-navy-100">Histórico de Pedidos</p>
              {customerOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-line-100 py-1.5 text-[11px]">
                  <span className="font-bold text-brand-600">{o.orderNumber}</span>
                  <OrderStatusPill status={o.status} short />
                  <span className="font-bold">{formatBRL(o.totalCents)}</span>
                </div>
              ))}
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
