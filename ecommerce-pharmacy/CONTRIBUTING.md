# 🤝 Guia de Contribuição

Obrigado por querer contribuir com nosso projeto! Este documento fornece diretrizes e instruções para contribuir de forma eficaz.

## 📋 Índice

- [Code of Conduct](#code-of-conduct)
- [Como Começar](#como-começar)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Convenções de Código](#convenções-de-código)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testes](#testes)
- [Documentação](#documentação)

---

## Code of Conduct

Todos os contribuidores devem aderir a um ambiente respeitoso e inclusivo. Esperamos:
- Comportamento profissional e respeitoso
- Abertura a feedback construtivo
- Foco na qualidade e na aprendizagem coletiva

---

## Como Começar

### 1. Fork o Repositório
```bash
# Clone seu fork
git clone https://github.com/seu-usuario/ecommerce-pharmacy.git
cd ecommerce-pharmacy

# Adicione upstream remoto
git remote add upstream https://github.com/original-repo/ecommerce-pharmacy.git
```

### 2. Crie uma Branch de Feature
```bash
# Atualize main
git fetch upstream
git rebase upstream/main

# Crie sua branch
git checkout -b feature/descricao-da-feature
# ou
git checkout -b fix/descricao-do-fix
```

### 3. Setup do Ambiente Local
```bash
# Instale dependências
cd backend && npm install
cd ../frontend && npm install

# Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Inicie os serviços
docker-compose up -d

# Rode as migrações (quando necessário)
cd backend && npm run migration:run
```

---

## Processo de Desenvolvimento

### Branch Naming

Use nomes descritivos para suas branches:
```
feature/user-authentication         # Nova feature
fix/cart-calculation-bug            # Bug fix
docs/api-documentation              # Documentação
refactor/extract-components         # Refatoração
test/add-payment-tests              # Testes
```

### Workflow

1. **Crie sua branch** a partir de `main`
2. **Faça commits** regularmente com mensagens claras
3. **Abra um Pull Request** assim que tiver progresso
4. **Responda a reviews** dos maintainers
5. **Merge quando aprovado**

### Status do PR

Use labels para indicar o status:
- `work-in-progress` - Ainda desenvolvendo
- `ready-for-review` - Pronto para revisão
- `pending-changes` - Aguardando correções
- `approved` - Aprovado e pronto para merge

---

## Convenções de Código

### TypeScript

```typescript
// ✅ Bom
export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

interface User {
  id: string;
  email: string;
  fullName: string;
}

// ❌ Ruim
const calcTotal = (i: any) => i.reduce((s, x) => s + x.p * x.q, 0);

function CT(items) {
  var sum = 0;
  for (var i = 0; i < items.length; i++) {
    sum = sum + items[i].price * items[i].quantity;
  }
  return sum;
}
```

### Nomes de Variáveis e Funções

- Use **camelCase** para variáveis e funções
- Use **PascalCase** para classes e componentes React
- Use **UPPER_SNAKE_CASE** para constantes
- Nomes descritivos e em inglês

```typescript
// ✅ Bom
const user: User = getUserById(userId);
const isValidEmail = validateEmail(email);
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// ❌ Ruim
const u: User = getU(id);
const valid = v_email(e);
const max_size = 5242880;
```

### Organização de Arquivos

```typescript
// Backend - Models
// src/models/User.ts
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // ...
}

// Backend - Services
// src/services/auth.service.ts
export class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async register(dto: RegisterDTO): Promise<User> {
    // ...
  }
}

// Frontend - Components
// src/components/auth/LoginForm.tsx
export const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  // ...
};

// Frontend - Hooks
// src/hooks/useAuth.ts
export const useAuth = () => {
  // ...
};
```

### Imports

```typescript
// ✅ Bom - Agrupe imports
import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

// ❌ Ruim - Imports desorganizados
import { Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import React, { FC } from 'react';
import { TextField } from '@mui/material';
import { authService } from '@/services/authService';
import { useRouter } from 'next/router';
```

### Comentários

- **Evite comentários óbvios**
- **Comente o "por quê", não o "o quê"**
- **Use TODO/FIXME para tarefas futuras**

```typescript
// ✅ Bom
// Aguarda 100ms para permitir que o DOM seja renderizado antes de pagar
setTimeout(() => capturePayment(), 100);

// TODO: Migrar para evento de DOM nativo quando o React Transitions API estiver pronto
// FIXME: User model não está sincronizando com CRM

// ❌ Ruim
// Set timeout
setTimeout(() => capturePayment(), 100);

// Chamar função
executeValidation(doc);
```

---

## Commit Messages

### Formato

Siga o padrão Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- `feat` - Nova feature
- `fix` - Bug fix
- `docs` - Documentação
- `style` - Formatação (não afeta lógica)
- `refactor` - Refatoração sem mudanças funcionais
- `perf` - Melhoria de performance
- `test` - Adição de testes
- `chore` - Tasks de build, dependências, etc

### Exemplos

```bash
# Feature
git commit -m "feat(auth): add two-factor authentication"

# Fix
git commit -m "fix(cart): calculate totals correctly with discounts"

# Docs
git commit -m "docs: update API documentation for payment endpoints"

# Refactoring
git commit -m "refactor(services): extract document validation logic"

# Com body
git commit -m "feat(documents): implement OCR extraction

- Add Tesseract.js integration
- Extract text from prescriptions
- Store extracted data in database
- Add unit tests for extraction"
```

### Regras

- ✅ Commits atômicos (uma coisa por commit)
- ✅ Mensagens em inglês
- ✅ Primeira linha com até 72 caracteres
- ✅ Conjugue na segunda pessoa do imperativo: "add feature" não "added feature"
- ❌ Sem merges em sua branch (rebase em vez disso)

---

## Pull Requests

### Checklist Antes de Submeter

- [ ] Código segue as convenções do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Testes passam localmente (`npm run test`)
- [ ] Linter passa (`npm run lint`)
- [ ] TypeScript compila sem erros (`npm run typecheck`)
- [ ] Documentação foi atualizada
- [ ] Não há conflitos com a branch principal
- [ ] Commits têm mensagens descritivas

### Template de PR

```markdown
## 📝 Descrição

Breve descrição do que este PR faz.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Atualização de documentação

## 🧪 Como Testar

Instruções passo a passo para testar:
1. Vá para...
2. Clique em...
3. Verifique que...

## 📸 Screenshots (se aplicável)

[Adicione screenshots ou GIFs aqui]

## 📋 Checklist

- [ ] Meu código segue as convenções do projeto
- [ ] Realizei uma auto-revisão do meu próprio código
- [ ] Adicionei comentários onde necessário
- [ ] Atualizei a documentação relevante
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que comprovam minha fix/feature
- [ ] Testes novos e existentes passam localmente

## 🔗 Links

Closes #(issue number)

## 📝 Notas Adicionais

Qualquer contexto adicional relevante.
```

---

## Testes

### Escrevendo Testes

Cobertura de teste é importante. Almejamos:
- **Unitários**: 80%+ de cobertura
- **Integração**: Endpoints críticos
- **E2E**: Fluxos principais do usuário

### Backend (Jest)

```typescript
// src/services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userRepository.save = jest.fn().mockResolvedValue({
        id: '1',
        ...dto,
      });

      const result = await authService.register(dto);

      expect(result.email).toBe(dto.email);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const dto = { email: 'existing@example.com', password: 'pass' };

      userRepository.findOne = jest.fn().mockResolvedValue({ id: '1' });

      await expect(authService.register(dto)).rejects.toThrow(
        'Email already registered'
      );
    });
  });
});
```

### Frontend (Jest + React Testing Library)

```typescript
// src/components/__tests__/LoginForm.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm onSuccess={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(onSuccess).toHaveBeenCalled();
  });
});
```

### Rodando Testes

```bash
# Backend
cd backend
npm test                    # Rodar testes
npm run test:watch         # Modo watch
npm run test:coverage      # Com coverage
npm run test:integration   # Apenas testes de integração

# Frontend
cd frontend
npm test                    # Rodar testes
npm run test:watch         # Modo watch
npm run test:coverage      # Com coverage
npm run test:e2e          # Testes E2E
```

---

## Documentação

### Comentar Código

```typescript
// ✅ Bom - Explica o porquê
// Validamos a receita via CRM do médico para garantir que é válida
// antes de permitir a compra de medicamentos controlados
const isValidPrescription = await validateWithCRM(prescription);

// Arquivo de componente bem documentado
/**
 * Formulário para upload de documentos médicos (receita e laudo)
 * 
 * @component
 * @example
 * return (
 *   <DocumentUploadForm 
 *     onSuccess={() => navigate('/checkout')} 
 *     onError={handleError} 
 *   />
 * )
 */
export const DocumentUploadForm: FC<DocumentUploadFormProps> = ({
  onSuccess,
  onError,
}) => {
  // ...
};
```

### README e Documentação

Mantenha a documentação atualizada:
- Adicione nova feature? Atualize o README
- Mude um endpoint? Atualize a documentação da API
- Refatore a estrutura? Atualize a documentação da arquitetura

### Exemplos de Código

Sempre forneça exemplos em sua documentação:

```markdown
## Como usar

### Exemplo 1: Autenticação básica
\`\`\`typescript
const { token } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
\`\`\`

### Exemplo 2: Upload de documento
\`\`\`typescript
const form = new FormData();
form.append('file', file);
form.append('documentType', 'PRESCRIPTION');

const result = await documentService.upload(form);
\`\`\`
```

---

## 🚀 Fazendo sua Primeira Contribuição

1. Procure issues com label `good-first-issue`
2. Comente na issue que quer trabalhar nela
3. Siga os passos acima para criar uma branch e fazer o PR
4. Espere feedback e seja aberto a sugestões

---

## 💡 Dicas

- **Comece pequeno**: PRs menores são mais fáceis de revisar
- **Comunique cedo**: Abra um PR em trabalho para feedback inicial
- **Seja paciente**: Reviews podem levar tempo
- **Aprenda com feedback**: Cada comentário é uma oportunidade de aprender

---

## ❓ Dúvidas?

- 📧 Email: dev@example.com
- 💬 Slack: #development
- 🗨️ Discussions: GitHub Discussions
- 📝 Issues: Use labels para perguntas

---

Obrigado por contribuir! 🎉

**Última atualização**: 2026-06-25
