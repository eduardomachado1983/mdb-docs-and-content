export const ASSISTANT_QUESTIONS = [
  'Olá! Sou o assistente de triagem da Sua Logo. Qual é o seu principal sintoma hoje?',
  'Há quanto tempo você está com esse sintoma?',
  'Em uma escala de 0 a 10, qual é a intensidade?',
  'Onde você sente o desconforto?',
  'Você tem outros sintomas associados?',
  'Tem alguma alergia ou usa medicamento contínuo?',
] as const

export function buildSummary(answers: string[]) {
  const [symptom, duration, intensity, location, associated, history] = answers
  return (
    '📋 RESUMO PARA O MÉDICO:\n' +
    `• Sintoma principal: ${symptom}\n` +
    `• Duração: ${duration}\n` +
    `• Intensidade: ${intensity}/10\n` +
    `• Localização: ${location}\n` +
    `• Sintomas associados: ${associated}\n` +
    `• Histórico/alergias: ${history}`
  )
}
