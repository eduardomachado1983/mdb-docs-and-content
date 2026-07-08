'use client'

export function DocumentUpload({
  label,
  file,
  onSelect,
  onClear,
}: {
  label: string
  file: File | null
  onSelect: (file: File) => void
  onClear: () => void
}) {
  if (file) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-success-500 bg-success-50 px-3 py-2.5">
        <span>📎</span>
        <span className="flex-1 text-[12px] font-semibold text-success-600">{file.name}</span>
        <button onClick={onClear} className="text-error-500">×</button>
      </div>
    )
  }
  return (
    <label className="block cursor-pointer rounded-lg border-2 border-dashed border-line-400 bg-surface-soft p-4 text-center">
      <div className="mb-1 text-xl">📤</div>
      <div className="text-[12px] font-semibold text-navy-500">{label}</div>
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
    </label>
  )
}
