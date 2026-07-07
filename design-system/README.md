# Design System — Desktop & Mobile

Sistema de design multi-marca. A **estrutura** (grid, espaçamento, elevação,
componentes) é fixa e compartilhada entre marcas. Cada nova marca gera apenas
uma **versão de tokens** (cor, tipografia, tom de voz) por cima dessa estrutura
— o padrão nunca muda, só a "pele".

## Arquitetura

```
design-system/
├── tokens/
│   ├── core.json           ← estrutural, NUNCA muda por marca (spacing, radius,
│   │                          breakpoints, elevação, motion, grid)
│   └── brand.template.json ← molde vazio a preencher por marca (cor, tipografia,
│                               voz/tom). Nunca editar direto — copiar para uma
│                               versão nova.
├── versions/
│   └── VERSIONS.md         ← histórico de versões de marca (v1, v2, ...)
├── platforms/
│   ├── desktop/            ← componentes/padrões derivados do UI Kit macOS 27
│   └── mobile/             ← componentes/padrões derivados do UI Kit iOS/iPadOS 27
└── CHANGELOG.md
```

## Status atual

- `tokens/core.json`: preenchido com valores estruturais **provisórios**,
  baseados nas convenções públicas da Apple HIG (macOS/iOS). Estes valores
  devem ser substituídos assim que os arquivos Figma de origem estiverem
  acessíveis (ver abaixo).
- `platforms/desktop` e `platforms/mobile`: ainda vazios de componentes reais.
  Os dois arquivos Figma de referência são arquivos da **Comunidade Figma**:
  - macOS 27 (Community)
  - iOS/iPadOS 27 (Community)

  A API do Figma só expõe a capa (página "Cover") de arquivos comunitários que
  não foram duplicados para uma conta própria. Para extrair a estrutura real
  (componentes, auto-layout, variáveis), é necessário:
  1. Abrir cada arquivo no Figma → **"Get a copy" / "Duplicate"**.
  2. Passar os links dos arquivos duplicados (agora na sua conta) para gerar
     `platforms/desktop` e `platforms/mobile` a partir dos componentes reais.

- Nenhuma marca aplicada ainda. `tokens/brand.template.json` está com os
  campos vazios/placeholder.

## Como criar uma nova versão de marca

Cada nova marca = uma nova pasta de tokens, nunca uma edição da estrutura.

1. Fornecer um input de identidade:
   - link de um site (para inferir paleta e tipografia via CSS computado), e/ou
   - um isologo (arquivo de imagem/SVG, para extrair cores dominantes), e/ou
   - um arquivo Figma da marca (para ler estilos/variáveis diretamente).
2. Copiar `tokens/brand.template.json` para
   `versions/<slug-da-marca>/brand.json` e preencher:
   - `color` — paleta semântica (primary, secondary, accent, surface,
     background, text, success/warning/error/info).
   - `typography` — família tipográfica, pesos e escala (desktop e mobile
     podem variar em tamanho, não em família).
   - `voice` — tom (ex: formal/informal, técnico/acessível), vocabulário
     preferido/evitado, exemplos de microcopy.
3. Registrar a versão em `versions/VERSIONS.md` e `CHANGELOG.md`.
4. `tokens/core.json` e os componentes em `platforms/` **não são tocados** —
   é isso que garante que o padrão fique intacto entre marcas.

## Próximos passos

- [ ] Duplicar os 2 arquivos Figma Community para a conta do usuário e
      reenviar os links.
- [ ] Extrair componentes/estilos reais → popular `platforms/desktop` e
      `platforms/mobile`.
- [ ] Revisar `tokens/core.json` contra os valores reais extraídos do Figma
      (hoje são estimativas baseadas na HIG pública da Apple).
- [ ] Definir a primeira marca real (v1) e seu input de identidade (site,
      logo ou Figma).
