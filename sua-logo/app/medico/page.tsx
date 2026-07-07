import Link from 'next/link'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { MedicoHeader } from '@/components/shared/medico-header'
import { Badge } from '@/components/ui/badge'
import { initials } from '@/lib/utils'
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

  const patientIds = queue?.map((p) => p.id) ?? []
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
      <MedicoHeader doctorName={profile?.name ?? 'Médico'} crm={profile?.crm} specialty={profile?.specialty} />

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel do médico</h1>
        <p className="mb-5 text-[15px] text-navy-300">Fila de atendimento</p>

        {!queue?.length && (
          <div className="rounded-2xl border border-line-200 bg-white px-6 py-8 text-center text-sm text-navy-200">
            Nenhum paciente na fila.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {queue?.map((patient) => {
            const name = patient.personal_data?.full_name || 'Paciente'
            const email = patient.personal_data?.email || '—'
            const phone = patient.personal_data?.phone
            const docs = docsByPatient.get(patient.id)
            const docsComplete = Boolean(docs?.has('identity') && docs?.has('address'))
            const paid = Boolean(patient.payment?.confirmed)

            return (
              <div key={patient.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line-200 bg-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-teal-600">
                    {initials(name)}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-navy-800">{name}</div>
                    <div className="flex items-center gap-3 text-[13px] text-navy-200">
                      <span>{email}</span>
                      {phone && <span>📞 {phone}</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="amber">Na fila do médico</Badge>
                      {paid && <Badge variant="teal">✓ Pago</Badge>}
                      {docsComplete && <Badge variant="teal">✓ Docs enviados</Badge>}
                    </div>
                  </div>
                </div>
                <Link href={`/medico/paciente/${patient.id}`} className="rounded-[10px] bg-teal-500 px-5 py-2.5 text-sm font-bold text-white">
                  Visualizar
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
