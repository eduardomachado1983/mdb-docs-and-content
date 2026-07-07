'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const MAX_SIZE = 5 * 1024 * 1024

export function SingleDocumentUpload({ type, label }: { type: string; label: string }) {
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setFileName(file.name)

    if (file.size > MAX_SIZE) {
      toast.error('Arquivo maior que 5MB. Escolha um arquivo menor.')
      return
    }

    setLoading(true)
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
      setUploaded(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-[11px] border border-line-200 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">
          {label} {uploaded && <span className="text-teal-600">✓ enviado</span>}
        </span>
        <input
          ref={inputRef} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button size="sm" variant="outline" disabled={loading} onClick={() => inputRef.current?.click()}>
          {loading ? 'Enviando...' : uploaded ? 'Trocar' : 'Enviar'}
        </Button>
      </div>
      {fileName && <span className="truncate text-xs text-navy-200">📎 {fileName}</span>}
    </div>
  )
}
