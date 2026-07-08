import { STATUS_LABELS, STATUS_SHORT_LABELS, type OrderStatus } from '@/types'

export interface OrderStatusMeta {
  key: OrderStatus
  label: string
  shortLabel: string
  color: string
  bg: string
  icon: string
}

const COLORS: Record<OrderStatus, { color: string; bg: string; icon: string }> = {
  aguardando_docs: { color: '#b9770e', bg: '#fef6e7', icon: '📋' },
  em_analise: { color: '#2563eb', bg: '#eff6ff', icon: '🔍' },
  aprovado: { color: '#1e8449', bg: '#eafaf1', icon: '✅' },
  em_separacao: { color: '#7c3aed', bg: '#f5f3ff', icon: '📦' },
  enviado: { color: '#0d9488', bg: '#f0fdfa', icon: '🚚' },
  entregue: { color: '#166534', bg: '#dcfce7', icon: '🏠' },
  recusado: { color: '#b91c1c', bg: '#fef2f2', icon: '❌' },
}

export const ORDER_STATUSES: OrderStatusMeta[] = (Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => ({
  key,
  label: STATUS_LABELS[key],
  shortLabel: STATUS_SHORT_LABELS[key],
  ...COLORS[key],
}))

export function getStatusMeta(status: OrderStatus): OrderStatusMeta {
  return ORDER_STATUSES.find((s) => s.key === status) ?? ORDER_STATUSES[0]
}

// Próximo status no fluxo feliz, para o botão "Avançar" do admin.
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  aguardando_docs: 'em_analise',
  em_analise: 'aprovado',
  aprovado: 'em_separacao',
  em_separacao: 'enviado',
  enviado: 'entregue',
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return NEXT_STATUS[status] ?? null
}
