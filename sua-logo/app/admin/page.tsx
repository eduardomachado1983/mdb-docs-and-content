import Link from 'next/link'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/shared/logout-button'
import { PatientListRow } from '@/components/shared/patient-list-row'
import { initials } from '@/lib/utils'
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

  const { data: allPatients } = await supabase
    .from('patients')
    .select('*')
    .order('updated_at', { ascending: false })
    .returns<Patient[]>()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line-200 bg-white">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-[13px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-admin-500 text-[11px] font-extrabold text-white">
              SL
            </div>
            <span className="text-[15px] font-extrabold">
              Sua Logo <span className="text-xs font-semibold text-navy-100">· Administrador</span>
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
                {initials(profile?.name ?? 'Ad')}
              </div>
              <span className="text-sm font-bold">{profile?.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-5 text-2xl font-extrabold">Painel do administrador</h1>

        <div className="mb-[18px] overflow-hidden rounded-2xl border border-line-200 bg-white">
          <div className="flex items-center gap-2 px-6 py-4 text-[15px] font-extrabold">
            🛡️ Aguardando validação final
            <span className="rounded-full bg-admin-100 px-2 py-0.5 text-xs font-bold text-admin-500">{pending?.length ?? 0}</span>
          </div>
          {!pending?.length && (
            <div className="border-t border-line-100 px-6 py-8 text-center text-sm text-navy-200">Nenhum paciente aguardando validação.</div>
          )}
          {pending?.map((patient) => {
            const name = (patient.personal_data as { full_name?: string })?.full_name || 'Paciente'
            return (
              <div key={patient.id} className="flex items-center justify-between gap-3 border-t border-line-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
                    {initials(name)}
                  </div>
                  <div className="text-sm font-bold">{name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy-200">Prontuário emitido pelo médico</span>
                  <Link href={`/admin/validacao/${patient.id}`} className="rounded-[10px] bg-admin-500 px-4 py-2.5 text-sm font-bold text-white">
                    Validar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-line-200 bg-white">
          <div className="px-6 py-4 text-[15px] font-extrabold">👥 Todos os pacientes</div>
          {allPatients?.map((patient) => (
            <PatientListRow key={patient.id} patient={patient} href={`/admin/validacao/${patient.id}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
