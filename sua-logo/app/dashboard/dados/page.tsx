import { redirect } from 'next/navigation'
import { createClient, getUserAndProfile } from '@/lib/supabase/server'
import { PatientHeader } from '@/components/shared/patient-header'
import { PersonalDataForm } from '@/components/shared/personal-data-form'
import { DocumentUpload } from '@/components/shared/document-upload'
import type { Patient } from '@/types'

const DOCS_UNLOCKED: Patient['status'][] = ['aguardando_medico', 'retido_admin', 'concluido']

const REQUIRED_DOCS: { type: string; label: string }[] = [
  { type: 'identity', label: 'documento de identidade' },
  { type: 'address', label: 'comprovante de endereço' },
]

export default async function DadosPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('*').eq('user_id', user.id).single<Patient>()
  const { data: documents } = await supabase
    .from('documents').select('*').eq('patient_id', patient?.id ?? '')

  if (!patient) {
    return <main className="mx-auto max-w-2xl px-6 py-16">Nenhum registro de paciente encontrado.</main>
  }

  const docsUnlocked = DOCS_UNLOCKED.includes(patient.status)
  const uploadedTypes = new Set<string>((documents ?? []).map((d) => d.type))
  const missingDocs = REQUIRED_DOCS.filter((d) => !uploadedTypes.has(d.type))
  const showReminder = patient.admin_validation?.reminder_reason === 'documentos' && missingDocs.length > 0

  return (
    <div className="min-h-screen">
      <PatientHeader patientName={profile?.name ?? 'Paciente'} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Meus dados</h1>
        <p className="mb-5 text-[15px] text-navy-300">Mantenha seus dados pessoais atualizados.</p>

        <div className="mb-[18px] rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
          <PersonalDataForm initial={patient.personal_data} />
        </div>

        {showReminder && (
          <div className="mb-[18px] rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-bold text-amber-800">⚠️ A administração pediu o envio de: {missingDocs.map((d) => d.label).join(', ')}.</p>
          </div>
        )}

        <div className="mb-[18px] rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
          <div className="mb-1 text-[15px] font-bold">📎 Documentos</div>
          <p className="mb-4 text-sm text-navy-300">Documento de identidade e comprovante de endereço.</p>
          {docsUnlocked ? (
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
