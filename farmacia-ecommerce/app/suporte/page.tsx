'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/shared/app-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message { from: 'bot' | 'user'; text: string }

function reply(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('receita') || t.includes('laudo')) return 'Para enviar documentos, acesse Documentos ou o carrinho ao finalizar a compra.'
  if (t.includes('pedido') || t.includes('status')) return 'Acompanhe todos os pedidos em Meus Pedidos com histórico completo e rastreio.'
  if (t.includes('pix') || t.includes('pagamento')) return 'Aceitamos exclusivamente PIX. A chave é enviada por e-mail após confirmar o pedido.'
  if (t.includes('prazo') || t.includes('entrega')) return '3 a 7 dias úteis após aprovação dos documentos.'
  return 'Recebemos sua mensagem! Nossa equipe entrará em contato.'
}

export default function SuportePage() {
  const [msgs, setMsgs] = useState<Message[]>([{ from: 'bot', text: 'Olá! Sou o suporte da PharmaCRM. Como posso ajudar?' }])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg: Message = { from: 'user', text: input }
    const text = input
    setInput('')
    setMsgs((prev) => [...prev, userMsg])
    setTimeout(() => setMsgs((prev) => [...prev, { from: 'bot', text: reply(text) }]), 700)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AppHeader />
      <main className="mx-auto w-full max-w-[540px] flex-1 overflow-auto p-[18px]">
        <h2 className="mb-3.5 text-lg font-black text-navy-800">💬 Suporte</h2>
        <div className="mb-3.5 grid grid-cols-2 gap-2.5">
          <Card className="p-3">
            <div className="mb-1.5 text-xl">📧</div>
            <div className="text-[10px] font-bold uppercase text-navy-100">E-mail</div>
            <div className="text-[12px] font-bold text-navy-800">suporte@pharmacrm.com</div>
          </Card>
          <Card className="p-3">
            <div className="mb-1.5 text-xl">📱</div>
            <div className="text-[10px] font-bold uppercase text-navy-100">WhatsApp</div>
            <div className="text-[12px] font-bold text-navy-800">(11) 99999-0000</div>
          </Card>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="bg-brand-500 px-4 py-3 text-white">
            <div className="text-[13px] font-extrabold">💬 Chat de Suporte</div>
            <div className="text-[10px] opacity-70">Atendimento automático + equipe humana</div>
          </div>
          <div className="flex h-56 flex-col gap-2 overflow-auto bg-surface-page p-3.5">
            {msgs.map((m, i) => (
              <div key={i} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-[10px] border border-line-200 px-2.5 py-2 text-[12px] leading-5',
                    m.from === 'user' ? 'rounded-br-[2px] bg-brand-500 text-white' : 'rounded-bl-[2px] bg-white text-navy-800'
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 border-t border-line-200 p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-lg border border-line-400 px-2.5 py-2 text-[12px] outline-none focus:border-brand-500"
            />
            <Button size="sm" onClick={send}>Enviar</Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
