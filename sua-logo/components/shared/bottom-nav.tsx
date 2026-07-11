'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BottomNavItem {
  href: string
  label: string
  icon: LucideIcon
}

// Barra de navegação inferior para mobile (zona do polegar). O atributo
// data-bottom-nav é usado pelo globals.css para reservar espaço no fim da
// página e o conteúdo não ficar escondido atrás da barra fixa.
export function BottomNav({ items, activeClass }: { items: BottomNavItem[]; activeClass: string }) {
  const pathname = usePathname()

  return (
    <nav
      data-bottom-nav
      aria-label="Menu inferior"
      className="fixed inset-x-0 bottom-0 z-30 grid border-t border-line-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition active:scale-[0.97]',
              active ? activeClass : 'text-navy-300'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
