'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function generateToken(): string {
  return crypto.randomBytes(16).toString('base64url')
}

export async function generateQrLink({
  weddingId,
  albumId,
  linkType,
}: {
  weddingId: string
  albumId?: string
  linkType: 'full_gallery' | 'album' | 'guest_gallery'
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const token = generateToken()

  const { data, error } = await supabase
    .from('qr_links')
    .insert({
      wedding_id: weddingId,
      album_id: albumId ?? null,
      token,
      link_type: linkType,
      is_active: true,
    })
    .select('id, token')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
  return { token: data.token, id: data.id }
}

export async function toggleQrLinkActive(qrLinkId: string, weddingId: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('qr_links')
    .update({ is_active: isActive })
    .eq('id', qrLinkId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
  return { success: true }
}

export async function deleteQrLink(qrLinkId: string, weddingId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('qr_links')
    .delete()
    .eq('id', qrLinkId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/qr`)
  return { success: true }
}
