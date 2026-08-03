import Link from 'next/link'

export function SiteLogo({ light, href = '/' }: { light?: boolean; href?: string; iconClassName?: string }) {
  return (
    <Link href={href} className="flex items-center">
      <div className="leading-tight">
        <div className="text-2xl font-extrabold tracking-tight">
          <span className={light ? 'text-white' : 'text-brand-700'}>Bio</span>
          <span className="text-[#c9a24e]">Sativa</span>
        </div>
      </div>
    </Link>
  )
}
