import type { Order, Product, Profile } from '@/types'

// ══════════════════════════════════════
// Dados de demonstração — substituir por Supabase quando o
// backend for integrado (ver "Roadmap" em CLAUDE.md).
// ══════════════════════════════════════

export const MOCK_USERS: (Profile & { password: string })[] = [
  {
    id: 'usr-admin',
    name: 'Admin Farmácia',
    email: 'admin@pharmacrm.com',
    password: 'Admin123',
    role: 'admin',
    createdAt: '2025-01-10',
  },
  {
    id: 'usr-carlos',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    password: 'Paciente1',
    role: 'customer',
    cpf: '123.456.789-00',
    phone: '(11) 99887-6655',
    address: { street: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', zip: '01310-100' },
    createdAt: '2025-05-02',
  },
]

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1', name: 'Ritalina LA 20mg', activeIngredient: 'Metilfenidato', category: 'Psicoestimulante',
    priceCents: 200, stock: 45, controlledClass: 'V', requiresPrescription: true, requiresReport: true,
    description: 'Tratamento do TDAH. Controlado — Portaria 344/98.',
  },
  {
    id: 'prod-2', name: 'Rivotril 2mg', activeIngredient: 'Clonazepam', category: 'Benzodiazepínico',
    priceCents: 200, stock: 30, controlledClass: 'V', requiresPrescription: true, requiresReport: false,
    description: 'Anticonvulsivante e ansiolítico. Receita especial obrigatória.',
  },
  {
    id: 'prod-3', name: 'Venvanse 50mg', activeIngredient: 'Lisdexanfetamina', category: 'Psicoestimulante',
    priceCents: 200, stock: 20, controlledClass: 'V', requiresPrescription: true, requiresReport: true,
    description: 'TDAH — Receita A obrigatória.',
  },
  {
    id: 'prod-4', name: 'Zolpidem 10mg', activeIngredient: 'Zolpidem', category: 'Hipnótico',
    priceCents: 200, stock: 60, controlledClass: 'A', requiresPrescription: true, requiresReport: false,
    description: 'Indução do sono. Receita de controle especial.',
  },
  {
    id: 'prod-5', name: 'Amoxicilina 500mg', activeIngredient: 'Amoxicilina', category: 'Antibiótico',
    priceCents: 200, stock: 120, controlledClass: 'A', requiresPrescription: true, requiresReport: false,
    description: 'Antibiótico de amplo espectro.',
  },
  {
    id: 'prod-6', name: 'Dipirona 500mg', activeIngredient: 'Metamizol', category: 'Analgésico',
    priceCents: 200, stock: 200, controlledClass: 'L', requiresPrescription: false, requiresReport: false,
    description: 'Analgésico e antitérmico. Venda livre.',
  },
]

