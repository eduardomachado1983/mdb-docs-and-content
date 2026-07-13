'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function WhatsAppReplyForm({ conversationId }: { conversationId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/whatsapp/${conversationId}`, { method: 'PATCH' })
  }, [conversationId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/whatsapp/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao enviar mensagem')
        return
      }
      setContent('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex items-end gap-2.5" onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite sua resposta..."
        className="min-h-[44px] flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      <Button type="submit" variant="admin" disabled={loading || !content.trim()}>
        {loading ? 'Enviando...' : 'Enviar'}
      </Button>
    </form>
  )
}
