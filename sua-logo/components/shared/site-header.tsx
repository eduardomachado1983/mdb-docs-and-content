import Link from 'next/link'
import { LoginMenu } from '@/components/shared/login-menu'
import { MobileNavMenu } from '@/components/shared/mobile-nav-menu'
import { SiteLogo } from '@/components/shared/site-logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1140px] grid-cols-[1fr_auto_1fr] items-center px-6 py-[15px]">
        <SiteLogo />
        <nav className="hidden items-center gap-6 justify-self-center text-sm font-bold text-navy-700 md:flex">
          <Link href="/">Início</Link>
          <Link href="/#quem-somos">Quem somos</Link>
          <Link href="/#como-funciona">Como funciona</Link>
        </nav>
        <div className="flex items-center justify-self-end gap-2.5">
          <div className="hidden items-center gap-2.5 md:flex">
            <LoginMenu />
            <Link
              href="/registro"
              className="rounded-[8px] bg-brand-500 px-[17px] py-2.5 text-sm font-bold text-primary-on"
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
