'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/mock-auth'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const { logout } = useAuth()
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className ?? 'gap-1.5'}
      onClick={() => {
        logout()
        router.push('/')
      }}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  )
}
