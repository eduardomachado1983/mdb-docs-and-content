import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { MedicoHeader } from '@/components/shared/medico-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProntuarioForm } from '@/components/shared/prontuario-form'
import { DOCUMENTS_BUCKET } from '@/lib/storage'
import type { Patient } from '@/types'

const DOC_TYPE_LABEL: Record<string, string> = {
  identity: 'Documento de identidade',
  address: 'Comprovante de endereço',
  previous_consultation: 'Consultas anteriores / exames',
}

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile()
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()

  if (!patient) notFound()

  const { data: chatHistory } = await supabase
    .from('chat_history').select('*').eq('patient_id', id).order('created_at', { ascending: true })

  const { data: documents } = await supabase
    .from('documents').select('*').eq('patient_id', id).order('created_at', { ascending: false })

  const documentsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc) => {
      const { data } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 300)
      return { ...doc, url: data?.signedUrl ?? null }
    })
  )

  return (
    <div className="min-h-screen">
      <MedicoHeader doctorName={profile?.name ?? 'Médico'} crm={profile?.crm} specialty={profile?.specialty} />

      <main className="mx-auto grid max-w-[1140px] gap-6 px-6 py-8">
        <div className="flex items-center gap-3">
          <Link
            href="/medico"
            aria-label="Voltar ao painel"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-300 text-navy-500 hover:bg-surface-page"
          >
            ←
          </Link>
          <h1 className="text-xl font-extrabold">Detalhes do paciente</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{patient.personal_data?.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-navy-600">
            <p>CPF: {patient.personal_data?.cpf}</p>
            <p>Nascimento: {patient.personal_data?.birth_date}</p>
            <p>Telefone: {patient.personal_data?.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Consulta</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm text-navy-600">
            <p><strong>Objetivo:</strong> {patient.triage?.main_symptom}</p>
            <p><strong>Local:</strong> {patient.triage?.pain_location}</p>
            <p><strong>Intensidade:</strong> {patient.triage?.pain_intensity}/10</p>
            <p><strong>Histórico:</strong> {patient.triage?.medical_history}</p>
          </CardContent>
        </Card>

        {patient.triage?.health_history && Object.keys(patient.triage.health_history).length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Histórico de saúde</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm text-navy-600">
              {Object.entries(patient.triage.health_history).map(([pergunta, resposta]) => (
                <p key={pergunta} className="flex items-center justify-between gap-3">
                  <span>{pergunta}</span>
                  <strong className="shrink-0 text-navy-800">{resposta}</strong>
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        {patient.triage?.mental_health && patient.triage.mental_health.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Saúde mental</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {patient.triage.mental_health.map((item) => (
                <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                  {item}
                </span>
              ))}
            </CardContent>
          </Card>
        )}

        {(patient.triage?.height || patient.triage?.weight || patient.triage?.sex) && (
          <Card>
            <CardHeader><CardTitle className="text-base">Informações físicas</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm text-navy-600">
              {patient.triage.height && <p><strong>Altura:</strong> {patient.triage.height}</p>}
              {patient.triage.weight && <p><strong>Peso:</strong> {patient.triage.weight}</p>}
              {patient.triage.sex && <p><strong>Sexo:</strong> {patient.triage.sex}</p>}
            </CardContent>
          </Card>
        )}

        {patient.triage?.product_preferences && patient.triage.product_preferences.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Produtos de preferência</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {patient.triage.product_preferences.map((item) => (
                <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                  {item}
                </span>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Documentos enviados</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {documentsWithUrls.length === 0 && (
              <p className="text-sm text-navy-200">Nenhum documento enviado ainda.</p>
            )}
            {documentsWithUrls.map((d) => (
              <a
                key={d.id}
                href={d.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2.5 rounded-[11px] border border-line-100 bg-surface-subtle px-3.5 py-2.5 text-sm font-semibold text-navy-700 hover:border-teal-300"
              >
                <span>📄 {DOC_TYPE_LABEL[d.type] ?? d.type}</span>
                <span className="truncate text-xs font-normal text-navy-200">{d.filename}</span>
              </a>
            ))}
          </CardContent>
        </Card>

        {chatHistory && chatHistory.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Conversa com o assistente</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {chatHistory.map((m) => (
                <p key={m.id} className={m.role === 'assistant' ? 'text-navy-200' : 'text-navy-700'}>
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
    </div>
  )
}
