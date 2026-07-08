---
name: NatureHealth
version: "1.1.0"
language: pt-BR
platform: web
stack: React 18 + Vite + inline CSS-in-JS

colors:
  # Paleta principal — Nature Health
  primary: "#57BC90"
  primary-dark: "#3d9a73"
  primary-light: "#77C9D4"
  primary-on: "#015249"        # texto sobre fundo primary — contraste 14.3:1 (AAA)

  secondary: "#015249"
  secondary-dark: "#013632"
  secondary-light: "#57BC90"

  accent: "#77C9D4"
  accent-subtle: "#E8F6F8"

  neutral: "#A5A5AF"
  neutral-light: "#D4D4D8"
  neutral-dark: "#6B6B72"

  # Estados semânticos (mantidos iOS para acessibilidade)
  success: "#57BC90"
  warning: "#FF9500"
  error: "#FF3B30"
  info: "#77C9D4"

  # Superfícies
  surface: "rgba(255,255,255,0.75)"
  surface-dark: "rgba(1,82,73,0.85)"
  surface-elevated: "rgba(255,255,255,0.92)"
  background: "#F0F4F3"
  background-dark: "#012E29"

  on-surface: "#015249"
  on-surface-secondary: "#4A6B67"
  on-surface-tertiary: "#A5A5AF"
  on-surface-inverted: "#FFFFFF"

  # Separadores derivados da paleta
  separator: "rgba(1,82,73,0.10)"
  separator-opaque: "#C8D8D6"

  # Liquid Glass — tonalidade verde-teal
  glass-light: "rgba(255,255,255,0.65)"
  glass-teal: "rgba(119,201,212,0.18)"
  glass-forest: "rgba(1,82,73,0.12)"
  glass-dark: "rgba(1,46,41,0.60)"
  glass-border: "rgba(255,255,255,0.30)"
  glass-border-teal: "rgba(119,201,212,0.35)"
  glass-shadow: "rgba(1,82,73,0.12)"

typography:
  display:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"

  title-1:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"

  title-2:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.27
    letterSpacing: "-0.005em"

  title-3:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3

  headline:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.41

  body:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.53

  callout:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5

  subheadline:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.47

  footnote:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.38

  caption:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.01em"

  label:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.27
    letterSpacing: "0.06em"
    textTransform: "uppercase"

  mono:
    fontFamily: "SF Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.57

spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"

rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "30px"
  full: "9999px"

effects:
  glass-blur: "blur(20px) saturate(180%)"
  glass-blur-heavy: "blur(40px) saturate(200%)"
  shadow-sm: "0 1px 3px rgba(1,82,73,0.08), 0 1px 2px rgba(1,82,73,0.04)"
  shadow-md: "0 4px 6px rgba(1,82,73,0.10), 0 2px 4px rgba(1,82,73,0.06)"
  shadow-lg: "0 10px 15px rgba(1,82,73,0.10), 0 4px 6px rgba(1,82,73,0.06)"
  shadow-xl: "0 20px 25px rgba(1,82,73,0.12), 0 10px 10px rgba(1,82,73,0.05)"
  shadow-glass: "0 8px 32px rgba(1,82,73,0.14), inset 0 1px 0 rgba(255,255,255,0.45)"

