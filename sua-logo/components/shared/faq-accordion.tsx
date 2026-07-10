'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
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
            <span className={cn('text-xl text-brand-500 transition-transform', open === i && 'rotate-45')}>+</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4.5 text-[15px] leading-relaxed text-navy-400">{f.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
