# 🏥 Plataforma de E-commerce para Medicamentos Prescritos

Uma plataforma completa para venda segura de medicamentos que exigem receita e laudo médico, com validação inteligente de documentos e conformidade com regulamentações de proteção de dados.

## 📚 Documentação

- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Sumário executivo do projeto
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Estrutura completa do projeto
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura técnica detalhada
- **[docs/API.md](./docs/API.md)** - Documentação da API REST
- **[docs/DATABASE.md](./docs/DATABASE.md)** - Schema do banco de dados
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guia de deployment

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Setup Local

```bash
# Clone o repositório
git clone <repo-url>
cd ecommerce-pharmacy

# Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Instale dependências
cd backend && npm install
cd ../frontend && npm install

# Inicie com Docker Compose
docker-compose up

# Acesse
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
# PgAdmin: http://localhost:5050
```

### Ou manualmente

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - BD (ou usar Docker)
docker-compose up postgres redis
```

## 📋 Estrutura de Diretórios

```
ecommerce-pharmacy/
├── backend/                    # API REST (Node.js/Express)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                   # React/Next.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── styles/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── database/                   # Schemas e migrações
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
│
├── docs/                       # Documentação técnica
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── USER_FLOWS.md
│
├── tests/                      # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── infra/                      # Infraestrutura
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
│
├── docker-compose.yml
├── .gitignore
├── PROJECT_STRUCTURE.md
├── ARCHITECTURE.md
├── EXECUTIVE_SUMMARY.md
├── README.md
└── CONTRIBUTING.md
```

## 🎯 Funcionalidades Principais

### 👤 Autenticação & Usuário
- Registro com email/senha
- Login com JWT
- Perfil de usuário editável
- Recuperação de senha
- Dois fatores (futuro)

### 📄 Gerenciamento de Documentos
- Upload de receita médica
- Upload de laudo médico
- OCR extração de dados
- Validação por admin
- Status em tempo real
- Histórico de documentos

### 💊 Catálogo de Medicamentos
- Listagem com filtros
- Busca por nome/princípio ativo
- Indicação de documentos necessários
- Preço e disponibilidade
- Detalhes completos

### 🛒 Carrinho & Checkout
- Adicionar/remover produtos
- Cálculo dinâmico
- Validação de documentos
- Seleção de endereço
- Resumo do pedido

### 💳 Pagamento
- Integração com gateway (Stone/Stripe)
- Suporte a cartão de crédito
- PIX (futuro)
- Escrow: validação pós-pagamento
- Confirmação e notificações

### 📦 Gerenciamento de Pedidos
- Histórico completo
- Rastreamento
- Status em tempo real
- Notificações por email/SMS
- Recebimento e devoluções

### ⚙️ Painel de Admin
- Validação de documentos
- Gerenciamento de medicamentos
- Gestão de pedidos
- Relatórios e analytics
- Gerenciamento de usuários

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Encriptação TLS 1.3
- ✅ Dados sensíveis em AES-256
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ LGPD compliant
- ✅ Auditoria de acessos
- ✅ Backup e disaster recovery

## 📊 Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **BD**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Auth**: JWT
- **Upload**: AWS S3 / MinIO
- **Validação**: Yup/Joi
- **OCR**: Tesseract.js (opcional)

### Frontend
- **Framework**: Next.js 14+
- **Linguagem**: TypeScript
- **UI**: Material-UI / Tailwind CSS
- **Estado**: Zustand / Redux
- **HTTP**: Axios
- **Upload**: React Dropzone

### DevOps
- **Containerização**: Docker
- **Orquestração**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana
- **Logging**: ELK / CloudWatch

## 📈 Roadmap

### MVP (Semanas 1-6)
- [x] Setup do projeto
- [ ] Autenticação básica
- [ ] Upload de documentos
- [ ] Catálogo de medicamentos
- [ ] Carrinho e checkout
- [ ] Integração de pagamento

### v1.0 (Semanas 7-12)
- [ ] OCR para documentos
- [ ] Validação por admin
- [ ] Integração com logística
- [ ] Notificações
- [ ] Deploy em produção

### v1.1+ (Futuro)
- [ ] Integração CRM médicos
- [ ] PIX payment
- [ ] App mobile
- [ ] Marketplace multi-farmácia
- [ ] IA para análise de receitas

## 🧪 Testes

```bash
# Backend
cd backend
npm run test              # Testes unitários
npm run test:integration  # Testes de integração
npm run test:e2e          # Testes end-to-end

# Frontend
cd frontend
npm run test              # Jest tests
npm run test:e2e          # Cypress/Playwright
```

## 📝 Desenvolvimento

```bash
# Backend
cd backend
npm run dev    # Desenvolver com hot-reload
npm run lint   # Linter
npm run build  # Build para produção

# Frontend
cd frontend
npm run dev    # Desenvolver com hot-reload
npm run lint   # Linter
npm run build  # Build para produção
```

## 🚢 Deployment

### Staging
```bash
git push origin staging
# GitHub Actions faz deploy automático
```

### Produção
```bash
git push origin main
# GitHub Actions faz deploy automático
# Requer aprovação manual em GitHub
```

Veja [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) para detalhes.

## 🤝 Contribuindo

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) para:
- Guia de setup
- Convenções de código
- Processo de PR
- Commits messages

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Slack**: #ecommerce-pharmacy
- **Email**: dev@example.com

## 📜 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

## 👥 Time

- **Product Owner**: [Nome]
- **Tech Lead**: [Nome]
- **Backend Lead**: [Nome]
- **Frontend Lead**: [Nome]

## ✅ Checklist de Antes de Começar

- [ ] Node.js 18+ instalado
- [ ] Docker instalado
- [ ] Git configurado
- [ ] SSH keys no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] BD local rodando
- [ ] `npm install` executado
- [ ] App iniciando sem erros

## 📊 Métricas e Monitoramento

Veja [docs/MONITORING.md](./docs/MONITORING.md) para:
- Dashboards
- Alertas
- SLOs e SLIs
- Performance benchmarks

---

**Desenvolvido com ❤️ para transformar a farmácia digital**

Last updated: 2026-06-25