animation:
  duration-fast: "150ms"
  duration-normal: "250ms"
  duration-slow: "400ms"
  easing-default: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  easing-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  easing-decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    fontSize: "{typography.headline.fontSize}"
    fontWeight: "{typography.headline.fontWeight}"
    borderRadius: "{rounded.full}"
    paddingX: "20px"
    paddingY: "14px"
    minHeight: "50px"

  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    transform: "scale(0.98)"

  button-secondary:
    backgroundColor: "{colors.glass-teal}"
    backdropFilter: "{effects.glass-blur}"
    textColor: "{colors.primary}"
    fontSize: "{typography.headline.fontSize}"
    fontWeight: "{typography.headline.fontWeight}"
    borderRadius: "{rounded.full}"
    border: "1px solid {colors.glass-border-teal}"
    paddingX: "20px"
    paddingY: "14px"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    fontSize: "{typography.headline.fontSize}"
    fontWeight: "{typography.headline.fontWeight}"
    borderRadius: "{rounded.full}"
    paddingX: "20px"
    paddingY: "14px"

  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.full}"
    paddingX: "20px"
    paddingY: "14px"

  card:
    backgroundColor: "{colors.glass-light}"
    backdropFilter: "{effects.glass-blur}"
    borderRadius: "{rounded.2xl}"
    border: "1px solid {colors.glass-border}"
    boxShadow: "{effects.shadow-glass}"
    padding: "{spacing.6}"

  card-teal:
    backgroundColor: "{colors.glass-teal}"
    backdropFilter: "{effects.glass-blur}"
    borderRadius: "{rounded.2xl}"
    border: "1px solid {colors.glass-border-teal}"
    boxShadow: "{effects.shadow-md}"
    padding: "{spacing.6}"

  card-doctor:
    backgroundColor: "{colors.glass-light}"
    backdropFilter: "{effects.glass-blur}"
    borderRadius: "{rounded.2xl}"
    border: "1px solid {colors.glass-border-teal}"
    boxShadow: "{effects.shadow-glass}"
    padding: "{spacing.6}"
    accentBar: "4px solid {colors.secondary}"

  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    borderRadius: "{rounded.2xl}"
    boxShadow: "{effects.shadow-lg}"
    padding: "{spacing.6}"

  input:
    backgroundColor: "{colors.glass-light}"
    backdropFilter: "{effects.glass-blur}"
    borderRadius: "{rounded.lg}"
    border: "1px solid {colors.separator-opaque}"
    textColor: "{colors.on-surface}"
    fontSize: "{typography.body.fontSize}"
    paddingX: "16px"
    paddingY: "12px"
    minHeight: "44px"

  input-focus:
    border: "1px solid {colors.primary}"
    boxShadow: "0 0 0 3px rgba(1,82,73,0.15)"

  navigation-bar:
    backgroundColor: "{colors.glass-forest}"
    backdropFilter: "{effects.glass-blur-heavy}"
    borderBottom: "0.5px solid {colors.separator}"
    height: "44px"

  tab-bar:
    backgroundColor: "{colors.glass-light}"
    backdropFilter: "{effects.glass-blur-heavy}"
    borderTop: "0.5px solid {colors.separator}"
    height: "83px"
    activeColor: "{colors.primary}"
    inactiveColor: "{colors.neutral}"

  badge-online:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    fontSize: "{typography.caption.fontSize}"
    fontWeight: 600
    borderRadius: "{rounded.full}"
    paddingX: "8px"
    paddingY: "3px"

  badge-urgent:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-surface-inverted}"
    fontSize: "{typography.caption.fontSize}"
    fontWeight: 600
    borderRadius: "{rounded.full}"
    paddingX: "8px"
    paddingY: "3px"

  badge-specialty:
    backgroundColor: "{colors.glass-teal}"
    textColor: "{colors.primary}"
    fontSize: "{typography.label.fontSize}"
    fontWeight: 500
    borderRadius: "{rounded.full}"
    border: "1px solid {colors.glass-border-teal}"
    paddingX: "10px"
    paddingY: "4px"

  status-dot-online:
    backgroundColor: "{colors.secondary}"
    size: "10px"
    borderRadius: "{rounded.full}"
    border: "2px solid {colors.on-surface-inverted}"

  status-dot-offline:
    backgroundColor: "{colors.neutral}"
    size: "10px"
    borderRadius: "{rounded.full}"
    border: "2px solid {colors.on-surface-inverted}"

  status-dot-busy:
    backgroundColor: "{colors.warning}"
    size: "10px"
    borderRadius: "{rounded.full}"
    border: "2px solid {colors.on-surface-inverted}"

  modal:
    backgroundColor: "{colors.glass-light}"
    backdropFilter: "{effects.glass-blur-heavy}"
    borderRadius: "{rounded.3xl}"
    boxShadow: "{effects.shadow-xl}"

  avatar:
    borderRadius: "{rounded.full}"
    border: "2px solid {colors.glass-border-teal}"
    boxShadow: "{effects.shadow-sm}"

  divider:
    color: "{colors.separator}"
    height: "0.5px"

  progress-bar:
    backgroundColor: "{colors.neutral-light}"
    fillColor: "{colors.primary}"
    height: "4px"
    borderRadius: "{rounded.full}"

  progress-step-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.full}"

  progress-step-done:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.full}"

  progress-step-pending:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.neutral}"
    borderRadius: "{rounded.full}"

  toast-success:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.lg}"
    boxShadow: "{effects.shadow-md}"

  toast-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.lg}"
    boxShadow: "{effects.shadow-md}"

  toast-info:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverted}"
    borderRadius: "{rounded.lg}"
    boxShadow: "{effects.shadow-md}"

  payment-pix:
    backgroundColor: "{colors.glass-teal}"
    borderRadius: "{rounded.xl}"
    border: "1px solid {colors.glass-border-teal}"
    accentColor: "{colors.secondary}"

  document-upload:
    backgroundColor: "{colors.glass-light}"
    borderRadius: "{rounded.xl}"
    border: "2px dashed {colors.secondary}"
    textColor: "{colors.primary}"
