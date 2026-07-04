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
        { patient_id: patient.id, role: 'assistant', content: 'Olá! Sou o assistente de triagem da Sua Logo. Qual é o seu principal sintoma hoje?' },
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

  console.log('\n✅ Seed concluído!')
  console.log('\nAcesse /login e use os botões de acesso rápido para testar.')
}

seed().catch(console.error)
