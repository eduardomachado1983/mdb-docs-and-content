import { Badge } from '@/components/ui/badge'
import { formatBRL, formatDateTimeBR } from '@/lib/utils'
import type { PaymentTransaction } from '@/types'

const METHOD_LABEL: Record<string, string> = {
  pix: 'Pix',
  card: 'Cartão',
}

const STATUS_LABEL: Record<PaymentTransaction['status'], string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
}

const STATUS_VARIANT: Record<PaymentTransaction['status'], 'amber' | 'teal' | 'red' | 'default'> = {
  pending: 'amber',
  approved: 'teal',
  rejected: 'red',
  cancelled: 'default',
}

export function PaymentHistory({ transactions }: { transactions: PaymentTransaction[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-extrabold tracking-wide text-navy-200">HISTÓRICO DE PAGAMENTO</div>
      {transactions.length === 0 && (
        <p className="text-xs text-navy-200">Nenhum pagamento registrado.</p>
      )}
      {transactions.map((t) => (
        <div key={t.id} className="rounded-lg bg-surface-subtle px-2.5 py-2 text-xs">
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <span className="font-bold text-navy-700">{METHOD_LABEL[t.method ?? ''] ?? t.method ?? '—'}</span>
            <Badge variant={STATUS_VARIANT[t.status]} className="px-1.5 py-0.5 text-[10px]">
              {STATUS_LABEL[t.status]}
            </Badge>
          </div>
          <div className="text-navy-200">{formatBRL(t.amount)} · {formatDateTimeBR(t.created_at)}</div>
        </div>
      ))}
    </div>
  )
}
