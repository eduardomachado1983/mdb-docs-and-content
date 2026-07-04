'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const PILLARS = [
  { key: 'identity_approved', label: 'Identidade validada (documentos conferem)' },
  { key: 'financial_approved', label: 'Pagamento confirmado' },
  { key: 'clinical_approved', label: 'Prontuário do médico revisado' },
] as const

export function ValidationForm({ patientId }: { patientId: string }) {
  const router = useRouter()
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {PILLARS.map((pillar) => (
        <label key={pillar.key} className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={checked[pillar.key]}
            onChange={(e) => setChecked((prev) => ({ ...prev, [pillar.key]: e.target.checked }))}
            className="h-4 w-4 accent-teal-600"
          />
          {pillar.label}
        </label>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar validação'}
      </Button>
    </form>
  )
}
