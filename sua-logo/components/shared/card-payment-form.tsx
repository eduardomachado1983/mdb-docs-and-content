'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
const SUBMIT_TIMEOUT_MS = 20_000

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), SUBMIT_TIMEOUT_MS)),
  ])
}

export function CardPaymentForm({ cpf }: { cpf: string }) {
  const router = useRouter()
  const [sdkReady, setSdkReady] = useState(false)
  const [sdkFailed, setSdkFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    number: '', name: '', month: '', year: '', cvv: '',
  })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!PUBLIC_KEY) {
      toast.error('Pagamento com cartão não configurado (public key ausente).')
      return
    }
    if (!sdkReady || !window.MercadoPago) {
      toast.error('Aguarde o carregamento do formulário de pagamento.')
      return
    }
    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length !== 11) {
      toast.error('CPF inválido no cadastro. Atualize seus dados pessoais antes de pagar.')
      return
    }

    setLoading(true)
    try {
      const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' })
      const cardNumber = form.number.replace(/\s/g, '')
      const bin = cardNumber.slice(0, 6)

      const { results } = await withTimeout(
        mp.getPaymentMethods({ bin }),
        'Tempo esgotado ao identificar a bandeira do cartão. Verifique sua conexão e tente novamente.'
      )
      const method = results.find((r) => r.payment_type_id === 'credit_card')
      if (!method) {
        const detected = results[0]
        toast.error(
          detected?.payment_type_id === 'debit_card'
            ? 'Este cartão foi identificado como cartão de débito, não crédito. Tente outro cartão.'
            : 'Não foi possível identificar este cartão para pagamento de crédito. Tente outro cartão.'
        )
        return
      }

      const token = await withTimeout(
        mp.createCardToken({
          cardNumber,
          cardholderName: form.name,
          cardExpirationMonth: form.month,
          cardExpirationYear: form.year,
          securityCode: form.cvv,
          identificationType: 'CPF',
          identificationNumber: cleanCpf,
        }),
        'Tempo esgotado ao validar o cartão. Verifique os dados e tente novamente.'
      )

      const res = await withTimeout(
        fetch('/api/payments/card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: token.id,
            paymentMethodId: method.id,
            issuerId: method.issuer?.id !== undefined ? String(method.issuer.id) : undefined,
          }),
        }),
        'Tempo esgotado ao processar o pagamento. Tente novamente em instantes.'
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao processar pagamento')
        return
      }

      if (data.approved) {
        toast.success('Pagamento aprovado!')
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error('Pagamento não aprovado. Tente outro cartão.')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao processar cartão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => setSdkReady(true)}
        onError={() => setSdkFailed(true)}
      />
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="cardNumber">Número do cartão</Label>
          <Input
            id="cardNumber" inputMode="numeric" placeholder="0000 0000 0000 0000" required
            value={form.number} onChange={(e) => update('number', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cardName">Nome no cartão</Label>
          <Input
            id="cardName" placeholder="Como está impresso no cartão" required
            value={form.name} onChange={(e) => update('name', e.target.value.toUpperCase())}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="cardMonth">Mês</Label>
            <Input id="cardMonth" placeholder="MM" maxLength={2} required value={form.month} onChange={(e) => update('month', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cardYear">Ano</Label>
            <Input id="cardYear" placeholder="AAAA" maxLength={4} required value={form.year} onChange={(e) => update('year', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cardCvv">CVV</Label>
            <Input id="cardCvv" placeholder="123" maxLength={4} required value={form.cvv} onChange={(e) => update('cvv', e.target.value)} />
          </div>
        </div>
        {sdkFailed && (
          <p className="text-xs text-red-600">
            Não foi possível carregar o formulário de pagamento. Recarregue a página e tente novamente.
          </p>
        )}
        <Button type="submit" disabled={loading || !sdkReady || sdkFailed} className="mt-1">
          {loading ? 'Processando...' : !sdkReady ? 'Carregando...' : `💳 Pagar R$ 2,00`}
        </Button>
      </form>
    </>
  )
}
