'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  validateBirthDate, validatePhone, validatePassword, validateCEP,
} from '@/lib/validators'
import type { Document } from '@/types'

const STEPS = [
  { title: 'Dados pessoais' },
  { title: 'Triagem' },
  { title: 'Documentos' },
  { title: 'Pagamento' },
]

const OBJETIVOS: { value: string; label: string; desc: string }[] = [
  { value: 'sono', label: 'Melhora do Sono', desc: 'Ajuda para dormir melhor' },
  { value: 'calma', label: 'Mais Calma', desc: 'Controle da agitação e do nervosismo diário' },
  { value: 'foco', label: 'Aumento do Foco', desc: 'Melhorar a concentração e produtividade' },
  { value: 'estresse', label: 'Menos estresse', desc: 'Reduzir o estresse do dia a dia' },
  { value: 'ansiedade', label: 'Controle da Ansiedade', desc: 'Alívio dos sintomas de ansiedade' },
  { value: 'dor', label: 'Dor Crônica', desc: 'Reduzir dores persistentes' },
  { value: 'tdah', label: 'TDAH', desc: 'Atenção e foco para TDAH' },
  { value: 'outros', label: 'Outros', desc: 'Descreva seu objetivo' },
]

const SAUDE_PERGUNTAS: string[] = [
  'Atualmente faz algum tratamento?',
  'Faz uso de remédios psiquiátricos?',
  'Histórico de psicose, esquizofrenia?',
  'Já usou cannabis (maconha)?',
  'Possui alguma doença crônica?',
  'Possui arritmia cardíaca?',
  'Tem dores de cabeça intensas?',
  'Tem problemas digestivos?',
]

const SAUDE_MENTAL: string[] = [
  'Sente muita tristeza',
  'Perde o foco facilmente',
  'Tem problemas de memória',
  'Fica facilmente irritado ou triste',
  'Possui problema com estresse',
  'Já teve episódios de pânico?',
]

const SEXO_OPCOES = ['Masculino', 'Feminino', 'Outros'] as const

const PRODUTOS: string[] = ['Flores', 'Óleos', 'Extrações', 'Gummies', 'Pomadas']

interface FormState {
  nome: string
  email: string
  cpf: string
  rg: string
  nascimento: string
  telefone: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  senha: string
  senha2: string
  objetivos: string[]
  objetivoOutros: string
  saude: Record<string, string>
  saudeMental: string[]
  altura: string
  peso: string
  sexo: string
  sexoOutros: string
  produtos: string[]
}

const EMPTY_FORM: FormState = {
  nome: '', email: '', cpf: '', rg: '', nascimento: '', telefone: '',
  cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  senha: '', senha2: '', objetivos: [], objetivoOutros: '', saude: {}, saudeMental: [],
  altura: '', peso: '', sexo: '', sexoOutros: '', produtos: [],
}

