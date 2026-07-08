import Link from 'next/link'

export function SiteLogo({ light, href = '/' }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-brand-500 text-lg">
        💊
      </div>
      <div className="leading-tight">
        <div className={`text-base font-extrabold ${light ? 'text-white' : 'text-navy-800'}`}>PharmaCRM</div>
        <div className={`text-[10px] font-bold tracking-wide uppercase ${light ? 'text-white/70' : 'text-navy-200'}`}>
          Farmácia &amp; Associação
        </div>
      </div>
    </Link>
  )
}
