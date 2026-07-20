import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/shared/admin-header'
import { WhatsAppReplyForm } from '@/components/shared/whatsapp-reply-form'
import { cn, formatDateTimeBR, initials, samePhoneNumber } from '@/lib/utils'
import type { Patient } from '@/types'

export default async function AdminWhatsAppConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile()
  const supabase = await createServiceClient()

  const { data: conversation } = await supabase.from('whatsapp_conversations').select('*').eq('id', id).maybeSingle()
  if (!conversation) notFound()

  const { data: messages } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  const { data: patients } = await supabase.from('patients').select('id, personal_data').returns<Pick<Patient, 'id' | 'personal_data'>[]>()
  const matchedPatient = patients?.find((p) => p.personal_data?.phone && samePhoneNumber(p.personal_data.phone, conversation.phone))

  return (
    <div className="min-h-screen">
      <AdminHeader adminName={profile?.name ?? 'Administrador'} />

      <main className="mx-auto grid max-w-[760px] gap-5 px-6 py-8">
        <Link href="/admin/whatsapp" className="flex w-fit items-center gap-1.5 text-sm font-bold text-navy-500 hover:text-navy-700">
          ← Voltar às conversas
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
              {initials(conversation.contact_name || conversation.phone)}
            </div>
            <div>
              <div className="text-[15px] font-bold text-navy-800">{conversation.contact_name || 'Contato do WhatsApp'}</div>
              <div className="text-[13px] text-navy-200">{conversation.phone}</div>
            </div>
          </div>
          {matchedPatient && (
            <Link
              href={`/admin/validacao/${matchedPatient.id}`}
              className="rounded-[8px] border border-admin-200 px-4 py-2 text-sm font-bold text-admin-500 hover:bg-admin-50"
            >
              Ver cadastro do paciente
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-line-100 bg-surface-subtle p-4">
          {(!messages || messages.length === 0) && (
            <p className="py-6 text-center text-sm text-navy-200">Nenhuma mensagem ainda.</p>
          )}
          {messages?.map((m) => (
            <div
              key={m.id}
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm',
                m.direction === 'inbound' ? 'self-start bg-white text-navy-700' : 'self-end bg-admin-500 text-white'
              )}
            >
              {m.content}
              <div className={cn('mt-1 text-[11px]', m.direction === 'inbound' ? 'text-navy-200' : 'text-white/70')}>
                {formatDateTimeBR(m.created_at)}
              </div>
            </div>
          ))}
        </div>

        <WhatsAppReplyForm conversationId={conversation.id} />
      </main>
    </div>
  )
}
