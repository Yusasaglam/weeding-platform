'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleFavorite(mediaFileId: string, weddingId: string, isFavorited: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (isFavorited) {
    await supabase.from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('media_file_id', mediaFileId)
  } else {
    await supabase.from('favorites')
      .insert({ user_id: user.id, media_file_id: mediaFileId })
  }

  revalidatePath(`/wedding/${weddingId}`)
}
