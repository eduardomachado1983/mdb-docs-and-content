import { redirect } from 'next/navigation'
import { createClient, getProfile, getUser } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { DocumentUpload } from '@/components/shared/document-upload'
import { STATUS_LABELS, type Patient } from '@/types'

const DOCS_UNLOCKED: Patient['status'][] = ['aguardando_medico', 'retido_admin', 'concluido']

export default async function DocumentosPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()
  const { data: documents } = await supabase
    .from('documents').select('*').eq('patient_id', patient?.id ?? '')

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  const unlocked = DOCS_UNLOCKED.includes(patient.status)

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} statusLabel={STATUS_LABELS[patient.status]} />

      <div className="mx-auto max-w-[960px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Documentos</h1>
        <p className="mb-5 text-[15px] text-navy-300">Documento de identidade e comprovante de endereço.</p>

        <div className="rounded-2xl border border-line-200 bg-white p-6">
          {unlocked ? (
            <>
              <DocumentUpload initialDocuments={documents ?? []} />
              <div className="mt-3.5 rounded-lg bg-surface-muted px-2.5 py-2 text-[11.5px] leading-relaxed text-navy-100">
                🔒 Visíveis apenas para os profissionais do seu caso.
              </div>
            </>
          ) : (
            <p className="text-sm text-navy-300">
              Você poderá enviar seus documentos assim que sua consulta for confirmada.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
