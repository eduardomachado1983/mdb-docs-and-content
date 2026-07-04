import Link from 'next/link'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/shared/logout-button'
import { STATUS_LABELS, type Patient, type PatientStatus } from '@/types'

const STATUSES: PatientStatus[] = [
  'cadastro_incompleto',
  'aguardando_pagamento',
  'aguardando_medico',
  'retido_admin',
  'concluido',
]

export default async function AdminPage() {
  const profile = await getProfile()
  const supabase = await createServiceClient()

  const counts: Record<string, number> = {}
  for (const status of STATUSES) {
    const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true }).eq('status', status)
    counts[status] = count ?? 0
  }

  const { data: pending } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'retido_admin')
    .order('updated_at', { ascending: true })
    .returns<Patient[]>()

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Painel administrativo</p>
          <h1 className="text-xl font-semibold">Olá, {profile?.name}</h1>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-5 gap-2 text-center">
        {STATUSES.map((status) => (
          <Card key={status}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold">{counts[status]}</p>
              <p className="text-[11px] text-slate-500">{STATUS_LABELS[status]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Aguardando validação</h2>
      {!pending?.length && (
        <Card><CardContent className="py-8 text-center text-sm text-slate-500">Nada para validar agora.</CardContent></Card>
      )}
      <div className="flex flex-col gap-3">
        {pending?.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle className="text-base">{patient.personal_data?.full_name ?? 'Paciente'}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Prontuário emitido pelo médico</p>
              <Link href={`/admin/validacao/${patient.id}`}>
                <Button size="sm">Validar</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
