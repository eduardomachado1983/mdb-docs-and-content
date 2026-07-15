'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buildPrescriptionIdeas, buildReportIdeas } from '@/lib/prontuario-suggestions'
import type { Patient } from '@/types'

function IdeasPanel({ title, ideas, onUse }: { title: string; ideas: string[]; onUse: () => void }) {
  if (ideas.length === 0) return null
  return (
    <div className="flex flex-col gap-2 rounded-[11px] border border-teal-100 bg-teal-50/60 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-teal-700">💡 Ideias com base na triagem — {title}</p>
        <button
          type="button"
          onClick={onUse}
          className="min-h-[32px] shrink-0 rounded-[4px] border border-teal-300 bg-white px-2.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100 active:scale-[0.97]"
        >
          Inserir no campo
        </button>
      </div>
      <ul className="flex flex-col gap-1 text-xs text-navy-600">
        {ideas.map((idea) => (
          <li key={idea} className="flex gap-1.5">
            <span aria-hidden="true">•</span>
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProntuarioForm({ patientId, patient }: { patientId: string; patient: Patient }) {
  const router = useRouter()
  const [prescription, setPrescription] = useState('')
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  const prescriptionIdeas = useMemo(() => buildPrescriptionIdeas(patient), [patient])
  const reportIdeas = useMemo(() => buildReportIdeas(patient), [patient])

  function insertIdeas(ideas: string[], current: string, setValue: (v: string) => void) {
    const bullets = ideas.map((idea) => `- ${idea}`).join('\n')
    setValue(current ? `${current}\n${bullets}` : bullets)
  }

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
        <IdeasPanel
          title="Receita"
          ideas={prescriptionIdeas}
          onUse={() => insertIdeas(prescriptionIdeas, prescription, setPrescription)}
        />
        <Textarea id="prescription" value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Medicamento, dosagem, duração..." />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="report">Laudo</Label>
        <IdeasPanel title="Laudo" ideas={reportIdeas} onUse={() => insertIdeas(reportIdeas, report, setReport)} />
        <Textarea id="report" value={report} onChange={(e) => setReport(e.target.value)} placeholder="Diagnóstico e observações..." />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar e enviar para validação'}
      </Button>
    </form>
  )
}
