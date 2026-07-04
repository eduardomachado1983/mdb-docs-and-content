import { MercadoPagoConfig, Payment } from 'mercadopago'
import crypto from 'crypto'

const AMOUNT = parseInt(process.env.CONSULTATION_AMOUNT || '200')
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

function getClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado')
  return new MercadoPagoConfig({ accessToken: token })
}

// ── PIX ─────────────────────────────────────────────────────────────

export async function createPixPayment(params: {
  patientId: string
  name: string
  email: string
  cpf: string
}) {
  const referenceId = `SUALOGO-${params.patientId}-${Date.now()}`

  // Modo simulado (sem token)
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return {
      id: `PIX-SIM-${Date.now()}`,
      referenceId,
      qrCode: '00020126580014br.gov.bcb.pix0136simulado-para-desenvolvimento-local-telemedicina',
      qrCodeBase64: null,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      simulated: true,
    }
  }

  const client = getClient()
  const payment = new Payment(client)

  const result = await payment.create({
    body: {
      transaction_amount: AMOUNT / 100,
      description: 'Consulta médica online — Sua Logo Telemedicina',
      payment_method_id: 'pix',
      payer: {
        email: params.email,
        first_name: params.name.split(' ')[0],
        last_name: params.name.split(' ').slice(1).join(' ') || params.name,
        identification: {
          type: 'CPF',
          number: params.cpf.replace(/\D/g, ''),
        },
      },
      notification_url: `${SITE_URL}/api/payments/webhook`,
      external_reference: referenceId,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    requestOptions: {
      idempotencyKey: referenceId,
    },
  })

  const txData = result.point_of_interaction?.transaction_data

  return {
    id: String(result.id),
    referenceId,
    qrCode: txData?.qr_code || null,
    qrCodeBase64: txData?.qr_code_base64 || null,
    expiresAt: result.date_of_expiration || null,
    simulated: false,
  }
}

// ── CARTÃO ──────────────────────────────────────────────────────────

const CARD_BRAND_MAP: Record<string, string> = {
  '4': 'visa',
  '5': 'master',
  '3': 'amex',
  '6': 'elo',
}

const ERROR_MESSAGES: Record<string, string> = {
  cc_rejected_insufficient_amount: 'Saldo insuficiente no cartão.',
  cc_rejected_bad_filled_security_code: 'CVV incorreto.',
  cc_rejected_bad_filled_date: 'Data de validade incorreta.',
  cc_rejected_bad_filled_card_number: 'Número do cartão inválido.',
  cc_rejected_call_for_authorize: 'Entre em contato com seu banco para autorizar.',
  cc_rejected_card_disabled: 'Cartão desabilitado. Entre em contato com o banco.',
  cc_rejected_duplicated_payment: 'Pagamento duplicado detectado.',
}

export async function createCardPayment(params: {
  patientId: string
  name: string
  email: string
  cpf: string
  card: {
    number: string
    holderName: string
    expiryMonth: string
    expiryYear: string
    cvv: string
  }
  cardType: 'credit' | 'debit'
}) {
  const referenceId = `SUALOGO-${params.patientId}-${Date.now()}`

  // Modo simulado
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return {
      success: true,
      referenceId,
      status: 'approved',
      simulated: true,
    }
  }

  const client = getClient()
  const payment = new Payment(client)

  // Detectar bandeira pelo primeiro dígito
  const firstDigit = params.card.number.replace(/\s/g, '')[0]
  const paymentMethodId = CARD_BRAND_MAP[firstDigit] || 'visa'

  const result = await payment.create({
    body: {
      transaction_amount: AMOUNT / 100,
      description: 'Consulta médica online — Sua Logo Telemedicina',
      installments: 1,
      payment_method_id: params.cardType === 'debit'
        ? `${paymentMethodId}_debit`
        : paymentMethodId,
      token: params.card.number.replace(/\s/g, ''), // Em produção: tokenizar via MP.js
      payer: {
        email: params.email,
        identification: {
          type: 'CPF',
          number: params.cpf.replace(/\D/g, ''),
        },
      },
      notification_url: `${SITE_URL}/api/payments/webhook`,
      external_reference: referenceId,
    },
    requestOptions: { idempotencyKey: referenceId },
  })

  if (result.status === 'rejected') {
    const detail = result.status_detail || ''
    const message = ERROR_MESSAGES[detail] || 'Cartão recusado. Tente outro cartão.'
    throw new Error(message)
  }

  return {
    success: true,
    referenceId,
    status: result.status,
    simulated: false,
  }
}

// ── WEBHOOK ─────────────────────────────────────────────────────────

export function validateWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string,
  ts: string
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return true // modo dev sem validação

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  const parts = xSignature.split(',')
  const v1Part = parts.find(p => p.startsWith('v1='))
  if (!v1Part) return false

  const receivedHash = v1Part.replace('v1=', '')
  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, 'hex'),
    Buffer.from(receivedHash, 'hex')
  )
}

export async function getPaymentById(paymentId: string) {
  const client = getClient()
  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}
