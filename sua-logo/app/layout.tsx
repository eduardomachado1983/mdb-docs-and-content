import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { HeaderOffset } from '@/components/shared/header-offset'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sua Logo Telemedicina',
  description: 'Consultas médicas online, com validação e segurança de verdade.',
}

// Fonte SF Pro via stack nativo (-apple-system, BlinkMacSystemFont), sem
// carregamento de webfont — renderização nativa em iOS/macOS, com fallback
// system-ui em outras plataformas. Ver DESIGN.md.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        {children}
        <HeaderOffset />
        <Toaster richColors position="top-right" offset={{ top: 'calc(var(--header-height) + 24px)' }} />
      </body>
    </html>
  )
}
