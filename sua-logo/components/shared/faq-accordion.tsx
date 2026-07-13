'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FAQS } from '@/lib/faq'

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((f, i) => (
        <div key={f.q} className="overflow-hidden rounded-2xl border border-line-100 bg-[#fbfdff]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-3.5 px-5 py-4.5 text-left text-[15px] font-bold text-navy-700"
          >
            {f.q}
            {open === i ? (
              <ChevronUp className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            )}
          </button>
          {open === i && (
            <div className="px-5 pb-4.5 text-[15px] leading-relaxed text-navy-400">{f.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
