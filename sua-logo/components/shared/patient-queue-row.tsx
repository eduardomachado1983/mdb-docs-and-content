import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn, initials } from '@/lib/utils'
import type { Patient } from '@/types'

export function PatientQueueRow({
  patient,
  docsComplete,
  statusLabel,
  actionLabel,
  href,
  editHref,
  accent = 'teal',
}: {
  patient: Patient
  docsComplete: boolean
  statusLabel: string
  actionLabel: string
  href: string
  editHref?: string
  accent?: 'teal' | 'admin'
}) {
  const name = patient.personal_data?.full_name || 'Paciente'
  const email = patient.personal_data?.email || '—'
  const phone = patient.personal_data?.phone
  const paid = Boolean(patient.payment?.confirmed)

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold',
            accent === 'admin' ? 'bg-admin-100 text-admin-500' : 'bg-teal-100 text-navy-900'
          )}
        >
          {initials(name)}
        </div>
        <div>
          <div className="text-[15px] font-bold text-navy-800">{name}</div>
          <div className="flex items-center gap-3 text-[13px] text-navy-200">
            <span>{email}</span>
            {phone && <span>📞 {phone}</span>}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="amber">{statusLabel}</Badge>
            {paid && <Badge variant="teal">✓ Pago</Badge>}
            {docsComplete && <Badge variant="teal">✓ Docs enviados</Badge>}
            {patient.clinical?.saved_by_doctor && <Badge variant="brand">✓ Prontuário do médico</Badge>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {editHref && (
          <Link
            href={editHref}
            className="rounded-[4px] border border-line-300 px-5 py-2.5 text-sm font-bold text-navy-700 hover:bg-surface-page"
          >
            ✏️ Editar
          </Link>
        )}
        <Link
          href={href}
          className={cn(
            'rounded-[4px] px-5 py-2.5 text-sm font-bold',
            accent === 'admin' ? 'bg-admin-500 text-white' : 'bg-teal-500 text-primary-on'
          )}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}
