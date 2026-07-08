import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidationForm } from '@/components/shared/validation-form'
import { NotifyMissingDocsButton } from '@/components/shared/notify-missing-docs-button'
import { PaymentHistory } from '@/components/shared/payment-history'
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

  const uploadedTypes = new Set<string>((documents ?? []).map((d) => d.type))
  const missingDocs = REQUIRED_DOCS.filter((d) => !uploadedTypes.has(d.type))

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <main className="mx-auto max-w-[960px] px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/admin"
            aria-label="Voltar ao painel"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-300 text-navy-500 hover:bg-surface-page"
          >
            ←
          </Link>
          <h1 className="text-xl font-extrabold">Detalhes do paciente</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>{patient.personal_data?.full_name}</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm text-navy-600">
                <p>CPF: {patient.personal_data?.cpf}</p>
                <p>E-mail: {patient.personal_data?.email}</p>
                <p>Telefone: {patient.personal_data?.phone}</p>
                <p>Pagamento: {patient.payment?.confirmed ? `Confirmado (${patient.payment.method})` : 'Pendente'}</p>
                <p>Documentos enviados: {documents?.length ?? 0}</p>
              </CardContent>
            </Card>

            {missingDocs.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
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
                <ValidationForm patientId={patient.id} />
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
