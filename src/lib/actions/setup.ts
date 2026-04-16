'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function claimAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Security: only when no admin exists
  const { data: existing } = await admin
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  if (existing && existing.length > 0) redirect('/login')

  await admin.from('users').upsert({
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata?.full_name ?? '',
    role: 'admin',
  })

  redirect('/dashboard')
}
