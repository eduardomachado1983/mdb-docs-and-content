import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { AdminPatientCard } from '@/components/shared/admin-patient-card'
import { PageLink } from '@/components/shared/page-link'
import type { Patient } from '@/types'

const PAGE_SIZE = 5

export default async function AdminPacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const profile = await getProfile()
  const supabase = await createServiceClient()

  const { data: allPatients, count } = await supabase
    .from('patients')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .returns<Patient[]>()

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  const patientIds = allPatients?.map((p) => p.id) ?? []
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
    <div className="min-h-screen bg-gradient-to-b from-[#eef3fb] to-[#f3f7fc]">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel administrativo</h1>
        <p className="mb-5 text-[15px] text-navy-300">Lista de pacientes</p>

        {!allPatients?.length && (
          <div className="rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-8 text-center text-sm text-navy-200">
            Nenhum paciente cadastrado.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {allPatients?.map((patient) => {
            const docs = docsByPatient.get(patient.id)
            const docsComplete = Boolean(docs?.has('identity') && docs?.has('address'))
            return (
              <AdminPatientCard
                key={patient.id}
                patient={patient}
                docsComplete={docsComplete}
                identifier="code"
                actionLabel="Visualizar"
                href={`/admin/validacao/${patient.id}`}
              />
            )
          })}
        </div>

        {(count ?? 0) > 0 && (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-navy-200">{PAGE_SIZE} itens por página</span>
            <div className="flex items-center gap-1.5">
              <PageLink href={`/admin/pacientes?page=${page - 1}`} disabled={page <= 1}>‹</PageLink>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageLink key={n} href={`/admin/pacientes?page=${n}`} active={n === page}>{n}</PageLink>
              ))}
              <PageLink href={`/admin/pacientes?page=${page + 1}`} disabled={page >= totalPages}>›</PageLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
