'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createGuestToken(formData: FormData) {
  const supabase = await createClient()

  const weddingId = formData.get('weddingId') as string
  const albumId   = (formData.get('albumId') as string) || null
  const label     = (formData.get('label')   as string)?.trim() || 'Misafirler'
  const expires   = (formData.get('expires_at') as string) || null

  const { error } = await supabase.from('guest_tokens').insert({
    wedding_id: weddingId,
    album_id:   albumId,
    label,
    expires_at: expires || null,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
  return { success: true }
}

export async function toggleGuestToken(tokenId: string, isActive: boolean, weddingId: string) {
  const supabase = await createClient()
  await supabase.from('guest_tokens').update({ is_active: isActive }).eq('id', tokenId)
  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
}

export async function deleteGuestToken(tokenId: string, weddingId: string) {
  const supabase = await createClient()
  await supabase.from('guest_tokens').delete().eq('id', tokenId)
  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
}
