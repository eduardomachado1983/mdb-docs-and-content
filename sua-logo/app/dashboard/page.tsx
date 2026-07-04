import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getProfile, getUser } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { LogoutButton } from '@/components/shared/logout-button'
import { PersonalDataForm } from '@/components/shared/personal-data-form'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { DocumentUpload } from '@/components/shared/document-upload'
import { STATUS_MESSAGES, type Patient } from '@/types'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()
  const { data: documents } = await supabase
    .from('documents').select('*').eq('patient_id', patient?.id ?? '')

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  const message = STATUS_MESSAGES[patient.status]
  const hasPersonalData = Boolean((patient.personal_data as { full_name?: string })?.full_name)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Olá, {profile?.name ?? 'paciente'}</p>
          <StatusBadge status={patient.status} />
        </div>
        <LogoutButton />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{message.title}</CardTitle>
          <CardDescription>{message.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {patient.status === 'cadastro_incompleto' && !hasPersonalData && (
            <PersonalDataForm initial={patient.personal_data} />
          )}

          {patient.status === 'cadastro_incompleto' && hasPersonalData && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500">
                Agora faça a triagem inicial com nosso assistente para prosseguir.
              </p>
              <Link href="/dashboard/chat">
                <Button>Iniciar triagem</Button>
              </Link>
            </div>
          )}

          {patient.status === 'aguardando_pagamento' && <PaymentPanel />}

          {patient.status === 'aguardando_medico' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500">
                Enquanto isso, envie seus documentos para agilizar a validação.
              </p>
              <DocumentUpload initialDocuments={documents ?? []} />
            </div>
          )}

          {patient.status === 'retido_admin' && (
            <p className="text-sm text-slate-500">
              O médico já avaliou seu caso. Nossa equipe está validando tudo antes da liberação final.
            </p>
          )}

          {patient.status === 'concluido' && (
            <div className="flex flex-col gap-3">
              {patient.clinical?.prescription && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm whitespace-pre-wrap dark:bg-slate-800">
                  <strong>Receita:</strong>
                  <br />
                  {patient.clinical.prescription}
                </div>
              )}
              {patient.clinical?.report && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm whitespace-pre-wrap dark:bg-slate-800">
                  <strong>Laudo:</strong>
                  <br />
                  {patient.clinical.report}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
