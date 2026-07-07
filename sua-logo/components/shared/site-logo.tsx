import Link from 'next/link'

export function SiteLogo({ light, href = '/' }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-brand-500 to-teal-500 text-[13px] font-extrabold tracking-wide text-white">
        SL
      </div>
      <div className="leading-tight">
        <div className={`text-base font-extrabold ${light ? 'text-white' : 'text-navy-800'}`}>Sua Logo</div>
        <div className="text-[11px] font-bold tracking-wide text-navy-200">TELEMEDICINA</div>
      </div>
    </Link>
  )
}
