# Arquitetura da Plataforma de E-commerce de Medicamentos Prescritos

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (Browser)                       │
│                    Frontend React/Next.js                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/REST
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Load Balancer / CDN                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────────┐    ┌───────▼────────┐    ┌──────▼───────┐
│  API 1     │    │   API 2        │    │   API 3      │
│ Express.js │────│  Express.js    │────│ Express.js   │
│ Container  │    │  Container     │    │ Container    │
└───┬────────┘    └────┬──────────┘    └───┬──────────┘
    │                  │                    │
    └──────────────────┼────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼────┐   ┌────▼──┐   ┌──────▼────┐
    │PostgreSQL│   │Redis  │   │  S3/MinIO│
    │(Primary) │   │(Cache)│   │(Storage) │
    └────────┘   └────────┘   └──────────┘
```

## 2. Componentes Principais

### 2.1 Frontend (React/Next.js)

**Responsabilidades:**
- Interface do usuário responsiva
- Gerenciamento de estado (Zustand/Redux)
- Chamadas à API
- Autenticação via JWT
- Upload de documentos

**Estrutura:**
```
frontend/src/
├── components/
│   ├── common/           # Componentes globais
│   │   ├── Header
│   │   ├── Footer
│   │   ├── Navigation
│   │   └── LoadingSpinner
│   ├── auth/            # Autenticação
│   │   ├── LoginForm
│   │   ├── RegisterForm
│   │   └── ProtectedRoute
│   ├── products/        # Catálogo
│   │   ├── ProductList
│   │   ├── ProductCard
│   │   └── ProductFilter
│   ├── cart/            # Carrinho
│   │   ├── CartSummary
│   │   ├── CartItem
│   │   └── CartCheckout
│   ├── documents/       # Gerenciamento de documentos
│   │   ├── DocumentUpload
│   │   ├── DocumentPreview
│   │   └── DocumentStatus
│   └── admin/           # Painel administrativo
│       ├── DocumentReview
│       ├── UserManagement
│       └── OrderManagement
├── pages/
│   ├── index.tsx
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── admin/
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useDocuments.ts
├── services/
│   ├── api.ts           # Instância axios
│   ├── authService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   ├── documentService.ts
│   └── orderService.ts
├── store/               # Zustand/Redux
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
└── utils/
    ├── validators.ts
    ├── formatters.ts
    └── constants.ts
```

### 2.2 Backend (Node.js/Express)

**Responsabilidades:**
- Autenticação e autorização
- Validação de dados
- Lógica de negócio
- Acesso ao banco de dados
- Integração com serviços externos

**Estrutura:**
```
backend/src/
├── config/
│   ├── database.ts      # Configuração PostgreSQL
│   ├── redis.ts         # Configuração Redis
│   ├── s3.ts            # Configuração AWS S3
│   └── env.ts           # Variáveis de ambiente
├── models/              # Sequelize/Typeorm
│   ├── User.ts
│   ├── MedicalDocument.ts
│   ├── Medication.ts
│   ├── Order.ts
│   ├── Payment.ts
│   └── OrderItem.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── document.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   ├── payment.controller.ts
│   └── admin.controller.ts
├── services/            # Lógica de negócio
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── document.service.ts
│   ├── document-validation.service.ts
│   ├── order.service.ts
│   ├── payment.service.ts
│   └── notification.service.ts
├── routes/
│   ├── auth.routes.ts
│   ├── products.routes.ts
│   ├── documents.routes.ts
│   ├── orders.routes.ts
│   ├── cart.routes.ts
│   ├── users.routes.ts
│   └── admin.routes.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   ├── cors.middleware.ts
│   └── logging.middleware.ts
├── validators/          # Yup/Joi schemas
│   ├── auth.validator.ts
│   ├── product.validator.ts
│   ├── order.validator.ts
│   └── document.validator.ts
├── utils/
│   ├── hash.ts          # Password hashing
│   ├── jwt.ts           # Token generation
│   ├── ocr.ts           # Document OCR
│   ├── mail.ts          # Email service
│   └── logger.ts        # Logging
└── app.ts               # Express app setup
```

### 2.3 Banco de Dados (PostgreSQL)

**Tabelas Principais:**

```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  cpf VARCHAR(11) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  address JSONB,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentos Médicos
CREATE TABLE medical_documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  document_type VARCHAR(50), -- PRESCRIPTION, MEDICAL_REPORT
  file_url VARCHAR(500),
  file_hash VARCHAR(64),
  validation_status VARCHAR(50), -- PENDING, APPROVED, REJECTED
  validation_notes TEXT,
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicamentos
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active_ingredient VARCHAR(255),
  dosage VARCHAR(100),
  requires_prescription BOOLEAN DEFAULT false,
  requires_medical_report BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  stock INTEGER,
  manufacturer VARCHAR(255),
  sku VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  prescription_id UUID REFERENCES medical_documents(id),
  medical_report_id UUID REFERENCES medical_documents(id),
  total_price DECIMAL(10, 2),
  status VARCHAR(50), -- PENDING, PAYMENT_PENDING, PROCESSING, SHIPPED, DELIVERED
  tracking_number VARCHAR(255),
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  medication_id UUID NOT NULL REFERENCES medications(id),
  quantity INTEGER,
  price_at_time DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagamentos (Escrow)
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  amount DECIMAL(10, 2),
  status VARCHAR(50), -- PENDING, AUTHORIZED, CAPTURED, REFUNDED
  payment_method VARCHAR(50), -- CARD, BANK_TRANSFER, PIX
  transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Cache (Redis)

