'use client'

import { useState } from 'react'

export function ClinicalDocLink({ label, content }: { label: string; content?: string | null }) {
  const [open, setOpen] = useState(false)

  if (!content) {
    return <p className="text-sm font-semibold text-error-500">{label} não está pronta</p>
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-sm font-semibold text-[#2f6fed] hover:underline"
      >
        {label}
      </button>
      {open && <p className="mt-1.5 whitespace-pre-wrap text-sm text-navy-600">{content}</p>}
    </div>
  )
}
