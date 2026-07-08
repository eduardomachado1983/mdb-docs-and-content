'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/mock-auth'
import { cn } from '@/lib/utils'
import { validateCPF, validateEmail, validateFullName, validatePassword, validatePhone, validateRequired } from '@/lib/validators'

interface FormState {
  nome: string; email: string; cpf: string; nasc: string; tel: string
  senha: string; confirm: string
  rua: string; bairro: string; cidade: string; uf: string; cep: string
  termos: boolean
}

const EMPTY: FormState = { nome: '', email: '', cpf: '', nasc: '', tel: '', senha: '', confirm: '', rua: '', bairro: '', cidade: '', uf: '', cep: '', termos: false }
const STEP_LABELS = ['Dados', 'Endereço', 'Senha']

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setF((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const validateStep = () => {
    const next: Record<string, string | null> = {}
    if (step === 1) {
      next.nome = validateFullName(f.nome)
      next.email = validateEmail(f.email)
      next.cpf = validateCPF(f.cpf)
      next.nasc = validateRequired(f.nasc)
      next.tel = validatePhone(f.tel)
    } else if (step === 2) {
      next.rua = validateRequired(f.rua)
      next.cidade = validateRequired(f.cidade)
      next.uf = validateRequired(f.uf)
      next.cep = validateRequired(f.cep)
    } else {
      next.senha = validatePassword(f.senha)
      next.confirm = f.senha !== f.confirm ? 'As senhas não coincidem' : null
      if (!f.termos) next.termos = 'Você precisa aceitar os termos'
    }
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v))
    setErrors(clean)
    return Object.keys(clean).length === 0
  }

  const next = () => {
    if (!validateStep()) {
      toast.error('Preencha os campos obrigatórios destacados.')
      return
    }
    if (step < 3) {
      setStep(step + 1)
      return
    }
    register({
      name: f.nome,
      email: f.email,
      cpf: f.cpf,
      phone: f.tel,
      address: { street: f.rua, city: f.cidade, state: f.uf, zip: f.cep },
    })
    toast.success('Conta criada com sucesso!')
    router.push('/loja')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-500 to-brand-400 p-4">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-5 text-center text-lg font-black text-white">💊 Criar conta — PharmaCRM</h1>
        <div className="mb-5 flex items-center justify-center">
          {STEP_LABELS.map((l, i) => (
            <div key={l} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black',
                    i + 1 <= step ? 'bg-white text-brand-600' : 'bg-white/20 text-white/40'
                  )}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={cn('text-[9px] font-bold', i + 1 === step ? 'text-white' : 'text-white/50')}>{l}</span>
              </div>
              {i < 2 && <div className={cn('mx-1.5 mb-3 h-0.5 w-10', i + 1 < step ? 'bg-white' : 'bg-white/20')} />}
            </div>
          ))}
        </div>
        <Card className="p-6">
          <div className="flex flex-col gap-2.5">
            {Object.keys(errors).length > 0 && (
              <div className="rounded-lg border-l-[3px] border-error-500 bg-error-50 px-3 py-2.5 text-[12px] font-semibold text-error-500">
                ⚠️ Preencha os campos destacados abaixo para continuar.
              </div>
            )}
            {step === 1 && (
              <>
                <h3 className="mb-1 text-[14px] font-extrabold text-navy-800">Dados Pessoais</h3>
                <Field label="Nome completo" value={f.nome} onChange={(v) => set('nome', v)} placeholder="João da Silva" error={errors.nome} />
                <Field label="E-mail" type="email" value={f.email} onChange={(v) => set('email', v)} placeholder="joao@email.com" error={errors.email} />
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="CPF" value={f.cpf} onChange={(v) => set('cpf', v)} placeholder="000.000.000-00" error={errors.cpf} />
                  <Field label="Nascimento" type="date" value={f.nasc} onChange={(v) => set('nasc', v)} error={errors.nasc} />
                </div>
                <Field label="Telefone" value={f.tel} onChange={(v) => set('tel', v)} placeholder="(11) 99999-0000" error={errors.tel} />
              </>
            )}
            {step === 2 && (
              <>
                <h3 className="mb-1 text-[14px] font-extrabold text-navy-800">Endereço de Entrega</h3>
                <Field label="Rua e número" value={f.rua} onChange={(v) => set('rua', v)} placeholder="Rua das Flores, 123" error={errors.rua} />
                <Field label="Bairro" value={f.bairro} onChange={(v) => set('bairro', v)} />
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Cidade" value={f.cidade} onChange={(v) => set('cidade', v)} error={errors.cidade} />
                  <Field label="UF" value={f.uf} onChange={(v) => set('uf', v)} placeholder="SP" error={errors.uf} />
                </div>
                <Field label="CEP" value={f.cep} onChange={(v) => set('cep', v)} placeholder="00000-000" error={errors.cep} />
              </>
            )}
            {step === 3 && (
              <>
                <h3 className="mb-1 text-[14px] font-extrabold text-navy-800">Criar Senha</h3>
                <Field label="Senha" type="password" value={f.senha} onChange={(v) => set('senha', v)} placeholder="Mínimo 8 caracteres" error={errors.senha} />
                <Field label="Confirmar Senha" type="password" value={f.confirm} onChange={(v) => set('confirm', v)} error={errors.confirm} />
                <div className="rounded-lg border-l-[3px] border-brand-500 bg-brand-50 px-3 py-2.5 text-[12px] text-brand-600">
                  📋 Para comprar medicamentos controlados, você enviará receita e/ou laudo para análise do farmacêutico.
                </div>
                <label className="flex cursor-pointer items-start gap-2">
                  <input type="checkbox" checked={f.termos} onChange={(e) => set('termos', e.target.checked)} className="mt-0.5 accent-brand-500" />
                  <span className="text-[12px] leading-5 text-navy-500">Li e aceito os Termos de Uso e a Política de Privacidade (LGPD).</span>
                </label>
                {errors.termos && <span className="ml-6 text-[10px] font-semibold text-error-500">{errors.termos}</span>}
              </>
            )}
          </div>
          <div className="mt-[18px] flex justify-between gap-2">
            <Button variant="outline" onClick={() => (step === 1 ? router.push('/login') : setStep(step - 1))}>
              {step === 1 ? '← Login' : '← Anterior'}
            </Button>
            <Button onClick={next}>{step === 3 ? '✅ Criar Conta' : 'Próximo →'}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, error, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string | null; type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className={error ? 'text-error-500' : undefined}>{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} error={error ?? undefined} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="text-[10px] font-semibold text-error-500">{error}</span>}
    </div>
  )
}
