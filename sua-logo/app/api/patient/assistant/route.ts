import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, getUser } from '@/lib/supabase/server'
import { ASSISTANT_QUESTIONS, TOTAL_ANSWERS, buildGreeting, buildSummary } from '@/lib/assistant'

// A consulta só libera depois de documentos enviados e pagamento confirmado
// (status aguardando_medico em diante).
const ALLOWED_STATUS = ['aguardando_medico', 'retido_admin', 'concluido']

async function getPatient(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from('patients').select('id, status').eq('user_id', userId).single()
  return data
}

async function getDoctorName(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('profiles').select('name').eq('role', 'doctor').limit(1).maybeSingle()
  return data?.name ?? 'Dra. Helena Vasconcelos'
}

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const supabase = await createClient()
  const patient = await getPatient(supabase, user.id)
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  if (!ALLOWED_STATUS.includes(patient.status)) {
    return NextResponse.json(
      { error: 'A consulta é liberada após o envio dos documentos e a confirmação do pagamento.' },
      { status: 403 }
    )
  }

  const { data: messages } = await supabase
    .from('chat_history').select('*').eq('patient_id', patient.id).order('created_at', { ascending: true })

  if (!messages || messages.length === 0) {
    const doctorName = await getDoctorName(supabase)
    return NextResponse.json({ messages: [{ role: 'assistant', content: buildGreeting(doctorName) }], done: false })
  }

  const answered = messages.filter((m) => m.role === 'user').length
  return NextResponse.json({ messages, done: answered >= TOTAL_ANSWERS })
}

const schema = z.object({ content: z.string().min(1) })

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })

  const supabase = await createClient()
  const patient = await getPatient(supabase, user.id)
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  if (patient.status !== 'aguardando_medico') {
    return NextResponse.json(
      { error: 'A consulta é liberada após o envio dos documentos e a confirmação do pagamento.' },
      { status: 403 }
    )
  }

  const { data: history } = await supabase
    .from('chat_history').select('*').eq('patient_id', patient.id).order('created_at', { ascending: true })

  const userAnswers = (history ?? []).filter((m) => m.role === 'user').map((m) => m.content)
  if (userAnswers.length >= TOTAL_ANSWERS) {
    return NextResponse.json({ error: 'A consulta já foi concluída.' }, { status: 400 })
  }

  await supabase.from('chat_history').insert({
    patient_id: patient.id,
    role: 'user',
    content: parsed.data.content,
  })

  const allAnswers = [...userAnswers, parsed.data.content]
  const done = allAnswers.length >= TOTAL_ANSWERS
  const assistantReply = done ? buildSummary(allAnswers) : ASSISTANT_QUESTIONS[allAnswers.length - 1]

  await supabase.from('chat_history').insert({ patient_id: patient.id, role: 'assistant', content: assistantReply })

  return NextResponse.json({ reply: assistantReply, done })
}
