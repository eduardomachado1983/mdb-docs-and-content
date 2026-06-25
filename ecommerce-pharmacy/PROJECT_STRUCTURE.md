# Plataforma de E-commerce para Medicamentos Prescritos

## 📋 Visão Geral

Plataforma de e-commerce para venda de medicamentos que exigem validação de receita e laudo médico do paciente.

### Requisitos Funcionais
- ✅ Registro/Autenticação de usuários (Pacientes)
- ✅ Upload e validação de Receita Médica
- ✅ Upload e validação de Laudo/Atestado Médico
- ✅ Catálogo de Medicamentos com controle de prescrição
- ✅ Carrinho de Compras
- ✅ Checkout com validação de documentos
- ✅ Histórico de Pedidos
- ✅ Painel de Administrador para validação de documentos
- ✅ Processamento de Pagamento (escrow)
- ✅ Rastreamento de Pedidos

### Requisitos Não-Funcionais
- Segurança de dados médicos (LGPD/HIPAA)
- Encriptação de dados sensíveis
- Auditoria de transações
- Performance
- Escalabilidade

---

## 📁 Estrutura do Projeto

```
ecommerce-pharmacy/
│
├── 📂 backend/                 # API REST (Node.js/Express)
│   ├── src/
│   │   ├── config/            # Configurações (BD, env vars)
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── models/            # Modelos de dados (Mongoose/Sequelize)
│   │   ├── routes/            # Rotas da API
│   │   ├── middleware/        # Autenticação, validação
│   │   ├── services/          # Serviços de negócio
│   │   ├── utils/             # Utilitários
│   │   └── app.js             # Arquivo principal
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── 📂 frontend/               # React/Next.js
│   ├── public/               # Assets
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas (Next.js)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Chamadas à API
│   │   ├── styles/           # CSS/SCSS
│   │   ├── context/          # Context API
│   │   ├── utils/            # Utilitários
│   │   └── App.tsx           # Componente principal
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── README.md
│
├── 📂 database/              # Esquemas e migrações
│   ├── schemas/              # Diagramas ER
│   ├── migrations/           # Scripts de migração
│   ├── seeds/                # Dados de exemplo
│   └── README.md
│
├── 📂 docs/                  # Documentação
│   ├── API.md               # Documentação da API
│   ├── DATABASE.md          # Esquema do banco
│   ├── ARCHITECTURE.md      # Arquitetura do sistema
│   ├── SECURITY.md          # Políticas de segurança
│   ├── DEPLOYMENT.md        # Guia de deploy
│   └── USER_FLOWS.md        # Fluxos do usuário
│
├── 📂 tests/                # Testes
│   ├── unit/               # Testes unitários
│   ├── integration/        # Testes de integração
│   ├── e2e/                # Testes end-to-end
│   └── README.md
│
├── 📂 infra/               # Infraestrutura
│   ├── docker-compose.yml  # Orquestração de containers
│   ├── kubernetes/         # Manifests K8s
│   ├── terraform/          # IaC
│   └── README.md
│
├── .gitignore
├── docker-compose.yml
├── README.md               # Guia geral do projeto
└── CONTRIBUTING.md         # Guia de contribuição

```

---

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────────────────┐
│         Frontend (React/Next.js)    │
│  - Autenticação                     │
│  - Upload de documentos             │
│  - Carrinho e checkout              │
│  - Painel do paciente               │
└────────────────┬────────────────────┘
                 │ (HTTPS/REST)
