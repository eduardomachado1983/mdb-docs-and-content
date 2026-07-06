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
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Envie um arquivo JPG, PNG ou PDF' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const serviceClient = await createServiceClient()

  // Garante o bucket privado. Propaga o motivo real caso a criação falhe.
  const bucketError = await ensureDocumentsBucket()
  if (bucketError) {
    return NextResponse.json({ error: `Storage: ${bucketError}` }, { status: 500 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${patient.id}/${type}/${Date.now()}-${safeName}`

  const { error: uploadError } = await serviceClient.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: `Upload: ${uploadError.message}` }, { status: 500 })
  }

  // Substitui documento anterior do mesmo tipo (permite "Trocar")
  await serviceClient.from('documents').delete().eq('patient_id', patient.id).eq('type', type)

  const { error: insertError } = await serviceClient.from('documents').insert({
    patient_id: patient.id,
    type,
    filename: file.name,
    storage_path: storagePath,
    mime_type: file.type,
    size_bytes: file.size,
  })

  if (insertError) {
    return NextResponse.json({ error: `Registro: ${insertError.message}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
