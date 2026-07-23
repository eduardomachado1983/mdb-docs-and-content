# CLAUDE.md — BioSativa

Leia este arquivo inteiro antes de qualquer tarefa.
Este é o contrato de arquitetura do projeto.

---

## Visão geral

Plataforma de telemedicina brasileira com 3 papéis de usuário.
Stack: Next.js 15 + Supabase + Mercado Pago + TypeScript.
Deploy: Vercel (frontend + API routes) + Supabase Cloud (banco + auth + storage).

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
pdfkit             geração de PDF no servidor
mercadopago        SDK oficial do Mercado Pago
```

---

## Estrutura de arquivos

```
sua-logo/
├── CLAUDE.md                    ← este arquivo
├── app/
│   ├── layout.tsx               ← layout raiz
│   ├── page.tsx                 ← landing page pública
│   ├── login/page.tsx
│   ├── registro/page.tsx
│   ├── dashboard/               ← área do paciente
│   │   ├── page.tsx
│   │   └── chat/page.tsx
│   ├── medico/                  ← área do médico
│   │   ├── page.tsx
│   │   └── paciente/[id]/page.tsx
│   ├── admin/                   ← área do admin
│   │   ├── page.tsx
│   │   └── validacao/[id]/page.tsx
│   └── api/
│       ├── auth/                ← login, logout, me, register
│       ├── patient/             ← dashboard, documentos, assistente
│       ├── doctor/              ← fila, pacientes, prontuário
│       ├── admin/               ← pacientes, stats, liberar
│       └── payments/            ← pix, card, webhook
├── components/
│   ├── ui/                      ← shadcn components
│   └── shared/                  ← componentes reutilizáveis
├── lib/
│   ├── supabase/
│   │   ├── server.ts            ← createServerClient
│   │   └── client.ts            ← createBrowserClient
│   ├── auth.ts                  ← helpers de autenticação
│   ├── mercadopago.ts           ← integração MP
│   └── pdf.ts                   ← geração de PDFs
├── hooks/                       ← React hooks customizados
├── types/                       ← TypeScript types
├── supabase/
│   └── migrations/              ← SQL migrations
└── middleware.ts                ← proteção de rotas
```

---

## Banco de dados (Supabase PostgreSQL)

### Schema completo

```sql
-- Usuários (complementa auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient','doctor','admin')),
  crm TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pacientes
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'cadastro_incompleto'
    CHECK (status IN (
      'cadastro_incompleto','aguardando_pagamento',
      'aguardando_medico','retido_admin','concluido'
    )),
  personal_data JSONB DEFAULT '{}',
  triage JSONB DEFAULT '{}',
  payment JSONB DEFAULT '{}',
  clinical JSONB DEFAULT '{}',
  admin_validation JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('identity','address')),
  filename TEXT,
  storage_path TEXT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico do assistente
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant')),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transações de pagamento
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  reference_id TEXT UNIQUE,
  amount INTEGER,
  method TEXT,
  status TEXT DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX ON patients(user_id);
CREATE INDEX ON patients(status);
CREATE INDEX ON documents(patient_id);
CREATE INDEX ON chat_history(patient_id);
CREATE INDEX ON payment_transactions(reference_id);

-- RLS (Row Level Security)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Paciente vê só os próprios dados
CREATE POLICY "patient_own" ON patients
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "patient_docs" ON documents
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- Service role bypassa RLS (para API routes com service_role_key)
```

---

## Autenticação

Usar **Supabase Auth** com `@supabase/ssr`.
Não usar JWT manual — o Supabase gerencia sessão via cookie.

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Atualizar sessão em cada request
  // Redirecionar para /login se não autenticado nas rotas protegidas
  // Verificar role do profile para autorização
}
```

### Papéis e rotas protegidas

```
/dashboard/*    → role: patient
/medico/*       → role: doctor
/admin/*        → role: admin
/api/patient/*  → role: patient
/api/doctor/*   → role: doctor
/api/admin/*    → role: admin
```

---

## Fluxo de status do paciente

```
cadastro_incompleto
    ↓ (preenche dados pessoais)
aguardando_pagamento
    ↓ (webhook MP confirma pagamento)
aguardando_medico
    ↓ (médico salva prontuário)
retido_admin
    ↓ (admin aprova 3 pilares)
concluido
```

---

## Integração Mercado Pago

Usar SDK oficial: `import { MercadoPagoConfig, Payment } from 'mercadopago'`

