import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { PatientQueueRow } from '@/components/shared/patient-queue-row'
import type { Patient, PaymentTransaction } from '@/types'

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
  const txByPatient = new Map<string, PaymentTransaction[]>()
  if (patientIds.length > 0) {
    const { data: docs } = await supabase.from('documents').select('patient_id, type').in('patient_id', patientIds)
    docs?.forEach((d) => {
      const set = docsByPatient.get(d.patient_id) ?? new Set<string>()
      set.add(d.type)
      docsByPatient.set(d.patient_id, set)
    })

    const { data: transactions } = await supabase
      .from('payment_transactions').select('*').in('patient_id', patientIds).order('created_at', { ascending: false })
    transactions?.forEach((t) => {
      const arr = txByPatient.get(t.patient_id) ?? []
      arr.push(t)
      txByPatient.set(t.patient_id, arr)
    })
  }

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel do administrador</h1>
        <p className="mb-5 text-[15px] text-navy-300">Aguardando validação</p>

        {!pending?.length && (
          <div className="rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-8 text-center text-sm text-navy-200">
            Nenhum paciente aguardando validação.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {pending?.map((patient) => {
            const docs = docsByPatient.get(patient.id)
            const docsComplete = Boolean(docs?.has('identity') && docs?.has('address'))
            return (
              <PatientQueueRow
                key={patient.id}
                patient={patient}
                docsComplete={docsComplete}
                statusLabel="Aguardando validação"
                actionLabel="Validar"
                href={`/admin/validacao/${patient.id}`}
                accent="admin"
                transactions={txByPatient.get(patient.id) ?? []}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
