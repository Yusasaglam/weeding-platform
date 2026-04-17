import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  const file = formData.get('file') as File

  if (!token || !file) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Token doğrula
  const { data: guestToken } = await admin
    .from('guest_tokens')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (!guestToken) return NextResponse.json({ error: 'Geçersiz token' }, { status: 403 })
  if (guestToken.expires_at && new Date(guestToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token süresi dolmuş' }, { status: 403 })
  }

  // Albüm bul: token'a bağlı albüm → guest albümü → yoksa otomatik oluştur
  let albumId: string | null = guestToken.album_id ?? null

  if (!albumId) {
    const { data: existing } = await admin
      .from('albums')
      .select('id')
      .eq('wedding_id', guestToken.wedding_id)
      .eq('visibility', 'guest')
      .order('sort_order')
      .limit(1)
      .maybeSingle()

    if (existing) {
      albumId = existing.id
    } else {
      // Otomatik "Misafir Fotoğrafları" albümü oluştur
      const { data: created } = await admin
        .from('albums')
        .insert({
          wedding_id: guestToken.wedding_id,
          title: 'Misafir Fotoğrafları',
          description: 'Misafirler tarafından yüklenen fotoğraflar',
          visibility: 'guest',
          sort_order: 999,
        })
        .select('id')
        .single()
      albumId = created?.id ?? null
    }
  }

  // Dosyayı storage'a yükle
  const fileType = file.type.startsWith('video/') ? 'video' : 'image'
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const storagePath = `${guestToken.wedding_id}/guest/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await admin.storage
    .from('wedding-media')
    .upload(storagePath, arrayBuffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // media_files kaydı oluştur
  const { data: mediaFile, error: insertError } = await admin
    .from('media_files')
    .insert({
      wedding_id: guestToken.wedding_id,
      album_id: albumId,
      storage_path: storagePath,
      file_name: file.name,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
    })
    .select('id, storage_path, file_name, file_type, album_id')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ file: mediaFile })
}
