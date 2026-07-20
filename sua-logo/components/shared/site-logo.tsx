import Link from 'next/link'

export function SiteLogo({
  light,
  href = '/',
  iconClassName = 'bg-gradient-to-br from-brand-500 to-teal-500',
}: {
  light?: boolean
  href?: string
  iconClassName?: string
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-[11px] text-lg ${iconClassName}`}>
        🌿
      </div>
      <div className="leading-tight">
        <div className="text-base font-extrabold">
          <span className={light ? 'text-white' : 'text-navy-800'}>Bio</span>
          <span className="text-[#d97706]">Sativa</span>
        </div>
        <div className={`text-[11px] font-bold tracking-wide ${light ? 'text-white/70' : 'text-navy-200'}`}>
          CANNABIS MEDICINAL
        </div>
      </div>
    </Link>
  )
}
