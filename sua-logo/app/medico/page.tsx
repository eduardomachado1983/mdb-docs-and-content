import { AlertTriangle } from 'lucide-react'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { MedicoHeader } from '@/components/shared/medico-header'
import { MedicoPatientCard } from '@/components/shared/medico-patient-card'
import { RefreshButton } from '@/components/shared/refresh-button'
import type { Patient } from '@/types'

export default async function MedicoPage() {
  const profile = await getProfile()
  const supabase = await createServiceClient()

  const { data: queue } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'aguardando_medico')
    .order('updated_at', { ascending: true })
    .returns<Patient[]>()

  return (
    <div className="min-h-screen">
      <MedicoHeader doctorName={profile?.name ?? 'Médico'} crm={profile?.crm} specialty={profile?.specialty} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel do médico</h1>
        <p className="mb-5 text-[15px] text-navy-300">Fila de atendimento</p>

        {!queue?.length && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-base font-bold text-navy-800">Nenhum paciente na fila</div>
            <p className="max-w-sm text-sm text-navy-300">
              Doutor, neste momento você não tem paciente na fila de atendimento.
            </p>
            <RefreshButton label="Atualize a fila de pacientes" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {queue?.map((patient) => (
            <MedicoPatientCard key={patient.id} patient={patient} href={`/medico/paciente/${patient.id}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
