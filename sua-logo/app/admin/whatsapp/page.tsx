import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { Badge } from '@/components/ui/badge'
import { RefreshButton } from '@/components/shared/refresh-button'
import { formatDateTimeBR, initials } from '@/lib/utils'

export default async function AdminWhatsAppPage() {
  const profile = await getProfile()
  const supabase = await createServiceClient()

  const { data: conversations } = await supabase
    .from('whatsapp_conversations')
    .select('*')
    .order('last_message_at', { ascending: false })

  const conversationIds = conversations?.map((c) => c.id) ?? []
  const lastMessageByConversation = new Map<string, string>()
  if (conversationIds.length > 0) {
    const { data: messages } = await supabase
      .from('whatsapp_messages')
      .select('conversation_id, content, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false })
    messages?.forEach((m) => {
      if (!lastMessageByConversation.has(m.conversation_id)) lastMessageByConversation.set(m.conversation_id, m.content)
    })
  }

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <div className="mx-auto grid max-w-[1140px] px-6 py-7">
        <h1 className="mb-1 text-2xl font-extrabold">Painel do administrador</h1>
        <p className="mb-5 text-[15px] text-navy-300">Conversas do WhatsApp</p>

        {!conversations?.length && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-100 text-admin-500">
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-base font-bold text-navy-800">Nenhuma conversa ainda</div>
            <p className="max-w-sm text-sm text-navy-300">
              Assim que um paciente enviar uma mensagem pelo WhatsApp, a conversa aparece aqui.
            </p>
            <RefreshButton label="Atualizar conversas" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {conversations?.map((c) => (
            <Link
              key={c.id}
              href={`/admin/whatsapp/${c.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-4 hover:border-admin-200"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
                  {initials(c.contact_name || c.phone)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-bold text-navy-800">{c.contact_name || c.phone}</span>
                    {c.unread_count > 0 && (
                      <Badge className="bg-admin-500 text-white">{c.unread_count}</Badge>
                    )}
                  </div>
                  <p className="truncate text-sm text-navy-300">{lastMessageByConversation.get(c.id) ?? '—'}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-navy-200">{formatDateTimeBR(c.last_message_at)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
