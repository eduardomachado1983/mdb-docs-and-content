import { NextResponse } from 'next/server'
import { getProfile, getUser } from '@/lib/supabase/server'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ user: null, profile: null })

  const profile = await getProfile()
  return NextResponse.json({ user: { id: user.id, email: user.email }, profile })
}
