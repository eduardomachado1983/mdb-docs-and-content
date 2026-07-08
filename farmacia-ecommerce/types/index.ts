// ══════════════════════════════════════
// Tipos centrais do projeto
// ══════════════════════════════════════

export type Role = 'customer' | 'admin'

export type OrderStatus =
  | 'aguardando_docs'
  | 'em_analise'
  | 'aprovado'
  | 'em_separacao'
  | 'enviado'
  | 'entregue'
  | 'recusado'

// Tarja vermelha / tarja amarela / venda livre
export type ControlledClass = 'V' | 'A' | 'L'

export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface Profile {
  id: string
  name: string
  email: string
  role: Role
  cpf?: string
  phone?: string
  address?: Address
  createdAt: string
}

export interface Product {
  id: string
  name: string
  activeIngredient: string
  category: string
  priceCents: number
  stock: number
  controlledClass: ControlledClass
  requiresPrescription: boolean
  requiresReport: boolean
  description: string
}

export interface OrderItem {
  productId: string
  productName: string
  unitPriceCents: number
  qty: number
}

export interface OrderDocument {
  uploaded: boolean
  filename?: string
  validated?: boolean
}

export interface OrderTrackingEvent {
  status: OrderStatus
  date: string
  note: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalCents: number
  status: OrderStatus
  paymentMethod: string
  createdAt: string
  shippingAddress: string
  trackingCode?: string
  prescription: OrderDocument
  medicalReport: OrderDocument
  history: OrderTrackingEvent[]
}

// Status que representam o "caminho feliz" do pedido, em ordem —
// usado pelo stepper de acompanhamento. "recusado" fica de fora por
// ser um desvio, não uma etapa do fluxo principal.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'aguardando_docs',
  'em_analise',
  'aprovado',
  'em_separacao',
  'enviado',
  'entregue',
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  aguardando_docs: 'Aguardando Documentos',
  em_analise: 'Em Análise',
  aprovado: 'Aprovado',
  em_separacao: 'Em Separação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  recusado: 'Recusado',
}

export const STATUS_SHORT_LABELS: Record<OrderStatus, string> = {
  aguardando_docs: 'Ag. Docs',
  em_analise: 'Análise',
  aprovado: 'Aprovado',
  em_separacao: 'Separação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  recusado: 'Recusado',
}
