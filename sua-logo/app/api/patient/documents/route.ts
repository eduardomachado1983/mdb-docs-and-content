import { NextResponse } from 'next/server'
import { createClient, createServiceClient, getUser } from '@/lib/supabase/server'
import { ensureDocumentsBucket, DOCUMENTS_BUCKET } from '@/lib/storage'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const supabase = await createClient()
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ documents: [] })

  const { data: documents } = await supabase
    .from('documents').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false })
  return NextResponse.json({ documents: documents ?? [] })
}

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const type = formData.get('type')

  if (!(file instanceof File) || (type !== 'identity' && type !== 'address')) {
    return NextResponse.json({ error: 'Arquivo ou tipo inválido' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Arquivo maior que 5MB' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Tipo de arquivo não suportado' }, { status: 400 })

  const supabase = await createClient()
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  await ensureDocumentsBucket()
  const serviceClient = await createServiceClient()
  const storagePath = `${patient.id}/${type}/${Date.now()}-${file.name}`

  const { error: uploadError } = await serviceClient.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, file, { contentType: file.type })

  if (uploadError) return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })

  const { error: insertError } = await supabase.from('documents').insert({
    patient_id: patient.id,
    type,
    filename: file.name,
    storage_path: storagePath,
    mime_type: file.type,
    size_bytes: file.size,
  })

  if (insertError) return NextResponse.json({ error: 'Falha ao registrar documento' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
