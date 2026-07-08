export function validateFullName(name: string): string | null {
  if (!name.trim()) return 'Informe seu nome completo'
  if (name.trim().split(' ').length < 2) return 'Informe nome e sobrenome'
  return null
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Informe seu e-mail'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido'
  return null
}

// Valida CPF com dígitos verificadores reais.
export function validateCPF(cpf: string): string | null {
  const digits = cpf.replace(/\D/g, '')
  if (!digits) return 'Informe seu CPF'
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return 'CPF inválido'

  const calcDigit = (base: string, weightStart: number) => {
    let sum = 0
    for (let i = 0; i < base.length; i++) sum += Number(base[i]) * (weightStart - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const d1 = calcDigit(digits.slice(0, 9), 10)
  const d2 = calcDigit(digits.slice(0, 10), 11)
  if (d1 !== Number(digits[9]) || d2 !== Number(digits[10])) return 'CPF inválido'
  return null
}

export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return 'Informe seu telefone'
  if (digits.length < 10 || digits.length > 11) return 'Telefone inválido'
  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Mínimo de 8 caracteres'
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Use letras maiúsculas, minúsculas e números'
  }
  return null
}

export function validateRequired(value: string): string | null {
  return value.trim() ? null : 'Campo obrigatório'
}
