import Link from 'next/link'
import { LoginMenu } from '@/components/shared/login-menu'
import { SiteLogo } from '@/components/shared/site-logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-[15px]">
        <SiteLogo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#41546b] md:flex">
          <Link href="/#quem-somos">Quem somos</Link>
          <Link href="/#consultas">Consultas</Link>
          <Link href="/#como-funciona">Como funciona</Link>
          <Link href="/#faq">Dúvidas</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <LoginMenu />
          <Link
            href="/registro"
            className="rounded-[10px] bg-brand-500 px-[17px] py-2.5 text-sm font-bold text-white"
          >
            Iniciar consulta
          </Link>
        </div>
      </div>
    </header>
  )
}
