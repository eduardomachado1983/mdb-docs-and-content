import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ChefHat, Receipt, X, ArrowLeft, ChevronDown, ChevronRight, ChevronLeft, Trash2, QrCode } from 'lucide-react';

/* ============ TOKENS ============ */
const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'IBM Plex Sans', sans-serif";

const C = {
  ink: '#0A0A0A',
  paper: '#FFFFFF',
  mist: '#F2F1EE',
  stone: '#C7C5C0',
  slate: '#6B6963',
  slateDark: '#33322F',
  /* cor só sobrevive nas notificações e em avisos de conferência */
  amberDeep: '#8A6425',
  amberBg: '#FAF3E6',
  greenDeep: '#2F6B49',
  greenBg: '#E8F5ED',
  alert: '#B8402C',
  alertBg: '#FBEDEA',
  payment: '#4A5578',
  paymentBg: '#EEF0F6',
};

/* ============ CARDÁPIO ============ */
const CARDAPIO = {
  bolinho: {
    nome: 'Bolinho de bacalhau (6 un)', preco: 48, categoria: 'Entradas',
    descricao: 'Seis bolinhos fritos na hora, servidos com limão siciliano.',
    modificadores: [],
    ingredientes: [
      { nome: 'Bacalhau dessalgado', qtd: 180, un: 'g' },
      { nome: 'Batata', qtd: 120, un: 'g' },
      { nome: 'Cebola', qtd: 30, un: 'g' },
      { nome: 'Salsinha', qtd: 5, un: 'g' },
      { nome: 'Limão siciliano', qtd: 1, un: 'un' },
    ],
  },
  burrata: {
    nome: 'Burrata com tomate confit', preco: 52, categoria: 'Entradas',
    descricao: 'Burrata cremosa, tomate confitado lentamente, azeite e manjericão.',
    modificadores: [
      { id: 'burrata_manj', titulo: 'Manjericão', tipo: 'unico', opcoes: ['Com manjericão', 'Sem manjericão'] },
    ],
    ingredientes: [
      { nome: 'Burrata', qtd: 125, un: 'g' },
      { nome: 'Tomate confit', qtd: 90, un: 'g' },
      { nome: 'Manjericão', qtd: 4, un: 'folhas' },
      { nome: 'Azeite extravirgem', qtd: 15, un: 'ml' },
      { nome: 'Flor de sal', qtd: 1, un: 'pitada' },
    ],
  },
  ancho: {
    nome: 'Ancho 300 g', preco: 89, categoria: 'Principais',
    descricao: 'Corte grelhado no ponto escolhido, manteiga de ervas e alho confitado.',
    modificadores: [
      { id: 'ancho_ponto', titulo: 'Ponto da carne', tipo: 'unico', obrigatorio: true, opcoes: ['Mal passado', 'Ao ponto', 'Bem passado'] },
      { id: 'ancho_add', titulo: 'Adicionais', tipo: 'multi', opcoes: ['Bacon (+R$ 8)', 'Ovo (+R$ 6)'] },
    ],
    ingredientes: [
      { nome: 'Ancho', qtd: 300, un: 'g' },
      { nome: 'Manteiga de ervas', qtd: 20, un: 'g' },
      { nome: 'Alho confitado', qtd: 2, un: 'dentes' },
      { nome: 'Sal grosso', qtd: 1, un: 'pitada' },
      { nome: 'Pimenta-do-reino', qtd: 1, un: 'pitada' },
    ],
  },
  risoto: {
    nome: 'Risoto de cogumelos', preco: 72, categoria: 'Principais',
    descricao: 'Arroz arbóreo, mix de cogumelos frescos e finalização de parmesão.',
    modificadores: [
      { id: 'risoto_ver', titulo: 'Versão', tipo: 'unico', opcoes: ['Tradicional', 'Vegana'] },
    ],
    ingredientes: [
      { nome: 'Arroz arbóreo', qtd: 90, un: 'g' },
      { nome: 'Cogumelos frescos', qtd: 120, un: 'g' },
      { nome: 'Parmesão', qtd: 30, un: 'g' },
      { nome: 'Manteiga', qtd: 20, un: 'g' },
      { nome: 'Vinho branco', qtd: 40, un: 'ml' },
    ],
  },
  moqueca: {
    nome: 'Moqueca de peixe (2 pessoas)', preco: 148, categoria: 'Principais',
    descricao: 'Peixe branco, leite de coco e dendê, servida com arroz e farofa.',
    modificadores: [
      { id: 'moqueca_pim', titulo: 'Pimenta', tipo: 'unico', opcoes: ['Com pimenta', 'Sem pimenta'] },
    ],
    ingredientes: [
      { nome: 'Peixe branco', qtd: 400, un: 'g' },
      { nome: 'Leite de coco', qtd: 200, un: 'ml' },
      { nome: 'Azeite de dendê', qtd: 30, un: 'ml' },
      { nome: 'Pimentão', qtd: 80, un: 'g' },
      { nome: 'Pimenta biquinho', qtd: 10, un: 'g' },
      { nome: 'Coentro', qtd: 8, un: 'g' },
    ],
  },
  petitgateau: {
    nome: 'Petit gâteau', preco: 34, categoria: 'Sobremesas',
    descricao: 'Bolo quente de chocolate com centro mole e sorvete de creme.',
    modificadores: [
      { id: 'petit_sorvete', titulo: 'Sorvete', tipo: 'unico', opcoes: ['Sorvete junto', 'Sorvete à parte'] },
    ],
    ingredientes: [
      { nome: 'Chocolate 70%', qtd: 80, un: 'g' },
      { nome: 'Manteiga', qtd: 40, un: 'g' },
      { nome: 'Ovo', qtd: 2, un: 'un' },
      { nome: 'Sorvete de creme', qtd: 1, un: 'bola' },
    ],
  },
  chopp: {
    nome: 'Chopp 300 ml', preco: 16, categoria: 'Bebidas',
    descricao: 'Chopp pilsen tirado na hora, colarinho de dois dedos.',
    modificadores: [],
    ingredientes: [{ nome: 'Chopp pilsen', qtd: 300, un: 'ml' }],
  },
  agua: {
    nome: 'Água', preco: 8, categoria: 'Bebidas',
    descricao: 'Garrafa 500 ml, com ou sem gás.',
    modificadores: [
      { id: 'agua_gas', titulo: 'Gás', tipo: 'unico', obrigatorio: true, opcoes: ['Com gás', 'Sem gás'] },
    ],
    ingredientes: [{ nome: 'Água mineral', qtd: 500, un: 'ml' }],
  },
};

const CATEGORIAS = ['Entradas', 'Principais', 'Sobremesas', 'Bebidas'];

/* ============ STATUS ============ */
/* eixo 1: estado da mesa · eixo 2: estágio do pedido */
const STATUS_LABEL = {
  livre: 'Livre',
  reservada: 'Reservada',
  atendido: 'Atendido',
  pedido_realizado: 'Pedido realizado',
  pedido_pronto: 'Prato pronto',
  pedido_entregue: 'Pedido entregue',
  conta_solicitada: 'Conta solicitada',
  em_pagamento: 'Em pagamento',
  pagamento_realizado: 'Pagamento realizado',
  aguardando_limpeza: 'Aguardando limpeza',
};

/* status de cada item da comanda — o que já saiu vs. o que ainda não */
const STATUS_ITEM_LABEL = {
  enviado: 'Na cozinha',
  em_preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Já saiu',
};

const STATUS_OCUPADA = ['atendido', 'pedido_realizado', 'pedido_pronto', 'pedido_entregue', 'conta_solicitada', 'em_pagamento', 'pagamento_realizado'];
const isOcupada = (s) => STATUS_OCUPADA.indexOf(s) !== -1;

/* estado macro mostrado no card */
function statusMesaLabel(status) {
  if (isOcupada(status)) return 'Ocupada';
  return STATUS_LABEL[status];
}

const PROXIMA_ACAO = {
  pedido_pronto: { label: 'Marcar como entregue', proximo: 'pedido_entregue' },
  pedido_entregue: { label: 'Pedir a conta', proximo: 'conta_solicitada' },
  pagamento_realizado: { label: 'Liberar para limpeza', proximo: 'aguardando_limpeza' },
  aguardando_limpeza: { label: 'Liberar mesa', proximo: 'livre' },
};

/* ============ CHAMADOS ============ */
const TIPOS_CHAMADO = [
  { tipo: 'cliente_chamou', label: 'Cliente chamou', cor: C.alert, corBg: C.alertBg, Icone: Bell },
  { tipo: 'prato_pronto', label: 'Prato pronto', cor: C.greenDeep, corBg: C.greenBg, Icone: CheckCircle2 },
  { tipo: 'pediu_conta', label: 'Pediu a conta', cor: C.payment, corBg: C.paymentBg, Icone: Receipt },
  { tipo: 'cozinha_chamou', label: 'Cozinha chamou', cor: C.amberDeep, corBg: C.amberBg, Icone: ChefHat },
];
const chamadoMeta = (tipo) => TIPOS_CHAMADO.filter((t) => t.tipo === tipo)[0];
const PRIORIDADE_CHAMADO = { prato_pronto: 0, pediu_conta: 1, cliente_chamou: 2, cozinha_chamou: 3 };

function temChamado(mesa, tipo) {
  return !!mesa.chamados && mesa.chamados.some((c) => c.tipo === tipo);
}

/* ============ TEMPO / DESCRIÇÕES ============ */
function tempoDecorrido(inicio) {
  if (!inicio) return '';
  return Math.floor((Date.now() - inicio) / 60000) + ' min';
}

function minutosExtenso(inicio) {
  if (!inicio) return '';
  const m = Math.max(1, Math.floor((Date.now() - inicio) / 60000));
  return m + (m === 1 ? ' minuto' : ' minutos');
}

function descricaoStatus(mesa) {
  const aberta = 'Mesa aberta há ' + minutosExtenso(mesa.horaAbertura);
  if (mesa.status === 'atendido') return aberta + ', escolhendo itens';
  if (mesa.status === 'pedido_realizado') return aberta + ' e pedido realizado há ' + minutosExtenso(mesa.horaPedido);
  if (mesa.status === 'pedido_pronto') return aberta + ' e prato pronto há ' + minutosExtenso(mesa.horaPronto);
  if (mesa.status === 'pedido_entregue') return aberta + ' e pedido entregue';
  if (mesa.status === 'conta_solicitada') return aberta + ' e conta solicitada há ' + minutosExtenso(mesa.horaConta);
  if (mesa.status === 'em_pagamento') return aberta + ', conta em pagamento';
  if (mesa.status === 'pagamento_realizado') return aberta + ', pagamento concluído';
  return aberta;
}

/* ============ MOCK ============ */
let _itemId = 0;
const mkItem = (produto, quantidade, modificadores, status) => ({
  id: 'it' + (_itemId++),
  produto,
  quantidade,
  modificadores: modificadores || [],
  observacao: '',
  status,
  ingredientes: CARDAPIO[produto].ingredientes.map((ing) => Object.assign({}, ing, { removido: false })),
});

const semRecursos = { cadeirasCrianca: 0, acessibilidade: 0 };
const comandaCobrada = { taxaServico: true, couvert: true };

