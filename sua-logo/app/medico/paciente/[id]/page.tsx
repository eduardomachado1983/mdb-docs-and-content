import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { MedicoHeader } from '@/components/shared/medico-header'
import { PatientDetailHero } from '@/components/shared/patient-detail-hero'
import { DetailField } from '@/components/shared/detail-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProntuarioForm } from '@/components/shared/prontuario-form'
import { cn } from '@/lib/utils'
import type { Patient } from '@/types'

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile()
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()

  if (!patient) notFound()

  const { data: chatHistory } = await supabase
    .from('chat_history').select('*').eq('patient_id', id).order('created_at', { ascending: true })

  const { data: documents } = await supabase
    .from('documents').select('type').eq('patient_id', id)

  const docsComplete =
    (documents ?? []).some((d) => d.type === 'identity') && (documents ?? []).some((d) => d.type === 'address')

  const { personal_data: pd, triage } = patient
  const cityState = [pd?.city, pd?.state].filter(Boolean).join('-')
  const numberComplement = [pd?.number, pd?.complement].filter(Boolean).join(' - ')

  return (
    <div className="min-h-screen">
      <MedicoHeader doctorName={profile?.name ?? 'Médico'} crm={profile?.crm} specialty={profile?.specialty} />

      <main className="mx-auto grid max-w-[1140px] gap-6 px-6 py-8">
        <div>
          <h1 className="mb-1 text-2xl font-extrabold">Painel do médico</h1>
          <Link
            href="/medico"
            className="flex w-fit items-center gap-1.5 text-sm font-bold text-navy-300 hover:text-navy-700"
          >
            ‹ Detalhes do paciente
          </Link>
        </div>

        <PatientDetailHero patient={patient} docsComplete={docsComplete} />

        <Card>
          <CardHeader><CardTitle className="text-base">Informações pessoais</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            <DetailField label="Nome" value={pd?.full_name} />
            <DetailField label="CPF" value={pd?.cpf} />
            <DetailField label="RG" value={pd?.rg} />
            <DetailField label="E-mail" value={pd?.email} />
            <DetailField label="Data de nascimento" value={pd?.birth_date} />
            <DetailField label="Telefone" value={pd?.phone} />
            <DetailField label="CEP" value={pd?.cep} />
            <DetailField label="Endereço" value={pd?.address} />
            <DetailField label="Número e complemento" value={numberComplement} />
            <DetailField label="Bairro" value={pd?.neighborhood} />
            <DetailField label="Cidade e Estado" value={cityState} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {(triage?.height || triage?.weight || triage?.sex) && (
            <Card>
              <CardHeader><CardTitle className="text-base">Informações físicas</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <DetailField label="Altura" value={triage.height} />
                <DetailField label="Peso" value={triage.weight} />
                <DetailField label="Sexo" value={triage.sex} />
              </CardContent>
            </Card>
          )}

          {triage?.mental_health && triage.mental_health.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Saúde mental</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {triage.mental_health.map((item) => (
                  <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                    {item}
                  </span>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {triage?.health_history && Object.keys(triage.health_history).length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Histórico de saúde</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
              {Object.entries(triage.health_history).map(([pergunta, resposta]) => (
                <DetailField key={pergunta} label={pergunta} value={resposta} />
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Consulta</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <DetailField label="Objetivo" value={triage?.main_symptom} />
              <DetailField label="Local" value={triage?.pain_location} />
              <DetailField label="Intensidade" value={triage?.pain_intensity ? `${triage.pain_intensity}/10` : undefined} />
            </CardContent>
          </Card>

          {triage?.product_preferences && triage.product_preferences.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Produtos de preferência</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {triage.product_preferences.map((item) => (
                  <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                    {item}
                  </span>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {chatHistory && chatHistory.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Conversa com o assistente</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {chatHistory.map((m, i) => {
                const newGroup = i > 0 && m.role === 'assistant' && chatHistory[i - 1].role === 'user'
                return (
                  <p key={m.id} className={cn(newGroup && 'mt-3', m.role === 'assistant' ? 'text-navy-200' : 'text-navy-700')}>
                    <strong>{m.role === 'assistant' ? 'Assistente' : 'Paciente'}:</strong> {m.content}
                  </p>
                )
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Prontuário</CardTitle></CardHeader>
          <CardContent>
            <ProntuarioForm patientId={patient.id} patient={patient} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
