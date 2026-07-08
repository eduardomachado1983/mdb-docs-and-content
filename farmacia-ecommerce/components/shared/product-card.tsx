import { Button } from '@/components/ui/button'
import { ControlledClassTag } from '@/components/shared/order-status-pill'
import { formatBRL } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product, onAdd, compact }: { product: Product; onAdd: () => void; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line-200 bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(20,50,90,.1)]">
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 py-6 text-center text-4xl">💊</div>
      <div className={compact ? 'p-3' : 'p-4'}>
        <div className="mb-0.5 text-[13px] font-extrabold text-navy-800">{product.name}</div>
        <div className="mb-2 text-[11px] text-navy-300">{product.activeIngredient}</div>
        <div className="mb-2.5 flex flex-wrap gap-1">
          <ControlledClassTag controlledClass={product.controlledClass} />
          {product.requiresPrescription && (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600">📝 Receita</span>
          )}
          {product.requiresReport && (
            <span className="inline-flex items-center rounded-full bg-admin-50 px-2 py-1 text-[11px] font-bold text-admin-600">📄 Laudo</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-black text-brand-600">{formatBRL(product.priceCents)}</span>
          <Button size="sm" onClick={onAdd}>+ Carrinho</Button>
        </div>
      </div>
    </div>
  )
}
