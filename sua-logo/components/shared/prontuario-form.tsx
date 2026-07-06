'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ProntuarioForm({ patientId }: { patientId: string }) {
  const router = useRouter()
  const [prescription, setPrescription] = useState('')
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/doctor/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescription, report }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao salvar')
        return
      }
      toast.success('Prontuário salvo. Enviado para validação.')
      router.push('/medico')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="prescription">Receita</Label>
        <Textarea id="prescription" value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Medicamento, dosagem, duração..." />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="report">Laudo</Label>
        <Textarea id="report" value={report} onChange={(e) => setReport(e.target.value)} placeholder="Diagnóstico e observações..." />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar e enviar para validação'}
      </Button>
    </form>
  )
}
