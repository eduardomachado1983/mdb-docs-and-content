'use client'

import { useState } from 'react'
import { formatDateTimeBR } from '@/lib/utils'
import type { Patient } from '@/types'

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  pix: 'Pix',
  card: 'Cartão',
}

export function ConsultationCard({ patient }: { patient: Patient }) {
  const [expanded, setExpanded] = useState(false)
  const triage = patient.triage
  if (!triage?.main_symptom) return null

  const payment = patient.payment
  const paymentLabel = payment?.confirmed
    ? `Confirmado${payment.method ? ` (${PAYMENT_METHOD_LABEL[payment.method] ?? payment.method})` : ''}`
    : 'Pendente'

  return (
    <div className="mb-[18px] rounded-2xl border border-white/30 bg-white/65 backdrop-blur-xl p-6">
      <div className="mb-2 text-xs font-extrabold tracking-wide text-navy-200">CONSULTA</div>
      <div className="flex flex-col gap-1.5 text-sm text-navy-600">
        <p><span className="text-navy-300">😊 Sintomas:</span> {triage.main_symptom}</p>

        {expanded && (
          <>
            <p><span className="text-navy-300">💳 Pagamento:</span> {paymentLabel}</p>
            <p><span className="text-navy-300">🗓️ Início da consulta:</span> {formatDateTimeBR(patient.created_at)}</p>
            <p><span className="text-navy-300">🔄 Última atualização:</span> {formatDateTimeBR(patient.updated_at)}</p>

            {patient.clinical?.prescription && (
              <div className="mt-2 rounded-xl bg-surface-muted p-3">
                <div className="mb-1 text-xs font-bold text-navy-300">💊 Receita</div>
                <p className="whitespace-pre-wrap">{patient.clinical.prescription}</p>
              </div>
            )}
            {patient.clinical?.report && (
              <div className="mt-2 rounded-xl bg-surface-muted p-3">
                <div className="mb-1 text-xs font-bold text-navy-300">📄 Laudo</div>
                <p className="whitespace-pre-wrap">{patient.clinical.report}</p>
              </div>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-sm font-bold text-brand-500"
      >
        {expanded ? '← Ver menos' : 'Ver todas as informações da consulta →'}
      </button>
    </div>
  )
}
