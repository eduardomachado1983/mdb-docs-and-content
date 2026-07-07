// Extrai a mensagem de erro real do SDK do Mercado Pago.
// O SDK lança um erro cujo detalhe útil pode estar em vários lugares:
//   - error.message           (mensagem genérica)
//   - error.cause[].description (motivo real da recusa da API)
//   - error.status            (código HTTP)
// Sem isso, o usuário só via "Falha ao gerar pagamento" e não dava
// para saber o que o Mercado Pago realmente recusou.

interface MpCause {
  code?: string | number
  description?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function extractMpError(error: unknown): string {
  if (!isRecord(error)) {
    return typeof error === 'string' ? error : 'Falha ao gerar pagamento'
  }

  // O SDK expõe as causas específicas da API do Mercado Pago em `cause`.
  const rawCause = error.cause
  const causes: MpCause[] = Array.isArray(rawCause)
    ? (rawCause as MpCause[])
    : isRecord(rawCause)
      ? [rawCause as MpCause]
      : []

  const causeMessage = causes
    .map((c) => c?.description)
    .filter((d): d is string => typeof d === 'string' && d.length > 0)
    .join(' — ')

  if (causeMessage) {
    return `Mercado Pago: ${causeMessage}`
  }

  const status = typeof error.status === 'number' ? error.status : undefined
  const message = typeof error.message === 'string' ? error.message : undefined

  if (message && message !== '[object Object]') {
    return status ? `Mercado Pago (${status}): ${message}` : `Mercado Pago: ${message}`
  }

  if (status) {
    return `Mercado Pago retornou erro ${status}. Verifique os dados de pagamento e tente novamente.`
  }

  return 'Falha ao gerar pagamento'
}
