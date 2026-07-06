import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProntuarioForm } from '@/components/shared/prontuario-form'
import type { Patient } from '@/types'

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()

  if (!patient) notFound()

  const { data: chatHistory } = await supabase
    .from('chat_history').select('*').eq('patient_id', id).order('created_at', { ascending: true })

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{patient.personal_data?.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
          <p>CPF: {patient.personal_data?.cpf}</p>
          <p>Nascimento: {patient.personal_data?.birth_date}</p>
          <p>Telefone: {patient.personal_data?.phone}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Triagem</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>Sintoma:</strong> {patient.triage?.main_symptom}</p>
          <p><strong>Local:</strong> {patient.triage?.pain_location}</p>
          <p><strong>Intensidade:</strong> {patient.triage?.pain_intensity}/10</p>
          <p><strong>Histórico:</strong> {patient.triage?.medical_history}</p>
        </CardContent>
      </Card>

      {chatHistory && chatHistory.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Conversa com o assistente</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {chatHistory.map((m) => (
              <p key={m.id} className={m.role === 'assistant' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                <strong>{m.role === 'assistant' ? 'Assistente' : 'Paciente'}:</strong> {m.content}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Prontuário</CardTitle></CardHeader>
        <CardContent>
          <ProntuarioForm patientId={patient.id} />
        </CardContent>
      </Card>
    </main>
  )
}
