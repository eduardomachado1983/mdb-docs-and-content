'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function NotifyMissingDocsButton({ patientId, alreadySent }: { patientId: string; alreadySent?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(Boolean(alreadySent))

  async function handleNotify() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/patients/${patientId}/notify-documents`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao notificar paciente')
        return
      }
      toast.success('Lembrete registrado — o paciente verá o aviso na área dele.')
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleNotify} disabled={loading}>
      {loading ? 'Enviando...' : sent ? '✓ Lembrete enviado — enviar de novo' : '📩 Notificar paciente (e-mail e telefone)'}
    </Button>
  )
}
