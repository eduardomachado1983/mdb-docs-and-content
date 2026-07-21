import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { AdminValidationHero } from '@/components/shared/admin-validation-hero'
import { CollapsibleSection } from '@/components/shared/collapsible-section'
import { ClinicalDocLink } from '@/components/shared/clinical-doc-link'
import { ValidationActionButton } from '@/components/shared/validation-action-button'
import { DetailField } from '@/components/shared/detail-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DOCUMENTS_BUCKET } from '@/lib/storage'
import { computeValidationState } from '@/lib/validation-status'
import { cn } from '@/lib/utils'
import type { Patient } from '@/types'

const REQUIRED_DOCS: { type: string; label: string }[] = [
  { type: 'identity', label: 'Documento de identidade e CPF' },
  { type: 'address', label: 'Comprovante de endereço' },
]

export default async function ValidacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile()
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()
  if (!patient) notFound()

  const { data: documents } = await supabase.from('documents').select('*').eq('patient_id', id)

  const docsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc) => {
      const { data } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 300)
      return { ...doc, url: data?.signedUrl ?? null }
    })
  )
  const docByType = new Map<string, (typeof docsWithUrls)[number]>(docsWithUrls.map((d) => [d.type, d]))
  const identityDocs = REQUIRED_DOCS.map((req) => {
    const doc = docByType.get(req.type)
    return { label: req.label, uploaded: Boolean(doc), url: doc?.url ?? null }
  })
  const docsComplete = identityDocs.every((d) => d.uploaded)

  const paymentConfirmed = Boolean(patient.payment?.confirmed)
  const clinicalPresent = Boolean(patient.clinical?.prescription || patient.clinical?.report)
  const state = computeValidationState({ docsComplete, paymentConfirmed, clinicalPresent })

  const { personal_data: pd, triage } = patient
  const cityState = [pd?.city, pd?.state].filter(Boolean).join('-')
  const numberComplement = [pd?.number, pd?.complement].filter(Boolean).join(' - ')

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <main className="mx-auto grid max-w-[1140px] gap-6 px-6 py-8">
        <div>
          <h1 className="mb-1 text-2xl font-extrabold">Painel do médico</h1>
          <Link
            href="/admin"
            className="flex w-fit items-center gap-1.5 text-sm font-bold text-navy-300 hover:text-navy-700"
          >
            ‹ Detalhes do paciente
          </Link>
        </div>

        <AdminValidationHero patientId={patient.id} patientName={pd?.full_name || 'Paciente'} state={state} />

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

        <CollapsibleSection title="Informações da consulta">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            <DetailField label="Objetivo" value={triage?.main_symptom} />
            <DetailField label="Local" value={triage?.pain_location} />
            <DetailField label="Intensidade" value={triage?.pain_intensity ? `${triage.pain_intensity}/10` : undefined} />
            <DetailField label="Altura" value={triage?.height} />
            <DetailField label="Peso" value={triage?.weight} />
            <DetailField label="Sexo" value={triage?.sex} />
            {triage?.health_history &&
              Object.entries(triage.health_history).map(([pergunta, resposta]) => (
                <DetailField key={pergunta} label={pergunta} value={resposta} />
              ))}
          </div>
          {triage?.mental_health && triage.mental_health.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm text-navy-300">Saúde mental</div>
              <div className="flex flex-wrap gap-2">
                {triage.mental_health.map((item) => (
                  <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {triage?.product_preferences && triage.product_preferences.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm text-navy-300">Produtos de preferência</div>
              <div className="flex flex-wrap gap-2">
                {triage.product_preferences.map((item) => (
                  <span key={item} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CollapsibleSection>

        <Card>
          <CardHeader><CardTitle className="text-base">Validação final</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-2 text-sm font-bold text-navy-800">Documentação</div>
              <div className="flex flex-col gap-2">
                {identityDocs.map((d) =>
                  d.uploaded ? (
                    <a
                      key={d.label}
                      href={d.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#2f6fed] hover:underline"
                    >
                      {d.label}
                    </a>
                  ) : (
                    <p key={d.label} className="text-sm font-semibold text-error-500">Sem {d.label}</p>
                  )
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-bold text-navy-800">Pagamento</div>
              <p className={cn('text-sm font-semibold', paymentConfirmed ? 'text-teal-600' : 'text-error-500')}>
                {paymentConfirmed ? 'Pagamento realizado' : 'Pagamento não realizado'}
              </p>
            </div>

            <div>
              <div className="mb-2 text-sm font-bold text-navy-800">Prontuário médico</div>
              <div className="flex flex-col gap-2">
                <ClinicalDocLink label="Receita" content={patient.clinical?.prescription} />
                <ClinicalDocLink label="Laudo" content={patient.clinical?.report} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin"
            className="flex items-center rounded-[8px] border border-teal-500 px-5 py-2.5 text-sm font-bold text-teal-600 transition hover:bg-teal-50 active:scale-[0.98]"
          >
            Voltar
          </Link>
          <ValidationActionButton
            patientId={patient.id}
            allReady={state === 'liberado'}
            alreadyNotified={Boolean(patient.admin_validation?.document_reminder_sent_at)}
          />
        </div>
      </main>
    </div>
  )
}
