import Link from 'next/link'
import { LoginMenu } from '@/components/shared/login-menu'
import { MobileNavMenu } from '@/components/shared/mobile-nav-menu'
import { SiteLogo } from '@/components/shared/site-logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-[15px]">
        <SiteLogo />
        <nav className="hidden items-center gap-6 text-[0.700rem] font-semibold text-navy-500 md:flex">
          <Link href="/">Início</Link>
          <Link href="/#quem-somos">Quem somos</Link>
          <Link href="/#consultas">Consultas</Link>
          <Link href="/#como-funciona">Como funciona</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 md:flex">
            <LoginMenu />
            <Link
              href="/registro"
              className="rounded-[4px] bg-brand-500 px-[17px] py-2.5 text-sm font-bold text-primary-on"
            >
              Iniciar consulta
            </Link>
          </div>
          <MobileNavMenu />
        </div>
      </div>
    </header>
  )
}
