import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import CoupleGallerySection from '@/components/wedding/CoupleGallerySection'

interface Props { params: Promise<{ weddingId: string; albumId: string }> }

export default async function CoupleAlbumPage({ params }: Props) {
  const { weddingId, albumId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [albumRes, mediaRes, favsRes] = await Promise.all([
    supabase.from('albums').select('id, title, description, visibility').eq('id', albumId).single(),
    admin.from('media_files')
      .select('id, storage_path, file_name, file_type, album_id')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false }),
    supabase.from('favorites').select('media_file_id').eq('user_id', user.id),
  ])

  if (!albumRes.data) notFound()

  const album = albumRes.data
  const mediaFiles = (mediaRes.data ?? []).map((f) => ({ ...f, album_id: f.album_id ?? albumId }))
  const favSet = (favsRes.data ?? []).map((f) => f.media_file_id)

  return (
    <div className="max-w-2xl mx-auto pt-4 space-y-4">
      <div className="px-4">
        <Link
          href={`/wedding/${weddingId}`}
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-3"
        >
          <ChevronLeft size={14} /> Geri
        </Link>
        <h1 className="font-serif text-2xl text-stone-900 mb-1">{album.title}</h1>
        {album.description && <p className="text-stone-400 text-sm">{album.description}</p>}
      </div>

      <CoupleGallerySection
        albums={[{ ...album, media_files: mediaFiles, description: album.description ?? null }]}
        favSet={favSet}
        weddingId={weddingId}
      />
    </div>
  )
}
