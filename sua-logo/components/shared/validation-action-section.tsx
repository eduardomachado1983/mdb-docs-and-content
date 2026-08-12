'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DeletePatientModal } from './delete-patient-modal'
import { ValidationActionButton } from './validation-action-button'
import type { ReminderReason } from '@/types'

interface ValidacionActionSectionProps {
  patientId: string
  patientName: string | undefined
  allReady: boolean
  reason: ReminderReason | undefined
  alreadyNotified: boolean
}

export function ValidacionActionSection({
  patientId,
  patientName,
  allReady,
  reason,
  alreadyNotified,
}: ValidacionActionSectionProps) {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <>
      <div className="flex justify-end gap-3">
        <Link
          href="/admin/pacientes"
          className="flex items-center rounded-[8px] border border-teal-500 px-5 py-2.5 text-sm font-bold text-teal-600 transition hover:bg-teal-50 active:scale-[0.98]"
        >
          Voltar
        </Link>

        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="flex items-center rounded-[8px] border border-error-500 px-5 py-2.5 text-sm font-bold text-error-600 transition hover:bg-error-50 active:scale-[0.98]"
        >
          Excluir paciente
        </button>

        <ValidationActionButton
          patientId={patientId}
          allReady={allReady}
          reason={reason}
          alreadyNotified={alreadyNotified}
        />
      </div>

      <DeletePatientModal
        patientId={patientId}
        patientName={patientName}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDeleted={() => router.push('/admin/pacientes')}
      />
    </>
  )
}
