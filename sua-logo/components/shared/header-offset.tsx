'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Mede a altura real do <header> da página atual e expõe em --header-height,
// para o Toaster (ver layout.tsx) posicionar o toast 24px abaixo dele.
export function HeaderOffset() {
  const pathname = usePathname()

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    const update = () =>
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)

    update()
    const observer = new ResizeObserver(update)
    observer.observe(header)
    return () => observer.disconnect()
  }, [pathname])

  return null
}
