'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocEvidence {
  label: string
  uploaded: boolean
  url: string | null
}

interface Props {
  patientId: string
  identityDocs: DocEvidence[]
  paymentConfirmed: boolean
  paymentMethod?: string | null
  clinicalPresent: boolean
}

const PAYMENT_METHOD_LABEL: Record<string, string> = { pix: 'Pix', card: 'cartão' }

export function ValidationForm({ patientId, identityDocs, paymentConfirmed, paymentMethod, clinicalPresent }: Props) {
  const router = useRouter()
  const identityReady = identityDocs.every((d) => d.uploaded)

  const PILLARS = [
    {
      key: 'identity_approved' as const,
      label: 'Identidade validada (documentos conferem)',
      ready: identityReady,
      evidence: (
        <div className="mt-1.5 flex flex-col gap-1">
          {identityDocs.map((d) => (
            <span key={d.label} className="text-xs">
              {d.uploaded ? (
                <a href={d.url ?? '#'} target="_blank" rel="noopener noreferrer" className="font-semibold text-admin-500 hover:underline">
                  📄 Ver {d.label.toLowerCase()} →
                </a>
              ) : (
                <span className="text-error-500">✗ {d.label} não enviado</span>
              )}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'financial_approved' as const,
      label: 'Pagamento confirmado',
      ready: paymentConfirmed,
      evidence: (
        <p className={cn('mt-1.5 text-xs font-semibold', paymentConfirmed ? 'text-teal-600' : 'text-error-500')}>
          {paymentConfirmed
            ? `✓ Pago${paymentMethod ? ` via ${PAYMENT_METHOD_LABEL[paymentMethod] ?? paymentMethod}` : ''}`
            : '✗ Pagamento ainda não confirmado'}
        </p>
      ),
    },
    {
      key: 'clinical_approved' as const,
      label: 'Prontuário do médico revisado',
      ready: clinicalPresent,
      evidence: (
        <p className={cn('mt-1.5 text-xs font-semibold', clinicalPresent ? 'text-teal-600' : 'text-error-500')}>
          {clinicalPresent ? '✓ Receita e/ou laudo preenchidos pelo médico' : '✗ O médico ainda não preencheu o prontuário'}
        </p>
      ),
    },
  ]

  const [checked, setChecked] = useState<Record<string, boolean>>({
    identity_approved: false,
    financial_approved: false,
    clinical_approved: false,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checked),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao salvar')
        return
      }
      toast.success(data.released ? 'Paciente liberado com sucesso!' : 'Validação salva.')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {PILLARS.map((pillar) => (
        <div key={pillar.key}>
          <label className={cn('flex items-start gap-3 text-sm', !pillar.ready && 'opacity-70')}>
            <input
              type="checkbox"
              checked={checked[pillar.key]}
              disabled={!pillar.ready}
              onChange={(e) => setChecked((prev) => ({ ...prev, [pillar.key]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-teal-600 disabled:cursor-not-allowed"
            />
            <span className="font-semibold text-navy-700">{pillar.label}</span>
          </label>
          <div className="pl-7">{pillar.evidence}</div>
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar validação'}
      </Button>
    </form>
  )
}
