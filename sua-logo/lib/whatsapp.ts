import crypto from 'crypto'

const API_VERSION = 'v21.0'

interface IncomingMessage {
  phone: string
  content: string
  waMessageId: string
  contactName: string | null
}

function getConfig() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) return null
  return { token, phoneNumberId }
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(getConfig())
}

// Envia uma mensagem de texto via WhatsApp Cloud API (Meta).
// Sem credenciais configuradas, roda em modo simulado — útil para o
// ambiente de demonstração, sem custo nem número de WhatsApp real.
export async function sendWhatsAppMessage(to: string, text: string): Promise<{ waMessageId: string | null; simulated: boolean }> {
  const config = getConfig()
  if (!config) {
    return { waMessageId: null, simulated: true }
  }

  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${config.phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message ?? 'Falha ao enviar mensagem no WhatsApp')
  }

  return { waMessageId: data.messages?.[0]?.id ?? null, simulated: false }
}

// Verificação do handshake de assinatura do webhook (GET hub.challenge).
export function verifyWebhookToken(token: string | null): boolean {
  const expected = process.env.WHATSAPP_VERIFY_TOKEN
  if (!expected) return false
  return token === expected
}

// Verifica a assinatura HMAC do corpo do webhook (X-Hub-Signature-256).
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) return true // modo dev sem validação

  if (!signature) return false
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

// Extrai as mensagens de texto recebidas do payload bruto do webhook do
// WhatsApp Cloud API (pode conter múltiplas entradas/mudanças/mensagens).
export function parseIncomingMessages(body: unknown): IncomingMessage[] {
  const messages: IncomingMessage[] = []
  const entries = isRecord(body) && Array.isArray(body.entry) ? body.entry : []

  for (const entry of entries) {
    const changes = isRecord(entry) && Array.isArray(entry.changes) ? entry.changes : []
    for (const change of changes) {
      const value = isRecord(change) ? change.value : null
      if (!isRecord(value)) continue

      const contacts = Array.isArray(value.contacts) ? value.contacts : []
      const firstContact = isRecord(contacts[0]) ? contacts[0] : null
      const profile = firstContact && isRecord(firstContact.profile) ? firstContact.profile : null
      const contactName = profile && typeof profile.name === 'string' ? profile.name : null

      const rawMessages = Array.isArray(value.messages) ? value.messages : []

      for (const message of rawMessages) {
        if (!isRecord(message) || message.type !== 'text') continue
        const text = isRecord(message.text) ? message.text : null
        const content = text && typeof text.body === 'string' ? text.body : null
        if (typeof message.from !== 'string' || typeof message.id !== 'string' || content === null) continue
        messages.push({ phone: message.from, content, waMessageId: message.id, contactName })
      }
    }
  }

  return messages
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
