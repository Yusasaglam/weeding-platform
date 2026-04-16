import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CoupleMediaGrid from '@/components/wedding/CoupleMediaGrid'

interface Props { params: Promise<{ weddingId: string; albumId: string }> }

export default async function CoupleAlbumPage({ params }: Props) {
  const { weddingId, albumId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: album }, { data: mediaFiles }, { data: favorites }] = await Promise.all([
    supabase.from('albums').select('id, title, description, visibility').eq('id', albumId).single(),
    supabase.from('media_files').select('*').eq('album_id', albumId).order('created_at', { ascending: false }),
    supabase.from('favorites').select('media_file_id').eq('user_id', user?.id ?? ''),
  ])

  if (!album) notFound()

  const favSet = new Set((favorites ?? []).map((f) => f.media_file_id))

  return (
    <div>
      <Link href={`/wedding/${weddingId}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> Geri
      </Link>

      <h2 className="text-lg font-semibold text-stone-800 mb-1">{album.title}</h2>
      {album.description && <p className="text-stone-500 text-sm mb-6">{album.description}</p>}

      {!mediaFiles || mediaFiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-400 text-sm">Bu albümde henüz fotoğraf yok.</p>
        </div>
      ) : (
        <CoupleMediaGrid
          files={mediaFiles}
          favSet={Array.from(favSet)}
          weddingId={weddingId}
        />
      )}
    </div>
  )
}
