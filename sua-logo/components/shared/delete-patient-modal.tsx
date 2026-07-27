'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface DeletePatientModalProps {
  patientId: string
  patientName: string | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeletePatientModal({
  patientId,
  patientName,
  open,
  onOpenChange,
  onDeleted,
}: DeletePatientModalProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/patients/${patientId}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar paciente')
      }

      toast.success('Paciente removido com sucesso')
      onOpenChange(false)
      onDeleted?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-6 w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-2 text-lg font-extrabold">Excluir paciente</h2>
        <p className="mb-4 text-sm text-navy-600">
          Você está prestes a deletar o paciente <strong>{patientName}</strong>. Esta ação não pode ser desfeita.
        </p>

        <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-700">
          <strong>⚠️ Aviso:</strong> Após excluir, será necessário realizar um novo cadastro completo para este paciente.
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-[8px] border border-navy-200 px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-[8px] bg-error-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-error-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Excluindo...' : 'Sim, excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
