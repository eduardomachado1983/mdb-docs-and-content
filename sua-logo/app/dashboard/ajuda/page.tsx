import { redirect } from 'next/navigation'
import { createClient, getUserAndProfile } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { SupportChat } from '@/components/shared/support-chat'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { SUPPORT_EMAIL } from '@/lib/faq'
import { STATUS_LABELS, type Patient } from '@/types'

export default async function AjudaPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('status').eq('user_id', user.id).single<Pick<Patient, 'status'>>()

  return (
    <div className="min-h-screen">
      <PatientHeader
        patientName={profile?.name ?? 'Paciente'}
        statusLabel={patient ? STATUS_LABELS[patient.status] : undefined}
      />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Ajuda</h1>
        <p className="mb-5 text-[15px] text-navy-300">
          Tire suas dúvidas com o nosso assistente ou consulte as perguntas frequentes.
        </p>

        <div className="mb-[18px] rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
          <div className="mb-4 text-[15px] font-bold">💬 Chat de ajuda</div>
          <SupportChat />
        </div>

        <div className="mb-[18px] rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
          <div className="mb-4 text-[15px] font-bold">❓ Perguntas frequentes</div>
          <FaqAccordion />
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
          <div className="mb-1 text-[15px] font-bold">📩 Ainda precisa de ajuda?</div>
          <p className="text-sm text-navy-300">
            Fale com nossa equipe de suporte (atendimento 24h) pelo e-mail{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
