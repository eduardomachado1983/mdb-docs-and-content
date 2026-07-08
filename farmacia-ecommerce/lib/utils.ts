import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

// Formata um timestamp ISO para data no padrão brasileiro.
export function formatDateBR(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// Formata um valor em centavos para Real (ex.: 200 -> "R$ 2,00").
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Gera um número de pedido no formato PED-000123 a partir de um índice sequencial.
export function orderNumber(seq: number): string {
  return `PED-${String(seq).padStart(6, '0')}`
}
