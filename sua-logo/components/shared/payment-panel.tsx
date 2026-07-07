'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CardPaymentForm } from '@/components/shared/card-payment-form'

interface PixResult {
  referenceId: string
  qrCode: string | null
  qrCodeBase64: string | null
  simulated: boolean
}

export function PaymentPanel({ cpf = '' }: { cpf?: string }) {
  const router = useRouter()
  const [method, setMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixResult | null>(null)

  async function copyPixCode() {
    if (!pix?.qrCode) return
    try {
      await navigator.clipboard.writeText(pix.qrCode)
      toast.success('Código Pix copiado!')
    } catch {
      toast.error('Não foi possível copiar. Selecione o código manualmente.')
    }
  }

  async function generatePix() {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/pix', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao gerar Pix')
        return
      }
      setPix(data)
    } finally {
      setLoading(false)
    }
  }

  async function confirmSimulated() {
    if (!pix) return
    setLoading(true)
    try {
      const res = await fetch('/api/payments/confirm-simulated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: pix.referenceId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao confirmar')
        return
      }
      toast.success('Pagamento confirmado!')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMethod('pix')}
          className={cn(
            'rounded-[11px] border px-4 py-2.5 text-sm font-bold',
            method === 'pix' ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-line-300 text-navy-300'
          )}
        >
          📱 Pix
        </button>
        <button
          type="button"
          onClick={() => setMethod('card')}
          className={cn(
            'rounded-[11px] border px-4 py-2.5 text-sm font-bold',
            method === 'card' ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-line-300 text-navy-300'
          )}
        >
          💳 Cartão
        </button>
      </div>

      {method === 'card' && <CardPaymentForm cpf={cpf} />}

      {method === 'pix' && !pix && (
        <Button variant="teal" onClick={generatePix} disabled={loading}>
          {loading ? 'Gerando...' : '📱 Gerar Pix — R$ 2,00'}
        </Button>
      )}

      {method === 'pix' && pix && (
        <div className="flex flex-col items-center gap-4">
          {pix.qrCodeBase64 && (
            <img src={`data:image/png;base64,${pix.qrCodeBase64}`} alt="QR Code Pix" className="h-48 w-48" />
          )}
          {pix.qrCode && (
            <div className="w-full">
              <label className="mb-1.5 block text-[13px] font-bold text-navy-700">
                Pix Copia e Cola
              </label>
              <div className="w-full rounded-xl bg-surface-muted p-3 text-xs break-all">{pix.qrCode}</div>
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={copyPixCode}>
                📋 Copiar código
              </Button>
            </div>
          )}
          {pix.simulated && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-center text-sm">
              <p className="text-amber-800">Pix simulado (Mercado Pago não configurado ainda).</p>
              <Button size="sm" variant="teal" onClick={confirmSimulated} disabled={loading}>
                {loading ? 'Confirmando...' : 'Simular pagamento confirmado'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
