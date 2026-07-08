'use client'

// ══════════════════════════════════════
// Sessão, carrinho e pedidos — provisórios, 100% client-side
// (Context + localStorage). Substituir por Supabase Auth +
// API routes reais quando o backend for integrado — ver
// "Roadmap" em CLAUDE.md. Não é autenticação segura: qualquer
// pessoa com acesso ao navegador pode inspecionar/editar o estado.
// ══════════════════════════════════════

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { MOCK_USERS, ORDERS } from '@/lib/mock-data'
import { orderNumber } from '@/lib/utils'
import type { Order, OrderItem, OrderStatus, OrderTrackingEvent, Product, Profile } from '@/types'

// ─── Auth ───────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: Profile | null
  login: (email: string, password: string) => Profile | null
  logout: () => void
  register: (data: Omit<Profile, 'id' | 'role' | 'createdAt'>) => Profile
}

const AuthContext = createContext<AuthContextValue | null>(null)
const SESSION_KEY = 'pharmacrm.session'

// ─── Carrinho ───────────────────────────────────────────────────────────
interface CartContextValue {
  items: OrderItem[]
  add: (product: Product) => void
  updateQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  totalCents: number
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_KEY = 'pharmacrm.cart'

// ─── Pedidos ────────────────────────────────────────────────────────────
interface OrdersContextValue {
  orders: Order[]
  createOrder: (input: {
    userId: string
    customerName: string
    customerEmail: string
    items: OrderItem[]
    shippingAddress: string
    requiresPrescription: boolean
    requiresReport: boolean
  }) => Order
  updateOrder: (id: string, patch: Partial<Order>, note?: string, status?: OrderStatus) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)
const ORDERS_KEY = 'pharmacrm.orders'

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [orders, setOrders] = useState<Order[]>(ORDERS)

  // Hidrata do localStorage só depois do mount, para não divergir do HTML renderizado no servidor.
  useEffect(() => {
    setUser(readStorage<Profile | null>(SESSION_KEY, null))
    setItems(readStorage<OrderItem[]>(CART_KEY, []))
    setOrders(readStorage<Order[]>(ORDERS_KEY, ORDERS))
  }, [])

  useEffect(() => {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(SESSION_KEY)
  }, [user])

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  const login = (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!found) return null
    const { password: _password, ...profile } = found
    setUser(profile)
    return profile
  }

  const logout = () => {
    setUser(null)
    setItems([])
  }

  const register: AuthContextValue['register'] = (data) => {
    const profile: Profile = { ...data, id: `usr-${Date.now()}`, role: 'customer', createdAt: new Date().toISOString().slice(0, 10) }
    setUser(profile)
    return profile
  }

  const add: CartContextValue['add'] = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { productId: product.id, productName: product.name, unitPriceCents: product.priceCents, qty: 1 }]
    })
  }

  const updateQty: CartContextValue['updateQty'] = (productId, qty) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i))))
  }

  const remove: CartContextValue['remove'] = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId))
  const clear = () => setItems([])
  const totalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0)

  const createOrder: OrdersContextValue['createOrder'] = (input) => {
    const needsDocs = input.requiresPrescription || input.requiresReport
    const firstEvent: OrderTrackingEvent = needsDocs
      ? { status: 'aguardando_docs', date: new Date().toISOString().slice(0, 10), note: 'Pedido criado, aguardando documentos' }
      : { status: 'em_analise', date: new Date().toISOString().slice(0, 10), note: 'Pedido criado' }
    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNumber(orders.length + 1),
      userId: input.userId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      items: input.items,
      totalCents: input.items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0),
      status: firstEvent.status,
      paymentMethod: 'PIX',
      createdAt: new Date().toISOString().slice(0, 10),
      shippingAddress: input.shippingAddress,
      prescription: { uploaded: false },
      medicalReport: { uploaded: false },
      history: [firstEvent],
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const updateOrder: OrdersContextValue['updateOrder'] = (id, patch, note, status) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = { ...o, ...patch }
        if (note) {
          next.history = [...o.history, { status: status ?? next.status, date: new Date().toISOString().slice(0, 10), note }]
        }
        return next
      })
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <CartContext.Provider value={{ items, add, updateQty, remove, clear, totalCents }}>
        <OrdersContext.Provider value={{ orders, createOrder, updateOrder }}>{children}</OrdersContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de AuthProvider')
  return ctx
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders deve ser usado dentro de AuthProvider')
  return ctx
}
