import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import CoupleGallerySection from '@/components/wedding/CoupleGallerySection'

interface Props { params: Promise<{ weddingId: string }> }

export default async function FavoritesPage({ params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: favRows } = await supabase
    .from('favorites')
    .select('media_file_id, media_files(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const mediaFiles = (favRows ?? [])
    .map((r) => r.media_files)
    .filter((f): f is NonNullable<typeof f> => !!f)
    .flat()
    .map((f) => ({ ...f, album_id: f.album_id ?? '' }))

  const favIds = mediaFiles.map((f) => f.id)

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">

      <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-8">
        <Heart size={18} className="text-stone-400 shrink-0" fill="currentColor" />
        <div>
          <h1 className="font-serif text-3xl text-stone-900 leading-none">Favorilerim</h1>
          <p className="text-stone-400 text-sm mt-1.5">
            {mediaFiles.length > 0
              ? `${mediaFiles.length} fotoğraf`
              : 'Henüz favori eklemediniz'}
          </p>
        </div>
      </div>

      {mediaFiles.length === 0 ? (
        <div className="py-20 text-center border border-stone-100 rounded-2xl">
          <Heart size={28} className="text-stone-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-stone-400">Henüz favori yok</p>
          <p className="text-stone-300 text-sm mt-1 max-w-xs mx-auto">
            Galerideki fotoğrafların üzerindeki kalp ikonuna basarak ekleyin.
          </p>
        </div>
      ) : (
        <CoupleGallerySection
          albums={[{ id: 'favorites', title: 'Favoriler', media_files: mediaFiles, description: null }]}
          favSet={favIds}
          weddingId={weddingId}
        />
      )}
    </div>
  )
}
