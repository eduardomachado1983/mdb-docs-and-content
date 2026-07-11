import type { Patient } from '@/types'

function healthHistoryPositives(patient: Patient): string[] {
  const history = patient.triage?.health_history
  if (!history) return []
  return Object.entries(history)
    .filter(([, resposta]) => resposta?.toLowerCase() === 'sim')
    .map(([pergunta]) => pergunta)
}

export function buildReportIdeas(patient: Patient): string[] {
  const t = patient.triage
  const ideas: string[] = []
  if (t?.main_symptom) ideas.push(`Objetivo principal relatado na triagem: ${t.main_symptom}`)
  if (t?.pain_location) ideas.push(`Local da queixa: ${t.pain_location}`)
  if (t?.pain_intensity) ideas.push(`Intensidade referida: ${t.pain_intensity}/10`)
  if (t?.medical_history) ideas.push(`Histórico médico informado: ${t.medical_history}`)

  const positives = healthHistoryPositives(patient)
  if (positives.length > 0) ideas.push(`Condições de saúde relatadas: ${positives.join(', ')}`)

  if (t?.mental_health && t.mental_health.length > 0) {
    ideas.push(`Saúde mental: ${t.mental_health.join(', ')}`)
  }

  const fisico = [t?.height && `altura ${t.height}`, t?.weight && `peso ${t.weight}`].filter(Boolean).join(', ')
  if (fisico) ideas.push(`Dados físicos: ${fisico}`)
  if (t?.sex) ideas.push(`Sexo: ${t.sex}`)

  ideas.push('Complementar com exame clínico, hipótese diagnóstica (CID, se aplicável) e conduta.')
  return ideas
}

export function buildPrescriptionIdeas(patient: Patient): string[] {
  const t = patient.triage
  const ideas: string[] = []
  if (t?.main_symptom) ideas.push(`Considerar tratamento direcionado a: ${t.main_symptom}`)

  const positives = healthHistoryPositives(patient)
  if (positives.length > 0) {
    ideas.push(`Atenção às condições relatadas na triagem: ${positives.join(', ')} (avaliar possíveis interações)`)
  }
  if (t?.medical_history) ideas.push(`Histórico médico relevante: ${t.medical_history}`)

  ideas.push('Definir produto/concentração, via de administração, posologia e duração do tratamento.')
  return ideas
}
