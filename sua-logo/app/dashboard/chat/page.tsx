'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/patient/assistant')
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || done) return
    const content = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content }])
    setLoading(true)
    try {
      const res = await fetch('/api/patient/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao enviar mensagem')
        return
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      if (data.done) setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 px-6 py-8">
      <h1 className="text-lg font-semibold">Assistente de triagem</h1>
      <Card className="flex-1">
        <CardContent className="flex h-[60vh] flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'assistant'
                  ? 'self-start bg-surface-muted text-navy-700'
                  : 'self-end bg-brand-500 text-white'
              )}
            >
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      {done ? (
        <Button onClick={() => router.push('/dashboard')}>Voltar ao painel</Button>
      ) : (
        <form className="flex gap-2" onSubmit={send}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua resposta..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>Enviar</Button>
        </form>
      )}
    </main>
  )
}
