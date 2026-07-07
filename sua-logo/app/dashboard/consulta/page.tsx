import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getProfile, getUser } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { PatientStepper } from '@/components/shared/patient-stepper'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { STATUS_LABELS, type Patient } from '@/types'

const STATUS_MSG: Record<Patient['status'], string> = {
  cadastro_incompleto: 'Preencha seus dados pessoais para começar sua consulta.',
  aguardando_pagamento: 'Cadastro completo! Finalize o pagamento para entrar na fila de atendimento.',
  aguardando_medico: 'Tudo certo! Um médico vai revisar o seu caso em breve.',
  retido_admin: 'O médico já avaliou seu caso. Nossa equipe está validando tudo antes da liberação final.',
  concluido: 'Seus documentos já estão disponíveis em "Meus dados".',
}

export default async function ConsultaPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  const hasPersonalData = Boolean(patient.personal_data?.full_name)

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} statusLabel={STATUS_LABELS[patient.status]} />

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Nova consulta</h1>
        <p className="mb-5 text-[15px] text-navy-300">Acompanhe aqui o andamento do seu atendimento.</p>

        <div className="mb-[18px] rounded-[18px] border border-line-200 bg-white p-6 shadow-[0_10px_30px_rgba(20,50,90,.06)]">
          <PatientStepper status={patient.status} />
          <div className="mt-3 rounded-xl bg-surface-muted px-4 py-3.5 text-[14.5px] leading-relaxed text-navy-600">
            {STATUS_MSG[patient.status]}
          </div>

          {patient.status === 'cadastro_incompleto' && !hasPersonalData && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-sm text-navy-300">Complete seus dados pessoais em &quot;Meus dados&quot; para prosseguir.</p>
              <Link href="/dashboard" className="w-fit rounded-[11px] bg-brand-500 px-5 py-3 text-sm font-bold text-white">
                Ir para Meus dados
              </Link>
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
              <PaymentPanel cpf={patient.personal_data?.cpf ?? ''} />
            </div>
          )}
        </div>

        {patient.triage?.main_symptom && (
          <div className="rounded-2xl border border-line-200 bg-white p-6">
            <div className="mb-2 text-xs font-extrabold tracking-wide text-navy-200">TRIAGEM</div>
            <div className="flex flex-col gap-1.5 text-sm text-navy-600">
              <p><span className="text-navy-300">😊 Sintomas:</span> {patient.triage.main_symptom}</p>
              <p><span className="text-navy-300">📍 Local:</span> {patient.triage.pain_location}</p>
              <p><span className="text-navy-300">📊 Intensidade:</span> {patient.triage.pain_intensity}/10</p>
              {patient.triage.medical_history && (
                <p><span className="text-navy-300">📋 Histórico:</span> {patient.triage.medical_history}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