┌────────────────▼────────────────────┐
│      API Backend (Node.js/Express)  │
│  - Autenticação JWT                 │
│  - Validação de receitas            │
│  - Processamento de pagamento       │
│  - Geração de pedidos               │
└────────────────┬────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐    ┌───▼──┐    ┌───▼──┐
│ PostgreSQL│ Redis│ S3 │
│ (BD)      │(Cache)│(Files)│
└──────┘    └──────┘    └─────┘
```

---

## 📊 Modelo de Dados Principal

### Users (Pacientes)
```
- id (UUID)
- email (unique)
- password (hashed)
- fullName
- cpf (CPF - unique)
- dateOfBirth
- phone
- address
- createdAt
- updatedAt
```

### MedicalDocuments (Receitas e Laudos)
```
- id (UUID)
- userId (FK)
- documentType (PRESCRIPTION | MEDICAL_REPORT)
- fileUrl (S3)
- fileHash
- validationStatus (PENDING | APPROVED | REJECTED)
- validatedBy (admin id)
- validatedAt
- expiresAt
- createdAt
```

### Medications
```
- id (UUID)
- name
- description
- activeIngredient
- dosage
- requiresPrescription (boolean)
- requiresMedicalReport (boolean)
- price
- stock
- manufacturer
- createdAt
- updatedAt
```

### Orders
```
- id (UUID)
- userId (FK)
- items (JSON - products + quantities)
- totalPrice
- status (PENDING | PAYMENT_PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED)
- prescriptionId (FK - validated)
- medicalReportId (FK - validated)
- paymentId (integration com gateway)
- trackingNumber
- createdAt
- updatedAt
```

### Payments (Escrow)
```
- id (UUID)
- orderId (FK)
- amount
- status (PENDING | AUTHORIZED | CAPTURED | REFUNDED)
- paymentMethod (CARD | BANK_TRANSFER | PIX)
- transactionId (gateway)
- createdAt
- updatedAt
```

---

## 🔐 Fluxo de Validação de Documentos

```
1. Usuário faz upload da receita
   ├─ Validação de formato (PDF/imagem)
   ├─ OCR para extração de dados
   ├─ Verificação de CRM do médico
   └─ Status: PENDING_REVIEW

2. Admin revisa documento
   ├─ Verifica integridade
   ├─ Valida autenticidade (opcional: integração com CRM)
   └─ Status: APPROVED | REJECTED

3. Documento aprovado
   ├─ Libera compra de medicamentos específicos
   └─ Define data de expiração (30-90 dias)
```

---

## 🛠️ Tech Stack Sugerido

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **BD**: PostgreSQL
- **Cache**: Redis
- **ODM**: Sequelize ou Typeorm
- **Auth**: JWT (jsonwebtoken)
- **Upload**: AWS S3 ou MinIO
- **Validação**: Joi ou Yup

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Linguagem**: TypeScript
- **UI**: Material-UI (MUI) ou Tailwind
- **Estado**: Zustand ou Redux Toolkit
- **Autenticação**: next-auth
- **Upload**: React-dropzone

### Infraestrutura
- **Containerização**: Docker
- **Orquestração**: Docker Compose (dev) / Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana
- **Logging**: ELK Stack ou CloudWatch

---

## 📅 Fases de Desenvolvimento

### Fase 1: MVP (4-6 semanas)
- [ ] Backend API básico
- [ ] Autenticação de usuários
- [ ] Upload de documentos
- [ ] Catálogo de medicamentos
- [ ] Carrinho simples
- [ ] Checkout básico

### Fase 2: Validação (2-3 semanas)
- [ ] Sistema de validação de documentos
- [ ] Painel de admin
- [ ] Integração com gateway de pagamento
- [ ] Histórico de pedidos

### Fase 3: Enhancements (2-3 semanas)
- [ ] OCR para receitas
- [ ] Integração com CRM
- [ ] Rastreamento de pedidos
- [ ] Notificações (email, SMS)

### Fase 4: Produção (1-2 semanas)
- [ ] Testes completos
- [ ] Deploy e monitoramento
- [ ] Otimizações de performance
- [ ] Documentação final

---

## 🚀 Como Começar

```bash
# Clone o repositório
git clone <repo>
cd ecommerce-pharmacy

# Instale dependências
cd backend && npm install
cd ../frontend && npm install

# Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Inicie com Docker Compose
docker-compose up

# Acesse
# Backend: http://localhost:3000
# Frontend: http://localhost:3001
```

---

## 📝 Próximos Passos

1. **Configurar ambiente de desenvolvimento**
   - Docker setup
   - Variáveis de ambiente
   - BD local

2. **Implementar backend MVP**
   - Models
   - Rotas autenticação
   - Endpoints de produtos

3. **Implementar frontend MVP**
   - Layout principal
   - Formulário de registro
   - Listagem de produtos

4. **Integração completa**
   - Upload de documentos
   - Validação
   - Checkout

---

**Versão**: 1.0  
**Última atualização**: 2026-06-25  
**Responsável**: Equipe de Desenvolvimento
