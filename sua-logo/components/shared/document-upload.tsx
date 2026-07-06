'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Document } from '@/types'

export function DocumentUpload({ initialDocuments }: { initialDocuments: Document[] }) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [loading, setLoading] = useState<'identity' | 'address' | null>(null)
  const identityRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  async function upload(type: 'identity' | 'address', file: File) {
    setLoading(type)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      const res = await fetch('/api/patient/documents', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha no upload')
        return
      }
      toast.success('Documento enviado!')
      const listRes = await fetch('/api/patient/documents')
      const listData = await listRes.json()
      setDocuments(listData.documents)
    } finally {
      setLoading(null)
    }
  }

  const hasType = (type: string) => documents.some((d) => d.type === type)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">Documento de identidade {hasType('identity') && '✓'}</span>
        <input ref={identityRef} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && upload('identity', e.target.files[0])} />
        <Button size="sm" variant="outline" disabled={loading === 'identity'} onClick={() => identityRef.current?.click()}>
          {loading === 'identity' ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">Comprovante de endereço {hasType('address') && '✓'}</span>
        <input ref={addressRef} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && upload('address', e.target.files[0])} />
        <Button size="sm" variant="outline" disabled={loading === 'address'} onClick={() => addressRef.current?.click()}>
          {loading === 'address' ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </div>
  )
}
