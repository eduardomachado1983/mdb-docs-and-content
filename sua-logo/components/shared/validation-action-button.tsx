'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ReminderReason } from '@/types'

export function ValidationActionButton({
  patientId,
  allReady,
  reason,
  alreadyNotified,
}: {
  patientId: string
  allReady: boolean
  reason?: ReminderReason
  alreadyNotified?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [notified, setNotified] = useState(Boolean(alreadyNotified))

  async function handleValidate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_approved: true, financial_approved: true, clinical_approved: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao validar paciente')
        return
      }
      toast.success('Paciente liberado com sucesso!')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function handleNotify() {
    if (!reason) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/patients/${patientId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao notificar paciente')
        return
      }
      const viaReal = !data.whatsappSimulated || !data.emailSimulated
      toast.success(
        viaReal
          ? 'Notificação enviada por WhatsApp e/ou e-mail.'
          : 'Notificação registrada (modo simulado — configure as credenciais de WhatsApp/e-mail para envio real).'
      )
      setNotified(true)
    } finally {
      setLoading(false)
    }
  }

  const className =
    'rounded-[8px] bg-teal-500 px-5 py-2.5 text-sm font-bold text-primary-on transition active:scale-[0.98] disabled:opacity-60'

  if (allReady) {
    return (
      <button type="button" onClick={handleValidate} disabled={loading} className={className}>
        {loading ? 'Validando...' : 'Validar paciente'}
      </button>
    )
  }

  return (
    <button type="button" onClick={handleNotify} disabled={loading} className={className}>
      {loading ? 'Enviando...' : notified ? '✓ Notificação enviada' : 'Enviar notificação'}
    </button>
  )
}