---

# DESIGN.md — Nature Health

Design system para plataformas web voltadas ao mercado brasileiro, com identidade visual Nature Health — quatro tons derivados de natureza e saúde — combinada com a linguagem Liquid Glass para transmitir confiança, leveza e modernidade.

## Overview

A identidade equilibra dois valores em tensão: **acolhimento** (cores suaves, espaços respiráveis) e **credibilidade** (hierarquia clara, precisão tipográfica). A paleta Nature Health resolve isso naturalmente — Forest (#015249) ancora a seriedade, Marine (#57BC90) traz vitalidade, Feather (#77C9D4) alivia, Sleek Grey (#A5A5AF) neutraliza.

O stack é React 18 + Vite, componente único App.jsx, com mock data estruturada para migração Firebase.

## Paleta de Cores

### Quatro cores-base

| Nome | Hex | Papel |
|---|---|---|
| Marine | #57BC90 | Primária — ação, CTA, identidade de marca |
| Forest | #015249 | Secundária — texto, autoridade, suporte visual |
| Feather | #77C9D4 | Acento — info, destaque suave, glass tint |
| Sleek Grey | #A5A5AF | Neutro — inativo, placeholder, divisores |

### Semântica por contexto médico

- **Médico online:** `colors.primary` (#57BC90 Marine) — verde transmite disponibilidade e saúde
- **Consulta confirmada / sucesso:** `colors.primary`
- **Especialidade / categoria:** `colors.accent` (#77C9D4 Feather) — mais suave, informativo
- **Alerta urgente / cancelamento:** `colors.error` — vermelho iOS padrão, reconhecível universalmente
- **Texto principal:** `colors.on-surface` (#015249) — Forest como cor de texto sobre fundos claros; `colors.primary-on` (#015249) sobre botões Marine
- **Fundo de tela:** `colors.background` (#F0F4F3) — levemente esverdeado, derivado da paleta, nunca cinza neutro

### Regras de uso de cor

- Marine (#57BC90) é a única cor de botão primário. Um por tela.
- Forest (#015249) é o secundário — âncora de texto, elementos de autoridade e suporte visual.
- Feather (#77C9D4) nunca age sozinho como CTA — é sempre suporte visual ou tint de glass.
- Sleek Grey (#A5A5AF) para estados inativos, texto terciário e ícones sem ação.
- Nunca use Forest como fundo de tela inteiro — reservado para dark mode e headers especiais.

## Tipografia

SF Pro via system font stack nativo (`-apple-system, BlinkMacSystemFont`). Renderização nativa em iOS sem carregamento externo. Em contextos médicos, clareza supera personalidade — SF Pro é a escolha certa.

**Hierarquia tipográfica:**
- **Display / Title 1** → Nome do médico no card, título de tela principal
- **Title 2 / Headline** → Nome da especialidade, cabeçalhos de seção
- **Body** → Descrição de sintomas, informações de consulta, texto de formulário
- **Subheadline / Footnote** → Horário, data, CRM, metadados clínicos
- **Label UPPERCASE** → Badges de especialidade, status, categorias

Nunca use peso 300 (Light) em contexto médico — transmite fragilidade. Mínimo 400 (Regular) para todo texto funcional.

## Layout

- Safe areas iOS respeitadas: 44px top (nav), 83px bottom (tab bar)
- Padding horizontal: 16px mobile, 24px tablet
- Max-width de conteúdo: 640px (breakpoint único do projeto)
- Grid: coluna única mobile-first
- Espaçamento interno de cards: sempre 24px
- Toque mínimo: 44×44px (obrigatório HIG — pacientes idosos são usuário real)

## Efeitos Liquid Glass

Superfícies translúcidas derivadas da paleta Forest/Feather:

```css
/* Glass padrão — cards, modais */
background: rgba(255, 255, 255, 0.65);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.30);
box-shadow: 0 8px 32px rgba(1,82,73,0.14), inset 0 1px 0 rgba(255,255,255,0.45);

/* Glass teal — cards de especialidade, pills de categoria */
background: rgba(119, 201, 212, 0.18);
border: 1px solid rgba(119, 201, 212, 0.35);

/* Glass forest — navigation bar */
background: rgba(1, 82, 73, 0.12);
```

**Regra:** Coloque glass sempre sobre o fundo `#F0F4F3` — o leve tom esverdeado faz o efeito aparecer com beleza. Nunca glass sobre branco puro.

## Componentes

### Card de Médico
Card glass branco com barra lateral esquerda de 4px em Marine (#57BC90). Avatar com border teal. Badge de status (online/offline/busy) com dot colorido. Nome em Title 2, especialidade em badge Feather pill, CRM em footnote cinza.

### Fluxo de 5 Etapas (Progress Steps)
- Etapa concluída: dot Marine (#57BC90) + linha conectora Forest
- Etapa atual: dot Forest (#015249) + label em Headline bold
- Etapa futura: dot Sleek Grey + label em subheadline cinza
- Barra de progresso: `colors.primary` fill sobre `colors.neutral-light`

### Upload de Documentos
Área de drop com borda 2px dashed Marine (#57BC90), fundo glass branco, ícone em Forest, texto em body Forest. No hover, borda sólida + leve tint teal.

### Pagamento PIX
Card glass teal com logo PIX em Marine. Código copiável em fonte mono. Status de confirmação com check Marine animado.

### Perfis por Papel
- **Paciente:** Tab bar branca glass, ícones Forest/Grey
- **Médico:** Navigation bar com glass forest sutil, badge de especialidade teal
- **Admin:** Tabelas com fundo alternado `#F0F4F3` / branco, accent Forest nos totais

## Animações

Spring physics em toda interação tátil:
- Botão press: `scale(0.97)` + `150ms spring`
- Card tap: `scale(0.99)` + `200ms spring`
- Modal entrada: slide-up `400ms cubic-bezier(0.34, 1.56, 0.64, 1)`
- Toast entrada: slide-down-fade `250ms decelerate`
- Status dot online: pulse suave `2s infinite` em Marine

## Feedback — Toast Only

**Nunca use `alert()` ou `confirm()` nativos do browser.** Todo feedback ao usuário é via toast:

- Sucesso → toast Marine (#57BC90) com ícone check
- Erro → toast vermelho com ícone X
- Info → toast Forest com ícone info
- Duração padrão: 3500ms, com possibilidade de fechar manualmente

## Contexto Brasil

- CPF do paciente: `000.000.000-00`
- CRM do médico: `CRM/SP 123456`
- Datas: `dd/mm/aaaa`, horários: `HH:mm`
- Valores: `R$ 150,00` (consulta particular) ou `Convênio` quando coberto
- Pagamento: PIX como opção principal, cartão como secundário, PagSeguro como gateway
- Linguagem: "Agendar consulta" não "Book appointment". "Entrar" não "Login". "Médico" não "Doutor" (exceto no saludo direto).
- LGPD: textos de consentimento obrigatórios antes de upload de documentos médicos

## Acessibilidade

- Contraste Forest (#015249) sobre branco: **14.3:1** — passa AAA
- Contraste Marine (#57BC90) sobre branco: **3.2:1** — usar apenas em elementos grandes (18px+ ou bold)
- Contraste Feather (#77C9D4) sobre branco: **2.5:1** — nunca como cor de texto, apenas decorativo/glass
- Toda área clicável mínimo 44×44px
- Focus ring: `outline: 2px solid #015249; outline-offset: 2px`
- Suporte a `prefers-reduced-motion`: remover transforms, manter opacity

## Uso com Agentes de IA

Cole no início de qualquer prompt de geração de UI:

```
Siga estritamente o DESIGN.md deste projeto.
Paleta: Marine #57BC90 (primária/CTA), Forest #015249 (texto sobre botão Marine e elementos de autoridade), Feather #77C9D4 (acento/glass), Sleek Grey #A5A5AF (neutro).
Use glass branco para cards, glass teal para badges de especialidade.
Fundo sempre #F0F4F3. Botão primário sempre Marine pill com texto Forest. Feedback sempre via toast, nunca alert().
Stack: React 18, App.jsx único, CSS-in-JS inline, breakpoint 640px.
```

## Do's e Don'ts

### ✅ Faça
- Use Marine (#57BC90) como cor primária de ação exclusiva
- Use Forest (#015249) como cor de texto sobre botões Marine e em elementos de autoridade
- Fundo de tela sempre #F0F4F3 (nunca branco puro)
- Glass com tint teal em cards de especialidade e categorias
- Toast para todo feedback, sem exceção
- Textos em pt-BR específico e humano ("Seus documentos", não "Seus arquivos")

### ❌ Não faça
- Não use Feather (#77C9D4) como cor de texto — contraste insuficiente
- Não use texto branco sobre Marine — contraste 3.2:1 insuficiente; use Forest (#015249)
- Não use alert() ou confirm() — quebraria a experiência e o design
- Não adicione novas cores fora da paleta sem versionamento
- Não use peso tipográfico Light (300) em nenhum contexto clínico
- Não esqueça `-webkit-backdrop-filter` no Safari

## UX Foundations

As regras abaixo são derivadas de três fontes reconhecidas em UX:

- **Nielsen Norman Group (NN/g)** — pesquisa científica e heurísticas validadas por testes reais com usuários. Regras de comportamento e usabilidade inegociáveis.
- **UX Collective** — prática de mercado atual. Decisões de tendência visual e riscos já identificados por outros profissionais.
- **Interaction Design Foundation (IxDF)** — base teórica e psicológica (carga cognitiva, Gestalt, modelos mentais). Explica o *porquê* de cada regra.

Prioridade em caso de conflito: **usabilidade (NN/g) > consistência visual do projeto > tendência estética**.

### Heurísticas de Nielsen — checklist obrigatório antes de qualquer entrega

1. **Visibilidade do status do sistema** — todo carregamento ou processamento assíncrono precisa de feedback visual imediato (skeleton, spinner, progress bar).
2. **Correspondência com o mundo real** — linguagem e ícones familiares ao usuário brasileiro (CPF, PIX), sem jargão técnico.
3. **Controle e liberdade** — toda ação destrutiva ou de múltiplas etapas precisa de saída clara (cancelar, voltar, desfazer).
4. **Consistência e padrões** — mesmo componente, mesmo comportamento em todo o app. Botão primário: sempre Forest pill, sempre na mesma posição relativa.
5. **Prevenção de erros** — validação em tempo real nos formulários, preferível a mensagens pós-envio.
6. **Reconhecimento em vez de memorização** — contexto sempre visível (breadcrumbs, resumos, dados já preenchidos).
7. **Flexibilidade e eficiência** — atalhos para admin sem complicar a experiência do paciente.
8. **Design minimalista** — cada elemento precisa justificar sua presença. Informação irrelevante compete com a relevante.
9. **Mensagens de erro humanas** — dizer o que aconteceu e como resolver. Nunca "Erro 500" ou "Algo deu errado".
10. **Ajuda contextual** — pontos críticos (pagamento, dados de saúde) precisam de texto de apoio curto e visível.

### Limites de tempo de resposta

| Tempo | Percepção | Ação exigida |
|---|---|---|
| < 0,1s | Instantâneo | Nenhum feedback necessário |
| < 1s | Fluxo mantido | Sem loading, mas ok |
| < 10s | Atenção começa a se perder | Loading indicator obrigatório |
| > 10s | Risco de abandono | Progress bar com % ou etapas |

Qualquer chamada de API (PagSeguro, OpenAI, upload de documento) que passe de 1 segundo precisa de estado de loading visível.

### Padrão de escaneamento (F-Pattern)

Usuários não leem — eles escaneiam. Pesquisa de eye-tracking do NN/g mostra atenção concentrada no topo e à esquerda, decrescendo.

- Informação mais importante sempre no topo/esquerda (ou centro em mobile)
- Títulos e labels devem funcionar sozinhos, sem depender do parágrafo ao redor
- Parágrafos longos de instrução viram bullets ou steps numerados
- KPIs críticos do admin vão no canto superior esquerdo da viewport

### Risco de acessibilidade em Liquid Glass

Glassmorphism é uma das áreas de maior risco de falha de contraste (WCAG 2.2): a transparência do fundo é imprevisível dependendo do conteúdo atrás.

- Testar contraste de texto sobre glass em pelo menos 3 fundos diferentes (claro, escuro, gradiente)
- Contraste mínimo AA: 4.5:1 para texto normal, 3:1 para texto grande — mesmo com blur ativo
- Nunca usar glass puro como único indicador de estado — combinar com opacidade, ícone ou borda
- Validar com `eslint-plugin-jsx-a11y` e `@axe-core/react`

### Base teórica (IxDF)

- **Carga cognitiva:** cada decisão extra consome energia mental limitada. Formulários curtos, hierarquia clara e menos opções simultâneas reduzem abandono — crítico em fluxos de cadastro com dados de saúde.
- **Modelos mentais:** usuários trazem expectativas de outros apps (ex: fluxo PIX já é modelo mental estabelecido no Brasil). Quebrar esse padrão sem motivo forte aumenta erro e frustração.
- **Lei de Gestalt:** elementos relacionados devem estar visualmente agrupados (espaçamento 4pt) e elementos com a mesma função devem parecer iguais (cor, forma). Base do design system inteiro.

### Checklist antes de enviar para Bolt/Base44/Replit

- [ ] Toda ação assíncrona tem feedback visual conforme os limites de tempo
- [ ] Toda tela passou pelas 10 heurísticas
- [ ] Hierarquia visual segue padrão de escaneamento F
- [ ] Contraste testado em glass em múltiplos fundos
- [ ] Mensagens de erro são humanas e acionáveis
- [ ] Terminologia 100% localizada (PIX, CPF/CNPJ, pt-BR)

*Fontes: Nielsen Norman Group (nngroup.com), UX Collective (uxdesign.cc), Interaction Design Foundation (interaction-design.org).*

---

## Versionamento

- **Patch (1.0.x):** Ajuste de valor de token sem mudança de intenção
- **Minor (1.x.0):** Novo componente ou token adicionado
- **Major (x.0.0):** Mudança de paleta ou fluxo de produto
