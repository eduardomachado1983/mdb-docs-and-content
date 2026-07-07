'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PersonalData } from '@/types'

export function PersonalDataForm({ initial }: { initial?: Partial<PersonalData> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: initial?.full_name ?? '',
    cpf: initial?.cpf ?? '',
    rg: initial?.rg ?? '',
    birth_date: initial?.birth_date ?? '',
    phone: initial?.phone ?? '',
  })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/patient/profile', {
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
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input id="full_name" required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cpf">CPF</Label>
        <Input id="cpf" required value={form.cpf} onChange={(e) => update('cpf', e.target.value)} placeholder="000.000.000-00" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rg">RG</Label>
        <Input id="rg" required value={form.rg} onChange={(e) => update('rg', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="birth_date">Data de nascimento</Label>
        <Input id="birth_date" type="date" required value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(00) 00000-0000" />
      </div>
      <Button type="submit" disabled={loading} className="sm:col-span-2">
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