**Uso:**
- Sessões de usuário
- Carrinho de compras temporário
- Cache de catálogo de produtos
- Rate limiting
- Fila de processamento de documentos

**Exemplo de chaves:**
```
session:{sessionId}         # Sessão do usuário
cart:{userId}               # Carrinho do usuário
products:list:1             # Listagem de produtos paginada
document:processing:{docId} # Status de processamento
```

### 2.5 Storage (S3/MinIO)

**Estrutura de diretórios:**
```
s3://bucket/
├── documents/
│   ├── prescriptions/
│   │   └── {userId}/{docId}.pdf
│   └── medical-reports/
│       └── {userId}/{docId}.pdf
└── exports/
    └── reports/
        └── {month}/{report}.csv
```

## 3. Fluxos Principais

### 3.1 Fluxo de Registro e Autenticação

```
1. Usuário acessa /register
2. Preenche formulário (email, senha, dados pessoais)
3. Frontend valida e faz POST /api/auth/register
4. Backend:
   - Valida dados (email único, password strength)
   - Hash da senha
   - Cria record em users table
   - Retorna JWT token
5. Frontend armazena token em localStorage/sessionStorage
6. Redireciona para /documents/upload
```

### 3.2 Fluxo de Upload de Documentos

```
1. Usuário acessa /documents/upload
2. Seleciona arquivo (PDF ou imagem)
3. Frontend valida (tipo, tamanho)
4. POST /api/documents/upload com multipart/form-data
5. Backend:
   - Valida arquivo
   - Hash do arquivo (duplicação)
   - Upload para S3
   - OCR extraction (opcional)
   - Cria record medical_documents (status: PENDING)
   - Enfileira para processamento
6. Frontend mostra status PENDING
7. Admin revisa e aprova/rejeita
8. Webhook/SSE notifica frontend
```

### 3.3 Fluxo de Compra

```
1. Usuário navega /products
2. Filtra/busca medicamentos
3. Adiciona ao carrinho (POST /api/cart/add)
4. Revisa carrinho
5. Click em "Checkout"
6. Sistema valida:
   - Documentos aprovados?
   - Expiração dos documentos?
   - Medicamentos requerem prescrição?
7. POST /api/orders/create
8. Backend:
   - Valida documentos
   - Reserva stock
   - Cria order (status: PENDING)
   - Cria payment (status: PENDING)
9. Frontend redireciona para pagamento
10. Processa pagamento
11. Backend:
    - Confirma pagamento
    - Atualiza order status
    - Enfileira para processamento
    - Gera email de confirmação
```

## 4. Padrões de Comunicação

### 4.1 API REST

```
Autenticação: Bearer <JWT_TOKEN>
Content-Type: application/json

GET    /api/products              # Listar produtos
POST   /api/products              # Criar (admin)
GET    /api/products/:id          # Detalhe
PUT    /api/products/:id          # Editar (admin)
DELETE /api/products/:id          # Deletar (admin)

GET    /api/documents             # Listar documentos do usuário
POST   /api/documents/upload      # Upload
GET    /api/documents/:id         # Detalhe
DELETE /api/documents/:id         # Deletar

GET    /api/orders                # Listar pedidos do usuário
POST   /api/orders                # Criar pedido
GET    /api/orders/:id            # Detalhe do pedido
PUT    /api/orders/:id/cancel     # Cancelar

GET    /api/admin/documents       # Listar docs para validação
PUT    /api/admin/documents/:id   # Validar documento
```

### 4.2 WebSocket (Opcional - Real-time)

```javascript
// Cliente
socket.on('order:updated', (data) => {
  // Atualiza status do pedido em tempo real
});

// Servidor
io.to(`user:${userId}`).emit('order:updated', {
  orderId: '...',
  status: 'PROCESSING'
});
```

## 5. Segurança

- **Autenticação**: JWT com refresh tokens
- **Encriptação**: TLS 1.3, AES-256 para dados sensíveis
- **Validação**: Todas as entradas validadas no servidor
- **CORS**: Configurado para domínios específicos
- **Rate Limiting**: Proteção contra brute force
- **LGPD**: Conformidade com proteção de dados
- **Auditoria**: Todos os acessos a dados médicos logados

## 6. Monitoramento e Logging

- **Logs**: ELK Stack ou CloudWatch
- **Métricas**: Prometheus + Grafana
- **APM**: NewRelic ou DataDog (opcional)
- **Alertas**: Sobre erros críticos, pagamentos falhados

---

**Versão**: 1.0  
**Data**: 2026-06-25
