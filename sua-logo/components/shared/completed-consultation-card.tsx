import Link from 'next/link'
import { formatDateTimeBR } from '@/lib/utils'
import type { Patient } from '@/types'

// Card exibido em "Minhas consultas" quando o paciente já concluiu o
// atendimento — poucas informações, com link para ver receita/laudo
// completos em "Meus dados".
export function CompletedConsultationCard({ patient }: { patient: Patient }) {
  return (
    <div className="mb-[18px] flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg">
          ✅
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-navy-800">Consulta concluída</div>
          <div className="truncate text-[13px] text-navy-200">{formatDateTimeBR(patient.updated_at)}</div>
        </div>
      </div>

      <div className="text-sm text-navy-600 sm:max-w-[280px]">
        <span className="text-navy-300">Objetivo:</span> {patient.triage?.main_symptom || '—'}
      </div>

      <Link
        href="/dashboard/dados"
        className="rounded-[4px] border border-brand-500 bg-white px-6 py-2.5 text-center text-sm font-bold text-brand-600 transition hover:bg-brand-50 active:scale-[0.98]"
      >
        Visualizar
      </Link>
    </div>
  )
}
