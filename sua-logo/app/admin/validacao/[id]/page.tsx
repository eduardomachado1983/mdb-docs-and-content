import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { AdminPatientHeader } from '@/components/shared/admin-patient-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidationForm } from '@/components/shared/validation-form'
import { NotifyMissingDocsButton } from '@/components/shared/notify-missing-docs-button'
import { PaymentHistory } from '@/components/shared/payment-history'
import { DOCUMENTS_BUCKET } from '@/lib/storage'
import type { Patient } from '@/types'

const REQUIRED_DOCS: { type: string; label: string }[] = [
  { type: 'identity', label: 'Documento de identidade' },
  { type: 'address', label: 'Comprovante de endereço' },
]

export default async function ValidacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile()
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single<Patient>()
  if (!patient) notFound()

  const { data: documents } = await supabase.from('documents').select('*').eq('patient_id', id)
  const { data: transactions } = await supabase
    .from('payment_transactions').select('*').eq('patient_id', id).order('created_at', { ascending: false })

  const docsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc) => {
      const { data } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 300)
      return { ...doc, url: data?.signedUrl ?? null }
    })
  )
  const docByType = new Map<string, (typeof docsWithUrls)[number]>(docsWithUrls.map((d) => [d.type, d]))
  const missingDocs = REQUIRED_DOCS.filter((d) => !docByType.has(d.type))

  const identityDocs = REQUIRED_DOCS.map((req) => {
    const doc = docByType.get(req.type)
    return { label: req.label, uploaded: Boolean(doc), url: doc?.url ?? null }
  })
  const clinicalPresent = Boolean(patient.clinical?.prescription || patient.clinical?.report)

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <main className="mx-auto max-w-[960px] px-6 py-8">
        <AdminPatientHeader patientId={patient.id} initial={patient.personal_data} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Documentos do paciente</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                {docsWithUrls.length === 0 && (
                  <p className="text-sm text-navy-200">Nenhum documento enviado ainda.</p>
                )}
                {docsWithUrls.map((d) => (
                  <a
                    key={d.id}
                    href={d.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2.5 rounded-[11px] border border-line-100 bg-surface-subtle px-3.5 py-2.5 text-sm font-semibold text-navy-700 hover:border-admin-200"
                  >
                    <span>📄 {REQUIRED_DOCS.find((r) => r.type === d.type)?.label ?? d.type}</span>
                    <span className="truncate text-xs font-normal text-navy-200">{d.filename}</span>
                  </a>
                ))}
                {missingDocs.length > 0 && (
                  <div className="mt-2 rounded-[11px] border border-amber-200 bg-amber-50 p-4">
                    <p className="mb-2 text-sm font-bold text-amber-800">⚠️ Documentos pendentes</p>
                    <ul className="mb-3 list-disc pl-5 text-sm text-amber-800">
                      {missingDocs.map((d) => <li key={d.type}>{d.label}</li>)}
                    </ul>
                    <NotifyMissingDocsButton
                      patientId={patient.id}
                      alreadySent={Boolean(patient.admin_validation?.document_reminder_sent_at)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Documentos do médico</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm whitespace-pre-wrap text-navy-600">
                <p><strong>Receita:</strong> {patient.clinical?.prescription || '—'}</p>
                <p><strong>Laudo:</strong> {patient.clinical?.report || '—'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Validação final</CardTitle></CardHeader>
              <CardContent>
                <ValidationForm
                  patientId={patient.id}
                  identityDocs={identityDocs}
                  paymentConfirmed={Boolean(patient.payment?.confirmed)}
                  paymentMethod={patient.payment?.method}
                  clinicalPresent={clinicalPresent}
                />
              </CardContent>
            </Card>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/65 p-5 backdrop-blur-xl">
            <PaymentHistory transactions={transactions ?? []} />
          </div>
        </div>
      </main>
    </div>
  )
}
