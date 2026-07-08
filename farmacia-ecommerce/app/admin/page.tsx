'use client'

import Link from 'next/link'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { OrderStatusPill } from '@/components/shared/order-status-pill'
import { useOrders } from '@/lib/mock-auth'
import { PRODUCTS } from '@/lib/mock-data'
import { formatBRL } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { orders } = useOrders()
  const emAnalise = orders.filter((o) => o.status === 'em_analise').length
  const aguardandoDocs = orders.filter((o) => o.status === 'aguardando_docs')
  const entregues = orders.filter((o) => o.status === 'entregue').length
  const faturamento = orders.reduce((sum, o) => sum + o.totalCents, 0)
  const lowStock = PRODUCTS.filter((p) => p.stock < 45)

  const cards = [
    { label: 'Total Pedidos', value: String(orders.length), color: '#1b3f6e', icon: '📦' },
    { label: 'Em Análise', value: String(emAnalise), color: '#f39c12', icon: '🔍' },
    { label: 'Entregues', value: String(entregues), color: '#27ae60', icon: '🏠' },
    { label: 'Faturamento', value: formatBRL(faturamento), color: '#7c3aed', icon: '💰' },
  ]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-0.5 text-lg font-black text-navy-800">📊 Dashboard</h2>
        <p className="mb-4 text-[12px] capitalize text-navy-300">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2.5">
          {cards.map((c) => (
            <Card key={c.label} className="p-3.5" style={{ borderLeft: `3px solid ${c.color}` }}>
              <div className="mb-1.5 text-xl">{c.icon}</div>
              <div className="mb-0.5 text-xl font-black" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[12px] font-semibold text-navy-500">{c.label}</div>
            </Card>
          ))}
        </div>

        <Card className="mb-3.5 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-line-100 px-4 py-3">
            <h3 className="text-[13px] font-extrabold text-navy-800">⚡ Pedidos Recentes</h3>
            <Link href="/admin/pedidos" className="text-[11px] font-bold text-brand-500">Ver todos →</Link>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-page">
                {['Pedido', 'Cliente', 'Total', 'Status', 'Data'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-navy-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-line-100">
                  <td className="px-3 py-2.5 text-[11px] font-extrabold text-brand-600">{o.orderNumber}</td>
                  <td className="px-3 py-2.5 text-[11px]">{o.customerName}</td>
                  <td className="px-3 py-2.5 text-[11px] font-bold">{formatBRL(o.totalCents)}</td>
                  <td className="px-3 py-2.5"><OrderStatusPill status={o.status} short /></td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[10px] text-navy-100">{o.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border border-amber-500 p-3.5">
            <h4 className="mb-2.5 text-[12px] font-extrabold text-amber-600">⚠️ Docs Pendentes ({aguardandoDocs.length})</h4>
            {aguardandoDocs.map((o) => (
              <div key={o.id} className="flex justify-between border-b border-line-100 py-1 text-[11px]">
                <span className="font-bold text-brand-600">{o.orderNumber}</span>
                <span className="text-navy-300">{o.customerName}</span>
              </div>
            ))}
            <Link href="/admin/pedidos" className="mt-2.5 block rounded-lg border border-amber-500 bg-amber-50 py-1.5 text-center text-[11px] font-bold text-amber-600">
              Gerenciar →
            </Link>
          </Card>
          <Card className="p-3.5">
            <h4 className="mb-2.5 text-[12px] font-extrabold text-error-500">📦 Estoque Baixo</h4>
            {lowStock.map((p) => (
              <div key={p.id} className="flex justify-between border-b border-line-100 py-1 text-[11px]">
                <span>{p.name}</span>
                <span className={p.stock < 30 ? 'font-bold text-error-500' : 'font-bold text-amber-600'}>{p.stock} un</span>
              </div>
            ))}
          </Card>
        </div>
      </main>
    </div>
  )
}
