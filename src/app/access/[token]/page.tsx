import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import GuestGallery from '@/components/guest/GuestGallery'

interface Props { params: Promise<{ token: string }> }

export default async function GuestAccessPage({ params }: Props) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: guestToken } = await admin
    .from('guest_tokens')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (!guestToken) redirect('/access-denied')
  if (guestToken.expires_at && new Date(guestToken.expires_at) < new Date()) {
    redirect('/access-denied')
  }

  const { data: wedding } = await admin
    .from('weddings')
    .select('id, title, bride_name, groom_name, event_date, venue')
    .eq('id', guestToken.wedding_id)
    .single()

  if (!wedding) redirect('/access-denied')

  let albums: { id: string; title: string; description: string; is_guest_uploads: boolean }[] = []
  const mediaByAlbum: Record<string, { id: string; storage_path: string; file_name: string; file_type: string }[]> = {}

  if (guestToken.album_id) {
    const { data: album } = await admin
      .from('albums').select('id, title, description')
      .eq('id', guestToken.album_id).single()

    if (album) {
      albums = [{ ...album, is_guest_uploads: false }]
      const { data: files } = await admin
        .from('media_files').select('id, storage_path, file_name, file_type')
        .eq('album_id', guestToken.album_id).order('created_at', { ascending: true })
      mediaByAlbum[guestToken.album_id] = files ?? []
    }
  } else {
    const { data: guestAlbums } = await admin
      .from('albums').select('id, title, description')
      .eq('wedding_id', guestToken.wedding_id)
      .eq('visibility', 'guest')
      .order('sort_order')

    // "Misafir Fotoğrafları" albümü en sona al
    const regular = (guestAlbums ?? []).filter((a) => a.title !== 'Misafir Fotoğrafları')
    const guestUploads = (guestAlbums ?? []).filter((a) => a.title === 'Misafir Fotoğrafları')
    const ordered = [...regular, ...guestUploads]

    albums = ordered.map((a) => ({ ...a, is_guest_uploads: a.title === 'Misafir Fotoğrafları' }))

    for (const album of ordered) {
      const { data: files } = await admin
        .from('media_files').select('id, storage_path, file_name, file_type')
        .eq('album_id', album.id).order('created_at', { ascending: true })
      mediaByAlbum[album.id] = files ?? []
    }
  }

  return (
    <GuestGallery
      wedding={wedding}
      albums={albums}
      mediaByAlbum={mediaByAlbum}
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      token={token}
    />
  )
}
