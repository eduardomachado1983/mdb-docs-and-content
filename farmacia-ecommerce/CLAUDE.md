# CLAUDE.md — Farmácia Ecommerce (PharmaCRM)

Leia este arquivo inteiro antes de qualquer tarefa.
Este é o contrato de arquitetura do projeto.

Este projeto reaproveita a arquitetura de **`sua-logo/`** (plataforma de
telemedicina, veja `../sua-logo/CLAUDE.md`) como base de stack e
convenções, adaptada para um ecommerce de farmácia especializado em
medicamentos de controle especial (Portaria 344/98 ANVISA). O protótipo
visual de referência (`FarmaciaEcommerce.jsx`) definiu as telas e fluxos;
este documento define como isso se encaixa na arquitetura Next.js +
Supabase.

---

## Visão geral

Ecommerce de farmácia com 2 papéis de usuário: **cliente** e **admin**
(farmacêutico/administrador — painel único, sem separação de papel como
o médico do sua-logo).

Stack: Next.js 15 + Supabase + Mercado Pago + TypeScript.
Deploy: Vercel (frontend + API routes) + Supabase Cloud (banco + auth + storage).

**Status atual:** scaffold de estrutura e telas com **dados mockados**
(`lib/mock-data.ts` + Context no cliente). Supabase Auth, Storage e
Mercado Pago ainda **não estão integrados** — ver seção "Roadmap" no
final. As migrations SQL já existem para quando essa integração
acontecer.

---

## Stack e versões

```
Next.js 15         App Router, Server Components, Server Actions
TypeScript 5       strict mode
Supabase           @supabase/ssr (não usar @supabase/auth-helpers — deprecated)
Tailwind CSS 4
shadcn/ui          componentes base
React Query 5      TanStack Query — para dados no cliente
Zod                validação de schemas
mercadopago        SDK oficial do Mercado Pago
```

---

## Estrutura de arquivos

```
farmacia-ecommerce/
├── CLAUDE.md
├── app/
│   ├── layout.tsx               ← layout raiz
│   ├── page.tsx                 ← landing page pública
│   ├── login/page.tsx
│   ├── registro/page.tsx        ← cadastro do cliente (3 passos)
│   ├── loja/page.tsx            ← catálogo (área do cliente)
│   ├── pedidos/                 ← pedidos do cliente
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── documentos/page.tsx      ← receita/laudo/identidade do cliente
│   ├── suporte/page.tsx         ← chat de suporte
│   ├── admin/                   ← área do admin/farmacêutico
│   │   ├── page.tsx             ← dashboard
│   │   ├── pedidos/
│   │   │   ├── page.tsx         ← gestão de pedidos (validar receita, avançar status)
│   │   │   └── [id]/page.tsx
│   │   ├── clientes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── produtos/page.tsx    ← catálogo (CRUD)
│   │   └── relatorios/page.tsx
│   └── api/                     ← (roadmap — ver seção final)
├── components/
│   ├── ui/                      ← shadcn components
│   └── shared/                  ← componentes reutilizáveis
├── lib/
│   ├── mock-data.ts             ← produtos/pedidos/clientes de demonstração
│   ├── mock-auth.tsx            ← Context client-side (sessão + carrinho) — provisório
│   ├── order-status.ts          ← enum de status + labels + cores
│   ├── utils.ts
│   └── validators.ts
├── types/
│   └── index.ts
└── supabase/
    └── migrations/              ← schema para quando integrarmos Supabase de verdade
```

---

## Banco de dados (Supabase PostgreSQL)

Schema normalizado (diferente do `sua-logo`, que usa colunas JSONB soltas
em `patients`): um ecommerce precisa de catálogo com estoque/preço reais
e itens de pedido consultáveis, então usamos tabelas próprias para
produtos e itens em vez de blobs.

