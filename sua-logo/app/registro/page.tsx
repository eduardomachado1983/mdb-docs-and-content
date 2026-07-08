'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { PaymentPanel } from '@/components/shared/payment-panel'
import { DocumentUpload } from '@/components/shared/document-upload'
import { SingleDocumentUpload } from '@/components/shared/single-document-upload'
import { WizardStepper } from '@/components/shared/wizard-stepper'
import { SiteHeader } from '@/components/shared/site-header'
import { cn } from '@/lib/utils'
import {
  validateFullName, validateEmail, validateCPF,
  validateBirthDate, validatePhone, validatePassword,
} from '@/lib/validators'
import type { Document } from '@/types'

const STEPS = [
  { title: 'Dados pessoais' },
  { title: 'Consulta' },
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

type FieldErrors = Partial<Record<keyof FormState, string | null>>

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([])

  const hasIdentity = uploadedDocs.some((d) => d.type === 'identity')
  const hasAddress = uploadedDocs.some((d) => d.type === 'address')
  const docsComplete = hasIdentity && hasAddress

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // limpa o erro do campo assim que o usuário começa a corrigir
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev))
  }

  function validateStep1(): boolean {
    const next: FieldErrors = {
      nome: validateFullName(form.nome),
      email: validateEmail(form.email),
      cpf: validateCPF(form.cpf),
      rg: form.rg.trim() ? null : 'Informe o RG.',
      nascimento: validateBirthDate(form.nascimento),
      telefone: validatePhone(form.telefone),
      senha: validatePassword(form.senha),
      senha2: form.senha2 !== form.senha ? 'As senhas não coincidem.' : null,
    }
    setErrors(next)
    return Object.values(next).every((e) => !e)
  }

  async function handleStep1() {
    if (!validateStep1()) {
      toast.error('Revise os campos destacados.')
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

  function validateStep2(): boolean {
    const next: FieldErrors = {
      sintomas: form.sintomas.trim() ? null : 'Descreva os sintomas.',
      local: form.local.trim() ? null : 'Informe a localização.',
    }
    setErrors((prev) => ({ ...prev, ...next }))
    return Object.values(next).every((e) => !e)
  }

  async function handleStep2() {
    if (!validateStep2()) {
      toast.error('Revise os campos destacados.')
      return
    }
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-surface-page to-brand-50">
      <SiteHeader />

      <div className="mx-auto mt-10 w-full max-w-[680px] px-6 pb-12">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-extrabold">Cadastro da consulta</h1>
          <p className="mt-1 text-[15px] text-navy-300">Leva poucos minutos. Seus dados são protegidos.</p>
        </div>

        <div className="mb-7">
          <WizardStepper steps={STEPS} current={step} />
        </div>

        <div className="mx-auto max-w-[560px] rounded-[22px] border border-white/30 bg-white/65 backdrop-blur-xl p-8 shadow-[0_24px_50px_rgba(20,50,90,.08)]">
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Dados pessoais</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 1 de 4</div>
              <div className="flex flex-col gap-4">
                <Field label="Nome completo" value={form.nome} onChange={(v) => update('nome', v)} placeholder="Nome e sobrenome" error={errors.nome} />
                <Field label="E-mail" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="seu@email.com" error={errors.email} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CPF" value={form.cpf} onChange={(v) => update('cpf', v)} placeholder="000.000.000-00" inputMode="numeric" error={errors.cpf} />
                  <Field label="RG" value={form.rg} onChange={(v) => update('rg', v)} placeholder="00.000.000-0" error={errors.rg} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Data de nascimento" type="date" value={form.nascimento} onChange={(v) => update('nascimento', v)} error={errors.nascimento} />
                  <Field label="Telefone" value={form.telefone} onChange={(v) => update('telefone', v)} placeholder="(00) 00000-0000" inputMode="tel" error={errors.telefone} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PasswordField
                    label="Senha" value={form.senha} onChange={(v) => update('senha', v)}
                    placeholder="Crie uma senha" error={errors.senha}
                    hint="Mínimo 8 caracteres, com maiúscula, minúscula e número."
                  />
                  <PasswordField
                    label="Confirmar senha" value={form.senha2} onChange={(v) => update('senha2', v)}
                    placeholder="Repita a senha" error={errors.senha2}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Consulta</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 2 de 4</div>
              <div className="flex flex-col gap-4">
                <TextAreaField label="Sintomas" value={form.sintomas} onChange={(v) => update('sintomas', v)} placeholder="Descreva o que você está sentindo..." error={errors.sintomas} />
                <Field label="Localização" value={form.local} onChange={(v) => update('local', v)} placeholder="Ex.: cabeça, garganta, abdômen..." error={errors.local} />
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Intensidade — {form.intensidade}/10</label>
                  <input
                    type="range" min={1} max={10} value={form.intensidade}
                    onChange={(e) => update('intensidade', Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                </div>
                <TextAreaField label="Histórico médico" value={form.historico} onChange={(v) => update('historico', v)} placeholder="Ex.: alergia a dipirona, uso de losartana..." />
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Documento de consultas anteriores (opcional)</label>
                  <SingleDocumentUpload type="previous_consultation" label="Ex.: consultas anteriores, exames..." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Documentos</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 3 de 4 — envie seu documento de identidade e comprovante de residência</div>
              <DocumentUpload initialDocuments={[]} onChange={setUploadedDocs} />
              {!docsComplete && (
                <p className="mt-3 text-xs text-navy-200">Envie os 2 documentos para continuar.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <div className="mb-1 text-lg font-extrabold">Pagamento</div>
              <div className="mb-[18px] text-sm text-navy-300">Etapa 4 de 4 — valor da consulta: <strong className="text-navy-900">R$ 2,00</strong></div>
              <PaymentPanel cpf={form.cpf} />
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
                onClick={step === 1 ? handleStep1 : step === 2 ? handleStep2 : () => setStep(4)}
                disabled={loading || (step === 3 && !docsComplete)}
                className="rounded-full bg-brand-500 px-6 py-3 text-[15px] font-bold text-primary-on disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Continuar →'}
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
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', error, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
  type?: string; error?: string | null; inputMode?: 'numeric' | 'tel'
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-navy-700">{label}</label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-[10px] border px-3.5 py-3 text-[15px] outline-none',
          error ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
        )}
      />
      {error && <p className="mt-1 text-xs font-semibold text-error-500">{error}</p>}
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder, error, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; error?: string | null; hint?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-navy-700">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full rounded-[10px] border px-3.5 py-3 pr-11 text-[15px] outline-none',
            error ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600"
        >
          {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {error ? (
        <p className="mt-1 text-xs font-semibold text-error-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-navy-200">{hint}</p>
      ) : null}
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder, error }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string | null
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-navy-700">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-[10px] border px-3.5 py-3 text-[15px] outline-none',
          error ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
        )}
      />
      {error && <p className="mt-1 text-xs font-semibold text-error-500">{error}</p>}
    </div>
  )
}
