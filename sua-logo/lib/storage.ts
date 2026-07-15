import { createServiceClient } from '@/lib/supabase/server'

export const DOCUMENTS_BUCKET = 'patient-documents'

// Garante que o bucket privado exista. Retorna null em caso de sucesso,
// ou uma mensagem de erro para a rota propagar ao cliente.
export async function ensureDocumentsBucket(): Promise<string | null> {
  const supabase = await createServiceClient()

  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) return listError.message
  if (buckets?.some((b) => b.name === DOCUMENTS_BUCKET)) return null

  const { error: createError } = await supabase.storage.createBucket(DOCUMENTS_BUCKET, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  })
  // "already exists" acontece em corridas concorrentes — não é erro real.
  if (createError && !/already exists/i.test(createError.message)) {
    return createError.message
  }
  return null
}