type FieldErrors = Partial<Record<keyof FormState, string | null>>

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([])

  const hasIdentity = uploadedDocs.some((d) => d.type === 'identity')
  const hasAddress = uploadedDocs.some((d) => d.type === 'address')
  const docsComplete = hasIdentity && hasAddress

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // limpa o erro do campo assim que o usuário começa a corrigir
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev))
  }

  async function lookupCEP(digits: string) {
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error('CEP não encontrado.')
        return
      }
      setForm((prev) => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }))
      setErrors((prev) => ({ ...prev, endereco: null, bairro: null, cidade: null, estado: null }))
    } catch {
      toast.error('Não foi possível buscar o CEP. Preencha o endereço manualmente.')
    } finally {
      setCepLoading(false)
    }
  }

  function validateStep1(): boolean {
    const next: FieldErrors = {
      nome: validateFullName(form.nome),
      email: validateEmail(form.email),
      cpf: validateCPF(form.cpf),
      rg: form.rg.trim() ? null : 'Informe o RG.',
      nascimento: validateBirthDate(form.nascimento),
      telefone: validatePhone(form.telefone),
      cep: validateCEP(form.cep),
      endereco: form.endereco.trim() ? null : 'Informe o endereço.',
      numero: form.numero.trim() ? null : 'Informe o número.',
      bairro: form.bairro.trim() ? null : 'Informe o bairro.',
      cidade: form.cidade.trim() ? null : 'Informe a cidade.',
      estado: form.estado.trim() ? null : 'Informe o estado.',
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
          cep: form.cep, address: form.endereco, number: form.numero,
          complement: form.complemento, neighborhood: form.bairro,
          city: form.cidade, state: form.estado,
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

  function toggleObjetivo(value: string) {
    setForm((prev) => ({
      ...prev,
      objetivos: prev.objetivos.includes(value)
        ? prev.objetivos.filter((o) => o !== value)
        : [...prev.objetivos, value],
    }))
    setErrors((prev) => (prev.objetivos ? { ...prev, objetivos: null } : prev))
  }

  // Junta os objetivos escolhidos (labels) + o texto de "Outros" numa string,
  // que é salva em triage.main_symptom (exibida ao médico e nos cards).
  function objetivosText(): string {
    const labels = OBJETIVOS
      .filter((o) => o.value !== 'outros' && form.objetivos.includes(o.value))
      .map((o) => o.label)
    if (form.objetivos.includes('outros') && form.objetivoOutros.trim()) {
      labels.push(form.objetivoOutros.trim())
    }
    return labels.join(', ')
  }

  function setSaude(pergunta: string, value: string) {
    setForm((prev) => ({ ...prev, saude: { ...prev.saude, [pergunta]: value } }))
    setErrors((prev) => (prev.saude ? { ...prev, saude: null } : prev))
  }

  function toggleSaudeMental(value: string) {
    setForm((prev) => ({
      ...prev,
      saudeMental: prev.saudeMental.includes(value)
        ? prev.saudeMental.filter((o) => o !== value)
        : [...prev.saudeMental, value],
    }))
  }

  function setSexo(value: string) {
    update('sexo', value)
  }

  // Junta o sexo escolhido com o texto de "Outros", quando informado.
  function sexoText(): string {
    if (form.sexo === 'Outros' && form.sexoOutros.trim()) return form.sexoOutros.trim()
    return form.sexo
  }

  function toggleProduto(value: string) {
    setForm((prev) => ({
      ...prev,
      produtos: prev.produtos.includes(value)
        ? prev.produtos.filter((p) => p !== value)
        : [...prev.produtos, value],
    }))
  }

  function validateStep2(): boolean {
    const outrosMissing = form.objetivos.includes('outros') && !form.objetivoOutros.trim()
    const saudeCompleto = SAUDE_PERGUNTAS.every((p) => form.saude[p])
    const sexoOutrosMissing = form.sexo === 'Outros' && !form.sexoOutros.trim()
    const next: FieldErrors = {
      objetivos: form.objetivos.length === 0
        ? 'Selecione ao menos um objetivo.'
        : outrosMissing
          ? 'Descreva o objetivo em "Outros".'
          : null,
      saude: saudeCompleto ? null : 'Responda todas as perguntas do histórico de saúde.',
      altura: form.altura.trim() ? null : 'Informe a altura.',
      peso: form.peso.trim() ? null : 'Informe o peso.',
      sexo: !form.sexo
        ? 'Selecione o sexo.'
        : sexoOutrosMissing
          ? 'Descreva o sexo em "Outros".'
          : null,
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
          main_symptom: objetivosText(),
          health_history: form.saude, mental_health: form.saudeMental,
          height: form.altura, weight: form.peso, sex: sexoText(),
          product_preferences: form.produtos,
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

      <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-10">
        <div className="w-full">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-extrabold">Cadastro da consulta</h1>
            <p className="mt-1 text-[15px] text-navy-300">Leva poucos minutos. Seus dados são protegidos.</p>
          </div>

          <div
            className={cn(
              'w-full rounded-[22px] border bg-white/65 backdrop-blur-xl p-8 shadow-[0_24px_50px_rgba(20,50,90,.08)]',
              docsComplete ? 'border-teal-500' : 'border-white/30'
            )}
          >
            <div className="mb-7">
              <WizardStepper steps={STEPS} current={step} />
            </div>

            {step === 1 && (
              <div className="animate-fade-up">
                <div className="mb-1 text-lg font-extrabold">Dados pessoais</div>
                <div className="mb-[18px] text-sm text-navy-300">
                  Precisamos de suas informações pessoais para dar continuidade na consulta.
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nome completo" value={form.nome} onChange={(v) => update('nome', v)} placeholder="Nome e sobrenome" error={errors.nome} />
                  <Field label="E-mail" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="seu@email.com" error={errors.email} />
                  <Field label="CPF" value={form.cpf} onChange={(v) => update('cpf', v)} placeholder="000.000.000-00" inputMode="numeric" error={errors.cpf} />
                  <Field label="RG" value={form.rg} onChange={(v) => update('rg', v)} placeholder="00.000.000-0" error={errors.rg} />
                  <Field label="Data de nascimento" type="date" value={form.nascimento} onChange={(v) => update('nascimento', v)} error={errors.nascimento} />
                  <Field label="Telefone" value={form.telefone} onChange={(v) => update('telefone', v)} placeholder="(00) 00000-0000" inputMode="tel" error={errors.telefone} />
                  <Field
                    label="CEP" value={form.cep}
                    onChange={(v) => {
                      update('cep', v)
                      const digits = v.replace(/\D/g, '')
                      if (digits.length === 8) lookupCEP(digits)
                    }}
                    placeholder={cepLoading ? 'Buscando endereço...' : '00000-000'}
                    inputMode="numeric" error={errors.cep}
                  />
                  <Field label="Endereço" value={form.endereco} onChange={(v) => update('endereco', v)} placeholder="Rua, avenida..." error={errors.endereco} />
                  <Field label="Número" value={form.numero} onChange={(v) => update('numero', v)} placeholder="123" inputMode="numeric" error={errors.numero} />
                  <Field label="Complemento (opcional)" value={form.complemento} onChange={(v) => update('complemento', v)} placeholder="Apto, bloco..." />
                  <Field label="Bairro" value={form.bairro} onChange={(v) => update('bairro', v)} placeholder="Bairro" error={errors.bairro} />
                  <Field label="Cidade" value={form.cidade} onChange={(v) => update('cidade', v)} placeholder="Cidade" error={errors.cidade} />
                  <Field label="Estado" value={form.estado} onChange={(v) => update('estado', v)} placeholder="UF" error={errors.estado} />
                  <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2">
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
                <div className="mb-1 text-lg font-extrabold">Triagem</div>
                <div className="mb-[18px] text-sm text-navy-300">Qual seu objetivo com o uso de Cannabis?</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-navy-700">
                      Objetivo principal <span className="font-normal text-navy-200">(pode escolher mais de um)</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {OBJETIVOS.map((o) => {
                        const selected = form.objetivos.includes(o.value)
                        return (
                          <button
                            key={o.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleObjetivo(o.value)}
                            className={cn(
                              'flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition',
                              selected ? 'border-brand-500 bg-brand-50' : 'border-line-300 hover:border-brand-200'
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs',
                                selected ? 'border-brand-500 bg-brand-500 text-primary-on' : 'border-line-400 text-transparent'
                              )}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-navy-800">{o.label}</span>
                              <span className="block text-xs text-navy-300">{o.desc}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    {form.objetivos.includes('outros') && (
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={form.objetivoOutros}
                          onChange={(e) => update('objetivoOutros', e.target.value)}
                          placeholder="Descreva seu objetivo"
                          aria-invalid={Boolean(errors.objetivos)}
                          className="w-full rounded-[10px] border border-line-400 px-3.5 py-3 text-[15px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                        />
                      </div>
                    )}
                    {errors.objetivos && <p className="mt-1 text-xs font-semibold text-error-500">{errors.objetivos}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-navy-700">
                      Saúde mental <span className="font-normal text-navy-200">(pode escolher mais de um)</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {SAUDE_MENTAL.map((item) => {
                        const selected = form.saudeMental.includes(item)
                        return (
                          <button
                            key={item}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleSaudeMental(item)}
                            className={cn(
                              'flex items-center gap-3 rounded-[12px] border p-3.5 text-left transition',
                              selected ? 'border-brand-500 bg-brand-50' : 'border-line-300 hover:border-brand-200'
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs',
                                selected ? 'border-brand-500 bg-brand-500 text-primary-on' : 'border-line-400 text-transparent'
                              )}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <span className="text-sm font-bold text-navy-800">{item}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-navy-700">Informações físicas</label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Altura" value={form.altura} onChange={(v) => update('altura', v)} placeholder="Ex.: 1,70m" error={errors.altura} />
                      <Field label="Peso" value={form.peso} onChange={(v) => update('peso', v)} placeholder="Ex.: 70kg" error={errors.peso} />
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Sexo</label>
                        <div className="flex flex-wrap gap-2.5">
                          {SEXO_OPCOES.map((opt) => {
                            const selected = form.sexo === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setSexo(opt)}
                                className={cn(
                                  'rounded-full border px-6 py-1.5 text-sm font-bold transition',
                                  selected ? 'border-brand-500 bg-brand-500 text-primary-on' : 'border-line-300 text-navy-500 hover:border-brand-200'
                                )}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                        {form.sexo === 'Outros' && (
                          <div className="mt-2.5">
                            <input
                              type="text"
                              value={form.sexoOutros}
                              onChange={(e) => update('sexoOutros', e.target.value)}
                              placeholder="Descreva"
                              aria-invalid={Boolean(errors.sexo)}
                              className="w-full rounded-[10px] border border-line-400 px-3.5 py-3 text-[15px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                            />
                          </div>
                        )}
                        {errors.sexo && <p className="mt-1 text-xs font-semibold text-error-500">{errors.sexo}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-navy-700">
                      Produtos de preferência <span className="font-normal text-navy-200">(pode escolher mais de um)</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {PRODUTOS.map((item) => {
                        const selected = form.produtos.includes(item)
                        return (
                          <button
                            key={item}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleProduto(item)}
                            className={cn(
                              'flex items-center gap-3 rounded-[12px] border p-3.5 text-left transition',
                              selected ? 'border-brand-500 bg-brand-50' : 'border-line-300 hover:border-brand-200'
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs',
                                selected ? 'border-brand-500 bg-brand-500 text-primary-on' : 'border-line-400 text-transparent'
                              )}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <span className="text-sm font-bold text-navy-800">{item}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-navy-700">Histórico de saúde</label>
                    <div className="flex flex-col gap-2">
                      {SAUDE_PERGUNTAS.map((pergunta) => (
                        <div
                          key={pergunta}
                          className="flex flex-col gap-2 rounded-[12px] border border-line-300 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="text-sm font-semibold text-navy-700">{pergunta}</span>
                          <div className="flex shrink-0 gap-2">
                            {['Sim', 'Não'].map((opt) => {
                              const selected = form.saude[pergunta] === opt
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() => setSaude(pergunta, opt)}
                                  className={cn(
                                    'rounded-full border px-6 py-1.5 text-sm font-bold transition',
                                    selected ? 'border-brand-500 bg-brand-500 text-primary-on' : 'border-line-300 text-navy-500 hover:border-brand-200'
                                  )}
                                >
                                  {opt}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.saude && <p className="mt-1 text-xs font-semibold text-error-500">{errors.saude}</p>}
                  </div>
                  <div className="sm:col-span-2">
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
                <div className="mb-1 text-sm text-navy-300">
                  Nesta consulta médica especializada você terá receita e laudo digital com validade legal,
                  encaminhamento a parceiros que vendem os produtos e suporte 24h.
                </div>
                <div className="mb-[18px] text-sm text-navy-300">Valor da consulta: <strong className="text-navy-900">R$ 2,00</strong></div>
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
        </div>
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
        autoComplete="off"
        className={cn(
          'w-full rounded-[10px] border px-3.5 py-3 text-[15px] outline-none focus:ring-2 focus:ring-brand-200',
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
          autoComplete="new-password"
          className={cn(
            'w-full rounded-[10px] border px-3.5 py-3 pr-11 text-[15px] outline-none focus:ring-2 focus:ring-brand-200',
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
