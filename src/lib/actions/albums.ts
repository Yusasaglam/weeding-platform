'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createAlbum(weddingId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()

  const title       = (formData.get('title')      as string).trim()
  const description = (formData.get('description') as string)?.trim() ?? ''
  const visibility  =  formData.get('visibility')  as string
  const sort_order  = parseInt(formData.get('sort_order') as string) || 0

  if (!title) return

  const { data, error } = await supabase
    .from('albums')
    .insert({ wedding_id: weddingId, title, description, visibility, sort_order })
    .select('id')
    .single()

  if (error || !data) return

  revalidatePath(`/dashboard/weddings/${weddingId}`)
  redirect(`/dashboard/weddings/${weddingId}/albums/${data.id}`)
}

export async function updateAlbum(albumId: string, weddingId: string, formData: FormData) {
  const supabase = await createClient()

  const title       = (formData.get('title')       as string).trim()
  const description = (formData.get('description') as string)?.trim() ?? ''
  const visibility  =  formData.get('visibility')  as string
  const sort_order  = parseInt(formData.get('sort_order') as string) || 0

  const { error } = await supabase
    .from('albums')
    .update({ title, description, visibility, sort_order })
    .eq('id', albumId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/albums/${albumId}`)
  return { success: true }
}

export async function deleteAlbum(albumId: string, weddingId: string) {
  const supabase = await createClient()
  await supabase.from('albums').delete().eq('id', albumId)
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  redirect(`/dashboard/weddings/${weddingId}`)
}
