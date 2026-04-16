'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function updateUserRole(userId: string, role: 'admin' | 'couple') {
  const admin = createAdminClient()
  const { error } = await admin.from('users').update({ role }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/users')
  return { success: true }
}

// Called from the WEDDING detail page — args are (weddingId, userId)
export async function assignCoupleToWedding(weddingId: string, userId: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('wedding_couples').upsert(
    { user_id: userId, wedding_id: weddingId },
    { onConflict: 'wedding_id,user_id' }
  )
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  revalidatePath('/dashboard/users')
  return { success: true }
}

// Called from the WEDDING detail page — args are (weddingId, userId)
export async function removeCoupleFromWedding(weddingId: string, userId: string) {
  const admin = createAdminClient()
  await admin.from('wedding_couples').delete()
    .eq('user_id', userId).eq('wedding_id', weddingId)
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  revalidatePath('/dashboard/users')
}

// Called from the USERS page — args are (userId, weddingId) — kept for UserRow
export async function assignWedding(userId: string, weddingId: string) {
  return assignCoupleToWedding(weddingId, userId)
}

export async function removeWeddingAssignment(userId: string, weddingId: string) {
  return removeCoupleFromWedding(weddingId, userId)
}
