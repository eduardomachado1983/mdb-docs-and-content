import Link from 'next/link'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/shared/logout-button'
import type { Patient } from '@/types'

export default async function MedicoPage() {
  const profile = await getProfile()
  const supabase = await createServiceClient()
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'aguardando_medico')
    .order('updated_at', { ascending: true })
    .returns<Patient[]>()

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Fila de atendimento</p>
          <h1 className="text-xl font-semibold">Olá, {profile?.name}</h1>
        </div>
        <LogoutButton />
      </header>

      {!patients?.length && (
        <Card><CardContent className="py-8 text-center text-sm text-slate-500">Nenhum paciente na fila.</CardContent></Card>
      )}

      <div className="flex flex-col gap-3">
        {patients?.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle className="text-base">{patient.personal_data?.full_name ?? 'Paciente'}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-slate-500 line-clamp-1">{patient.triage?.main_symptom}</p>
              <Link href={`/medico/paciente/${patient.id}`}>
                <Button size="sm">Atender</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
