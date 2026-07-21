'use client'

import { Video } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sala de vídeo via Jitsi Meet (sem necessidade de conta ou chave de API).
// O nome da sala é derivado do id do paciente para ser estável e difícil de adivinhar.
export function VideoCallButton({ patientId, className }: { patientId: string; className?: string }) {
  function handleClick() {
    const room = `BioSativa-${patientId}`
    window.open(`https://meet.jit.si/${room}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] bg-teal-500 px-5 py-2.5 text-sm font-bold text-primary-on transition active:scale-[0.98]',
        className
      )}
    >
      <Video className="h-4 w-4" aria-hidden="true" />
      Iniciar consulta por vídeo
    </button>
  )
}