```typescript
// lib/mercadopago.ts
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

// PIX
export async function createPixPayment(params: {
  amount: number
  patientId: string
  email: string
  cpf: string
  name: string
}) {
  const payment = new Payment(client)
  return payment.create({
    body: {
      transaction_amount: params.amount / 100,
      description: 'Consulta - BioSativa',
      payment_method_id: 'pix',
      payer: {
        email: params.email,
        first_name: params.name.split(' ')[0],
        identification: { type: 'CPF', number: params.cpf.replace(/\D/g,'') }
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`,
      external_reference: `SUALOGO-${params.patientId}-${Date.now()}`,
    }
  })
}
```

### Webhook

```
POST /api/payments/webhook
Validar: x-signature com HMAC-SHA256 usando MERCADOPAGO_WEBHOOK_SECRET
Se status=approved: atualizar patient.status → aguardando_medico
```

---

## Inbox de WhatsApp (admin)

Integração com o WhatsApp Cloud API (Meta) para o admin atender pelo
WhatsApp direto do painel, em `/admin/whatsapp`.

```
Webhook a cadastrar na Meta: POST {SITE_URL}/api/whatsapp/webhook
Verificação (GET):           hub.verify_token deve bater com WHATSAPP_VERIFY_TOKEN
```

Tabelas: `whatsapp_conversations` (uma por telefone) e `whatsapp_messages`
(inbound/outbound). Sem `WHATSAPP_ACCESS_TOKEN`/`WHATSAPP_PHONE_NUMBER_ID`
configurados, o envio roda em modo simulado (mensagem só é salva no banco,
não é enviada de fato) — mesmo padrão do Mercado Pago sem token.

---

## Notificações ao paciente (admin)

`POST /api/admin/patients/[id]/notify` — o admin notifica o paciente sobre
uma pendência (`reason`: `documentos` | `pagamento` | `prontuario`) por
WhatsApp (`lib/whatsapp.ts`, também registra a mensagem no inbox) e e-mail
(`lib/email.ts`, via Resend). Grava `admin_validation.reminder_reason` +
`reminder_sent_at` para o paciente ver o aviso na área dele
(`/dashboard` e `/dashboard/dados`).

Sem `RESEND_API_KEY`/`RESEND_FROM_EMAIL` configurados, o e-mail roda em
modo simulado (não é enviado de fato) — mesmo padrão do WhatsApp e do
Mercado Pago sem token.

---

## Upload de documentos

Usar **Supabase Storage** com bucket privado.

```
Bucket: patient-documents
Path: {patientId}/{type}/{filename}
```

Regras do bucket:
- Leitura: service_role apenas (via API route)
- Upload: autenticado, só o próprio patient_id

---

## Geração de PDF

```typescript
// lib/pdf.ts — usar pdfkit
// Receita e laudo gerados no servidor
// Retornar como stream ou buffer
// Headers: Content-Type: application/pdf, Content-Disposition: attachment
```

---

## Assistente virtual (rule-based)

Sem API de IA — lógica baseada em contador de mensagens.

```typescript
const QUESTIONS = [
  'Olá! Sou o assistente da BioSativa. Qual é o seu principal sintoma hoje?',
  'Há quanto tempo você está com esse sintoma?',
  'Em uma escala de 0 a 10, qual é a intensidade?',
  'Onde você sente o desconforto?',
  'Você tem outros sintomas associados?',
  'Tem alguma alergia ou usa medicamento contínuo?',
]

// Se userCount < 6 → retorna QUESTIONS[userCount]
// Se userCount >= 6 → gera RESUMO PARA O MÉDICO com as 6 respostas
```

---

## Variáveis de ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=

# WhatsApp Cloud API (Meta) — opcional, sem elas o envio roda simulado
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=

# E-mail transacional (Resend) — opcional, sem elas o envio roda simulado
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=https://biosativa.vercel.app

# Consulta (em centavos)
CONSULTATION_AMOUNT=200
```

---

## Comandos

```bash
pnpm dev          # dev server localhost:3000
pnpm build        # build de produção
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit

# Supabase CLI
pnpm supabase db push          # aplicar migrations
pnpm supabase db reset         # resetar banco local
pnpm supabase gen types        # gerar tipos TypeScript do banco
```

---

## Dados demo (seed)

```
Paciente:  Eduardo Machado     / contato@em.art.br   / A1234567
Médico:    Dra. Helena Vasconcelos / medico@sualogo.com.br / medico123
Admin:     Administrador        / admin@sualogo.com.br  / admin123
```

---

## Convenções de código

**Não usar:**
- `any` em TypeScript
- `console.log` em produção (usar apenas em desenvolvimento)
- `alert()` ou `confirm()` — usar toast (sonner)
- Lógica de negócio no frontend — sempre no servidor (Server Actions ou API routes)
- `@supabase/auth-helpers-nextjs` — deprecated, usar `@supabase/ssr`

**Usar:**
- Server Components por padrão, Client Components só quando necessário
- `'use client'` somente em componentes que precisam de estado ou eventos
- Zod para validar dados de entrada em API routes
- `next/image` para imagens
- Variáveis de ambiente com prefixo `NEXT_PUBLIC_` apenas para o que o cliente precisa ver

**Tamanho de arquivo:**
- Máximo 200 linhas por arquivo
- Dividir componentes grandes em partes menores

---

## Checklist antes de cada commit

- [ ] `pnpm typecheck` sem erros
- [ ] `pnpm build` passa sem erros
- [ ] Middleware verifica autenticação e role corretamente
- [ ] Variáveis de ambiente sem valores hardcoded no código
- [ ] Dados do paciente não expostos em logs
- [ ] Upload de documentos valida tipo e tamanho no servidor
- [ ] Webhook do Mercado Pago valida assinatura HMAC

---

## O que construir primeiro (ordem recomendada)

1. Schema do banco + migrations + seed
2. Middleware de autenticação
3. Login + registro (Supabase Auth)
4. Dashboard do paciente com dados reais
5. Upload de documentos (Supabase Storage)
6. Área do médico (fila + prontuário)
7. Área do admin (validação + liberação)
8. Pagamento Mercado Pago (Pix + Cartão)
9. Webhook de confirmação
10. Assistente virtual
11. Download de PDF
12. Landing page
