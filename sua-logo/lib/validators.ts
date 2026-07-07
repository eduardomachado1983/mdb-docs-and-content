// Validações dos campos de cadastro (dados pessoais).
// Cada função retorna uma mensagem de erro (string) ou null se válido.

export function validateFullName(value: string): string | null {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) return 'Informe nome e sobrenome.'
  if (parts.some((p) => p.length < 2)) return 'Nome e sobrenome devem ter ao menos 2 letras.'
  return null
}

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return 'Informe seu e-mail.'
  // exige algo@algo.dominio
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido (ex.: nome@email.com).'
  return null
}

// Valida CPF: 11 dígitos + dígitos verificadores.
export function validateCPF(value: string): string | null {
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11) return 'CPF deve ter 11 dígitos.'
  if (/^(\d)\1{10}$/.test(cpf)) return 'CPF inválido.'

  const digits = cpf.split('').map(Number)
  for (let t = 9; t < 11; t++) {
    let sum = 0
    for (let i = 0; i < t; i++) sum += digits[i] * (t + 1 - i)
    let check = (sum * 10) % 11
    if (check === 10) check = 0
    if (check !== digits[t]) return 'CPF inválido.'
  }
  return null
}

// Valida maioridade (18+) a partir da data de nascimento (YYYY-MM-DD).
export function validateBirthDate(value: string): string | null {
  if (!value) return 'Informe a data de nascimento.'
  const birth = new Date(value)
  if (Number.isNaN(birth.getTime())) return 'Data de nascimento inválida.'

  const today = new Date()
  if (birth > today) return 'Data de nascimento não pode ser no futuro.'

  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

  if (age < 18) return 'É necessário ser maior de 18 anos.'
  if (age > 120) return 'Data de nascimento inválida.'
  return null
}

// Valida telefone com DDD (10 ou 11 dígitos).
export function validatePhone(value: string): string | null {
  const phone = value.replace(/\D/g, '')
  if (phone.length < 10 || phone.length > 11) return 'Telefone com DDD (ex.: (48) 99999-0000).'
  const ddd = Number(phone.slice(0, 2))
  if (ddd < 11 || ddd > 99) return 'DDD inválido.'
  return null
}

// Regras de senha forte.
export function validatePassword(value: string): string | null {
  if (value.length < 8) return 'A senha deve ter ao menos 8 caracteres.'
  if (!/[A-Z]/.test(value)) return 'Inclua ao menos uma letra maiúscula.'
  if (!/[a-z]/.test(value)) return 'Inclua ao menos uma letra minúscula.'
  if (!/[0-9]/.test(value)) return 'Inclua ao menos um número.'
  return null
}
