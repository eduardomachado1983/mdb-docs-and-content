'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/shared/app-header'
import { Card } from '@/components/ui/card'
import { DocumentUpload } from '@/components/shared/document-upload'

const DOC_TYPES = [
  { key: 'prescription', label: '📝 Receita Médica Vigente', hint: 'Válida por 30 dias' },
  { key: 'report', label: '📄 Laudo / CID', hint: 'Laudo da especialidade' },
  { key: 'identity', label: '🪪 Identidade', hint: 'RG, CNH ou passaporte' },
] as const

export default function DocumentosPage() {
  const [docs, setDocs] = useState<Record<string, File | null>>({ prescription: null, report: null, identity: null })

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <AppHeader />
      <main className="mx-auto w-full max-w-[540px] flex-1 overflow-auto p-[18px]">
        <h2 className="mb-1 text-lg font-black text-navy-800">📋 Meus Documentos</h2>
        <p className="mb-4 text-[12px] text-navy-300">Mantenha seus documentos atualizados para agilizar pedidos futuros.</p>
        {DOC_TYPES.map(({ key, label, hint }) => (
          <Card key={key} className="mb-2.5 p-3.5">
            <div className="mb-0.5 text-[13px] font-bold text-navy-800">{label}</div>
            <div className="mb-3 text-[11px] text-navy-300">{hint}</div>
            <DocumentUpload
              label="Clique para enviar"
              file={docs[key]}
              onSelect={(file) => { setDocs((prev) => ({ ...prev, [key]: file })); toast.success(`${label} salvo!`) }}
              onClear={() => setDocs((prev) => ({ ...prev, [key]: null }))}
            />
          </Card>
        ))}
      </main>
    </div>
  )
}
