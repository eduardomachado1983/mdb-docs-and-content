'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn, formatDateBR } from '@/lib/utils'
import type { PersonalData } from '@/types'

function emptyForm(initial?: Partial<PersonalData>) {
  return {
    full_name: initial?.full_name ?? '',
    cpf: initial?.cpf ?? '',
    rg: initial?.rg ?? '',
    birth_date: initial?.birth_date ?? '',
    phone: initial?.phone ?? '',
  }
}

export function AdminPatientHeader({
  patientId,
  initial,
  initialEditing = false,
}: {
  patientId: string
  initial?: PersonalData
  initialEditing?: boolean
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(initialEditing)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm(initial))

  function update(field: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function cancelEdit() {
    setForm(emptyForm(initial))
    setEditing(false)
  }

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/patients/${patientId}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error ?? 'Falha ao salvar dados')
        return
      }
      toast.success('Dados salvos!')
      setEditing(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            aria-label="Voltar ao painel"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-300 text-navy-500 hover:bg-surface-page"
          >
            ←
          </Link>
          <h1 className="text-xl font-extrabold">Detalhes do paciente</h1>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="rounded-full border border-line-300 px-4 py-2 text-sm font-bold text-navy-500 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="rounded-full bg-admin-500 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border border-line-300 px-4 py-2 text-sm font-bold text-navy-700 hover:bg-surface-page"
            >
              ✏️ Editar
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" value={form.full_name} onChange={(v) => update('full_name', v)} className="sm:col-span-2" />
            <Field label="CPF" value={form.cpf} onChange={(v) => update('cpf', v)} />
            <Field label="RG" value={form.rg} onChange={(v) => update('rg', v)} />
            <Field label="Data de nascimento" type="date" value={form.birth_date} onChange={(v) => update('birth_date', v)} />
            <Field label="Telefone" value={form.phone} onChange={(v) => update('phone', v)} />
          </div>
        ) : (
          <div className="grid gap-2 text-sm text-navy-600">
            <p className="text-[15px] font-extrabold text-navy-900">{form.full_name || '—'}</p>
            <p>CPF: {form.cpf || '—'}</p>
            <p>RG: {form.rg || '—'}</p>
            <p>Nascimento: {form.birth_date ? formatDateBR(form.birth_date) : '—'}</p>
            <p>Telefone: {form.phone || '—'}</p>
            <p>E-mail: {initial?.email || '—'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', className }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-bold text-navy-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-line-400 px-3.5 py-3 text-[15px] outline-none focus:border-admin-500"
      />
    </div>
  )
}
