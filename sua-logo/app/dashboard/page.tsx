import { redirect } from 'next/navigation'
import { createClient, getProfile, getUser } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { PersonalDataForm } from '@/components/shared/personal-data-form'
import { STATUS_LABELS, type Patient } from '@/types'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} statusLabel={STATUS_LABELS[patient.status]} />

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Meus dados</h1>
        <p className="mb-5 text-[15px] text-navy-300">Mantenha seus dados pessoais atualizados.</p>

        <div className="mb-[18px] rounded-2xl border border-line-200 bg-white p-6">
          <PersonalDataForm initial={patient.personal_data} />
        </div>

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
      </div>
    </div>
  )
}