const INITIAL_MESAS = [
  { id: 1, numero: 1, capacidade: 2, praca: 'Salão Interno', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 2, numero: 2, capacidade: 2, praca: 'Salão Interno', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 3, numero: 3, capacidade: 4, praca: 'Salão Interno', status: 'reservada', pessoas: 0, horaAbertura: null, recursos: { cadeirasCrianca: 1, acessibilidade: 0 }, reserva: { nome: 'Mariana Duarte' }, chamados: [], comanda: null },
  { id: 4, numero: 4, capacidade: 2, praca: 'Salão Interno', status: 'atendido', pessoas: 2, horaAbertura: Date.now() - 4 * 60000, recursos: Object.assign({}, semRecursos), chamados: [], comanda: { itens: [], taxaServico: true, couvert: false } },
  { id: 5, numero: 5, capacidade: 4, praca: 'Salão Interno', status: 'conta_solicitada', pessoas: 2, horaAbertura: Date.now() - 74 * 60000, horaPedido: Date.now() - 66 * 60000, horaConta: Date.now() - 1 * 60000, recursos: Object.assign({}, semRecursos), chamados: [], comanda: { itens: [
      mkItem('risoto', 1, ['Vegana'], 'entregue'),
      mkItem('agua', 1, ['Com gás'], 'entregue'),
      mkItem('petitgateau', 1, ['Sorvete à parte'], 'entregue'),
    ], taxaServico: true, couvert: true } },
  { id: 6, numero: 6, capacidade: 4, praca: 'Salão Interno', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 7, numero: 7, capacidade: 4, praca: 'Salão Interno', status: 'aguardando_limpeza', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 8, numero: 8, capacidade: 6, praca: 'Salão Interno', status: 'pedido_entregue', pessoas: 8, horaAbertura: Date.now() - 72 * 60000, horaPedido: Date.now() - 60 * 60000, grupoId: 'g8', recursos: { cadeirasCrianca: 1, acessibilidade: 0 }, chamados: [], comanda: { itens: [
      mkItem('moqueca', 1, ['Sem pimenta'], 'entregue'),
      mkItem('ancho', 2, ['Ao ponto'], 'entregue'),
      mkItem('risoto', 1, ['Vegana'], 'entregue'),
      mkItem('bolinho', 2, [], 'entregue'),
      mkItem('chopp', 6, [], 'entregue'),
      mkItem('petitgateau', 2, ['Sorvete à parte'], 'entregue'),
      mkItem('agua', 3, ['Sem gás'], 'entregue'),
    ], taxaServico: true, couvert: true } },
  { id: 9, numero: 9, capacidade: 4, praca: 'Salão Interno', status: 'pedido_entregue', pessoas: 3, horaAbertura: Date.now() - 70 * 60000, horaPedido: Date.now() - 58 * 60000, grupoId: 'g8', recursos: Object.assign({}, semRecursos), chamados: [{ tipo: 'pediu_conta', mensagem: 'Cliente pediu a conta há 2 minutos.' }], comanda: { itens: [
      mkItem('burrata', 2, ['Sem manjericão'], 'entregue'),
      mkItem('chopp', 3, [], 'entregue'),
    ], taxaServico: true, couvert: true } },
  { id: 10, numero: 10, capacidade: 4, praca: 'Salão Interno', status: 'em_pagamento', pessoas: 4, horaAbertura: Date.now() - 95 * 60000, horaPedido: Date.now() - 85 * 60000, horaConta: Date.now() - 6 * 60000, recursos: Object.assign({}, semRecursos), chamados: [], comanda: { itens: [
      mkItem('ancho', 2, ['Ao ponto'], 'entregue'),
      mkItem('chopp', 4, [], 'entregue'),
    ], taxaServico: true, couvert: true, divisaoModo: 'Por item', subcontas: [
      { etiqueta: 'Pessoa 1', valor: 124.38 },
      { etiqueta: 'Pessoa 2', valor: 124.38 },
      { etiqueta: 'Pessoa 3', valor: 44.72 },
      { etiqueta: 'Pessoa 4', valor: 44.72 },
    ] } },
  { id: 11, numero: 11, capacidade: 2, praca: 'Terraço', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 12, numero: 12, capacidade: 4, praca: 'Terraço', status: 'pedido_realizado', pessoas: 4, horaAbertura: Date.now() - 38 * 60000, horaPedido: Date.now() - 30 * 60000, recursos: { cadeirasCrianca: 0, acessibilidade: 1 }, chamados: [{ tipo: 'cozinha_chamou', mensagem: 'Confirmar o ponto do segundo Ancho — o pedido veio sem marcação.' }], comanda: { itens: [
      mkItem('ancho', 1, ['Ao ponto'], 'em_preparo'),
      mkItem('ancho', 1, ['Bem passado'], 'em_preparo'),
      mkItem('burrata', 1, ['Sem manjericão'], 'em_preparo'),
      mkItem('chopp', 2, [], 'entregue'),
      mkItem('agua', 1, ['Sem gás'], 'entregue'),
    ], taxaServico: true, couvert: false } },
  { id: 13, numero: 13, capacidade: 2, praca: 'Terraço', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 14, numero: 14, capacidade: 4, praca: 'Terraço', status: 'reservada', pessoas: 0, horaAbertura: null, recursos: { cadeirasCrianca: 0, acessibilidade: 1 }, reserva: { nome: 'Felipe Andrade' }, chamados: [], comanda: null },
  { id: 15, numero: 15, capacidade: 4, praca: 'Terraço', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 16, numero: 16, capacidade: 2, praca: 'Terraço', status: 'pedido_pronto', pessoas: 2, horaAbertura: Date.now() - 26 * 60000, horaPedido: Date.now() - 18 * 60000, horaPronto: Date.now() - 2 * 60000, recursos: Object.assign({}, semRecursos), chamados: [{ tipo: 'prato_pronto', mensagem: 'Burrata pronta na praça fria.' }], comanda: { itens: [
      mkItem('burrata', 1, ['Sem manjericão'], 'pronto'),
      mkItem('chopp', 2, [], 'entregue'),
    ], taxaServico: true, couvert: false } },
  { id: 17, numero: 17, capacidade: 6, praca: 'Terraço', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 18, numero: 18, capacidade: 4, praca: 'Terraço', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 19, numero: 19, capacidade: 2, praca: 'Bar', status: 'pedido_entregue', pessoas: 1, horaAbertura: Date.now() - 12 * 60000, horaPedido: Date.now() - 9 * 60000, recursos: Object.assign({}, semRecursos), chamados: [{ tipo: 'cliente_chamou', mensagem: 'Cliente acionou o botão de chamada há 2 minutos.' }], comanda: { itens: [
      mkItem('bolinho', 1, [], 'entregue'),
    ], taxaServico: true, couvert: false } },
  { id: 20, numero: 20, capacidade: 2, praca: 'Bar', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 21, numero: 21, capacidade: 2, praca: 'Bar', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
  { id: 22, numero: 22, capacidade: 2, praca: 'Bar', status: 'livre', pessoas: 0, horaAbertura: null, recursos: Object.assign({}, semRecursos), chamados: [], comanda: null },
];

/* ============ STYLES ============ */
const rootStyle = { fontFamily: FONT_BODY, minHeight: '100vh', background: C.paper, color: C.ink, WebkitFontSmoothing: 'antialiased' };

const landingWrapStyle = { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', gap: 40 };
const landingContentStyle = { maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 };
const eyebrowStyle = { fontSize: 12, letterSpacing: '0.16em', fontWeight: 600, color: C.slate, textTransform: 'uppercase' };
const wordmarkStyle = { fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(48px, 12vw, 72px)', letterSpacing: '-0.01em', lineHeight: 1 };
const landingDescStyle = { fontSize: 15, lineHeight: 1.6, color: C.slateDark, maxWidth: 340 };
const landingButtonsStyle = { display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 12 };
const landingFootStyle = { fontSize: 11, color: C.stone, letterSpacing: '0.04em' };
const backLinkStyle = { position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: C.slate, fontSize: 13, fontWeight: 500, padding: 8 };

const primaryButtonStyle = { width: '100%', padding: '16px 24px', background: C.ink, color: C.paper, border: 'none', borderRadius: 10, fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600, minHeight: 52 };
const secondaryButtonStyle = { width: '100%', padding: '14px 20px', background: 'transparent', color: C.ink, border: '1.5px solid ' + C.ink, borderRadius: 10, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, minHeight: 48 };
const ghostButtonStyle = { width: '100%', padding: '14px 20px', background: 'transparent', color: C.slate, border: '1.5px solid ' + C.stone, borderRadius: 10, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, minHeight: 48 };

const fieldLabelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.slate, marginBottom: 6 };
const inputStyle = { width: '100%', padding: '13px 14px', border: '1.5px solid ' + C.stone, borderRadius: 10, fontFamily: FONT_BODY, fontSize: 15, color: C.ink, background: C.paper };
const searchStyle = Object.assign({}, inputStyle, { marginBottom: 12 });

const phoneFrameStyle = { maxWidth: 430, width: '100%', margin: '0 auto', minHeight: '100vh', background: C.paper, display: 'flex', flexDirection: 'column', position: 'relative' };
const appHeaderStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid ' + C.mist };
const logoTextStyle = { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.ink };
const pageIntroStyle = { padding: '20px 20px 4px' };
const pageIntroTitleStyle = { fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, lineHeight: 1.15 };
const pageIntroDescStyle = { fontSize: 13.5, color: C.slate, marginTop: 4, lineHeight: 1.4 };
const pageHeaderStyle = { display: 'flex', alignItems: 'center', gap: 6, padding: '12px 12px 12px 6px', borderBottom: '1px solid ' + C.mist, position: 'sticky', top: 0, background: C.paper, zIndex: 30 };
const pracaSelectorStyle = { display: 'flex', gap: 8, padding: '14px 20px', overflowX: 'auto' };
const pracaChipStyle = { padding: '8px 14px', borderRadius: 20, border: '1px solid ' + C.stone, background: C.paper, color: C.slateDark, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 };
const pracaChipActiveStyle = Object.assign({}, pracaChipStyle, { background: C.ink, border: '1px solid ' + C.ink, color: C.paper });
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '4px 20px 110px' };

/* card de mesa: neutro, sem cor e sem ícone */
const cardStyle = { position: 'relative', borderRadius: 12, padding: 14, minHeight: 118, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, fontFamily: FONT_BODY, textAlign: 'left', width: '100%', background: C.paper, border: '1.5px solid ' + C.stone };
const cardNumStyle = { fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, lineHeight: 1, color: C.ink };
const cardStatusMesaStyle = { fontSize: 10.5, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700, color: C.slate };
const cardMetaStyle = { fontSize: 11.5, color: C.slate, marginTop: 'auto' };

/* tag de status, neutra */
const tagStatusStyle = { display: 'inline-block', fontSize: 11, fontWeight: 700, color: C.ink, background: C.mist, borderRadius: 6, padding: '4px 8px', lineHeight: 1.2 };
const tagInfoStyle = { display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: C.slate, background: C.mist, borderRadius: 6, padding: '3px 8px' };

const iconButtonStyle = { width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, flexShrink: 0 };
const iconButtonSmallStyle = { width: 30, height: 30, borderRadius: 8, border: 'none', background: C.mist, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, flexShrink: 0 };
const stepperSmallStyle = { width: 34, height: 34, borderRadius: 8, border: '1.5px solid ' + C.stone, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, flexShrink: 0, fontSize: 17, fontWeight: 600, lineHeight: 1, paddingBottom: 2 };

const sectionStyle = { padding: '18px 20px', borderBottom: '1px solid ' + C.mist };
const sectionTitleStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.slate, marginBottom: 12 };
const statusBannerStyle = { background: C.mist, borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' };

const chamadoCardStyle = (cor) => ({ background: cor, color: C.paper, padding: '12px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 });
const smallButtonStyle = { alignSelf: 'flex-start', background: C.paper, color: C.ink, border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700 };

const recursoRowStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' };
const itemRowStyle = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid ' + C.mist, textAlign: 'left' };
const ingRowStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid ' + C.mist };
const chipButtonStyle = { padding: '9px 13px', borderRadius: 8, border: '1px solid ' + C.stone, background: C.paper, fontSize: 13, fontWeight: 500, color: C.ink };
const chipButtonActiveStyle = Object.assign({}, chipButtonStyle, { border: '1px solid ' + C.ink, background: C.ink, color: C.paper });

const perfilButtonStyle = { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 20, border: '1.5px solid ' + C.stone, background: C.paper, color: C.ink, fontSize: 13, fontWeight: 600, fontFamily: FONT_BODY, whiteSpace: 'nowrap' };
const perfilPanelStyle = { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 210, background: C.paper, border: '1px solid ' + C.mist, borderRadius: 14, boxShadow: '0 10px 30px rgba(10,10,10,0.16)', zIndex: 56, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 };
const perfilItemStyle = { textAlign: 'left', width: '100%', padding: 10, background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, color: C.ink };
const invisibleOverlayStyle = { position: 'fixed', inset: 0, background: 'transparent', zIndex: 55 };

/* navbar */
const navBarStyle = { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: C.paper, borderTop: '1px solid ' + C.mist, padding: '10px 0', zIndex: 40 };
const navGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 12px' };
const navItemStyle = (bg) => ({ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 4px', background: bg, border: 'none', borderRadius: 12, minHeight: 74 });
const navLabelStyle = (ativo) => ({ fontSize: 11, lineHeight: 1.25, textAlign: 'center', fontWeight: ativo ? 700 : 500, color: ativo ? C.slateDark : C.slate });
const navCircleStyle = (cor) => ({ position: 'absolute', top: -6, right: -6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, height: 24, borderRadius: 12, padding: '0 6px', background: cor, color: C.paper, fontSize: 12.5, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums', border: '2px solid ' + C.paper });

/* drawer / modal */
const drawerOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.5)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const drawerPanelStyle = { width: '100%', maxWidth: 430, background: C.paper, borderRadius: '20px 20px 0 0', maxHeight: '82vh', overflowY: 'auto', padding: '10px 20px 28px', animation: 'slideUp 0.22s ease' };
const drawerHandleStyle = { width: 36, height: 4, borderRadius: 2, background: C.stone, margin: '4px auto 14px' };

const toastStyle = { position: 'fixed', top: 66, left: '50%', width: 'calc(100% - 40px)', maxWidth: 390, background: C.ink, color: C.paper, padding: '13px 16px', borderRadius: 10, fontSize: 13.5, lineHeight: 1.45, zIndex: 95, boxShadow: '0 8px 24px rgba(10,10,10,0.28)', animation: 'toastIn 0.2s ease forwards' };

/* conta */
const modoTabRow = { display: 'flex', gap: 8, marginBottom: 16 };
const modoTabStyle = (sel) => ({ flex: 1, padding: '10px 6px', borderRadius: 10, border: '1.5px solid ' + (sel ? C.ink : C.stone), background: sel ? C.ink : C.paper, color: sel ? C.paper : C.slate, fontSize: 12.5, fontWeight: 600, lineHeight: 1.25, minHeight: 52 });
const subcontaCardStyle = { border: '1.5px solid ' + C.mist, borderRadius: 12, padding: 14, marginBottom: 12 };
const subcontaHeadStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 };
const valorInputStyle = { width: 120, padding: '10px 12px', border: '1.5px solid ' + C.stone, borderRadius: 8, fontFamily: FONT_BODY, fontSize: 16, fontWeight: 700, color: C.ink, textAlign: 'right' };
const conferenciaStyle = (ok) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 10, background: ok ? C.greenBg : C.alertBg, color: ok ? C.greenDeep : C.alert, fontSize: 13, fontWeight: 600, marginTop: 4 });
const pessoaChipStyle = (sel) => ({ padding: '8px 12px', borderRadius: 20, border: '1.5px solid ' + (sel ? C.ink : C.stone), background: sel ? C.ink : C.paper, color: sel ? C.paper : C.slate, fontSize: 12.5, fontWeight: 600, minHeight: 40 });

/* cardápio */
const catRowStyle = { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 };
const cardapioItemStyle = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid ' + C.mist, textAlign: 'left' };
const addChipStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', border: '1.5px solid ' + C.ink, background: C.paper, color: C.ink, flexShrink: 0, fontSize: 18, fontWeight: 600, lineHeight: 1, paddingBottom: 2 };
const modOptionStyle = (sel) => ({ padding: '9px 13px', borderRadius: 8, border: '1.5px solid ' + (sel ? C.ink : C.stone), background: sel ? C.ink : C.paper, color: sel ? C.paper : C.ink, fontSize: 13, fontWeight: 500 });
const carrinhoBarStyle = { position: 'fixed', bottom: 94, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: C.paper, borderTop: '1px solid ' + C.mist, padding: '12px 20px', zIndex: 41, boxShadow: '0 -6px 18px rgba(10,10,10,0.07)' };

/* ============ GESTOR (DESKTOP/TABLET) ============ */
const gestorRootStyle = { minHeight: '100vh', background: C.mist };
const gestorHeaderStyle = { background: C.ink, borderBottom: '1px solid rgba(255,255,255,0.1)' };
const gestorHeaderInnerStyle = { maxWidth: 1180, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 12 };
const gestorLogoStyle = { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 19, color: C.paper };
const gestorEyebrowStyle = { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginLeft: 4 };
const gestorPerfilButtonStyle = { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: C.paper, fontSize: 13, fontWeight: 600, fontFamily: FONT_BODY, whiteSpace: 'nowrap' };
const gestorPerfilPanelStyle = { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 200, background: C.paper, border: '1px solid ' + C.mist, borderRadius: 14, boxShadow: '0 10px 30px rgba(10,10,10,0.25)', zIndex: 56, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 };

const gestorMainStyle = { maxWidth: 1180, margin: '0 auto', padding: '32px 40px' };
const gestorPageTitleStyle = { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700 };
const gestorPageDescStyle = { fontSize: 14, color: C.slate, marginTop: 4, marginBottom: 26 };
const gestorVoltarStyle = { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: C.slate, fontSize: 13.5, fontWeight: 600, padding: '4px 0', marginBottom: 18 };

const statsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 26 };
const statCardStyle = { background: C.paper, border: '1px solid ' + C.stone, borderRadius: 12, padding: '16px 18px' };
const statLabelStyle = { fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.slate, marginBottom: 8 };
const statValueStyle = { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700 };

const tableWrapStyle = { background: C.paper, border: '1px solid ' + C.stone, borderRadius: 12, overflow: 'hidden' };
const gestorGridCols = '64px 1.1fr 1.3fr 80px 90px 110px 1.4fr';
const tableHeadRowStyle = { display: 'grid', gridTemplateColumns: gestorGridCols, gap: 10, padding: '12px 18px', borderBottom: '1px solid ' + C.stone, background: C.mist };
const tableHeadCellStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.slate };
const tableRowStyle = { display: 'grid', gridTemplateColumns: gestorGridCols, gap: 10, padding: '13px 18px', borderBottom: '1px solid ' + C.mist, alignItems: 'center', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontSize: 13.5, color: C.ink };
const alertaPillStyle = (cor) => ({ fontSize: 10.5, fontWeight: 700, color: C.paper, background: cor, borderRadius: 5, padding: '2px 7px', marginRight: 4, display: 'inline-block' });

/* página de detalhe da mesa (não é mais painel lateral) */
const detalheGridStyle = { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, alignItems: 'start' };
const detalheCardStyle = { background: C.paper, border: '1px solid ' + C.stone, borderRadius: 12, padding: '20px 22px', marginBottom: 20 };

/* checkout — modal centralizado, formato desktop */
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
const modalCardStyle = { background: C.paper, borderRadius: 16, padding: '28px 30px', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(10,10,10,0.3)', animation: 'modalIn 0.18s ease' };


/* ============ GLOBAL ============ */
function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      button, input { font-family: inherit; -webkit-tap-highlight-color: transparent; }
      button { cursor: pointer; transition: transform 0.1s ease; }
      button:active { transform: scale(0.97); }
      button:focus-visible, input:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
      @keyframes slideUp { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes toastIn { from { transform: translate(-50%, -10px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      @keyframes slideInRight { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes modalIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: ${C.stone}; border-radius: 3px; }
      @media print {
        body * { visibility: hidden; }
        #comprovante-impressao, #comprovante-impressao * { visibility: visible; }
        #comprovante-impressao { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; }
      }
    `}</style>
  );
}

/* ============ HELPERS ============ */
function totaisDaComanda(mesa) {
  if (!mesa.comanda) return { itens: [], subtotal: 0, taxa: 0, couvert: 0, desconto: 0, total: 0 };
  const itens = mesa.comanda.itens.filter((i) => i.status !== 'cancelado' && i.status !== 'rascunho');
  const subtotal = itens.reduce((s, i) => s + CARDAPIO[i.produto].preco * i.quantidade, 0);
  /* regra: em conta solicitada / pagamento, taxa e couvert são sempre cobrados */
  const forcado = mesa.status === 'conta_solicitada' || mesa.status === 'em_pagamento' || mesa.status === 'pagamento_realizado';
  const taxa = (forcado || mesa.comanda.taxaServico) ? subtotal * 0.1 : 0;
  const couvert = (forcado || mesa.comanda.couvert) ? 18 * (mesa.pessoas || 0) : 0;
  const desconto = mesa.comanda.desconto || 0;
  return { itens, subtotal, taxa, couvert, desconto, total: Math.max(0, subtotal + taxa + couvert - desconto) };
}

function RowTotal({ label, value, muted, strong, negativo }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: strong ? 16 : 13, fontWeight: strong ? 700 : 400, color: negativo ? C.alert : muted ? C.slate : C.ink }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{negativo ? '− ' : ''}R$ {Math.abs(value).toFixed(2)}</span>
    </div>
  );
}

/* ============ CARD DE MESA ============ */
function MesaCard({ mesa, onTap }) {
  const ocupada = isOcupada(mesa.status);
  return (
    <button onClick={() => onTap(mesa)} style={cardStyle}>
      <div style={cardNumStyle}>{mesa.numero}</div>
      <div style={cardStatusMesaStyle}>{statusMesaLabel(mesa.status)}</div>
      {ocupada && <span style={tagStatusStyle}>{STATUS_LABEL[mesa.status]}</span>}
      {mesa.status === 'reservada' && mesa.reserva && (
        <div style={{ fontSize: 11.5, color: C.slate }}>{mesa.reserva.nome}</div>
      )}
      <div style={cardMetaStyle}>
        {ocupada
          ? mesa.pessoas + (mesa.pessoas === 1 ? ' pessoa · ' : ' pessoas · ') + tempoDecorrido(mesa.horaAbertura)
          : mesa.capacidade + ' lugares'}
      </div>
    </button>
  );
}

/* ============ TELA: DETALHE DA MESA ============ */
function MesaScreen({ mesa, mesasTodas, mesasGrupo, mesasParaJuntar, onVoltar, onAbrirMesa, onAvancarStatus, onCancelarReserva, onJuntar, onSeparar, onDividirConta, onLancarPedido, onAtenderChamado, onAbrirItem, onAtualizarRecursos, onAtualizarPessoas, onAbrirTipo, notificar }) {
  const [juntarAberto, setJuntarAberto] = useState(false);
  const [pessoasNovas, setPessoasNovas] = useState(0);
  const ocupada = isOcupada(mesa.status);
  const { itens, subtotal, taxa, couvert, desconto, total } = totaisDaComanda(mesa);
  const preAbertura = mesa.status === 'livre' || mesa.status === 'reservada';
  const cozinhaChamou = temChamado(mesa, 'cozinha_chamou');
  const acao = PROXIMA_ACAO[mesa.status];

  const acaoPrincipal = () => {
    if (!acao) return;
    /* regra: cozinha chamou trava avanço para prato pronto / conta solicitada */
    if (cozinhaChamou && (acao.proximo === 'pedido_pronto' || acao.proximo === 'conta_solicitada')) {
      notificar('A cozinha chamou esta mesa. Resolva o chamado antes de seguir.');
      return;
    }
    onAvancarStatus(mesa.id, acao.proximo);
  };

  return (
    <div style={phoneFrameStyle}>
      <div style={pageHeaderStyle}>
        <button onClick={onVoltar} style={iconButtonStyle} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>Mesa {mesa.numero}</div>
          <div style={{ fontSize: 12, color: C.slate }}>{mesa.praca} · {mesa.capacidade} lugares</div>
          {mesa.grupoId && mesasGrupo.length > 1 && (
            <span style={Object.assign({}, tagInfoStyle, { marginTop: 6 })}>Junta com {mesasGrupo.filter((m) => m.id !== mesa.id).map((m) => m.numero).join(', ')}</span>
          )}
        </div>
      </div>

      <div style={{ paddingBottom: 110 }}>
        {mesa.chamados.length > 0 && (
          <div style={{ padding: '16px 20px 0' }}>
            {mesa.chamados.map((ch, idx) => {
              const meta = chamadoMeta(ch.tipo);
              return (
                <div key={idx} style={chamadoCardStyle(meta.cor)}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{meta.label}</span>
                  <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.95 }}>{ch.mensagem}</div>
                  <button onClick={() => onAtenderChamado(mesa.id, ch.tipo)} style={smallButtonStyle}>Marcar como atendido</button>
                </div>
              );
            })}
          </div>
        )}

        {/* status */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Status</div>
          <div style={statusBannerStyle}>
            <span style={tagStatusStyle}>{STATUS_LABEL[mesa.status]}</span>
            {ocupada && <div style={{ fontSize: 12.5, color: C.slate }}>{descricaoStatus(mesa)}</div>}
            {mesa.status === 'reservada' && mesa.reserva && (
              <div style={{ fontSize: 12.5, color: C.slate }}>Reserva de {mesa.reserva.nome}</div>
            )}
          </div>
        </div>

        {/* acomodação */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Acomodação</div>
          {(preAbertura || ocupada) && (
            <>
              <div style={recursoRowStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Pessoas na mesa</div>
                  <div style={{ fontSize: 12, color: C.slate }}>Quantas pessoas sentaram?</div>
                </div>
                <button onClick={() => (ocupada ? onAtualizarPessoas(mesa.id, Math.max(1, mesa.pessoas - 1)) : setPessoasNovas((p) => Math.max(0, p - 1)))} style={stepperSmallStyle}>−</button>
                <span style={{ fontSize: 16, fontWeight: 700, width: 24, textAlign: 'center' }}>{ocupada ? mesa.pessoas : pessoasNovas}</span>
                <button
                  onClick={() => {
                    const atual = ocupada ? mesa.pessoas : pessoasNovas;
                    if (atual >= mesa.capacidade) { notificar('Mesa ' + mesa.numero + ' comporta ' + mesa.capacidade + ' lugares.'); return; }
                    if (ocupada) onAtualizarPessoas(mesa.id, mesa.pessoas + 1); else setPessoasNovas((p) => p + 1);
                  }}
                  style={stepperSmallStyle}
                >+</button>
              </div>
              {ocupada && couvert > 0 && (
                <div style={{ fontSize: 12, color: C.slate, margin: '2px 0 4px' }}>Couvert de R$ 18 por pessoa aplicado nesta mesa.</div>
              )}
            </>
          )}

          <div style={recursoRowStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Cadeira de criança</div>
              <div style={{ fontSize: 12, color: C.slate }}>Avisa o salão para levar até a mesa</div>
            </div>
            <button onClick={() => onAtualizarRecursos(mesa.id, { cadeirasCrianca: Math.max(0, mesa.recursos.cadeirasCrianca - 1) })} style={stepperSmallStyle}>−</button>
            <span style={{ fontSize: 16, fontWeight: 700, width: 24, textAlign: 'center' }}>{mesa.recursos.cadeirasCrianca}</span>
            <button onClick={() => onAtualizarRecursos(mesa.id, { cadeirasCrianca: mesa.recursos.cadeirasCrianca + 1 })} style={stepperSmallStyle}>+</button>
          </div>

          <div style={recursoRowStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Cadeira de rodas</div>
              <div style={{ fontSize: 12, color: C.slate }}>Reserva espaço de passagem na mesa</div>
            </div>
            <button onClick={() => onAtualizarRecursos(mesa.id, { acessibilidade: Math.max(0, mesa.recursos.acessibilidade - 1) })} style={stepperSmallStyle}>−</button>
            <span style={{ fontSize: 16, fontWeight: 700, width: 24, textAlign: 'center' }}>{mesa.recursos.acessibilidade}</span>
            <button onClick={() => onAtualizarRecursos(mesa.id, { acessibilidade: mesa.recursos.acessibilidade + 1 })} style={stepperSmallStyle}>+</button>
          </div>
        </div>

        {/* grupo de mesas */}
        {(ocupada || preAbertura) && mesa.status !== 'conta_solicitada' && mesa.status !== 'em_pagamento' && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Grupo de mesas</div>
            {mesa.grupoId && mesasGrupo.length > 1 ? (
              <>
                <div style={{ fontSize: 13, color: C.slate, marginBottom: 12 }}>
                  Junta com {mesasGrupo.filter((m) => m.id !== mesa.id).map((m) => 'mesa ' + m.numero).join(', ')}. Cada mesa mantém a própria comanda.
                </div>
                <button onClick={() => onSeparar(mesa.id)} style={secondaryButtonStyle}>Separar esta mesa</button>
              </>
            ) : !juntarAberto ? (
              <button onClick={() => setJuntarAberto(true)} style={ghostButtonStyle}>Juntar com outra mesa</button>
            ) : (
              <>
                <div style={{ fontSize: 13, color: C.slate, marginBottom: 10 }}>Escolha a mesa que vira o mesmo grupo:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {mesasParaJuntar.length === 0 && <span style={{ fontSize: 13, color: C.stone }}>Nenhuma mesa ocupada disponível.</span>}
                  {mesasParaJuntar.map((m) => (
                    <button key={m.id} onClick={() => { onJuntar(mesa.id, m.id); setJuntarAberto(false); }} style={chipButtonStyle}>Mesa {m.numero}</button>
                  ))}
                </div>
                <button onClick={() => setJuntarAberto(false)} style={ghostButtonStyle}>Cancelar</button>
              </>
            )}
          </div>
        )}

        {/* comanda */}
        {ocupada && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Comanda</div>
            {itens.length === 0 ? (
              <div style={{ padding: '18px 0', textAlign: 'center', fontSize: 13.5, color: C.slate }}>Nenhum item lançado ainda.</div>
            ) : (
              <>
                {itens.map((item) => (
                  <button key={item.id} onClick={() => onAbrirItem(mesa.id, item.id)} style={itemRowStyle}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{item.quantidade}× {CARDAPIO[item.produto].nome}</div>
                      {item.modificadores.length > 0 && <div style={{ fontSize: 12.5, color: C.slate }}>{item.modificadores.join(' · ')}</div>}
                      {item.observacao ? <div style={{ fontSize: 12.5, color: C.slate, fontStyle: 'italic' }}>{item.observacao}</div> : null}
                      <div style={{ marginTop: 4 }}><span style={tagStatusStyle}>{STATUS_ITEM_LABEL[item.status]}</span></div>
                    </div>
                    <div style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>R$ {(CARDAPIO[item.produto].preco * item.quantidade).toFixed(2)}</div>
                    <ChevronRight size={18} color={C.slate} />
                  </button>
                ))}
                <div style={{ marginTop: 12 }}>
                  <RowTotal label="Subtotal" value={subtotal} muted />
                  {taxa > 0 && <RowTotal label="Taxa de serviço (10%)" value={taxa} muted />}
                  {couvert > 0 && <RowTotal label={'Couvert (' + mesa.pessoas + ' × R$ 18)'} value={couvert} muted />}
                  {desconto > 0 && <RowTotal label={'Desconto' + (mesa.comanda.descontoMotivo ? ' · ' + mesa.comanda.descontoMotivo : '')} value={desconto} negativo />}
                  <RowTotal label="Total" value={total} strong />
                </div>
              </>
            )}
            {mesa.status !== 'atendido' && mesa.status !== 'conta_solicitada' && mesa.status !== 'em_pagamento' && mesa.status !== 'pagamento_realizado' && (
              <button onClick={() => onLancarPedido(mesa.id)} style={Object.assign({}, ghostButtonStyle, { marginTop: 14 })}>Adicionar itens ao pedido</button>
            )}
          </div>
        )}

        {/* divisão da conta */}
        {mesa.comanda && mesa.comanda.subcontas && mesa.comanda.subcontas.length > 0 && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Divisão da conta</div>
            {mesa.comanda.divisaoModo && <div style={{ marginBottom: 10 }}><span style={tagInfoStyle}>{mesa.comanda.divisaoModo}</span></div>}
            {mesa.comanda.subcontas.map((sc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0', borderBottom: '1px solid ' + C.mist }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{sc.etiqueta}</div>
                  {sc.detalhe && <div style={{ fontSize: 12, color: C.slate }}>{sc.detalhe}</div>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {sc.valor.toFixed(2)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 14px', fontSize: 13, color: C.slate }}>
              <span>{mesa.comanda.subcontas.length} pagamento(s)</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>Total R$ {mesa.comanda.subcontas.reduce((s, sc) => s + sc.valor, 0).toFixed(2)}</span>
            </div>
            {mesa.status !== 'pagamento_realizado' && (
              <button onClick={() => onDividirConta(mesa.id)} style={secondaryButtonStyle}>Editar divisão</button>
            )}
          </div>
        )}

        {/* ação principal */}
        <div style={{ padding: '18px 20px 0' }}>
          {preAbertura ? (
            <>
              <button
                onClick={() => {
                  if (pessoasNovas < 1) { notificar('Informe quantas pessoas sentaram antes de abrir a mesa.'); return; }
                  onAbrirMesa(mesa.id, pessoasNovas);
                }}
                style={primaryButtonStyle}
              >Abrir mesa</button>
              {mesa.status === 'reservada' && (
                <button onClick={() => onCancelarReserva(mesa.id)} style={Object.assign({}, secondaryButtonStyle, { marginTop: 10 })}>Cancelar reserva</button>
              )}
            </>
          ) : mesa.status === 'atendido' ? (
            <button onClick={() => onLancarPedido(mesa.id)} style={primaryButtonStyle}>
              {mesa.comanda && mesa.comanda.itens.length > 0 ? 'Continuar lançando itens' : 'Começar pedido'}
            </button>
          ) : mesa.status === 'conta_solicitada' ? (
            <button onClick={() => onDividirConta(mesa.id)} style={primaryButtonStyle}>Fechar a conta</button>
          ) : mesa.status === 'em_pagamento' ? (
            <div style={{ textAlign: 'center', fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>
              Pagamento em conferência. Só o gestor confirma o recebimento antes de liberar a mesa.
            </div>
          ) : acao ? (
            <button onClick={acaoPrincipal} style={primaryButtonStyle}>{acao.label}</button>
          ) : null}
          {ocupada && (
            <button onClick={() => onAvancarStatus(mesa.id, 'livre')} style={Object.assign({}, secondaryButtonStyle, { marginTop: 10 })}>Liberar a mesa</button>
          )}
        </div>
      </div>
      <NavBar mesas={mesasTodas} onAbrirTipo={onAbrirTipo} />
    </div>
  );
}

/* ============ TELA: DETALHE DO ITEM ============ */
function ItemScreen({ mesa, item, mesasDestino, mesasTodas, onVoltar, onAlterarQuantidade, onToggleIngrediente, onAlterarQtdIngrediente, onTransferir, onCancelar, onAbrirTipo, notificar }) {
  const [modo, setModo] = useState(null);
  const produto = CARDAPIO[item.produto];
  const jaNaCozinha = item.status !== 'rascunho';

  return (
    <div style={phoneFrameStyle}>
      <div style={pageHeaderStyle}>
        <button onClick={onVoltar} style={iconButtonStyle} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, lineHeight: 1.15 }}>{produto.nome}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 12, color: C.slate }}>Mesa {mesa.numero}</span>
            <span style={tagStatusStyle}>{STATUS_ITEM_LABEL[item.status]}</span>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: 110 }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: C.slateDark, marginBottom: 14 }}>{produto.descricao}</div>
          <div style={recursoRowStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Quantidade</div>
              <div style={{ fontSize: 12, color: C.slate }}>R$ {produto.preco.toFixed(2)} cada</div>
            </div>
            <button onClick={() => { if (item.quantidade <= 1) { notificar('Para remover o item por completo use "Cancelar".'); return; } onAlterarQuantidade(mesa.id, item.id, item.quantidade - 1); }} style={stepperSmallStyle}>−</button>
            <span style={{ fontSize: 16, fontWeight: 700, width: 24, textAlign: 'center' }}>{item.quantidade}</span>
            <button onClick={() => onAlterarQuantidade(mesa.id, item.id, item.quantidade + 1)} style={stepperSmallStyle}>+</button>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Ficha do prato</div>
          <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 6 }}>
            Ajuste a quantidade ou remova o que o cliente não quer. A cozinha recebe exatamente o que estiver aqui.
          </div>
          {item.ingredientes.map((ing, idx) => (
            <div key={idx} style={ingRowStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: ing.removido ? C.stone : C.ink, textDecoration: ing.removido ? 'line-through' : 'none' }}>{ing.nome}</div>
                {ing.removido && <div style={{ fontSize: 12, color: C.alert, fontWeight: 600 }}>Sem {ing.nome.toLowerCase()}</div>}
              </div>
              {!ing.removido && (
                <>
                  <button onClick={() => onAlterarQtdIngrediente(mesa.id, item.id, idx, -1)} style={stepperSmallStyle}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 56, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{ing.qtd} {ing.un}</span>
                  <button onClick={() => onAlterarQtdIngrediente(mesa.id, item.id, idx, 1)} style={stepperSmallStyle}>+</button>
                </>
              )}
              <button onClick={() => onToggleIngrediente(mesa.id, item.id, idx)} style={iconButtonSmallStyle} aria-label={ing.removido ? 'Recolocar' : 'Remover'}>
                {ing.removido ? <ChevronLeft size={15} /> : <Trash2 size={15} />}
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modo === null && (
            <>
              <button onClick={() => { onVoltar(); notificar('Alterações salvas na comanda.'); }} style={primaryButtonStyle}>Salvar</button>
              <button onClick={() => setModo('transferir')} style={secondaryButtonStyle}>Transferir</button>
              <button onClick={() => setModo('cancelar')} style={secondaryButtonStyle}>Cancelar</button>
            </>
          )}

          {modo === 'transferir' && (
            <div>
              <div style={sectionTitleStyle}>Transferir para</div>
              {jaNaCozinha && <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 10 }}>Este item já foi para a cozinha. A transferência avisa a praça sem reiniciar o preparo.</div>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {mesasDestino.length === 0 && <span style={{ fontSize: 13, color: C.stone }}>Nenhuma outra mesa ocupada no momento.</span>}
                {mesasDestino.map((m) => (
                  <button key={m.id} onClick={() => onTransferir(mesa.id, item.id, m.id)} style={chipButtonStyle}>Mesa {m.numero}</button>
                ))}
              </div>
              <button onClick={() => setModo(null)} style={ghostButtonStyle}>Voltar</button>
            </div>
          )}

          {modo === 'cancelar' && (
            <div>
              <div style={sectionTitleStyle}>Motivo do cancelamento</div>
              {jaNaCozinha && <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 10 }}>Item já enviado. A cozinha recebe o aviso de cancelamento na hora.</div>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {['Pedido errado', 'Cliente desistiu', 'Demora excessiva', 'Erro de lançamento'].map((mo) => (
                  <button key={mo} onClick={() => onCancelar(mesa.id, item.id, mo)} style={chipButtonActiveStyle}>{mo}</button>
                ))}
              </div>
              <button onClick={() => setModo(null)} style={ghostButtonStyle}>Voltar</button>
            </div>
          )}
        </div>
      </div>
      <NavBar mesas={mesasTodas} onAbrirTipo={onAbrirTipo} />
    </div>
  );
}

/* ============ MODAL: CONFIGURAR ITEM ============ */
function ConfigItemModal({ produtoKey, onFechar, onAdicionar, notificar }) {
  const produto = CARDAPIO[produtoKey];
  const [qtd, setQtd] = useState(1);
  const [obs, setObs] = useState('');
  const [escolhas, setEscolhas] = useState(() => {
    const init = {};
    produto.modificadores.forEach((g) => { init[g.id] = g.tipo === 'multi' ? [] : (g.obrigatorio ? null : g.opcoes[0]); });
    return init;
  });

  const selecionarUnico = (grupo, opcao) => setEscolhas((prev) => Object.assign({}, prev, { [grupo.id]: opcao }));
  const toggleMulti = (grupo, opcao) => setEscolhas((prev) => {
    const atual = prev[grupo.id] || [];
    const novo = atual.indexOf(opcao) !== -1 ? atual.filter((o) => o !== opcao) : [...atual, opcao];
    return Object.assign({}, prev, { [grupo.id]: novo });
  });

  const confirmar = () => {
    const falta = produto.modificadores.filter((g) => g.obrigatorio && !escolhas[g.id]);
    if (falta.length > 0) { notificar('Escolha ' + falta[0].titulo.toLowerCase() + ' antes de adicionar.'); return; }
    const mods = [];
    produto.modificadores.forEach((g) => {
      const v = escolhas[g.id];
      if (Array.isArray(v)) v.forEach((o) => mods.push(o));
      else if (v) mods.push(v);
    });
    onAdicionar(produtoKey, qtd, mods, obs);
  };

  return (
    <div style={drawerOverlayStyle} onClick={onFechar}>
      <div style={drawerPanelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHandleStyle} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1px solid ' + C.mist }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, lineHeight: 1.15 }}>{produto.nome}</div>
            <div style={{ fontSize: 12.5, color: C.slate }}>R$ {produto.preco.toFixed(2)}</div>
          </div>
          <button onClick={onFechar} style={iconButtonStyle}><X size={20} /></button>
        </div>

        <div style={{ fontSize: 13.5, color: C.slateDark, padding: '12px 0', lineHeight: 1.5 }}>{produto.descricao}</div>

        {produto.modificadores.map((g) => (
          <div key={g.id} style={{ padding: '10px 0', borderTop: '1px solid ' + C.mist }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              {g.titulo}{g.obrigatorio ? ' · obrigatório' : g.tipo === 'multi' ? ' · opcional' : ''}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {g.opcoes.map((o) => {
                const sel = g.tipo === 'multi' ? (escolhas[g.id] || []).indexOf(o) !== -1 : escolhas[g.id] === o;
                return <button key={o} onClick={() => (g.tipo === 'multi' ? toggleMulti(g, o) : selecionarUnico(g, o))} style={modOptionStyle(sel)}>{o}</button>;
              })}
            </div>
          </div>
        ))}

        <div style={{ padding: '12px 0', borderTop: '1px solid ' + C.mist }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Observação para a cozinha</div>
          <input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: capricha no ponto, alergia a…" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>Quantidade</span>
          <button onClick={() => setQtd((q) => Math.max(1, q - 1))} style={stepperSmallStyle}>−</button>
          <span style={{ fontSize: 18, fontWeight: 700, width: 26, textAlign: 'center' }}>{qtd}</span>
          <button onClick={() => setQtd((q) => q + 1)} style={stepperSmallStyle}>+</button>
        </div>

        <button onClick={confirmar} style={primaryButtonStyle}>Adicionar · R$ {(produto.preco * qtd).toFixed(2)}</button>
      </div>
    </div>
  );
}

/* ============ TELA: CARDÁPIO ============ */
function CardapioScreen({ mesa, mesasTodas, onVoltar, onAdicionarItem, onRemoverRascunho, onEnviar, onAbrirTipo, notificar }) {
  const [cat, setCat] = useState(CATEGORIAS[0]);
  const [busca, setBusca] = useState('');
  const [config, setConfig] = useState(null);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const rascunho = (mesa.comanda ? mesa.comanda.itens : []).filter((i) => i.status === 'rascunho');
  const totalRascunho = rascunho.reduce((s, i) => s + CARDAPIO[i.produto].preco * i.quantidade, 0);
  const qtdRascunho = rascunho.reduce((s, i) => s + i.quantidade, 0);

  const buscando = busca.trim().length > 0;
  const chaves = Object.keys(CARDAPIO).filter((k) => {
    if (buscando) return CARDAPIO[k].nome.toLowerCase().indexOf(busca.trim().toLowerCase()) !== -1;
    return CARDAPIO[k].categoria === cat;
  });

  return (
    <div style={phoneFrameStyle}>
      <div style={pageHeaderStyle}>
        <button onClick={onVoltar} style={iconButtonStyle} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, lineHeight: 1.15 }}>Lançar pedido</div>
          <div style={{ fontSize: 12, color: C.slate }}>Mesa {mesa.numero} · {mesa.pessoas} pessoas</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar item do cardápio" style={searchStyle} />
        {!buscando && (
          <div style={catRowStyle}>
            {CATEGORIAS.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={c === cat ? chipButtonActiveStyle : chipButtonStyle}>{c}</button>
            ))}
          </div>
        )}
        {buscando && <div style={{ fontSize: 12.5, color: C.slate }}>{chaves.length} resultado(s) para “{busca.trim()}”</div>}
      </div>

      <div style={{ padding: '4px 20px', paddingBottom: rascunho.length > 0 ? 190 : 120 }}>
        {chaves.length === 0 && (
          <div style={{ padding: '30px 0', textAlign: 'center', fontSize: 13.5, color: C.slate }}>Nenhum item encontrado.</div>
        )}
        {chaves.map((k) => {
          const p = CARDAPIO[k];
          const noRascunho = rascunho.filter((i) => i.produto === k).reduce((s, i) => s + i.quantidade, 0);
          return (
            <button key={k} onClick={() => setConfig(k)} style={cardapioItemStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{p.nome}</div>
                <div style={{ fontSize: 12.5, color: C.slate, marginTop: 1 }}>R$ {p.preco.toFixed(2)}{p.modificadores.length > 0 ? ' · personalizável' : ''}{buscando ? ' · ' + p.categoria : ''}</div>
              </div>
              {noRascunho > 0 && <span style={tagStatusStyle}>{noRascunho}×</span>}
              <span style={addChipStyle}>+</span>
            </button>
          );
        })}
      </div>

      {rascunho.length > 0 && (
        <div style={carrinhoBarStyle}>
          <button
            onClick={() => setCarrinhoAberto((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', padding: '2px 0 10px', textAlign: 'left' }}
          >
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{qtdRascunho} item(ns) a enviar</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {totalRascunho.toFixed(2)}</span>
              <ChevronDown size={16} style={{ transform: carrinhoAberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </span>
          </button>

          {carrinhoAberto && (
            <div style={{ maxHeight: 190, overflowY: 'auto', marginBottom: 10, borderTop: '1px solid ' + C.mist }}>
              {rascunho.map((i) => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid ' + C.mist }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{i.quantidade}× {CARDAPIO[i.produto].nome}</div>
                    {i.modificadores.length > 0 && <div style={{ fontSize: 12, color: C.slate }}>{i.modificadores.join(' · ')}</div>}
                    {i.observacao ? <div style={{ fontSize: 12, color: C.slate, fontStyle: 'italic' }}>{i.observacao}</div> : null}
                  </div>
                  <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>R$ {(CARDAPIO[i.produto].preco * i.quantidade).toFixed(2)}</span>
                  <button onClick={() => { onRemoverRascunho(mesa.id, i.id); notificar('Item retirado do pedido.'); }} style={iconButtonSmallStyle} aria-label="Remover item">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => onEnviar(mesa.id)} style={primaryButtonStyle}>Enviar para a cozinha</button>
        </div>
      )}

      {config && (
        <ConfigItemModal
          produtoKey={config}
          onFechar={() => setConfig(null)}
          onAdicionar={(produtoKey, qtd, mods, obs) => { onAdicionarItem(mesa.id, produtoKey, qtd, mods, obs); setConfig(null); notificar('Adicionado ao pedido.'); }}
          notificar={notificar}
        />
      )}
      <NavBar mesas={mesasTodas} onAbrirTipo={onAbrirTipo} />
    </div>
  );
}

/* ============ TELA: FECHAR A CONTA ============ */
function ContaScreen({ mesa, mesasTodas, onVoltar, onConfirmar, onAbrirTipo, notificar }) {
  const { itens, subtotal, taxa, couvert, desconto, total } = totaisDaComanda(mesa);
  const nPessoas = mesa.pessoas || 2;
  const pessoasLista = Array.from({ length: nPessoas }, (_, i) => i + 1);
  const centavos = (v) => Math.round(v * 100);
  const igualValor = total / nPessoas;
  const jaDividido = mesa.comanda && mesa.comanda.subcontas && mesa.comanda.subcontas.length > 0;

  const [modo, setModo] = useState('igual');
  const [itemPessoas, setItemPessoas] = useState(() => {
    const map = {};
    itens.forEach((it) => { map[it.id] = [1]; });
    return map;
  });
  const [cobrancas, setCobrancas] = useState([{ valor: '', pessoas: [] }]);

  const togglePessoaNoItem = (itemId, pessoa) => setItemPessoas((prev) => {
    const atual = prev[itemId] || [];
    const novo = atual.indexOf(pessoa) !== -1 ? atual.filter((p) => p !== pessoa) : [...atual, pessoa].sort((a, b) => a - b);
    return Object.assign({}, prev, { [itemId]: novo });
  });

  const totaisPorItem = () => {
    const base = Array.from({ length: nPessoas }, () => 0);
    let semDono = false;
    itens.forEach((it) => {
      const donos = itemPessoas[it.id] || [];
      if (donos.length === 0) { semDono = true; return; }
      const fatia = (CARDAPIO[it.produto].preco * it.quantidade) / donos.length;
      donos.forEach((p) => { base[p - 1] += fatia; });
    });
    const somaBase = base.reduce((s, v) => s + v, 0);
    return { final: base.map((sub) => sub + (taxa + couvert) * (somaBase > 0 ? sub / somaBase : 0)), semDono };
  };

  const setValorCobranca = (idx, v) => setCobrancas((prev) => prev.map((c, k) => (k === idx ? Object.assign({}, c, { valor: v }) : c)));
  const togglePessoaCobranca = (idx, pessoa) => setCobrancas((prev) => prev.map((c, k) => {
    if (k !== idx) return c;
    const tem = c.pessoas.indexOf(pessoa) !== -1;
    return Object.assign({}, c, { pessoas: tem ? c.pessoas.filter((p) => p !== pessoa) : [...c.pessoas, pessoa].sort((a, b) => a - b) });
  }));

  const somaCobrancas = cobrancas.reduce((s, c) => s + (parseFloat(String(c.valor).replace(',', '.')) || 0), 0);
  const diff = centavos(total) - centavos(somaCobrancas);
  const fecha = Math.abs(diff) <= 1;
  const temPessoas = cobrancas.every((c) => c.pessoas.length > 0);
  const desigualOk = fecha && temPessoas;
  const totItem = totaisPorItem();

  const confirmar = () => {
    let subcontas;
    let rotulo;
    if (modo === 'igual') {
      rotulo = 'Igual entre todos';
      subcontas = pessoasLista.map((p) => ({ etiqueta: 'Pessoa ' + p, valor: igualValor }));
    } else if (modo === 'item') {
      if (totItem.semDono) { notificar('Todo item precisa de ao menos uma pessoa.'); return; }
      rotulo = 'Por item';
      subcontas = totItem.final.map((v, i) => ({ etiqueta: 'Pessoa ' + (i + 1), valor: v }));
    } else {
      if (!temPessoas) { notificar('Cada valor precisa de ao menos uma pessoa atribuída.'); return; }
      if (!fecha) { notificar(diff > 0 ? 'Ainda faltam R$ ' + (diff / 100).toFixed(2) + '.' : 'A soma passou R$ ' + Math.abs(diff / 100).toFixed(2) + '.'); return; }
      rotulo = 'Valor por pessoa';
      subcontas = cobrancas.map((c, i) => ({ etiqueta: 'Cobrança ' + (i + 1), detalhe: 'Pessoa' + (c.pessoas.length > 1 ? 's ' : ' ') + c.pessoas.join(', '), valor: parseFloat(String(c.valor).replace(',', '.')) || 0 }));
    }
    onConfirmar(mesa.id, subcontas, rotulo);
  };

  return (
    <div style={phoneFrameStyle}>
      <div style={pageHeaderStyle}>
        <button onClick={onVoltar} style={iconButtonStyle} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, lineHeight: 1.15 }}>{jaDividido ? 'Editar divisão' : 'Fechar a conta'}</div>
          <div style={{ fontSize: 12, color: C.slate }}>Mesa {mesa.numero} · {nPessoas} pessoas · R$ {total.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ paddingBottom: 110 }}>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Total da mesa</div>
          <RowTotal label="Subtotal" value={subtotal} muted />
          <RowTotal label="Taxa de serviço (10%)" value={taxa} muted />
          <RowTotal label={'Couvert (' + mesa.pessoas + ' × R$ 18)'} value={couvert} muted />
          {desconto > 0 && <RowTotal label={'Desconto' + (mesa.comanda.descontoMotivo ? ' · ' + mesa.comanda.descontoMotivo : '')} value={desconto} negativo />}
          <RowTotal label="Total" value={total} strong />
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Como dividir</div>
          <div style={modoTabRow}>
            <button onClick={() => setModo('igual')} style={modoTabStyle(modo === 'igual')}>Igual entre todos</button>
            <button onClick={() => setModo('item')} style={modoTabStyle(modo === 'item')}>Por item</button>
            <button onClick={() => setModo('desigual')} style={modoTabStyle(modo === 'desigual')}>Valor por pessoa</button>
          </div>
        </div>

        {modo === 'igual' && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Cada pessoa paga</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 700 }}>R$ {igualValor.toFixed(2)}</div>
            <div style={{ fontSize: 12.5, color: C.slate, marginTop: 2 }}>{nPessoas} × R$ {igualValor.toFixed(2)} = R$ {total.toFixed(2)}</div>
          </div>
        )}

        {modo === 'item' && (
          <>
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Quem divide cada item</div>
              <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 8 }}>Toque nos números para marcar quem participa. O valor é dividido igualmente entre os marcados.</div>
              {itens.map((it) => {
                const donos = itemPessoas[it.id] || [];
                return (
                  <div key={it.id} style={{ padding: '12px 0', borderBottom: '1px solid ' + C.mist }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{it.quantidade}× {CARDAPIO[it.produto].nome}</div>
                      <div style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>R$ {(CARDAPIO[it.produto].preco * it.quantidade).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {pessoasLista.map((p) => (
                        <button key={p} onClick={() => togglePessoaNoItem(it.id, p)} style={pessoaChipStyle(donos.indexOf(p) !== -1)}>{p}</button>
                      ))}
                    </div>
                    {donos.length === 0 && <div style={{ fontSize: 12, color: C.alert, marginTop: 6, fontWeight: 600 }}>Sem ninguém atribuído</div>}
                    {donos.length > 1 && <div style={{ fontSize: 12, color: C.slate, marginTop: 6 }}>R$ {((CARDAPIO[it.produto].preco * it.quantidade) / donos.length).toFixed(2)} por pessoa</div>}
                  </div>
                );
              })}
            </div>
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Resumo por pessoa</div>
              {totItem.final.map((v, i) => <RowTotal key={i} label={'Pessoa ' + (i + 1)} value={v} />)}
              <div style={{ fontSize: 11.5, color: C.slate, marginTop: 6 }}>Taxa e couvert rateados proporcionalmente ao consumo.</div>
            </div>
          </>
        )}

        {modo === 'desigual' && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Quanto e quem paga cada parte</div>
            {cobrancas.map((c, idx) => (
              <div key={idx} style={subcontaCardStyle}>
                <div style={subcontaHeadStyle}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Cobrança {idx + 1}</span>
                  {cobrancas.length > 1 && (
                    <button onClick={() => setCobrancas((prev) => prev.filter((_, k) => k !== idx))} style={iconButtonSmallStyle} aria-label="Remover"><Trash2 size={15} /></button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: C.slate }}>R$</span>
                  <input inputMode="decimal" value={c.valor} placeholder="0,00" onChange={(e) => setValorCobranca(idx, e.target.value)} style={valorInputStyle} />
                </div>
                <div style={{ fontSize: 12, color: C.slate, marginBottom: 6 }}>Pagam esta parte:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {pessoasLista.map((p) => (
                    <button key={p} onClick={() => togglePessoaCobranca(idx, p)} style={pessoaChipStyle(c.pessoas.indexOf(p) !== -1)}>{p}</button>
                  ))}
                </div>
                {c.pessoas.length === 0 && <div style={{ fontSize: 12, color: C.alert, marginTop: 6, fontWeight: 600 }}>Sem ninguém atribuído</div>}
              </div>
            ))}
            <button onClick={() => setCobrancas((prev) => [...prev, { valor: '', pessoas: [] }])} style={ghostButtonStyle}>Adicionar cobrança</button>
            <div style={Object.assign({}, conferenciaStyle(desigualOk), { marginTop: 14 })}>
              {!temPessoas ? 'Cada cobrança precisa de ao menos uma pessoa'
                : fecha ? 'Fecha certo: R$ ' + somaCobrancas.toFixed(2) + ' de R$ ' + total.toFixed(2)
                  : diff > 0 ? 'Faltam R$ ' + (diff / 100).toFixed(2)
                    : 'Passou R$ ' + Math.abs(diff / 100).toFixed(2)}
            </div>
          </div>
        )}

        <div style={{ padding: '18px 20px 0' }}>
          <button onClick={confirmar} style={Object.assign({}, primaryButtonStyle, ((modo === 'desigual' && !desigualOk) || (modo === 'item' && totItem.semDono)) ? { background: C.stone } : {})}>
            {jaDividido ? 'Salvar divisão' : 'Confirmar pagamento'}
          </button>
        </div>
      </div>
      <NavBar mesas={mesasTodas} onAbrirTipo={onAbrirTipo} />
    </div>
  );
}

/* ============ DRAWER DE NOTIFICAÇÕES ============ */
function NotificacoesDrawer({ tipo, mesas, onFechar, onIrParaMesa, onAtenderChamado }) {
  const meta = chamadoMeta(tipo);
  const lista = [];
  mesas.forEach((m) => { m.chamados.forEach((ch) => { if (ch.tipo === tipo) lista.push({ mesa: m, chamado: ch }); }); });

  return (
    <div style={drawerOverlayStyle} onClick={onFechar}>
      <div style={drawerPanelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHandleStyle} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid ' + C.mist }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, lineHeight: 1.1 }}>{meta.label}</div>
            <div style={{ fontSize: 12, color: C.slate }}>{lista.length === 1 ? '1 mesa aguardando' : lista.length + ' mesas aguardando'}</div>
          </div>
          <button onClick={onFechar} style={iconButtonStyle}><X size={20} /></button>
        </div>

        <div style={{ paddingTop: 6 }}>
          {lista.map((l, idx) => (
            <div key={idx} style={{ padding: '14px 0', borderBottom: '1px solid ' + C.mist }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700 }}>Mesa {l.mesa.numero}</span>
                <span style={{ fontSize: 12, color: C.slate }}>{l.mesa.praca} · {STATUS_LABEL[l.mesa.status]}</span>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.slateDark, marginTop: 4 }}>{l.chamado.mensagem}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => onIrParaMesa(l.mesa.id)} style={chipButtonStyle}>Detalhes da mesa</button>
                <button onClick={() => onAtenderChamado(l.mesa.id, tipo)} style={chipButtonActiveStyle}>Marcar como atendido</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ NAVBAR ============ */
function NavBar({ mesas, onAbrirTipo }) {
  const contar = (tipo) => mesas.reduce((acc, m) => acc + m.chamados.filter((c) => c.tipo === tipo).length, 0);
  return (
    <div style={navBarStyle}>
      <div style={navGridStyle}>
        {TIPOS_CHAMADO.map((t) => {
          const n = contar(t.tipo);
          const ativo = n > 0;
          return (
            <button key={t.tipo} onClick={() => onAbrirTipo(t.tipo, n)} style={navItemStyle(ativo ? t.corBg : C.mist)}>
              {ativo && <span style={navCircleStyle(t.cor)}>{n}</span>}
              <t.Icone size={26} color={ativo ? t.cor : C.stone} />
              <span style={navLabelStyle(ativo)}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ TELAS SIMPLES ============ */
function Landing({ onGarcom, onGestor }) {
  return (
    <div style={landingWrapStyle}>
      <div style={landingContentStyle}>
        <div style={eyebrowStyle}>Operação de salão</div>
        <h1 style={wordmarkStyle}>Dionísio</h1>
        <p style={landingDescStyle}>Da mesa livre à conta fechada. Pensado pra funcionar em pé, com uma mão ocupada, no barulho de uma sexta à noite agitada.</p>
        <div style={landingButtonsStyle}>
          <button onClick={onGarcom} style={primaryButtonStyle}>Acesso do Garçom</button>
          <button onClick={onGestor} style={secondaryButtonStyle}>Acesso do Gestor</button>
        </div>
      </div>
      <div style={landingFootStyle}>Desenvolvido por Eduardo Machado</div>
    </div>
  );
}

function Login({ onEntrar, onVoltar }) {
  const [cpf, setCpf] = useState('123.456.789-00');
  const [senha, setSenha] = useState('123456');
  return (
    <div style={landingWrapStyle}>
      <button onClick={onVoltar} style={backLinkStyle}><ChevronLeft size={15} /> Voltar</button>
      <div style={landingContentStyle}>
        <div style={eyebrowStyle}>Acesso do garçom</div>
        <h1 style={Object.assign({}, wordmarkStyle, { fontSize: 40 })}>Dionísio</h1>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6, textAlign: 'left' }}>
          <div>
            <label style={fieldLabelStyle}>CPF</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={fieldLabelStyle}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" style={inputStyle} />
          </div>
        </div>
        <div style={landingButtonsStyle}>
          <button onClick={onEntrar} style={primaryButtonStyle}>Entrar</button>
        </div>
      </div>
      <div style={landingFootStyle}>Login genérico · protótipo, sem autenticação real</div>
    </div>
  );
}

function GestorLogin({ onEntrar, onVoltar }) {
  const [email, setEmail] = useState('luis@odionisio.com');
  const [senha, setSenha] = useState('123456');
  return (
    <div style={landingWrapStyle}>
      <button onClick={onVoltar} style={backLinkStyle}><ChevronLeft size={15} /> Voltar</button>
      <div style={landingContentStyle}>
        <div style={eyebrowStyle}>Acesso do gestor</div>
        <h1 style={Object.assign({}, wordmarkStyle, { fontSize: 40 })}>Dionísio</h1>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6, textAlign: 'left' }}>
          <div>
            <label style={fieldLabelStyle}>E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={fieldLabelStyle}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" style={inputStyle} />
          </div>
        </div>
        <div style={landingButtonsStyle}>
          <button onClick={onEntrar} style={primaryButtonStyle}>Entrar</button>
        </div>
      </div>
      <div style={landingFootStyle}>Login genérico · protótipo, sem autenticação real</div>
    </div>
  );
}

function GestorHeader({ onSair, notificar }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={gestorHeaderStyle}>
      <div style={gestorHeaderInnerStyle}>
        <span style={gestorLogoStyle}>Dionísio</span>
        <span style={gestorEyebrowStyle}>Painel do gestor</span>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <button onClick={() => setAberto((v) => !v)} style={gestorPerfilButtonStyle}>
            <span>Olá, Luís</span>
            <ChevronDown size={14} style={{ transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>
          {aberto && (
            <>
              <div style={invisibleOverlayStyle} onClick={() => setAberto(false)} />
              <div style={gestorPerfilPanelStyle}>
                <button onClick={() => { setAberto(false); notificar('A edição de perfil entra na próxima etapa.'); }} style={perfilItemStyle}>Editar perfil</button>
                <button onClick={onSair} style={perfilItemStyle}>Sair</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Checkout de pagamento (demonstrativo) --- */
/* --- Fluxo específico por forma de pagamento --- */
function PagamentoFormaModal({ forma, valor, onConfirmar, onFechar, notificar }) {
  const [aprovando, setAprovando] = useState(false);
  const [valorRecebido, setValorRecebido] = useState(valor.toFixed(2).replace('.', ','));

  const recebidoNum = parseFloat(String(valorRecebido).replace(',', '.')) || 0;
  const troco = Math.max(0, recebidoNum - valor);
  const suficiente = recebidoNum >= valor - 0.001;

  const confirmarCartao = () => {
    setAprovando(true);
    setTimeout(() => onConfirmar(), 900);
  };

  const confirmarDinheiro = () => {
    if (!suficiente) { notificar('Valor recebido é menor que o valor da conta.'); return; }
    onConfirmar();
  };

  return (
    <div style={modalOverlayStyle} onClick={aprovando ? undefined : onFechar}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700 }}>{forma}</div>
          {!aprovando && <button onClick={onFechar} style={iconButtonStyle}><X size={19} /></button>}
        </div>

        {forma === 'Cartão' && (
          aprovando ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.ink, display: 'inline-block', animation: 'pulseDot 0.6s ease-in-out infinite' }} />
              <div style={{ fontSize: 13.5, color: C.slate, marginTop: 14 }}>Aguardando aprovação da maquininha…</div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '22px 16px', border: '1.5px dashed ' + C.stone, borderRadius: 12, marginBottom: 16 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700 }}>R$ {valor.toFixed(2)}</div>
                <div style={{ fontSize: 12.5, color: C.slate, marginTop: 8, lineHeight: 1.4 }}>Insira, aproxime ou passe o cartão na maquininha</div>
              </div>
              <button onClick={confirmarCartao} style={primaryButtonStyle}>Simular aprovação</button>
            </>
          )
        )}

        {forma === 'Pix' && (
          <>
            <div style={{ textAlign: 'center', padding: '6px 0 18px' }}>
              <div style={{ display: 'inline-flex', padding: 14, border: '1.5px solid ' + C.stone, borderRadius: 12 }}>
                <QrCode size={110} color={C.ink} />
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, marginTop: 12 }}>R$ {valor.toFixed(2)}</div>
            </div>
            <label style={fieldLabelStyle}>Pix copia e cola</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input readOnly value={'00020126580014BR.GOV.BCB.PIX-DIONISIO' + Math.round(valor * 100)} style={Object.assign({}, inputStyle, { flex: 1, fontSize: 12, color: C.slate })} />
              <button onClick={() => notificar('Link Pix copiado.')} style={ghostButtonStyle}>Copiar</button>
            </div>
            <button onClick={onConfirmar} style={primaryButtonStyle}>Confirmar recebimento</button>
          </>
        )}

        {forma === 'Dinheiro' && (
          <>
            <label style={fieldLabelStyle}>Valor da conta</label>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, marginBottom: 14 }}>R$ {valor.toFixed(2)}</div>
            <label style={fieldLabelStyle}>Valor recebido</label>
            <input inputMode="decimal" value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} style={Object.assign({}, inputStyle, { marginBottom: 12 })} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid ' + C.mist, marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Troco</span>
              <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {troco.toFixed(2)}</span>
            </div>
            <button onClick={confirmarDinheiro} style={Object.assign({}, primaryButtonStyle, !suficiente ? { background: C.stone } : {})}>Confirmar</button>
          </>
        )}
      </div>
    </div>
  );
}


function CancelarPagamentoModal({ onConfirmar, onFechar }) {
  return (
    <div style={modalOverlayStyle} onClick={onFechar}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700 }}>Cancelar pagamento</div>
          <button onClick={onFechar} style={iconButtonStyle}><X size={19} /></button>
        </div>
        <div style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>Selecione o motivo do cancelamento.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Cliente trocou a forma de pagamento', 'Valor lançado errado', 'Pagamento recusado', 'Outro motivo'].map((mo) => (
            <button key={mo} onClick={() => onConfirmar(mo)} style={chipButtonActiveStyle}>{mo}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Comprovante: conferir, imprimir (de verdade) e compartilhar --- */
function montarTextoComprovante(mesa, dataFormatada, itens, subtotal, taxa, couvert, desconto, total) {
  let txt = '*Dionísio · Bistrô Paulista*\n';
  txt += 'Mesa ' + mesa.numero + ' · ' + dataFormatada + '\n\n';
  itens.forEach((it) => {
    txt += it.quantidade + 'x ' + CARDAPIO[it.produto].nome;
    if (it.modificadores.length > 0) txt += ' (' + it.modificadores.join(', ') + ')';
    txt += ' — R$ ' + (CARDAPIO[it.produto].preco * it.quantidade).toFixed(2) + '\n';
  });
  txt += '\nSubtotal: R$ ' + subtotal.toFixed(2) + '\n';
  if (taxa > 0) txt += 'Taxa de serviço (10%): R$ ' + taxa.toFixed(2) + '\n';
  if (couvert > 0) txt += 'Couvert: R$ ' + couvert.toFixed(2) + '\n';
  if (desconto > 0) txt += 'Desconto: -R$ ' + desconto.toFixed(2) + '\n';
  txt += '*Total: R$ ' + total.toFixed(2) + '*';
  return txt;
}

function ComprovanteModal({ mesa, itens, subtotal, taxa, couvert, desconto, total, onFechar, notificar }) {
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const imprimir = () => {
    window.print();
  };

  const compartilhar = async () => {
    const texto = montarTextoComprovante(mesa, dataFormatada, itens, subtotal, taxa, couvert, desconto, total);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Comprovante Dionísio', text: texto });
        return;
      } catch (e) {
        /* cancelado ou sem suporte — tenta copiar abaixo */
      }
    }
    try {
      await navigator.clipboard.writeText(texto);
      notificar('Comprovante copiado. Cole no WhatsApp ou onde precisar.');
    } catch (e) {
      notificar('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onFechar}>
      <div style={Object.assign({}, modalCardStyle, { maxWidth: 380 })} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700 }}>Comprovante</div>
          <button onClick={onFechar} style={iconButtonStyle}><X size={19} /></button>
        </div>
        <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 16 }}>Confira antes de imprimir ou compartilhar.</div>

        <div id="comprovante-impressao" style={{ border: '1px solid ' + C.mist, borderRadius: 10, padding: '18px 16px', marginBottom: 16, maxHeight: 320, overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700 }}>Dionísio</div>
            <div style={{ fontSize: 11.5, color: C.slate }}>Bistrô Paulista</div>
            <div style={{ fontSize: 11.5, color: C.slate, marginTop: 4 }}>Mesa {mesa.numero} · {dataFormatada}</div>
          </div>
          {itens.map((it) => (
            <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed ' + C.mist, fontSize: 12.5 }}>
              <span>{it.quantidade}× {CARDAPIO[it.produto].nome}{it.modificadores.length > 0 ? ' (' + it.modificadores.join(', ') + ')' : ''}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginLeft: 8 }}>R$ {(CARDAPIO[it.produto].preco * it.quantidade).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <RowTotal label="Subtotal" value={subtotal} muted />
            {taxa > 0 && <RowTotal label="Taxa de serviço (10%)" value={taxa} muted />}
            {couvert > 0 && <RowTotal label="Couvert" value={couvert} muted />}
            {desconto > 0 && <RowTotal label="Desconto" value={desconto} negativo />}
            <RowTotal label="Total" value={total} strong />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={imprimir} style={Object.assign({}, secondaryButtonStyle, { flex: 1 })}>Imprimir</button>
          <button onClick={compartilhar} style={Object.assign({}, primaryButtonStyle, { flex: 1 })}>Compartilhar</button>
        </div>
      </div>
    </div>
  );
}

/* --- Página de detalhe da mesa (gestor) --- */
function GestorMesaDetalhe({ mesa, onVoltar, onAplicarDesconto, onRegistrarPagamento, onCancelarPagamento, onConfirmarPagamento, notificar }) {
  const { itens, subtotal, taxa, couvert, desconto, total } = totaisDaComanda(mesa);
  const ocupada = isOcupada(mesa.status);
  const [descontoInput, setDescontoInput] = useState('');
  const [motivoInput, setMotivoInput] = useState('');
  const [cancelarAberto, setCancelarAberto] = useState(false);
  const [pagamentoAtivo, setPagamentoAtivo] = useState(null); // { idx, forma }
  const [comprovanteAberto, setComprovanteAberto] = useState(false);

  const aplicarDesconto = () => {
    const v = parseFloat(String(descontoInput).replace(',', '.'));
    if (!v || v <= 0) { notificar('Informe um valor de desconto válido.'); return; }
    onAplicarDesconto(mesa.id, v, motivoInput.trim());
    setDescontoInput('');
    setMotivoInput('');
  };

  const subcontas = mesa.comanda && mesa.comanda.subcontas ? mesa.comanda.subcontas : [];
  const todasPagas = subcontas.length > 0 && subcontas.every((sc) => sc.pago);

  const concluirPagamento = () => {
    if (!todasPagas) { notificar('Ainda há parte(s) sem forma de pagamento registrada.'); return; }
    onConfirmarPagamento(mesa.id);
    onVoltar();
  };

  const confirmarCancelamento = (motivo) => {
    setCancelarAberto(false);
    onCancelarPagamento(mesa.id, motivo);
  };

  return (
    <div style={gestorMainStyle}>
      <button onClick={onVoltar} style={gestorVoltarStyle}><ChevronLeft size={16} /> Voltar para a visão geral</button>
      <div style={gestorPageTitleStyle}>Mesa {mesa.numero}</div>
      <div style={gestorPageDescStyle}>{mesa.praca} · {mesa.capacidade} lugares</div>

      <div style={detalheGridStyle}>
        <div>
          {ocupada && (
            <div style={detalheCardStyle}>
              <div style={sectionTitleStyle}>Comanda completa</div>
              {itens.length === 0 ? (
                <div style={{ fontSize: 13, color: C.slate }}>Nenhum item lançado ainda.</div>
              ) : (
                <>
                  {itens.map((it) => (
                    <div key={it.id} style={{ padding: '10px 0', borderBottom: '1px solid ' + C.mist }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.quantidade}× {CARDAPIO[it.produto].nome}</div>
                        <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>R$ {(CARDAPIO[it.produto].preco * it.quantidade).toFixed(2)}</span>
                      </div>
                      {it.modificadores.length > 0 && <div style={{ fontSize: 12, color: C.slate }}>{it.modificadores.join(' · ')}</div>}
                      {it.observacao ? <div style={{ fontSize: 12, color: C.slate, fontStyle: 'italic' }}>{it.observacao}</div> : null}
                      <div style={{ marginTop: 4 }}><span style={tagStatusStyle}>{STATUS_ITEM_LABEL[it.status]}</span></div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <RowTotal label="Subtotal" value={subtotal} muted />
                    {taxa > 0 && <RowTotal label="Taxa de serviço (10%)" value={taxa} muted />}
                    {couvert > 0 && <RowTotal label={'Couvert (' + mesa.pessoas + ' × R$ 18)'} value={couvert} muted />}
                    {desconto > 0 && <RowTotal label={'Desconto' + (mesa.comanda.descontoMotivo ? ' · ' + mesa.comanda.descontoMotivo : '')} value={desconto} negativo />}
                    <RowTotal label="Total" value={total} strong />
                  </div>
                </>
              )}
            </div>
          )}

          {subcontas.length > 0 && (
            <div style={detalheCardStyle}>
              <div style={sectionTitleStyle}>Formas de pagamento</div>
              {subcontas.map((sc, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid ' + C.mist }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{sc.etiqueta}</div>
                      {sc.detalhe && <div style={{ fontSize: 12, color: C.slate }}>{sc.detalhe}</div>}
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {sc.valor.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Cartão', 'Pix', 'Dinheiro'].map((forma) => (
                      <button key={forma} onClick={() => setPagamentoAtivo({ idx: i, forma })} style={sc.formaPagamento === forma ? chipButtonActiveStyle : chipButtonStyle}>{forma}</button>
                    ))}
                  </div>
                </div>
              ))}
              {mesa.status === 'em_pagamento' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button onClick={() => setCancelarAberto(true)} style={Object.assign({}, secondaryButtonStyle, { flex: 1 })}>Cancelar</button>
                  <button onClick={concluirPagamento} style={Object.assign({}, primaryButtonStyle, { flex: 1 }, !todasPagas ? { background: C.stone } : {})}>Concluir</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div style={detalheCardStyle}>
            <div style={sectionTitleStyle}>Status</div>
            <span style={tagStatusStyle}>{ocupada ? STATUS_LABEL[mesa.status] : statusMesaLabel(mesa.status)}</span>
            {ocupada && <div style={{ fontSize: 13, color: C.slate, marginTop: 8 }}>{descricaoStatus(mesa)}</div>}
            {ocupada && <div style={{ fontSize: 13, color: C.slate, marginTop: 4 }}>Atendida por Camila</div>}
            {mesa.status === 'reservada' && mesa.reserva && <div style={{ fontSize: 13, color: C.slate, marginTop: 4 }}>Reserva de {mesa.reserva.nome}</div>}
          </div>

          {mesa.chamados.length > 0 && (
            <div style={detalheCardStyle}>
              <div style={sectionTitleStyle}>Chamados</div>
              {mesa.chamados.map((ch, i) => {
                const meta = chamadoMeta(ch.tipo);
                return (
                  <div key={i} style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.45 }}>
                    <span style={alertaPillStyle(meta.cor)}>{meta.label}</span>
                    <div style={{ color: C.slateDark, marginTop: 4 }}>{ch.mensagem}</div>
                  </div>
                );
              })}
            </div>
          )}

          {ocupada && (
            <div style={detalheCardStyle}>
              <div style={sectionTitleStyle}>Fechamento</div>
              <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 10, lineHeight: 1.4 }}>Desconto exige autorização do gestor — o garçom não aplica sozinho.</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input value={descontoInput} onChange={(e) => setDescontoInput(e.target.value)} placeholder="Valor R$" inputMode="decimal" style={Object.assign({}, inputStyle, { flex: 1 })} />
                <input value={motivoInput} onChange={(e) => setMotivoInput(e.target.value)} placeholder="Motivo (opcional)" style={Object.assign({}, inputStyle, { flex: 2 })} />
              </div>
              <button onClick={aplicarDesconto} style={secondaryButtonStyle}>Aplicar desconto</button>
              <button onClick={() => setComprovanteAberto(true)} style={Object.assign({}, primaryButtonStyle, { marginTop: 10 })}>Ver comprovante</button>
            </div>
          )}
        </div>
      </div>

      {pagamentoAtivo && (
        <PagamentoFormaModal
          forma={pagamentoAtivo.forma}
          valor={subcontas[pagamentoAtivo.idx].valor}
          onConfirmar={() => { onRegistrarPagamento(mesa.id, pagamentoAtivo.idx, pagamentoAtivo.forma); setPagamentoAtivo(null); }}
          onFechar={() => setPagamentoAtivo(null)}
          notificar={notificar}
        />
      )}

      {cancelarAberto && (
        <CancelarPagamentoModal onConfirmar={confirmarCancelamento} onFechar={() => setCancelarAberto(false)} />
      )}

      {comprovanteAberto && (
        <ComprovanteModal
          mesa={mesa}
          itens={itens}
          subtotal={subtotal}
          taxa={taxa}
          couvert={couvert}
          desconto={desconto}
          total={total}
          onFechar={() => setComprovanteAberto(false)}
          notificar={notificar}
        />
      )}
    </div>
  );
}

function GestorVisaoGeral({ mesas, praca, onMudarPraca, onSelecionarMesa }) {
  const pracas = ['Todas', 'Terraço', 'Salão Interno', 'Bar'];
  const exibidas = mesas.filter((m) => praca === 'Todas' || m.praca === praca);

  const ocupadas = mesas.filter((m) => isOcupada(m.status));
  const livres = mesas.filter((m) => m.status === 'livre').length;
  const valorEmAberto = ocupadas.reduce((s, m) => s + totaisDaComanda(m).total, 0);
  const chamadosPendentes = mesas.reduce((s, m) => s + m.chamados.length, 0);

  return (
    <div style={gestorMainStyle}>
      <div style={gestorPageTitleStyle}>Visão geral do salão</div>
      <div style={gestorPageDescStyle}>Bistrô Paulista · {mesas.length} mesas em 3 praças</div>

      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Mesas ocupadas</div>
          <div style={statValueStyle}>{ocupadas.length} <span style={{ fontSize: 15, fontWeight: 500, color: C.slate }}>/ {mesas.length}</span></div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Mesas livres</div>
          <div style={statValueStyle}>{livres}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Valor em aberto</div>
          <div style={statValueStyle}>R$ {valorEmAberto.toFixed(0)}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Chamados pendentes</div>
          <div style={Object.assign({}, statValueStyle, chamadosPendentes > 0 ? { color: C.alert } : {})}>{chamadosPendentes}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {pracas.map((p) => (
          <button key={p} onClick={() => onMudarPraca(p)} style={p === praca ? pracaChipActiveStyle : pracaChipStyle}>{p}</button>
        ))}
      </div>

      <div style={tableWrapStyle}>
        <div style={tableHeadRowStyle}>
          <span style={tableHeadCellStyle}>Mesa</span>
          <span style={tableHeadCellStyle}>Praça</span>
          <span style={tableHeadCellStyle}>Status</span>
          <span style={tableHeadCellStyle}>Pessoas</span>
          <span style={tableHeadCellStyle}>Tempo</span>
          <span style={tableHeadCellStyle}>Valor</span>
          <span style={tableHeadCellStyle}>Alertas</span>
        </div>
        {exibidas.map((m) => {
          const { total } = totaisDaComanda(m);
          const ocupada = isOcupada(m.status);
          return (
            <button key={m.id} onClick={() => onSelecionarMesa(m.id)} style={tableRowStyle}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16 }}>{m.numero}</span>
              <span style={{ color: C.slate }}>{m.praca}</span>
              <span><span style={tagStatusStyle}>{ocupada ? STATUS_LABEL[m.status] : statusMesaLabel(m.status)}</span></span>
              <span>{ocupada ? m.pessoas : '—'}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: C.slate }}>{ocupada ? tempoDecorrido(m.horaAbertura) : '—'}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{total > 0 ? 'R$ ' + total.toFixed(2) : '—'}</span>
              <span>
                {m.chamados.length === 0
                  ? <span style={{ color: C.stone }}>—</span>
                  : m.chamados.map((ch, i) => <span key={i} style={alertaPillStyle(chamadoMeta(ch.tipo).cor)}>{chamadoMeta(ch.tipo).label}</span>)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GestorApp({ mesas, onSair, onAplicarDesconto, onRegistrarPagamento, onCancelarPagamento, onConfirmarPagamento, notificar }) {
  const [rotaGestor, setRotaGestor] = useState({ nome: 'visao-geral' });
  const [pracaGestor, setPracaGestor] = useState('Todas');
  const mesaSelecionada = rotaGestor.mesaId ? mesas.filter((m) => m.id === rotaGestor.mesaId)[0] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rotaGestor.nome, rotaGestor.mesaId]);

  return (
    <div style={gestorRootStyle}>
      <GestorHeader onSair={onSair} notificar={notificar} />
      {rotaGestor.nome === 'visao-geral' && (
        <GestorVisaoGeral mesas={mesas} praca={pracaGestor} onMudarPraca={setPracaGestor} onSelecionarMesa={(id) => setRotaGestor({ nome: 'mesa', mesaId: id })} />
      )}
      {rotaGestor.nome === 'mesa' && mesaSelecionada && (
        <GestorMesaDetalhe
          mesa={mesaSelecionada}
          onVoltar={() => setRotaGestor({ nome: 'visao-geral' })}
          onAplicarDesconto={onAplicarDesconto}
          onRegistrarPagamento={onRegistrarPagamento}
          onCancelarPagamento={onCancelarPagamento}
          onConfirmarPagamento={onConfirmarPagamento}
          notificar={notificar}
        />
      )}
    </div>
  );
}


function AppHeader({ onSair, notificar }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={appHeaderStyle}>
      <div style={logoTextStyle}>Dionísio</div>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative' }}>
        <button onClick={() => setAberto((v) => !v)} style={perfilButtonStyle}>
          <span>Olá, Camila</span>
          <ChevronDown size={14} style={{ transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
        </button>
        {aberto && (
          <>
            <div style={invisibleOverlayStyle} onClick={() => setAberto(false)} />
            <div style={perfilPanelStyle}>
              <button onClick={() => { setAberto(false); notificar('A edição de perfil entra na próxima etapa.'); }} style={perfilItemStyle}>Editar perfil</button>
              <button onClick={onSair} style={perfilItemStyle}>Sair</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MesasScreen({ mesas, praca, onMudarPraca, onTapMesa, onSair, onAbrirTipo, notificar }) {
  const pracas = ['Terraço', 'Salão Interno', 'Bar', 'Todas'];
  const exibidas = mesas.filter((m) => praca === 'Todas' || m.praca === praca);

  return (
    <div style={phoneFrameStyle}>
      <AppHeader onSair={onSair} notificar={notificar} />
      <div style={pageIntroStyle}>
        <div style={pageIntroTitleStyle}>Operação de salão</div>
        <div style={pageIntroDescStyle}>Escolha a mesa que deseja trabalhar</div>
      </div>
      <div style={pracaSelectorStyle}>
        {pracas.map((p) => (
          <button key={p} onClick={() => onMudarPraca(p)} style={p === praca ? pracaChipActiveStyle : pracaChipStyle}>{p}</button>
        ))}
      </div>
      <div style={gridStyle}>
        {exibidas.map((m) => <MesaCard key={m.id} mesa={m} onTap={onTapMesa} />)}
      </div>
      <NavBar mesas={mesas} onAbrirTipo={onAbrirTipo} />
    </div>
  );
}

/* ============ APP ============ */
export default function App() {
  const [screen, setScreen] = useState('landing');
  const [mesas, setMesas] = useState(INITIAL_MESAS);
  const [rota, setRota] = useState({ nome: 'mesas' });
  const [pracaAtiva, setPracaAtiva] = useState('Terraço');
  const [drawerTipo, setDrawerTipo] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, rota.nome, rota.mesaId, rota.itemId]);

  const notificar = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const abrirTipo = (tipo, n) => {
    if (!n) {
      notificar('Não há notificações em "' + chamadoMeta(tipo).label + '".');
      return;
    }
    setDrawerTipo(tipo);
  };

  const patchMesa = (mesaId, patch) => {
    setMesas((prev) => prev.map((m) => (m.id === mesaId ? Object.assign({}, m, typeof patch === 'function' ? patch(m) : patch) : m)));
  };

  const patchItem = (mesaId, itemId, fn) => {
    setMesas((prev) => prev.map((m) => {
      if (m.id !== mesaId || !m.comanda) return m;
      return Object.assign({}, m, { comanda: Object.assign({}, m.comanda, { itens: m.comanda.itens.map((i) => (i.id === itemId ? fn(i) : i)) }) });
    }));
  };

  const adicionarItemRascunho = (mesaId, produtoKey, qtd, mods, obs) => {
    setMesas((prev) => prev.map((m) => {
      if (m.id !== mesaId || !m.comanda) return m;
      const novo = {
        id: 'it' + (_itemId++),
        produto: produtoKey,
        quantidade: qtd,
        modificadores: mods,
        observacao: obs || '',
        status: 'rascunho',
        ingredientes: CARDAPIO[produtoKey].ingredientes.map((ing) => Object.assign({}, ing, { removido: false })),
      };
      return Object.assign({}, m, { comanda: Object.assign({}, m.comanda, { itens: [...m.comanda.itens, novo] }) });
    }));
  };

  const removerRascunho = (mesaId, itemId) => {
    setMesas((prev) => prev.map((m) => {
      if (m.id !== mesaId || !m.comanda) return m;
      return Object.assign({}, m, { comanda: Object.assign({}, m.comanda, { itens: m.comanda.itens.filter((i) => i.id !== itemId) }) });
    }));
  };

  const enviarPedido = (mesaId) => {
    const mesa = mesas.filter((m) => m.id === mesaId)[0];
    const rascunho = mesa.comanda ? mesa.comanda.itens.filter((i) => i.status === 'rascunho') : [];
    if (rascunho.length === 0) { notificar('Escolha ao menos um item do cardápio antes de enviar.'); return; }
    setMesas((prev) => prev.map((m) => {
      if (m.id !== mesaId || !m.comanda) return m;
      return Object.assign({}, m, {
        status: 'pedido_realizado',
        horaPedido: Date.now(),
        comanda: Object.assign({}, m.comanda, { itens: m.comanda.itens.map((i) => (i.status === 'rascunho' ? Object.assign({}, i, { status: 'enviado' }) : i)) }),
      });
    }));
    setRota({ nome: 'mesa', mesaId });
    notificar(rascunho.reduce((s, i) => s + i.quantidade, 0) + ' item(ns) enviado(s) para a cozinha.');
  };

  const lancarPedido = (mesaId) => setRota({ nome: 'cardapio', mesaId });

  const abrirMesa = (mesaId, pessoas) => {
    patchMesa(mesaId, { status: 'atendido', pessoas, horaAbertura: Date.now(), comanda: { itens: [], taxaServico: true, couvert: false } });
    notificar('Mesa aberta com ' + pessoas + (pessoas === 1 ? ' pessoa.' : ' pessoas.'));
  };

  const avancarStatus = (mesaId, proximo) => {
    if (proximo === 'livre') {
      patchMesa(mesaId, { status: 'livre', pessoas: 0, horaAbertura: null, horaPedido: null, horaPronto: null, horaConta: null, comanda: null, chamados: [], grupoId: null, recursos: Object.assign({}, semRecursos) });
      setRota({ nome: 'mesas' });
      notificar('Mesa liberada e disponível.');
      return;
    }
    const extra = {};
    if (proximo === 'conta_solicitada') {
      extra.horaConta = Date.now();
      /* regra: conta sempre sai com taxa de serviço e couvert */
      const mesa = mesas.filter((m) => m.id === mesaId)[0];
      if (mesa.comanda) extra.comanda = Object.assign({}, mesa.comanda, comandaCobrada);
    }
    if (proximo === 'pedido_pronto') extra.horaPronto = Date.now();
    patchMesa(mesaId, Object.assign({ status: proximo }, extra));
    notificar('Status atualizado para "' + STATUS_LABEL[proximo] + '".');
  };

  const cancelarReserva = (mesaId) => {
    const mesa = mesas.filter((m) => m.id === mesaId)[0];
    const nome = mesa && mesa.reserva ? mesa.reserva.nome : null;
    patchMesa(mesaId, { status: 'livre', reserva: null });
    setRota({ nome: 'mesas' });
    notificar(nome ? 'Reserva de ' + nome + ' cancelada.' : 'Reserva cancelada.');
  };

  const atualizarPessoas = (mesaId, pessoas) => patchMesa(mesaId, { pessoas });

  const atualizarRecursos = (mesaId, patch) => {
    patchMesa(mesaId, (m) => ({ recursos: Object.assign({}, m.recursos, patch) }));
    if (patch.cadeirasCrianca !== undefined) notificar(patch.cadeirasCrianca === 0 ? 'Cadeira de criança removida.' : patch.cadeirasCrianca + ' cadeira(s) de criança solicitada(s).');
    if (patch.acessibilidade !== undefined) notificar(patch.acessibilidade === 0 ? 'Cadeira de rodas removida.' : patch.acessibilidade + ' espaço(s) para cadeira de rodas reservado(s).');
  };

  const atenderChamado = (mesaId, tipo) => {
    patchMesa(mesaId, (m) => ({ chamados: m.chamados.filter((c) => c.tipo !== tipo) }));
    setDrawerTipo(null);
    notificar('Chamado marcado como atendido.');
  };

  const alterarQuantidade = (mesaId, itemId, q) => patchItem(mesaId, itemId, (i) => Object.assign({}, i, { quantidade: q }));

  const toggleIngrediente = (mesaId, itemId, idx) => patchItem(mesaId, itemId, (i) => Object.assign({}, i, {
    ingredientes: i.ingredientes.map((ing, k) => (k === idx ? Object.assign({}, ing, { removido: !ing.removido }) : ing)),
  }));

  const alterarQtdIngrediente = (mesaId, itemId, idx, delta) => patchItem(mesaId, itemId, (i) => Object.assign({}, i, {
    ingredientes: i.ingredientes.map((ing, k) => (k === idx ? Object.assign({}, ing, { qtd: Math.max(0, ing.qtd + delta * (ing.qtd >= 20 ? 10 : 1)) }) : ing)),
  }));

  const transferirItem = (origemId, itemId, destinoId) => {
    setMesas((prev) => {
      const origem = prev.filter((m) => m.id === origemId)[0];
      const item = origem.comanda.itens.filter((i) => i.id === itemId)[0];
      return prev.map((m) => {
        if (m.id === origemId) return Object.assign({}, m, { comanda: Object.assign({}, m.comanda, { itens: m.comanda.itens.filter((i) => i.id !== itemId) }) });
        if (m.id === destinoId) return Object.assign({}, m, { comanda: Object.assign({}, m.comanda, { itens: [...m.comanda.itens, item] }) });
        return m;
      });
    });
    const destino = mesas.filter((m) => m.id === destinoId)[0];
    setRota({ nome: 'mesa', mesaId: origemId });
    notificar('Item transferido para a mesa ' + destino.numero + '. A cozinha foi avisada.');
  };

  const cancelarItem = (mesaId, itemId, motivo) => {
    patchItem(mesaId, itemId, (i) => Object.assign({}, i, { status: 'cancelado', motivoCancelamento: motivo }));
    setRota({ nome: 'mesa', mesaId });
    notificar('Item cancelado (' + motivo.toLowerCase() + '). Aviso enviado à cozinha.');
  };

  const juntarMesas = (baseId, alvoId) => {
    const base = mesas.filter((m) => m.id === baseId)[0];
    const alvo = mesas.filter((m) => m.id === alvoId)[0];
    const grupoId = base.grupoId || 'g' + baseId;
    setMesas((prev) => prev.map((m) => ((m.id === baseId || m.id === alvoId) ? Object.assign({}, m, { grupoId }) : m)));
    notificar('Mesa ' + alvo.numero + ' juntada à mesa ' + base.numero + '.');
  };

  const separarMesa = (mesaId) => {
    const mesa = mesas.filter((m) => m.id === mesaId)[0];
    const restantes = mesas.filter((m) => m.grupoId === mesa.grupoId && m.id !== mesaId);
    setMesas((prev) => prev.map((m) => {
      if (m.id === mesaId) return Object.assign({}, m, { grupoId: null });
      if (restantes.length === 1 && m.id === restantes[0].id) return Object.assign({}, m, { grupoId: null });
      return m;
    }));
    notificar('Mesa ' + mesa.numero + ' separada do grupo.');
  };

  const fecharConta = (mesaId, subcontas, rotuloModo) => {
    const mesa = mesas.filter((m) => m.id === mesaId)[0];
    const jaEstava = mesa.status === 'em_pagamento';
    patchMesa(mesaId, { status: 'em_pagamento', comanda: Object.assign({}, mesa.comanda, comandaCobrada, { subcontas, divisaoModo: rotuloModo }) });
    setRota({ nome: 'mesa', mesaId });
    notificar(jaEstava ? 'Divisão atualizada.' : 'Conta dividida em ' + subcontas.length + ' pagamento(s).');
  };

  const aplicarDesconto = (mesaId, valor, motivo) => {
    patchMesa(mesaId, (m) => ({ comanda: Object.assign({}, m.comanda, { desconto: valor, descontoMotivo: motivo || 'Cortesia do gestor' }) }));
    notificar('Desconto de R$ ' + valor.toFixed(2) + ' aplicado pelo gestor.');
  };

  const registrarPagamento = (mesaId, idx, forma) => {
    patchMesa(mesaId, (m) => ({
      comanda: Object.assign({}, m.comanda, {
        subcontas: m.comanda.subcontas.map((sc, i) => (i === idx ? Object.assign({}, sc, { formaPagamento: forma, pago: true }) : sc)),
      }),
    }));
    notificar('Pagamento em ' + forma + ' registrado.');
  };

  const cancelarPagamento = (mesaId, motivo) => {
    patchMesa(mesaId, (m) => ({
      comanda: Object.assign({}, m.comanda, {
        subcontas: m.comanda.subcontas.map((sc) => Object.assign({}, sc, { formaPagamento: undefined, pago: false })),
      }),
    }));
    notificar('Pagamento cancelado (' + motivo.toLowerCase() + '). Formas de pagamento reiniciadas.');
  };

  const confirmarPagamentoGestor = (mesaId) => {
    const mesa = mesas.filter((m) => m.id === mesaId)[0];
    const todasPagas = mesa.comanda && mesa.comanda.subcontas && mesa.comanda.subcontas.every((sc) => sc.pago);
    if (!todasPagas) { notificar('Ainda há parte(s) sem forma de pagamento registrada.'); return; }
    patchMesa(mesaId, { status: 'pagamento_realizado' });
    notificar('Pagamento confirmado. Mesa liberada para limpeza.');
  };

  const mesaAtual = rota.mesaId ? mesas.filter((m) => m.id === rota.mesaId)[0] : null;
  const itemAtual = mesaAtual && rota.itemId && mesaAtual.comanda ? mesaAtual.comanda.itens.filter((i) => i.id === rota.itemId)[0] : null;
  const mesasDestino = mesas.filter((m) => isOcupada(m.status) && m.id !== (mesaAtual ? mesaAtual.id : null));
  const mesasGrupo = mesaAtual && mesaAtual.grupoId ? mesas.filter((m) => m.grupoId === mesaAtual.grupoId) : [];
  const mesasParaJuntar = mesaAtual ? mesas.filter((m) => isOcupada(m.status) && m.id !== mesaAtual.id && !m.grupoId) : [];

  return (
    <div style={rootStyle}>
      <FontStyles />

      {screen === 'landing' && <Landing onGarcom={() => setScreen('login')} onGestor={() => setScreen('gestor-login')} />}
      {screen === 'login' && <Login onEntrar={() => { setRota({ nome: 'mesas' }); setScreen('garcom'); }} onVoltar={() => setScreen('landing')} />}
      {screen === 'gestor-login' && <GestorLogin onEntrar={() => setScreen('gestor')} onVoltar={() => setScreen('landing')} />}
      {screen === 'gestor' && (
        <GestorApp
          mesas={mesas}
          onSair={() => setScreen('gestor-login')}
          onAplicarDesconto={aplicarDesconto}
          onRegistrarPagamento={registrarPagamento}
          onCancelarPagamento={cancelarPagamento}
          onConfirmarPagamento={confirmarPagamentoGestor}
          notificar={notificar}
        />
      )}

      {screen === 'garcom' && rota.nome === 'mesas' && (
        <MesasScreen mesas={mesas} praca={pracaAtiva} onMudarPraca={setPracaAtiva} onTapMesa={(m) => setRota({ nome: 'mesa', mesaId: m.id })} onSair={() => setScreen('login')} onAbrirTipo={abrirTipo} notificar={notificar} />
      )}

      {screen === 'garcom' && rota.nome === 'mesa' && mesaAtual && (
        <MesaScreen
          mesa={mesaAtual}
          mesasTodas={mesas}
          mesasGrupo={mesasGrupo}
          mesasParaJuntar={mesasParaJuntar}
          onVoltar={() => setRota({ nome: 'mesas' })}
          onAbrirMesa={abrirMesa}
          onAvancarStatus={avancarStatus}
          onCancelarReserva={cancelarReserva}
          onJuntar={juntarMesas}
          onSeparar={separarMesa}
          onDividirConta={(mesaId) => setRota({ nome: 'conta', mesaId })}
          onLancarPedido={lancarPedido}
          onAtenderChamado={atenderChamado}
          onAbrirItem={(mesaId, itemId) => setRota({ nome: 'item', mesaId, itemId })}
          onAtualizarRecursos={atualizarRecursos}
          onAtualizarPessoas={atualizarPessoas}
          onAbrirTipo={abrirTipo}
          notificar={notificar}
        />
      )}

      {screen === 'garcom' && rota.nome === 'item' && mesaAtual && itemAtual && (
        <ItemScreen
          mesa={mesaAtual}
          item={itemAtual}
          mesasDestino={mesasDestino}
          mesasTodas={mesas}
          onVoltar={() => setRota({ nome: 'mesa', mesaId: mesaAtual.id })}
          onAlterarQuantidade={alterarQuantidade}
          onToggleIngrediente={toggleIngrediente}
          onAlterarQtdIngrediente={alterarQtdIngrediente}
          onTransferir={transferirItem}
          onCancelar={cancelarItem}
          onAbrirTipo={abrirTipo}
          notificar={notificar}
        />
      )}

      {screen === 'garcom' && rota.nome === 'cardapio' && mesaAtual && (
        <CardapioScreen
          mesa={mesaAtual}
          mesasTodas={mesas}
          onVoltar={() => setRota({ nome: 'mesa', mesaId: mesaAtual.id })}
          onAdicionarItem={adicionarItemRascunho}
          onRemoverRascunho={removerRascunho}
          onEnviar={enviarPedido}
          onAbrirTipo={abrirTipo}
          notificar={notificar}
        />
      )}

      {screen === 'garcom' && rota.nome === 'conta' && mesaAtual && (
        <ContaScreen
          mesa={mesaAtual}
          mesasTodas={mesas}
          onVoltar={() => setRota({ nome: 'mesa', mesaId: mesaAtual.id })}
          onConfirmar={fecharConta}
          onAbrirTipo={abrirTipo}
          notificar={notificar}
        />
      )}

      {drawerTipo && (
        <NotificacoesDrawer
          tipo={drawerTipo}
          mesas={mesas}
          onFechar={() => setDrawerTipo(null)}
          onIrParaMesa={(id) => { setDrawerTipo(null); setRota({ nome: 'mesa', mesaId: id }); }}
          onAtenderChamado={atenderChamado}
        />
      )}

      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}
