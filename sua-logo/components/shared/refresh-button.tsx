'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

export function RefreshButton({ label }: { label: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex items-center gap-2 rounded-[4px] bg-brand-500 px-5 py-2.5 text-sm font-bold text-primary-on"
    >
      <RefreshCw className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}
