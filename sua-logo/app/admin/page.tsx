import { AlertTriangle } from 'lucide-react'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { AdminPatientCard } from '@/components/shared/admin-patient-card'
import { RefreshButton } from '@/components/shared/refresh-button'
import type { Patient } from '@/types'

export default async function AdminPage() {
  const profile = await getProfile()
  const supabase = await createServiceClient()

  const { data: pending } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'retido_admin')
    .order('updated_at', { ascending: true })
    .returns<Patient[]>()

  const patientIds = pending?.map((p) => p.id) ?? []
  const docsByPatient = new Map<string, Set<string>>()
  if (patientIds.length > 0) {
    const { data: docs } = await supabase.from('documents').select('patient_id, type').in('patient_id', patientIds)
    docs?.forEach((d) => {
      const set = docsByPatient.get(d.patient_id) ?? new Set<string>()
      set.add(d.type)
      docsByPatient.set(d.patient_id, set)
    })
  }

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel do administrador</h1>
        <p className="mb-5 text-[15px] text-navy-300">Aguardando validação</p>

        {!pending?.length && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-base font-bold text-navy-800">Nenhum paciente na fila</div>
            <p className="max-w-sm text-sm text-navy-300">
              Olá, neste momento não tem paciente na fila de atendimento.
            </p>
            <RefreshButton label="Atualize a fila de pacientes" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {pending?.map((patient) => {
            const docs = docsByPatient.get(patient.id)
            const docsComplete = Boolean(docs?.has('identity') && docs?.has('address'))
            return (
              <AdminPatientCard
                key={patient.id}
                patient={patient}
                docsComplete={docsComplete}
                identifier="cpf"
                actionLabel="Validar"
                href={`/admin/validacao/${patient.id}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
