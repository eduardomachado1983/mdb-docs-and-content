'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/shared/app-header'
import { ProductCard } from '@/components/shared/product-card'
import { Input } from '@/components/ui/input'
import { useAuth, useCart } from '@/lib/mock-auth'
import { PRODUCTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function LojaPage() {
  const { user } = useAuth()
  const { add } = useCart()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const categories = ['all', ...new Set(PRODUCTS.map((p) => p.category))]

  const list = PRODUCTS.filter(
    (p) =>
      (p.name + p.activeIngredient).toLowerCase().includes(search.toLowerCase()) &&
      (category === 'all' || p.category === category)
  )

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AppHeader />
      <main className="flex-1 overflow-auto p-[18px]">
        <h2 className="mb-0.5 text-lg font-black text-navy-800">🏪 Loja</h2>
        <p className="mb-3.5 text-[12px] text-navy-300">
          Olá, {user?.name.split(' ')[0]}! Escolha os medicamentos conforme sua receita.
        </p>
        <Input placeholder="Buscar por nome ou princípio ativo..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="my-3.5 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[10px] font-bold',
                category === c ? 'border-brand-500 bg-brand-500 text-white' : 'border-line-400 bg-white text-navy-300'
              )}
            >
              {c === 'all' ? 'Todos' : c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} compact onAdd={() => { add(p); toast.success('Adicionado ao carrinho!') }} />
          ))}
        </div>
      </main>
    </div>
  )
}
