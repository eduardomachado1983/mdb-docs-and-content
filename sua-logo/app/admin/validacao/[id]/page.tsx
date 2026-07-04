import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidationForm } from '@/components/shared/validation-form'
import type { Patient } from '@/types'

export default async function ValidacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()
  if (!patient) notFound()

  const { data: documents } = await supabase.from('documents').select('*').eq('patient_id', id)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <Card>
        <CardHeader><CardTitle>{patient.personal_data?.full_name}</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
          <p>CPF: {patient.personal_data?.cpf}</p>
          <p>Pagamento: {patient.payment?.confirmed ? `Confirmado (${patient.payment.method})` : 'Pendente'}</p>
          <p>Documentos enviados: {documents?.length ?? 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Prontuário do médico</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
          <p><strong>Receita:</strong> {patient.clinical?.prescription || '—'}</p>
          <p><strong>Laudo:</strong> {patient.clinical?.report || '—'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Validação final</CardTitle></CardHeader>
        <CardContent>
          <ValidationForm patientId={patient.id} />
        </CardContent>
      </Card>
    </main>
  )
}
