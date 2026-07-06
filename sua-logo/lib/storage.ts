import { createServiceClient } from '@/lib/supabase/server'

export const DOCUMENTS_BUCKET = 'patient-documents'

export async function ensureDocumentsBucket() {
  const supabase = await createServiceClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  if (buckets?.some((b) => b.name === DOCUMENTS_BUCKET)) return
  await supabase.storage.createBucket(DOCUMENTS_BUCKET, { public: false })
}
