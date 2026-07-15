'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Document } from '@/types'

const MAX_SIZE = 5 * 1024 * 1024

interface Props {
  initialDocuments: Document[]
  onChange?: (documents: Document[]) => void
}

export function DocumentUpload({ initialDocuments, onChange }: Props) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [loading, setLoading] = useState<'identity' | 'address' | null>(null)
  const [selectedNames, setSelectedNames] = useState<Record<string, string>>({})
  const identityRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onChange?.(documents)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents])

  async function upload(type: 'identity' | 'address', file: File) {
    setSelectedNames((prev) => ({ ...prev, [type]: file.name }))

    if (file.size > MAX_SIZE) {
      toast.error('Arquivo maior que 5MB. Escolha um arquivo menor.')
      return
    }

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

  function row(type: 'identity' | 'address', label: string, ref: React.RefObject<HTMLInputElement | null>) {
    const done = hasType(type)
    return (
      <div className="flex flex-col gap-1.5 rounded-[11px] border border-line-200 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            {label} {done && <span className="text-teal-600">✓ enviado</span>}
          </span>
          <input
            ref={ref} type="file" accept="image/*,.pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(type, e.target.files[0])}
          />
          <Button size="sm" variant="outline" disabled={loading === type} onClick={() => ref.current?.click()}>
            {loading === type ? 'Enviando...' : done ? 'Trocar' : 'Enviar'}
          </Button>
        </div>
        {selectedNames[type] && (
          <span className="truncate text-xs text-navy-200">📎 {selectedNames[type]}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {row('identity', 'Documento de identidade', identityRef)}
      {row('address', 'Comprovante de endereço', addressRef)}
    </div>
  )
}
