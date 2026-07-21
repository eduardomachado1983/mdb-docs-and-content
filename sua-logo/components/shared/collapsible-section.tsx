'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-6 text-left"
      >
        <span className="text-base font-bold text-navy-800">{title}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-navy-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-navy-500" aria-hidden="true" />
        )}
      </button>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  )
}
