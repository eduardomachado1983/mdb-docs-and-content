# Dionísio · Operação de salão

Protótipo funcional de operação de salão para restaurante, com dois fluxos:

- **Garçom**: mesas, comanda, cardápio, chamados, divisão e fechamento de conta.
- **Gestor**: visão geral das mesas, detalhe por mesa, desconto, registro e conferência de pagamento.

Todo o estado vive em memória (React `useState`), com dados de demonstração já
carregados. Não há backend nem autenticação real — os logins são apenas telas
de fachada, como indicado na própria interface.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy

Projeto Vite + React puro — pronto para deploy direto no Vercel (framework
preset "Vite", diretório raiz `dionisio-salao`).
