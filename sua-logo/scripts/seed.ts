/**
 * Seed — Dados de demonstração
 * Execute: pnpm seed
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DEMO_USERS = [
  {
    email: 'contato@em.art.br',
    password: 'A1234567',
    name: 'Eduardo Machado',
    role: 'patient',
  },
  {
    email: 'medico@sualogo.com.br',
    password: 'medico123',
    name: 'Dra. Helena Vasconcelos',
    role: 'doctor',
    crm: 'CRM/SC 34344',
    specialty: 'Clínica Geral',
  },
  {
    email: 'admin@sualogo.com.br',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
  },
]

async function seed() {
  console.log('🌱 Criando usuários demo...\n')

  for (const user of DEMO_USERS) {
    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name, role: user.role },
    })

    if (error) {
      console.error(`❌ ${user.email}:`, error.message)
      continue
    }

    // Atualizar profile com crm/specialty se médico
    if (user.role === 'doctor' && data.user) {
      await supabase.from('profiles').update({
        crm: user.crm,
        specialty: user.specialty,
      }).eq('id', data.user.id)
    }

    console.log(`✓ ${user.role}: ${user.email} / ${user.password}`)
  }

  // Atualizar paciente demo com dados completos
  console.log('\n🏥 Populando paciente demo...')

  const { data: patientUser } = await supabase.auth.admin
    .listUsers()
    .then(r => ({ data: r.data.users.find(u => u.email === 'contato@em.art.br') }))

  if (patientUser) {
    await supabase.from('patients').update({
      status: 'aguardando_medico',
      personal_data: {
        full_name: 'Eduardo Machado',
        email: 'contato@em.art.br',
        cpf: '001.743.300-22',
        rg: '9999999999',
        birth_date: '01/01/1990',
        phone: '(48) 99999-0000',
      },
      triage: {
        main_symptom: 'Dor de cabeça persistente há 3 dias, piora à tarde.',
        pain_location: 'Região frontal e temporal',
        pain_intensity: 6,
        medical_history: 'Sem alergias conhecidas. Não usa medicamentos regularmente.',
      },
      payment: {
        confirmed: true,
        method: 'pix',
        amount: 200,
        confirmed_at: new Date().toISOString(),
      },
    }).eq('user_id', patientUser.id)

    // Histórico do assistente
    const { data: patient } = await supabase
      .from('patients').select('id').eq('user_id', patientUser.id).single()

    if (patient) {
      await supabase.from('chat_history').insert([
        { patient_id: patient.id, role: 'assistant', content: 'Olá! Sou o assistente de triagem da BioSativa. Qual é o seu principal sintoma hoje?' },
        { patient_id: patient.id, role: 'user', content: 'Estou com dor de cabeça forte há 3 dias, piora à tarde.' },
        { patient_id: patient.id, role: 'assistant', content: 'Há quanto tempo você está com esse sintoma?' },
        { patient_id: patient.id, role: 'user', content: 'Desde domingo, são 3 dias.' },
        { patient_id: patient.id, role: 'assistant', content: 'Em uma escala de 0 a 10, qual é a intensidade?' },
        { patient_id: patient.id, role: 'user', content: '6' },
        { patient_id: patient.id, role: 'assistant', content: 'Onde você sente o desconforto?' },
        { patient_id: patient.id, role: 'user', content: 'Na cabeça, região frontal e nas têmporas.' },
        { patient_id: patient.id, role: 'assistant', content: 'Você tem outros sintomas associados?' },
        { patient_id: patient.id, role: 'user', content: 'Fica pior com barulho e luz forte.' },
        { patient_id: patient.id, role: 'assistant', content: 'Tem alguma alergia ou usa medicamento contínuo?' },
        { patient_id: patient.id, role: 'user', content: 'Não tenho alergias e não uso medicamentos.' },
        {
          patient_id: patient.id, role: 'assistant',
          content: '📋 RESUMO PARA O MÉDICO:\n• Sintoma principal: Dor de cabeça forte\n• Duração: 3 dias (desde domingo)\n• Intensidade: 6/10\n• Localização: Região frontal e têmporas\n• Sintomas associados: Piora com barulho e luz\n• Histórico/alergias: Sem alergias, sem medicamentos'
        },
      ])
    }

    console.log('✓ Paciente demo populado (status: aguardando_medico)')
  }

  // Pacientes demo extras (sem login) — populam as listas do admin e do
  // médico com outros status, incluindo exemplos de prontuário já
  // preenchido pelo médico.
  console.log('\n👥 Populando pacientes demo extras...')

  const EXTRA_PATIENTS: {
    status: string
    personal_data: Record<string, string>
    triage?: Record<string, unknown>
    payment?: Record<string, unknown>
    clinical?: Record<string, unknown>
    admin_validation?: Record<string, unknown>
    withDocuments?: boolean
  }[] = [
    {
      status: 'retido_admin',
      personal_data: {
        full_name: 'Ana Beatriz Souza',
        email: 'ana.souza@example.com',
        cpf: '123.456.789-00',
        rg: '11.222.333-4',
        birth_date: '15/03/1988',
        phone: '(11) 91234-5678',
        cep: '01310-100',
        address: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
      triage: {
        main_symptom: 'Ansiedade generalizada e insônia recorrente há 2 meses.',
        pain_location: '—',
        pain_intensity: 4,
        medical_history: 'Sem alergias conhecidas. Uso ocasional de melatonina.',
      },
      payment: { confirmed: true, method: 'pix', amount: 200, confirmed_at: new Date().toISOString() },
      clinical: {
        prescription: 'Óleo CBD 5% — 2 gotas sublinguais à noite, por 30 dias.',
        report: 'Paciente relata ansiedade generalizada e insônia recorrente há 2 meses, sem histórico de outras comorbidades. Indicado tratamento com cannabis medicinal (CBD) para controle dos sintomas, com reavaliação em 30 dias.',
        saved_by_doctor: true,
        saved_at: new Date().toISOString(),
      },
      withDocuments: true,
    },
    {
      status: 'concluido',
      personal_data: {
        full_name: 'Carlos Eduardo Lima',
        email: 'carlos.lima@example.com',
        cpf: '987.654.321-00',
        rg: '22.333.444-5',
        birth_date: '08/11/1979',
        phone: '(31) 98888-2222',
        cep: '30130-010',
        address: 'Rua da Bahia',
        number: '500',
        neighborhood: 'Centro',
        city: 'Belo Horizonte',
        state: 'MG',
      },
      triage: {
        main_symptom: 'Dor crônica lombar há mais de 1 ano, sem melhora com analgésicos comuns.',
        pain_location: 'Região lombar',
        pain_intensity: 7,
        medical_history: 'Hipertensão controlada. Sem alergias.',
      },
      payment: { confirmed: true, method: 'card', amount: 200, confirmed_at: new Date().toISOString() },
      clinical: {
        prescription: 'Extrato full spectrum CBD:THC 20:1 — 3 gotas sublinguais 2x ao dia, por 60 dias.',
        report: 'Paciente com dor crônica lombar há mais de 1 ano refratária a analgésicos comuns. Indicado tratamento com cannabis medicinal, com reavaliação em 60 dias.',
        saved_by_doctor: true,
        saved_at: new Date().toISOString(),
      },
      admin_validation: {
        identity_approved: true,
        financial_approved: true,
        clinical_approved: true,
        released_at: new Date().toISOString(),
        released_by: 'Administrador',
      },
      withDocuments: true,
    },
    {
      status: 'cadastro_incompleto',
      personal_data: {
        full_name: 'Fernanda Ribeiro',
        email: 'fernanda.ribeiro@example.com',
        cpf: '456.789.123-00',
        rg: '33.444.555-6',
        birth_date: '22/07/1995',
        phone: '(21) 99876-5432',
      },
    },
  ]

  for (const p of EXTRA_PATIENTS) {
    const cpf = p.personal_data.cpf
    const { data: existing, error: findError } = await supabase
      .from('patients').select('id').eq('personal_data->>cpf', cpf).maybeSingle()
    if (findError) {
      console.error(`❌ ${p.personal_data.full_name}:`, findError.message)
      continue
    }

    const payload = {
      status: p.status,
      personal_data: p.personal_data,
      triage: p.triage ?? {},
      payment: p.payment ?? {},
      clinical: p.clinical ?? {},
      admin_validation: p.admin_validation ?? {},
    }

    let patientId: string | undefined = existing?.id
    let upsertError = null
    if (patientId) {
      const { error } = await supabase.from('patients').update(payload).eq('id', patientId)
      upsertError = error
    } else {
      const { data: inserted, error } = await supabase.from('patients').insert(payload).select('id').single()
      patientId = inserted?.id
      upsertError = error
    }
    if (upsertError || !patientId) {
      console.error(`❌ ${p.personal_data.full_name}:`, upsertError?.message ?? 'falha desconhecida')
      continue
    }

    if (p.withDocuments) {
      await supabase.from('documents').delete().eq('patient_id', patientId)
      await supabase.from('documents').insert([
        { patient_id: patientId, type: 'identity', filename: 'documento-identidade.pdf', storage_path: `${patientId}/identity/documento-identidade.pdf`, mime_type: 'application/pdf' },
        { patient_id: patientId, type: 'address', filename: 'comprovante-endereco.pdf', storage_path: `${patientId}/address/comprovante-endereco.pdf`, mime_type: 'application/pdf' },
      ])
    }

    console.log(`✓ Paciente demo: ${p.personal_data.full_name} (status: ${p.status})`)
  }

  // Conversas de WhatsApp em andamento (inbox do admin)
  console.log('\n💬 Populando conversas de WhatsApp...')

  const CONVERSATIONS: {
    phone: string
    contact_name: string
    unread_count: number
    messages: { direction: 'inbound' | 'outbound'; content: string; minutesAgo: number }[]
  }[] = [
    {
      // Mesmo telefone do paciente demo, para linkar com "Ver cadastro do paciente".
      phone: '(48) 99999-0000',
      contact_name: 'Eduardo Machado',
      unread_count: 1,
      messages: [
        { direction: 'inbound', content: 'Oi, boa tarde! Já mandei meus documentos, minha consulta já foi liberada?', minutesAgo: 190 },
        { direction: 'outbound', content: 'Boa tarde, Eduardo! Deixa eu verificar aqui pra você, um instante.', minutesAgo: 185 },
        { direction: 'outbound', content: 'Vi que seus documentos estão em análise com a nossa equipe médica. Assim que o médico avaliar seu caso, você recebe um aviso por aqui e por e-mail.', minutesAgo: 183 },
        { direction: 'inbound', content: 'Perfeito, obrigado! E sobre a receita, sai em quanto tempo depois da consulta?', minutesAgo: 20 },
      ],
    },
    {
      phone: '(11) 98765-4321',
      contact_name: 'Marina Costa',
      unread_count: 2,
      messages: [
        { direction: 'inbound', content: 'Olá! Vi o anúncio de vocês sobre cannabis medicinal para ansiedade, queria saber como funciona.', minutesAgo: 420 },
        { direction: 'outbound', content: 'Oi, Marina! Que bom que você chegou até a gente 💚 Funciona assim: você faz um cadastro rápido, passa por uma triagem guiada e depois tem uma consulta com um médico prescritor.', minutesAgo: 415 },
        { direction: 'outbound', content: 'Ao final, se indicado, você recebe a receita e o laudo digitais, tudo dentro das normas da Anvisa.', minutesAgo: 414 },
        { direction: 'inbound', content: 'Entendi! E qual o valor da consulta?', minutesAgo: 60 },
        { direction: 'inbound', content: 'Ah, e vocês atendem em qualquer estado ou só em SP?', minutesAgo: 55 },
      ],
    },
    {
      phone: '(21) 97654-1230',
      contact_name: 'Ricardo Alves',
      unread_count: 0,
      messages: [
        { direction: 'inbound', content: 'Bom dia! Fiz o pagamento via Pix ontem mas ainda não vi confirmação no meu painel.', minutesAgo: 1300 },
        { direction: 'outbound', content: 'Bom dia, Ricardo! Vou verificar o pagamento aqui no sistema, só um momento.', minutesAgo: 1295 },
        { direction: 'outbound', content: 'Confirmado! Seu pagamento já foi processado e você já está na fila de atendimento médico. 🎉', minutesAgo: 1290 },
        { direction: 'inbound', content: 'Que ótimo, muito obrigado pela agilidade!', minutesAgo: 1288 },
      ],
    },
  ]

  for (const conv of CONVERSATIONS) {
    const lastMessage = conv.messages[conv.messages.length - 1]
    const lastMessageAt = new Date(Date.now() - lastMessage.minutesAgo * 60_000).toISOString()

    const { data: existing } = await supabase
      .from('whatsapp_conversations').select('id').eq('phone', conv.phone).maybeSingle()

    const conversationId = existing?.id ?? (
      await supabase
        .from('whatsapp_conversations')
        .insert({
          phone: conv.phone,
          contact_name: conv.contact_name,
          unread_count: conv.unread_count,
          last_message_at: lastMessageAt,
        })
        .select('id')
        .single()
    ).data?.id

    if (!conversationId) continue

    // Evita duplicar mensagens se o seed rodar mais de uma vez.
    await supabase.from('whatsapp_messages').delete().eq('conversation_id', conversationId)
    await supabase.from('whatsapp_messages').insert(
      conv.messages.map((m) => ({
        conversation_id: conversationId,
        direction: m.direction,
        content: m.content,
        status: m.direction === 'outbound' ? 'sent' : 'received',
        created_at: new Date(Date.now() - m.minutesAgo * 60_000).toISOString(),
      }))
    )
    await supabase
      .from('whatsapp_conversations')
      .update({ unread_count: conv.unread_count, last_message_at: lastMessageAt })
      .eq('id', conversationId)

    console.log(`✓ Conversa: ${conv.contact_name} (${conv.messages.length} mensagens)`)
  }

  console.log('\n✅ Seed concluído!')
  console.log('\nAcesse /login e use os botões de acesso rápido para testar.')
}

seed().catch(console.error)
