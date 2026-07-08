'use client'

import { toast } from 'sonner'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ControlledClassTag } from '@/components/shared/order-status-pill'
import { PRODUCTS } from '@/lib/mock-data'
import { formatBRL } from '@/lib/utils'

export default function AdminProdutosPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <h2 className="mb-0.5 text-lg font-black text-navy-800">💊 Catálogo</h2>
            <p className="text-[12px] text-navy-300">{PRODUCTS.length} produtos cadastrados</p>
          </div>
          <Button onClick={() => toast.info('Abrindo editor de produto...')}>+ Novo Produto</Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {PRODUCTS.map((p) => (
            <Card key={p.id} className="p-3.5">
              <div className="mb-2.5 flex items-start gap-2.5">
                <div className="text-3xl">💊</div>
                <div className="flex-1">
                  <div className="text-[12px] font-extrabold">{p.name}</div>
                  <div className="text-[10px] text-navy-300">{p.activeIngredient}</div>
                </div>
              </div>
              <div className="mb-2.5 flex flex-wrap gap-1">
                <ControlledClassTag controlledClass={p.controlledClass} />
                {p.requiresPrescription && <span className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600">📝</span>}
                {p.requiresReport && <span className="rounded-full bg-admin-50 px-2 py-1 text-[11px] font-bold text-admin-600">📄</span>}
              </div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[14px] font-black text-brand-600">{formatBRL(p.priceCents)}</span>
                <span
                  className="rounded-full px-2 py-1 text-[11px] font-bold"
                  style={p.stock < 30 ? { background: '#fef2f2', color: '#991b1b' } : p.stock < 60 ? { background: '#fef6e7', color: '#92400e' } : { background: '#eafaf1', color: '#166534' }}
                >
                  {p.stock} un
                </span>
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => toast.info(`Editando ${p.name}`)}>✏️ Editar</Button>
                <Button variant="outline" size="sm" onClick={() => toast.success(`+10 unidades em ${p.name}`)}>+10</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
