'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DocumentUpload } from '@/components/shared/document-upload'
import { useAuth, useCart, useOrders } from '@/lib/mock-auth'
import { formatBRL } from '@/lib/utils'
import { PRODUCTS } from '@/lib/mock-data'

const STEPS = ['Itens', 'Documentos', 'Confirmar']

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const { items, updateQty, totalCents, clear } = useCart()
  const { createOrder } = useOrders()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [prescription, setPrescription] = useState<File | null>(null)
  const [report, setReport] = useState<File | null>(null)

  const products = items.map((i) => ({ item: i, product: PRODUCTS.find((p) => p.id === i.productId) }))
  const needsPrescription = products.some(({ product }) => product?.requiresPrescription)
  const needsReport = products.some(({ product }) => product?.requiresReport)

  const confirm = () => {
    if (!user) return
    const order = createOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items,
      shippingAddress: user.address ? `${user.address.street} — ${user.address.city}, ${user.address.state}` : 'Endereço não informado',
      requiresPrescription: needsPrescription,
      requiresReport: needsReport,
    })
    toast.success(`Pedido ${order.orderNumber} criado!`)
    clear()
    onClose()
    router.push('/pedidos')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="flex h-full w-full max-w-[400px] flex-col bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-shrink-0 items-center justify-between bg-brand-500 px-4 py-3.5 text-white">
          <span className="text-sm font-extrabold">{step === 1 ? '🛒 Carrinho' : step === 2 ? '📋 Documentos' : '✅ Confirmação'}</span>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-shrink-0 border-b border-line-200 bg-surface-page">
          {STEPS.map((l, i) => (
            <div
              key={l}
              className="flex-1 border-b-2 py-1.5 text-center text-[10px] font-bold"
              style={{ color: step === i + 1 ? '#1b3f6e' : '#94A3B8', borderColor: step === i + 1 ? '#1b3f6e' : 'transparent' }}
            >
              {i + 1}. {l}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-3.5">
          {step === 1 && (
            items.length === 0 ? (
              <div className="py-10 text-center text-navy-100">
                <div className="mb-2.5 text-4xl">🛒</div>
                <p className="font-bold">Carrinho vazio</p>
              </div>
            ) : (
              <>
                {products.map(({ item, product }) => (
                  <div key={item.productId} className="mb-2 flex gap-2.5 rounded-lg border border-line-200 bg-surface-page p-2.5">
                    <div className="text-2xl">💊</div>
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-navy-800">{item.productName}</p>
                      <p className="mb-1.5 text-[10px] text-navy-300">{formatBRL(item.unitPriceCents)} cada</p>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item.productId, item.qty - 1)} className="rounded border border-line-400 bg-white px-1.5 text-sm">−</button>
                        <span className="min-w-[18px] text-center text-[12px] font-extrabold">{item.qty}</span>
                        <button
                          disabled={product ? item.qty >= product.stock : false}
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          className="rounded border border-line-400 bg-white px-1.5 text-sm disabled:opacity-40"
                        >
                          +
                        </button>
                        <span className="ml-1 text-[13px] font-black text-brand-600">{formatBRL(item.unitPriceCents * item.qty)}</span>
                      </div>
                    </div>
                    <button onClick={() => updateQty(item.productId, 0)} className="text-error-500">🗑</button>
                  </div>
                ))}
                <div className="mt-1.5 flex justify-between rounded-lg bg-surface-page p-2.5">
                  <span className="text-[12px] font-bold">Total</span>
                  <span className="text-[15px] font-black text-brand-600">{formatBRL(totalCents)}</span>
                </div>
              </>
            )
          )}
          {step === 2 && (
            <>
              <div className="mb-3.5 rounded-lg border-l-4 border-brand-500 bg-brand-50 p-2.5 text-[12px] text-brand-600">
                📋 Documentos são analisados pelo farmacêutico antes da liberação do envio.
              </div>
              {needsPrescription && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[12px] font-bold text-navy-500">📝 Receita Médica *</p>
                  <DocumentUpload label="Clique para enviar" file={prescription} onSelect={setPrescription} onClear={() => setPrescription(null)} />
                </div>
              )}
              {needsReport && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[12px] font-bold text-navy-500">📄 Laudo / CID *</p>
                  <DocumentUpload label="Clique para enviar" file={report} onSelect={setReport} onClear={() => setReport(null)} />
                </div>
              )}
              {!needsPrescription && !needsReport && (
                <div className="rounded-lg border-l-4 border-success-500 bg-success-50 p-2.5 text-[12px] text-success-600">
                  ✅ Nenhum documento obrigatório para estes itens.
                </div>
              )}
            </>
          )}
          {step === 3 && user && (
            <>
              <div className="mb-3 flex items-center gap-2.5 rounded-lg border-[1.5px] border-success-500 bg-success-50 p-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-[13px] font-extrabold text-success-600">Pagamento via PIX</div>
                  <div className="text-[11px] text-success-600">Aprovação instantânea</div>
                </div>
              </div>
              <div className="mb-3 rounded-lg bg-surface-page p-2.5">
                <p className="mb-1 text-[10px] font-bold uppercase text-navy-100">Endereço de entrega</p>
                <p className="text-[12px] text-navy-800">{user.address ? `${user.address.street} — ${user.address.city}, ${user.address.state}` : 'Cadastre um endereço em Meus dados'}</p>
              </div>
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between border-b border-line-100 py-1.5 text-[12px]">
                  <span className="text-navy-500">{i.productName} × {i.qty}</span>
                  <span className="font-bold">{formatBRL(i.unitPriceCents * i.qty)}</span>
                </div>
              ))}
              <div className="mt-1.5 flex justify-between border-t border-line-200 pt-2.5 text-[15px] font-black">
                <span>Total PIX</span>
                <span className="text-brand-600">{formatBRL(totalCents)}</span>
              </div>
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex flex-shrink-0 gap-2 border-t border-line-200 p-3.5">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>← Voltar</Button>}
            {step < 3 && <Button className="flex-1 justify-center" onClick={() => setStep(step + 1)}>Continuar →</Button>}
            {step === 3 && <Button variant="success" className="flex-1 justify-center" onClick={confirm}>✅ Confirmar Pedido</Button>}
          </div>
        )}
      </div>
    </div>
  )
}
