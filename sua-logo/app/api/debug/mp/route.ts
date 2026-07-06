import { NextResponse } from 'next/server'

// Diagnóstico temporário: confirma se as variáveis do Mercado Pago
// chegaram ao runtime, sem expor os valores. Remover depois de validar.
export async function GET() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? ''

  return NextResponse.json({
    tokenConfigured: token.length > 0,
    tokenPrefix: token.slice(0, 8),
    tokenLength: token.length,
    publicKeyConfigured: publicKey.length > 0,
    publicKeyPrefix: publicKey.slice(0, 8),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  })
}
