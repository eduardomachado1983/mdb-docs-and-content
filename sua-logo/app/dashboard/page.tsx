import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getUserAndProfile } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { PatientStepper } from '@/components/shared/patient-stepper'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { ConsultationCard } from '@/components/shared/consultation-card'
import { CompletedConsultationCard } from '@/components/shared/completed-consultation-card'
import { TOTAL_ANSWERS } from '@/lib/assistant'
import type { Patient } from '@/types'

const STATUS_MSG: Record<Patient['status'], string> = {
  cadastro_incompleto: 'Preencha seus dados pessoais para começar sua consulta.',
  aguardando_pagamento: 'Cadastro completo! Finalize o pagamento para entrar na fila de atendimento.',
  aguardando_medico: 'Documentos e pagamento confirmados! Você já pode realizar sua consulta.',
  retido_admin: 'O médico já avaliou seu caso. Nossa equipe está validando tudo antes de liberar sua receita e laudo.',
  concluido: 'Seus documentos já estão disponíveis em "Meus dados".',
}

export default async function DashboardPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  const hasPersonalData = Boolean(patient.personal_data?.full_name)

  // Consulta libera com documentos enviados + pagamento confirmado.
  const { data: documents } = await supabase
    .from('documents').select('type').eq('patient_id', patient.id)
  const docsComplete =
    (documents ?? []).some((d) => d.type === 'identity') &&
    (documents ?? []).some((d) => d.type === 'address')

  const { count: answersCount } = await supabase
    .from('chat_history')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patient.id)
    .eq('role', 'user')
  const consultaDone = (answersCount ?? 0) >= TOTAL_ANSWERS

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Minhas consultas</h1>
        <p className="mb-5 text-[15px] text-navy-300">Acompanhe aqui o andamento do seu atendimento.</p>

        <div className="mb-[18px] rounded-[18px] border border-white/30 bg-white/65 backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(20,50,90,.06)]">
          <PatientStepper status={patient.status} />
          <div className="mt-3 rounded-xl bg-surface-muted px-4 py-3.5 text-[14.5px] leading-relaxed text-navy-600">
            {STATUS_MSG[patient.status]}
          </div>

          {patient.status === 'cadastro_incompleto' && !hasPersonalData && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-sm text-navy-300">Complete seus dados pessoais em &quot;Meus dados&quot; para prosseguir.</p>
              <Link href="/dashboard/dados" className="w-fit rounded-[8px] bg-brand-500 px-5 py-3 text-sm font-bold text-primary-on">
                Ir para Meus dados
              </Link>
            </div>
          )}

          {patient.status === 'cadastro_incompleto' && hasPersonalData && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-sm text-navy-300">
                Continue as etapas do cadastro para prosseguir com sua consulta.
              </p>
              <Link
                href="/registro"
                className="w-fit rounded-[8px] bg-brand-500 px-5 py-3 text-sm font-bold text-primary-on"
              >
                Continuar cadastro
              </Link>
            </div>
          )}

          {patient.status === 'aguardando_pagamento' && (
            <div className="mt-5">
              <PaymentPanel cpf={patient.personal_data?.cpf ?? ''} />
            </div>
          )}

          {patient.status === 'aguardando_medico' && !consultaDone && (
            <div className="mt-5 flex flex-col gap-3">
              {docsComplete ? (
                <>
                  <p className="text-sm text-navy-300">
                    Responda as perguntas da nossa assistente para o médico analisar seu caso.
                  </p>
                  <Link
                    href="/dashboard/chat"
                    className="w-fit rounded-[8px] bg-brand-500 px-5 py-3 text-sm font-bold text-primary-on"
                  >
                    Iniciar consulta
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-navy-300">
                    Envie seus documentos em &quot;Meus dados&quot; para liberar a consulta.
                  </p>
                  <Link
                    href="/dashboard/dados"
                    className="w-fit rounded-[8px] bg-brand-500 px-5 py-3 text-sm font-bold text-primary-on"
                  >
                    Enviar documentos
                  </Link>
                </>
              )}
            </div>
          )}

          {patient.status === 'aguardando_medico' && consultaDone && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-sm text-navy-300">
                Consulta realizada! O médico está analisando suas respostas e em breve libera sua receita e laudo.
              </p>
              <Link
                href="/dashboard/chat"
                className="w-fit rounded-[8px] border border-line-300 bg-surface-page px-5 py-3 text-sm font-bold text-navy-700"
              >
                Rever minha consulta
              </Link>
            </div>
          )}
        </div>

        {patient.status === 'concluido' ? (
          <CompletedConsultationCard patient={patient} />
        ) : (
          <ConsultationCard patient={patient} />
        )}
      </div>
    </div>
  )
}
