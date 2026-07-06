'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { DocumentUpload } from '@/components/shared/document-upload'
import { WizardStepper } from '@/components/shared/wizard-stepper'

const STEPS = [
  { title: 'Dados pessoais' },
  { title: 'Triagem' },
  { title: 'Documentos' },
  { title: 'Pagamento' },
]

interface FormState {
  nome: string
  email: string
  cpf: string
  rg: string
  nascimento: string
  telefone: string
  senha: string
  senha2: string
  sintomas: string
  local: string
  intensidade: number
  historico: string
}

const EMPTY_FORM: FormState = {
  nome: '', email: '', cpf: '', rg: '', nascimento: '', telefone: '',
  senha: '', senha2: '', sintomas: '', local: '', intensidade: 5, historico: '',
}

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleStep1() {
    if (form.senha !== form.senha2) {
      toast.error('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.nome, email: form.email, password: form.senha }),
      })
      const registerData = await registerRes.json()
      if (!registerRes.ok) {
        toast.error(registerData.error ?? 'Falha ao criar conta')
        return
      }

      const profileRes = await fetch('/api/patient/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.nome, cpf: form.cpf, rg: form.rg,
          birth_date: form.nascimento, phone: form.telefone,
        }),
      })
      if (!profileRes.ok) {
        const profileData = await profileRes.json()
        toast.error(profileData.error ?? 'Falha ao salvar dados pessoais')
        return
      }

      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  async function handleStep2() {
    setLoading(true)
    try {
      const res = await fetch('/api/patient/triage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          main_symptom: form.sintomas, pain_location: form.local,
          pain_intensity: form.intensidade, medical_history: form.historico,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao salvar triagem')
        return
      }
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-surface-page to-brand-50 px-6 py-8">
      <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-teal-500 text-xs font-extrabold text-white">
            SL
          </div>
          <span className="text-base font-extrabold text-navy-800">Sua Logo</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-navy-500">Cancelar</Link>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[680px]">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-extrabold">Cadastro da consulta</h1>
          <p className="mt-1 text-[15px] text-navy-300">Leva poucos minutos. Seus dados são protegidos.</p>
        </div>

        <div className="mb-7">
          <WizardStepper steps={STEPS} current={step} />
        </div>

        <div className="mx-auto max-w-[560px] rounded-[22px] border border-line-200 bg-white p-8 shadow-[0_24px_50px_rgba(20,50,90,.08)]">
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Dados pessoais</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 1 de 4</div>
              <div className="flex flex-col gap-4">
                <Field label="Nome completo" value={form.nome} onChange={(v) => update('nome', v)} placeholder="Seu nome" />
                <Field label="E-mail" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="seu@email.com" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CPF" value={form.cpf} onChange={(v) => update('cpf', v)} placeholder="000.000.000-00" />
                  <Field label="RG" value={form.rg} onChange={(v) => update('rg', v)} placeholder="00.000.000-0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Data de nascimento" type="date" value={form.nascimento} onChange={(v) => update('nascimento', v)} />
                  <Field label="Telefone" value={form.telefone} onChange={(v) => update('telefone', v)} placeholder="(00) 00000-0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Senha" type="password" value={form.senha} onChange={(v) => update('senha', v)} placeholder="••••••" />
                  <Field label="Confirmar senha" type="password" value={form.senha2} onChange={(v) => update('senha2', v)} placeholder="••••••" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Triagem</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 2 de 4</div>
              <div className="flex flex-col gap-4">
                <TextAreaField label="Sintomas" value={form.sintomas} onChange={(v) => update('sintomas', v)} placeholder="Descreva o que você está sentindo..." />
                <Field label="Localização" value={form.local} onChange={(v) => update('local', v)} placeholder="Ex.: cabeça, garganta, abdômen..." />
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Intensidade — {form.intensidade}/10</label>
                  <input
                    type="range" min={1} max={10} value={form.intensidade}
                    onChange={(e) => update('intensidade', Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                </div>
                <TextAreaField label="Histórico médico" value={form.historico} onChange={(v) => update('historico', v)} placeholder="Ex.: alergia a dipirona, uso de losartana..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Documentos</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 3 de 4 — envie seu documento de identidade e comprovante de residência</div>
              <DocumentUpload initialDocuments={[]} />
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Pagamento</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 4 de 4 — valor da consulta: <strong className="text-navy-900">R$ 2,00</strong></div>
              <PaymentPanel />
              <div className="mt-5 border-t border-dashed border-line-300 pt-4">
                <p className="mb-3 text-sm leading-relaxed text-navy-300">
                  Não consegue pagar agora? Sem problema — você pode finalizar o cadastro e pagar depois pela sua área.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full rounded-[11px] border border-line-300 bg-surface-page py-3 text-sm font-bold text-navy-700"
                >
                  Finalizar cadastro e pagar depois
                </button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-[11px] border border-line-300 bg-surface-page px-5 py-3 text-sm font-bold text-navy-500"
                >
                  ← Voltar
                </button>
              ) : <span />}
              <button
                onClick={step === 1 ? handleStep1 : handleStep2}
                disabled={loading}
                className="rounded-[11px] bg-brand-500 px-6 py-3 text-[15px] font-bold text-white disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Continuar →'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-[11px] border border-line-300 bg-surface-page px-5 py-3 text-sm font-bold text-navy-500"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                className="rounded-[11px] bg-brand-500 px-6 py-3 text-[15px] font-bold text-white"
              >
                Continuar →
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="mt-6">
              <button onClick={() => setStep(3)} className="text-sm font-bold text-navy-500">← Voltar</button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-navy-300">
          Já tem conta? <Link href="/login" className="font-semibold text-brand-500">Entrar</Link>
        </p>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-navy-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-line-400 px-3.5 py-3 text-[15px] outline-none focus:border-brand-500"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-navy-700">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-line-400 px-3.5 py-3 text-[15px] outline-none focus:border-brand-500"
      />
    </div>
  )
}
