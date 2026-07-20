import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getUserAndProfile } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { ConsultationSummaryHero } from '@/components/shared/consultation-summary-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient } from '@/types'

export default async function ConsultaPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()

  if (!patient || patient.status !== 'concluido') redirect('/dashboard')

  const triage = patient.triage

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} />

      <main className="mx-auto grid max-w-[1140px] gap-6 px-6 py-8">
        <Link
          href="/dashboard"
          className="flex w-fit items-center gap-1.5 text-sm font-bold text-navy-500 hover:text-navy-700"
        >
          ← Voltar
        </Link>

        <ConsultationSummaryHero patient={patient} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados pessoais</CardTitle>
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
              <p><strong>Objetivo:</strong> {triage?.main_symptom}</p>
              {triage?.pain_location && <p><strong>Local:</strong> {triage.pain_location}</p>}
              {triage?.pain_intensity && <p><strong>Intensidade:</strong> {triage.pain_intensity}/10</p>}
            </CardContent>
          </Card>

          {triage?.health_history && Object.keys(triage.health_history).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Histórico de saúde</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm text-navy-600">
                {Object.entries(triage.health_history).map(([pergunta, resposta]) => (
                  <p key={pergunta} className="flex items-center justify-between gap-3">
                    <span>{pergunta}</span>
                    <strong className="shrink-0 text-navy-800">{resposta}</strong>
                  </p>
                ))}
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

          {(triage?.height || triage?.weight || triage?.sex) && (
            <Card>
              <CardHeader><CardTitle className="text-base">Informações físicas</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm text-navy-600">
                {triage.height && <p><strong>Altura:</strong> {triage.height}</p>}
                {triage.weight && <p><strong>Peso:</strong> {triage.weight}</p>}
                {triage.sex && <p><strong>Sexo:</strong> {triage.sex}</p>}
              </CardContent>
            </Card>
          )}

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

        {(patient.clinical?.prescription || patient.clinical?.report) && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {patient.clinical?.prescription && (
              <Card>
                <CardHeader><CardTitle className="text-base">💊 Receita</CardTitle></CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm text-navy-600">
                  {patient.clinical.prescription}
                </CardContent>
              </Card>
            )}
            {patient.clinical?.report && (
              <Card>
                <CardHeader><CardTitle className="text-base">📄 Laudo</CardTitle></CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm text-navy-600">
                  {patient.clinical.report}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
