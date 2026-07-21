export function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div>
      <div className="text-sm text-navy-300">{label}</div>
      <div className="text-[15px] font-bold text-navy-800">{value}</div>
    </div>
  )
}
