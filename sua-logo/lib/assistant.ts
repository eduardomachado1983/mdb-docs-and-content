// Roteiro da consulta com a assistente virtual (chatbot).
// A saudação leva o nome do médico; as demais perguntas seguem em ordem fixa.

export function buildGreeting(doctorName: string) {
  return (
    `E aí! Eu sou ${doctorName}, sua assistente especializada em cannabis medicinal.\n` +
    'Estou aqui para ajudar na triagem inicial e organizar as informações que você precisa.\n' +
    'Lembre-se, a decisão final sempre será do seu médico.\n' +
    'Vamos juntos nessa!\n\n' +
    'Como posso te ajudar hoje?'
  )
}

export const ASSISTANT_QUESTIONS = [
  'Como é que a dor ou outras condições têm afetado seu dia a dia? Me conta!',
  'Entendi! Como você se sente no geral sem a presença da dor? Há outras questões que te incomodam no dia a dia?',
  'Oi! Me conta há quanto tempo você tem lidado com essa condição?',
  'Entendi, você convive com isso há bastante tempo. Como você diria que a intensidade ou a frequência das suas dores mudou nos últimos meses?',
  'Como você tem se sentido em relação à sua saúde mental ultimamente? Me conta um pouquinho!',
  'Entendi! Você tem algum tratamento atual ou já tentou algo específico para sua saúde mental?',
  'Oi! Me conta, você está fazendo algum tratamento médico atualmente?',
  'Entendi. O que impede você de buscar uma abordagem terapêutica neste momento?',
  'E aí, já teve a oportunidade de experimentar a cannabis antes? Me conta como foi!',
  'Entendi. Como foi essa experiência para você?',
  'E aí, já pensou em que tipo de produto de cannabis gostaria de experimentar? Flores, óleos ou gomas?',
  'Entendi! O que te atrai mais nessa opção em comparação às outras?',
] as const

// Quantidade total de respostas esperadas: saudação + perguntas.
export const TOTAL_ANSWERS = ASSISTANT_QUESTIONS.length + 1

const SUMMARY_LABELS = [
  'Como podemos ajudar',
  'Impacto no dia a dia',
  'Bem-estar geral e outras queixas',
  'Tempo de convivência com a condição',
  'Evolução da intensidade/frequência',
  'Saúde mental',
  'Tratamentos para saúde mental',
  'Tratamento médico atual',
  'Barreiras para o tratamento',
  'Experiência prévia com cannabis',
  'Como foi a experiência',
  'Produto de preferência',
  'Motivo da preferência',
] as const

export function buildSummary(answers: string[]) {
  const lines = SUMMARY_LABELS.map((label, i) => `• ${label}: ${answers[i] ?? '—'}`)
  return (
    '📋 RESUMO PARA O MÉDICO:\n' +
    lines.join('\n') +
    '\n\nObrigada por compartilhar! Suas respostas já foram enviadas ao médico, ' +
    'que vai analisar seu caso e liberar sua receita e laudo em breve.'
  )
}