```sql
-- Usuários (complementa auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer','admin')),
  cpf TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catálogo
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active_ingredient TEXT NOT NULL,
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  controlled_class TEXT NOT NULL CHECK (controlled_class IN ('V','A','L')), -- tarja vermelha/amarela/venda livre
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  requires_report BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- ex.: PED-000123
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'aguardando_docs'
    CHECK (status IN (
      'aguardando_docs','em_analise','aprovado',
      'em_separacao','enviado','entregue','recusado'
    )),
  total_cents INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'pix',
  shipping_address JSONB NOT NULL DEFAULT '{}', -- snapshot do endereço no momento da compra
  tracking_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido (snapshot de nome/preço no momento da compra)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0)
);

-- Histórico de status (equivalente ao "track" do protótipo)
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos (receita, laudo, identidade)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('prescription','medical_report','identity')),
  filename TEXT,
  storage_path TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  validated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transações de pagamento
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  reference_id TEXT UNIQUE,
  amount_cents INTEGER,
  method TEXT,
  status TEXT DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(status);
CREATE INDEX ON order_items(order_id);
CREATE INDEX ON order_status_history(order_id);
CREATE INDEX ON documents(user_id);
CREATE INDEX ON documents(order_id);
CREATE INDEX ON payment_transactions(reference_id);

-- RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Cliente vê só os próprios pedidos/documentos
CREATE POLICY "customer_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "customer_own_order_items" ON order_items
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "customer_own_history" ON order_status_history
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "customer_own_documents" ON documents
  FOR ALL USING (user_id = auth.uid());

-- products é público para leitura (catálogo); escrita só via service role
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (active = TRUE);

-- Service role bypassa RLS (para API routes com service_role_key) — usado pelo admin
```

---

## Autenticação (roadmap — ainda não implementado)

Seguir exatamente o padrão do `sua-logo`: **Supabase Auth** via
`@supabase/ssr`, sessão por cookie, sem JWT manual.

```
/loja, /pedidos, /documentos, /suporte  → role: customer
/admin/*                                → role: admin
/api/customer/*                         → role: customer
/api/admin/*                            → role: admin
```

Enquanto isso não é implementado, `lib/mock-auth.tsx` fornece um
`AuthProvider` client-side (Context + `localStorage`) só para permitir
navegar pelo protótipo com os dois papéis — **não é autenticação real**
e deve ser removido quando o middleware com Supabase Auth entrar.

---

## Fluxo de status do pedido

```
aguardando_docs   (pedido criado, receita/laudo pendente de envio)
    ↓ (cliente envia documentos)
em_analise        (farmacêutico avalia receita/laudo)
    ↓ (aprovado) ─────────────→ recusado (documentos inválidos)
aprovado
    ↓ (separação do estoque)
em_separacao
    ↓ (postado)
enviado
    ↓ (confirmação de entrega)
entregue
```

Cada transição grava uma linha em `order_status_history` (nota +
timestamp), igual ao array `track` do protótipo `FarmaciaEcommerce.jsx`.

---

## Integração Mercado Pago (roadmap)

Mesmo padrão do `sua-logo/lib/mercadopago.ts`: SDK oficial, Pix como
método principal, `external_reference` no formato
`FARMA-{orderId}-{timestamp}`, modo simulado quando
`MERCADOPAGO_ACCESS_TOKEN` não está configurado. A diferença é que o
valor não é fixo (`CONSULTATION_AMOUNT`): vem do total do carrinho
(`SUM(order_items.unit_price_cents * qty)`).

---

## Upload de documentos (roadmap)

Mesmo padrão do `sua-logo`: **Supabase Storage**, bucket privado.

```
Bucket: order-documents
Path: {userId}/{orderId}/{type}/{filename}
```

---

## Variáveis de ambiente

Ver `.env.example`.

---

## Comandos

```bash
pnpm dev          # dev server localhost:3000
pnpm build        # build de produção
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

---

## Dados demo (mock, `lib/mock-data.ts`)

```
Cliente: Carlos Oliveira / carlos@email.com / Paciente1
Admin:   Admin Farmácia  / admin@pharmacrm.com / Admin123
```

---

## Convenções de código

Mesmas do `sua-logo/CLAUDE.md`:

**Não usar:**
- `any` em TypeScript
- `console.log` em produção
- `alert()` ou `confirm()` — usar toast (`sonner`)
- Lógica de negócio no frontend quando houver backend real (Server Actions/API routes)

**Usar:**
- Server Components por padrão, Client Components só quando precisam de estado/eventos
- Zod para validar dados de entrada em API routes (quando existirem)
- `next/image` para imagens
- Máximo ~200 linhas por arquivo — dividir componentes grandes

---

## Roadmap (o que falta para produção)

Este scaffold cobre telas + navegação + dados mockados. Ainda faltam,
na ordem recomendada (mesma lógica do `sua-logo`):

1. Aplicar as migrations em um projeto Supabase real
2. Middleware de autenticação (`middleware.ts`) com Supabase Auth
3. Substituir `lib/mock-auth.tsx` por login/registro reais (`/api/auth/*`)
4. Ligar `loja`/`carrinho`/`pedidos` a `products`/`orders`/`order_items` via API routes
5. Upload de documentos real (Supabase Storage)
6. Área do admin com dados reais (validação de receita, avançar status)
7. Pagamento Mercado Pago (Pix) com valor dinâmico do carrinho
8. Webhook de confirmação de pagamento
9. Notificações (email/WhatsApp) de status do pedido
