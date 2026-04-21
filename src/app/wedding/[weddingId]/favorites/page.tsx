import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Heart, ImageOff } from 'lucide-react'
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
    <div className="max-w-2xl mx-auto pt-4 space-y-4">

      {/* Header */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={18} className="text-rose-500" fill="currentColor" />
          <h1 className="font-serif text-2xl text-stone-900">Favorilerim</h1>
        </div>
        <p className="text-stone-400 text-sm">
          {mediaFiles.length > 0
            ? `${mediaFiles.length} fotoğraf favorilerinizde`
            : 'Henüz favori eklemediniz'}
        </p>
      </div>

      {mediaFiles.length === 0 ? (
        <div className="mx-4 bg-white rounded-3xl border border-stone-100 shadow-sm px-8 py-16 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={24} className="text-rose-200" />
          </div>
          <p className="font-serif text-lg text-stone-600 mb-2">Henüz favori yok</p>
          <p className="text-stone-400 text-sm max-w-xs mx-auto">
            Galerideki fotoğrafların üzerindeki kalp ikonuna basarak favorilere ekleyin.
          </p>
        </div>
      ) : (
        <CoupleGallerySection
          albums={[{ id: 'favorites', title: 'Favoriler', media_files: mediaFiles, description: null, visibility: 'couple' }]}
          favSet={favIds}
          weddingId={weddingId}
        />
      )}
    </div>
  )
}
