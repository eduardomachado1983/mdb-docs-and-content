import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, getUser } from '@/lib/supabase/server'
import { ASSISTANT_QUESTIONS, buildSummary } from '@/lib/assistant'

async function getPatient(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from('patients').select('id, personal_data, status').eq('user_id', userId).single()
  return data
}

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const supabase = await createClient()
  const patient = await getPatient(supabase, user.id)
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { data: messages } = await supabase
    .from('chat_history').select('*').eq('patient_id', patient.id).order('created_at', { ascending: true })

  if (!messages || messages.length === 0) {
    return NextResponse.json({ messages: [{ role: 'assistant', content: ASSISTANT_QUESTIONS[0] }] })
  }
  return NextResponse.json({ messages })
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

  const { data: history } = await supabase
    .from('chat_history').select('*').eq('patient_id', patient.id).order('created_at', { ascending: true })

  const userAnswers = (history ?? []).filter((m) => m.role === 'user').map((m) => m.content)
  const nextIndex = userAnswers.length
  const isLastQuestion = nextIndex === ASSISTANT_QUESTIONS.length - 1

  await supabase.from('chat_history').insert({
    patient_id: patient.id,
    role: 'user',
    content: parsed.data.content,
  })

  const allAnswers = [...userAnswers, parsed.data.content]
  let assistantReply: string

  if (isLastQuestion) {
    assistantReply = buildSummary(allAnswers)
    await supabase.from('chat_history').insert({ patient_id: patient.id, role: 'assistant', content: assistantReply })

    const personalData = (patient.personal_data ?? {}) as Record<string, unknown>
    const nextStatus = personalData.full_name ? 'aguardando_pagamento' : patient.status

    await supabase.from('patients').update({
      triage: {
        main_symptom: allAnswers[0],
        pain_location: allAnswers[3],
        pain_intensity: Number(allAnswers[2]) || 0,
        medical_history: allAnswers[5],
      },
      status: nextStatus,
    }).eq('id', patient.id)
  } else {
    assistantReply = ASSISTANT_QUESTIONS[nextIndex + 1]
    await supabase.from('chat_history').insert({ patient_id: patient.id, role: 'assistant', content: assistantReply })
  }

  return NextResponse.json({ reply: assistantReply, done: isLastQuestion })
}
