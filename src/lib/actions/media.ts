'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
const VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/quicktime', 'video/avi', 'video/webm']
const MAX_IMAGE = 30 * 1024 * 1024   // 30 MB
const MAX_VIDEO = 500 * 1024 * 1024  // 500 MB

export async function uploadMediaFiles(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açılı değil.', uploaded: 0 }

  const admin = createAdminClient()
  const weddingId = formData.get('weddingId') as string
  const albumId   = formData.get('albumId')   as string | null
  const files     = formData.getAll('files')  as File[]

  if (!weddingId || files.length === 0) return { error: 'Eksik parametreler.', uploaded: 0 }

  let uploaded = 0
  const errors: string[] = []

  for (const file of files) {
    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      errors.push(`${file.name}: desteklenmeyen format`)
      continue
    }
    if (isImage && file.size > MAX_IMAGE) {
      errors.push(`${file.name}: görsel 30 MB'den büyük olamaz`)
      continue
    }
    if (isVideo && file.size > MAX_VIDEO) {
      errors.push(`${file.name}: video 500 MB'den büyük olamaz`)
      continue
    }

    const ext  = file.name.split('.').pop() ?? 'bin'
    const path = `${weddingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await admin.storage
      .from('wedding-media')
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      errors.push(`${file.name}: ${uploadError.message}`)
      continue
    }

    await admin.from('media_files').insert({
      wedding_id:   weddingId,
      album_id:     albumId || null,
      storage_path: path,
      file_name:    file.name,
      file_type:    isImage ? 'image' : 'video',
      mime_type:    file.type,
      file_size:    file.size,
      uploaded_by:  user.id,
    })

    uploaded++
  }

  if (albumId) revalidatePath(`/dashboard/weddings/${weddingId}/albums/${albumId}`)
  revalidatePath(`/dashboard/weddings/${weddingId}`)

  return {
    uploaded,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export async function deleteMediaFile(fileId: string, weddingId: string, storagePath: string) {
  const admin = createAdminClient()
  await admin.storage.from('wedding-media').remove([storagePath])
  await admin.from('media_files').delete().eq('id', fileId)
  revalidatePath(`/dashboard/weddings/${weddingId}`)
}
