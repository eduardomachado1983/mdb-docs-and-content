// Tipos mínimos do SDK client-side MercadoPago.js v2 (window.MercadoPago)
// https://sdk.mercadopago.com/js/v2

interface MercadoPagoCardTokenParams {
  cardNumber: string
  cardholderName: string
  cardExpirationMonth: string
  cardExpirationYear: string
  securityCode: string
  identificationType: string
  identificationNumber: string
}

interface MercadoPagoCardToken {
  id: string
}

interface MercadoPagoPaymentMethod {
  id: string
  payment_type_id: 'credit_card' | 'debit_card'
  issuer?: { id: string | number; name: string }
}

interface MercadoPagoInstance {
  createCardToken(params: MercadoPagoCardTokenParams): Promise<MercadoPagoCardToken>
  getPaymentMethods(params: { bin: string }): Promise<{ results: MercadoPagoPaymentMethod[] }>
}

interface Window {
  MercadoPago?: new (publicKey: string, options?: { locale?: string }) => MercadoPagoInstance
}
