const RESEND_API_URL = 'https://api.resend.com/emails'

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return null
  return { apiKey, from }
}

export function isEmailConfigured(): boolean {
  return Boolean(getConfig())
}

// Envia um e-mail via Resend. Sem credenciais configuradas, roda em modo
// simulado — mesmo padrão do WhatsApp Cloud API e do Mercado Pago sem token.
export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<{ simulated: boolean }> {
  const config = getConfig()
  if (!config) {
    return { simulated: true }
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Falha ao enviar e-mail')
  }

  return { simulated: false }
}
