export type ValidationState = 'aguardando_documento' | 'aguardando_pagamento' | 'aguardando_receita' | 'liberado'

// Ordem segue a jornada do paciente: documentos → pagamento → prontuário do médico.
export function computeValidationState({
  docsComplete,
  paymentConfirmed,
  clinicalPresent,
}: {
  docsComplete: boolean
  paymentConfirmed: boolean
  clinicalPresent: boolean
}): ValidationState {
  if (!docsComplete) return 'aguardando_documento'
  if (!paymentConfirmed) return 'aguardando_pagamento'
  if (!clinicalPresent) return 'aguardando_receita'
  return 'liberado'
}

export const VALIDATION_STATE_LABEL: Record<ValidationState, string> = {
  aguardando_documento: 'Aguardando documento',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_receita: 'Aguardando Receita',
  liberado: 'Liberado',
}

export const VALIDATION_STATE_VARIANT: Record<ValidationState, 'amber' | 'teal'> = {
  aguardando_documento: 'amber',
  aguardando_pagamento: 'amber',
  aguardando_receita: 'amber',
  liberado: 'teal',
}
