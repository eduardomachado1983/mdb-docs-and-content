import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getProfile, getUser } from '@/lib/supabase/server'
import { PatientStepper } from '@/components/shared/patient-stepper'
import { LogoutButton } from '@/components/shared/logout-button'
import { PersonalDataForm } from '@/components/shared/personal-data-form'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { DocumentUpload } from '@/components/shared/document-upload'
import { STATUS_LABELS, type Patient } from '@/types'

const STATUS_PILL: Record<Patient['status'], string> = {
  cadastro_incompleto: 'bg-surface-page text-navy-500',
  aguardando_pagamento: 'bg-amber-100 text-amber-800',
  aguardando_medico: 'bg-brand-100 text-brand-500',
  retido_admin: 'bg-amber-100 text-amber-800',
  concluido: 'bg-teal-100 text-teal-600',
}

const STATUS_MSG: Record<Patient['status'], string> = {
  cadastro_incompleto: 'Preencha seus dados pessoais para começar sua consulta.',
  aguardando_pagamento: 'Cadastro completo! Finalize o pagamento para entrar na fila de atendimento.',
  aguardando_medico: 'Tudo certo! Um médico vai revisar o seu caso em breve.',
  retido_admin: 'O médico já avaliou seu caso. Nossa equipe está validando tudo antes da liberação final.',
  concluido: 'Seus documentos já estão disponíveis para visualizar, baixar e imprimir.',
}

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

  const hasPersonalData = Boolean((patient.personal_data as { full_name?: string })?.full_name)
  const firstName = (profile?.name ?? 'paciente').split(' ')[0]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line-200 bg-white">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-[13px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-teal-500 text-[11px] font-extrabold text-white">
              SL
            </div>
            <span className="text-[15px] font-extrabold">
              Sua Logo <span className="text-xs font-semibold text-navy-100">· Paciente</span>
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#dbe9fb] text-[13px] font-bold text-brand-500">
                {(profile?.name ?? 'P').slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-bold">{profile?.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-[26px] font-extrabold">Olá, {firstName} 👋</h1>
        <p className="mb-5 text-[15px] text-navy-300">Acompanhe aqui o andamento do seu atendimento.</p>

        <div className="mb-[18px] rounded-[18px] border border-line-200 bg-white p-6 shadow-[0_10px_30px_rgba(20,50,90,.06)]">
          <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${STATUS_PILL[patient.status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {STATUS_LABELS[patient.status]}
          </div>
          <PatientStepper status={patient.status} />
          <div className="mt-3 rounded-xl bg-surface-muted px-4 py-3.5 text-[14.5px] leading-relaxed text-navy-600">
            {STATUS_MSG[patient.status]}
          </div>

          {patient.status === 'cadastro_incompleto' && !hasPersonalData && (
            <div className="mt-5">
              <PersonalDataForm initial={patient.personal_data} />
            </div>
          )}

          {patient.status === 'cadastro_incompleto' && hasPersonalData && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-sm text-navy-300">
                Agora faça a triagem inicial com nosso assistente para prosseguir.
              </p>
              <Link
                href="/dashboard/chat"
                className="w-fit rounded-[11px] bg-brand-500 px-5 py-3 text-sm font-bold text-white"
              >
                Iniciar triagem
              </Link>
            </div>
          )}

          {patient.status === 'aguardando_pagamento' && (
            <div className="mt-5">
              <PaymentPanel cpf={(patient.personal_data as { cpf?: string })?.cpf ?? ''} />
            </div>
          )}
        </div>

        {patient.status === 'aguardando_medico' && (
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-[18px] rounded-2xl border border-line-200 bg-white p-6">
            <div className="flex flex-col gap-3">
              <div className="text-[15px] font-bold">📎 Envie seus documentos</div>
              <p className="text-sm text-navy-300">Enviar agora agiliza a validação administrativa depois da consulta.</p>
              <DocumentUpload initialDocuments={documents ?? []} />
            </div>
          </div>
        )}

        {patient.status === 'concluido' && (patient.clinical?.prescription || patient.clinical?.report) && (
          <div className="flex flex-col gap-4">
            {patient.clinical?.prescription && (
              <div className="rounded-2xl border border-line-100 bg-white p-6 text-sm leading-relaxed whitespace-pre-wrap">
                <div className="mb-2 text-[15px] font-bold">💊 Receita</div>
                {patient.clinical.prescription}
              </div>
            )}
            {patient.clinical?.report && (
              <div className="rounded-2xl border border-line-100 bg-white p-6 text-sm leading-relaxed whitespace-pre-wrap">
                <div className="mb-2 text-[15px] font-bold">📄 Laudo</div>
                {patient.clinical.report}
              </div>
            )}
          </div>
        )}

        {(patient.status === 'aguardando_medico' || patient.status === 'retido_admin' || patient.status === 'concluido') && (
          <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-line-200 bg-white p-[22px]">
              <div className="mb-3.5 text-[16px] font-extrabold">📋 Sua triagem</div>
              <div className="mb-1 text-[13px] font-bold text-navy-100">Sintomas</div>
              <div className="mb-3 text-sm text-navy-600">{patient.triage?.main_symptom}</div>
              <div className="mb-3 flex gap-[22px]">
                <div>
                  <div className="mb-1 text-[13px] font-bold text-navy-100">Local</div>
                  <div className="text-sm text-navy-600">{patient.triage?.pain_location}</div>
                </div>
                <div>
                  <div className="mb-1 text-[13px] font-bold text-navy-100">Intensidade</div>
                  <div className="text-sm text-navy-600">{patient.triage?.pain_intensity}/10</div>
                </div>
              </div>
              <div className="mb-1 text-[13px] font-bold text-navy-100">Histórico</div>
              <div className="text-sm text-navy-600">{patient.triage?.medical_history}</div>
            </div>
            <div className="rounded-2xl border border-line-200 bg-white p-[22px]">
              <div className="mb-3.5 text-[16px] font-extrabold">📎 Seus documentos</div>
              <div className="flex flex-col gap-2.5">
                {(documents ?? []).length === 0 && (
                  <p className="text-sm text-navy-200">Nenhum documento enviado ainda.</p>
                )}
                {(documents ?? []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-2.5 rounded-[11px] border border-line-100 bg-surface-subtle px-3.5 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-lg">📄</span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-navy-700">
                          {d.type === 'identity' ? 'Documento de identidade' : 'Comprovante de residência'}
                        </div>
                        <div className="truncate text-[11.5px] text-navy-100">{d.filename}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3.5 rounded-lg bg-surface-muted px-2.5 py-2 text-[11.5px] leading-relaxed text-navy-100">
                🔒 Visíveis apenas para os profissionais do seu caso.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
