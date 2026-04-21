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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">

      {/* Header card */}
      <div className="relative bg-stone-900 rounded-3xl border border-white/6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#1c0a0a_0%,transparent_60%)] pointer-events-none" />
        <div className="relative px-7 py-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center shrink-0">
            <Heart size={18} className="text-amber-400" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-white">Favorilerim</h1>
            <p className="text-stone-500 text-sm mt-0.5">
              {mediaFiles.length > 0
                ? `${mediaFiles.length} fotoğraf favorilerinizde`
                : 'Henüz favori eklemediniz'}
            </p>
          </div>
        </div>
      </div>

      {mediaFiles.length === 0 ? (
        <div className="bg-stone-900 rounded-3xl border border-white/6 px-8 py-16 text-center">
          <div className="w-16 h-16 bg-stone-800 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={24} className="text-stone-700" />
          </div>
          <p className="font-serif text-lg text-stone-400 mb-2">Henüz favori yok</p>
          <p className="text-stone-600 text-sm max-w-xs mx-auto">
            Galerideki fotoğrafların üzerindeki kalp ikonuna basarak favorilere ekleyin.
          </p>
        </div>
      ) : (
        <section className="bg-stone-900 rounded-3xl border border-white/6 overflow-hidden">
          <div className="px-7 py-6 space-y-8">
            <CoupleGallerySection
              albums={[{ id: 'favorites', title: 'Favoriler', media_files: mediaFiles, description: null }]}
              favSet={favIds}
              weddingId={weddingId}
            />
          </div>
        </section>
      )}
    </div>
  )
}
