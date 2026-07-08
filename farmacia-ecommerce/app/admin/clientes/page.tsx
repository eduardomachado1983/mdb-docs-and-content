'use client'

import Link from 'next/link'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/lib/mock-auth'
import { MOCK_CUSTOMERS } from '@/lib/mock-data'
import { formatBRL, initials } from '@/lib/utils'

export default function AdminClientesPage() {
  const { orders } = useOrders()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-0.5 text-lg font-black text-navy-800">👥 Clientes</h2>
        <p className="mb-3.5 text-[12px] text-navy-300">{MOCK_CUSTOMERS.length} clientes cadastrados</p>
        <Card className="overflow-hidden p-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-page">
                {['Cliente', 'E-mail', 'Pedidos', 'Total Gasto', 'Ação'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-navy-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((c) => {
                const customerOrders = orders.filter((o) => o.userId === c.id)
                const total = customerOrders.reduce((sum, o) => sum + o.totalCents, 0)
                return (
                  <tr key={c.id} className="border-t border-line-100">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand-500 text-[12px] font-black text-white">{initials(c.name)}</div>
                        <span className="text-[12px] font-bold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-navy-300">{c.email}</td>
                    <td className="px-3 py-2.5"><span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">{customerOrders.length}</span></td>
                    <td className="px-3 py-2.5 text-[12px] font-bold text-success-600">{formatBRL(total)}</td>
                    <td className="px-3 py-2.5"><Link href={`/admin/clientes/${c.id}`}><Button variant="outline" size="sm">Ver</Button></Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  )
}
