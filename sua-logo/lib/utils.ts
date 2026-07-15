import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function patientCode(id: string): string {
  return `PNT-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Formata "YYYY-MM-DD" (valor de <input type="date">) para "DD/MM/YYYY".
export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  if (!y || !m || !d) return dateStr
  return `${d}/${m}/${y}`
}

// Formata um timestamp ISO para data e hora no padrão brasileiro.
export function formatDateTimeBR(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// Formata um valor em centavos para Real (ex.: 200 -> "R$ 2,00").
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Só os dígitos de um telefone, para comparar números em formatos diferentes
// (ex.: WhatsApp "5511999998888" vs. cadastro "(11) 99999-8888").
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

// Compara dois telefones pelos últimos 10-11 dígitos (ignora DDI/zeros à esquerda).
export function samePhoneNumber(a: string, b: string): boolean {
  const da = phoneDigits(a).slice(-11)
  const db = phoneDigits(b).slice(-11)
  return da.length >= 8 && da === db
}
