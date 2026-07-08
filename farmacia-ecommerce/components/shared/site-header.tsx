import Link from 'next/link'
import { SiteLogo } from '@/components/shared/site-logo'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-[15px]">
        <SiteLogo />
        <nav className="hidden items-center gap-6 text-[13px] font-semibold text-navy-500 md:flex">
          <Link href="/#sobre">Sobre</Link>
          <Link href="/#produtos">Produtos</Link>
          <Link href="/#como-funciona">Como funciona</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link href="/login">
            <Button variant="outline" size="sm">Entrar</Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Cadastrar</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
