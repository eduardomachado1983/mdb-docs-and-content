'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PixResult {
  referenceId: string
  qrCode: string | null
  qrCodeBase64: string | null
  simulated: boolean
}

export function PaymentPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixResult | null>(null)

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

  if (!pix) {
    return (
      <Button variant="teal" onClick={generatePix} disabled={loading}>
        {loading ? 'Gerando...' : '📱 Gerar Pix — R$ 2,00'}
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {pix.qrCodeBase64 ? (
        <img src={`data:image/png;base64,${pix.qrCodeBase64}`} alt="QR Code Pix" className="h-48 w-48" />
      ) : (
        <div className="w-full rounded-xl bg-surface-muted p-3 text-xs break-all">{pix.qrCode}</div>
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
  )
}
