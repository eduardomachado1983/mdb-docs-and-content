'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { FAQS, SUPPORT_EMAIL } from '@/lib/faq'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const GREETING =
  'Olá! Sou o assistente de ajuda da Sua Logo. Escolha um assunto abaixo ou ' +
  'digite sua dúvida que eu tento te ajudar. 💬'

const FALLBACK =
  'Não encontrei uma resposta pronta para isso. Nossa equipe pode te ajudar pelo ' +
  `e-mail ${SUPPORT_EMAIL} (atendimento 24h).`

// Casa o texto digitado com a FAQ mais provável pelas palavras-chave.
function findAnswer(text: string): string {
  const normalized = text.toLowerCase()
  let best: { score: number; answer: string } | null = null
  for (const faq of FAQS) {
    const score = faq.keywords.reduce((acc, k) => (normalized.includes(k) ? acc + 1 : acc), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, answer: faq.a }
  }
  return best?.answer ?? FALLBACK
}

export function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', content: GREETING }])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Rola só a caixa de mensagens (não a página) para a última mensagem.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  function ask(question: string, answer: string) {
    setMessages((prev) => [...prev, { role: 'user', content: question }, { role: 'bot', content: answer }])
  }

  function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    ask(text, findAnswer(text))
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={listRef} className="flex h-[46vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-line-100 bg-surface-subtle p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm',
              m.role === 'bot'
                ? 'self-start bg-surface-muted text-navy-700'
                : 'self-end bg-brand-500 text-primary-on'
            )}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FAQS.map((faq) => (
          <button
            key={faq.q}
            type="button"
            onClick={() => ask(faq.q, faq.a)}
            className="min-h-[44px] rounded-[4px] border border-line-300 px-3.5 py-1.5 text-xs font-bold text-navy-600 transition hover:border-brand-300 active:scale-[0.97] sm:min-h-0"
          >
            {faq.q}
          </button>
        ))}
      </div>

      <form className="flex gap-2" onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua dúvida..."
          className="min-h-[44px] w-full rounded-full border border-line-400 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          className="min-h-[44px] shrink-0 rounded-[4px] bg-brand-500 px-5 py-2.5 text-sm font-bold text-primary-on transition active:scale-[0.97]"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