export const ORDERS: Order[] = [
  {
    id: 'ord-1', orderNumber: 'PED-000001', userId: 'usr-carlos',
    customerName: 'Carlos Oliveira', customerEmail: 'carlos@email.com',
    items: [{ productId: 'prod-1', productName: 'Ritalina LA 20mg', unitPriceCents: 200, qty: 2 }],
    totalCents: 400, status: 'em_analise', paymentMethod: 'PIX', createdAt: '2025-06-20',
    shippingAddress: 'Rua das Flores, 123 — São Paulo, SP',
    prescription: { uploaded: true, filename: 'receita.pdf', validated: false },
    medicalReport: { uploaded: true, filename: 'laudo.pdf', validated: false },
    history: [
      { status: 'aguardando_docs', date: '2025-06-20', note: 'Pedido criado' },
      { status: 'em_analise', date: '2025-06-20', note: 'Documentos recebidos, em análise farmacêutica' },
    ],
  },
  {
    id: 'ord-2', orderNumber: 'PED-000002', userId: 'usr-ana',
    customerName: 'Ana Costa', customerEmail: 'ana@email.com',
    items: [{ productId: 'prod-2', productName: 'Rivotril 2mg', unitPriceCents: 200, qty: 1 }],
    totalCents: 200, status: 'aprovado', paymentMethod: 'PIX', createdAt: '2025-06-18',
    shippingAddress: 'Av. Paulista, 900 — São Paulo, SP',
    prescription: { uploaded: true, filename: 'receita.pdf', validated: true },
    medicalReport: { uploaded: false },
    history: [
      { status: 'aguardando_docs', date: '2025-06-18', note: 'Pedido criado' },
      { status: 'em_analise', date: '2025-06-18', note: 'Docs enviados' },
      { status: 'aprovado', date: '2025-06-19', note: 'Receita validada pelo farmacêutico' },
    ],
  },
  {
    id: 'ord-3', orderNumber: 'PED-000003', userId: 'usr-roberto',
    customerName: 'Roberto Melo', customerEmail: 'roberto@email.com',
    items: [{ productId: 'prod-3', productName: 'Venvanse 50mg', unitPriceCents: 200, qty: 1 }],
    totalCents: 200, status: 'enviado', paymentMethod: 'PIX', createdAt: '2025-06-15',
    trackingCode: 'BR123456789SP',
    shippingAddress: 'Rua XV de Novembro, 50 — Curitiba, PR',
    prescription: { uploaded: true, filename: 'receita.pdf', validated: true },
    medicalReport: { uploaded: true, filename: 'laudo.pdf', validated: true },
    history: [
      { status: 'aguardando_docs', date: '2025-06-15', note: 'Pedido criado' },
      { status: 'aprovado', date: '2025-06-16', note: 'Aprovado' },
      { status: 'em_separacao', date: '2025-06-17', note: 'Separação' },
      { status: 'enviado', date: '2025-06-18', note: 'Postado — BR123456789SP' },
    ],
  },
  {
    id: 'ord-4', orderNumber: 'PED-000004', userId: 'usr-maria',
    customerName: 'Maria Silva', customerEmail: 'maria@email.com',
    items: [{ productId: 'prod-4', productName: 'Zolpidem 10mg', unitPriceCents: 200, qty: 2 }],
    totalCents: 400, status: 'aguardando_docs', paymentMethod: 'PIX', createdAt: '2025-06-24',
    shippingAddress: 'Rua 7 de Setembro, 200 — Belo Horizonte, MG',
    prescription: { uploaded: false },
    medicalReport: { uploaded: false },
    history: [{ status: 'aguardando_docs', date: '2025-06-24', note: 'Pedido criado, aguardando documentos' }],
  },
  {
    id: 'ord-5', orderNumber: 'PED-000005', userId: 'usr-joao',
    customerName: 'João Ferreira', customerEmail: 'joao@email.com',
    items: [
      { productId: 'prod-1', productName: 'Ritalina LA 20mg', unitPriceCents: 200, qty: 1 },
      { productId: 'prod-5', productName: 'Amoxicilina 500mg', unitPriceCents: 200, qty: 1 },
    ],
    totalCents: 400, status: 'entregue', paymentMethod: 'PIX', createdAt: '2025-06-10',
    trackingCode: 'BR987654321SP',
    shippingAddress: 'Alameda Santos, 1000 — São Paulo, SP',
    prescription: { uploaded: true, filename: 'receita.pdf', validated: true },
    medicalReport: { uploaded: true, filename: 'laudo.pdf', validated: true },
    history: [
      { status: 'aguardando_docs', date: '2025-06-10', note: 'Pedido criado' },
      { status: 'aprovado', date: '2025-06-11', note: 'Aprovado' },
      { status: 'enviado', date: '2025-06-13', note: 'Postado' },
      { status: 'entregue', date: '2025-06-16', note: 'Entregue ao destinatário' },
    ],
  },
]

// Clientes referenciados nos pedidos demo além do usuário logável `usr-carlos`
// (histórico read-only para as telas de admin).
export const MOCK_CUSTOMERS: Profile[] = [
  MOCK_USERS[1],
  { id: 'usr-ana', name: 'Ana Costa', email: 'ana@email.com', role: 'customer', cpf: '987.654.321-00', phone: '(21) 98765-4321', address: { street: 'Av. Paulista, 900', city: 'São Paulo', state: 'SP', zip: '01310-100' }, createdAt: '2025-04-11' },
  { id: 'usr-roberto', name: 'Roberto Melo', email: 'roberto@email.com', role: 'customer', cpf: '456.789.123-00', phone: '(41) 97654-3210', address: { street: 'Rua XV de Novembro, 50', city: 'Curitiba', state: 'PR', zip: '80020-310' }, createdAt: '2025-03-22' },
  { id: 'usr-maria', name: 'Maria Silva', email: 'maria@email.com', role: 'customer', cpf: '321.654.987-00', phone: '(31) 96543-2100', address: { street: 'Rua 7 de Setembro, 200', city: 'Belo Horizonte', state: 'MG', zip: '30130-000' }, createdAt: '2025-02-14' },
  { id: 'usr-joao', name: 'João Ferreira', email: 'joao@email.com', role: 'customer', cpf: '654.321.098-00', phone: '(11) 95432-1000', address: { street: 'Alameda Santos, 1000', city: 'São Paulo', state: 'SP', zip: '01418-100' }, createdAt: '2025-01-30' },
]
