import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoupleMediaGrid from '@/components/wedding/CoupleMediaGrid'

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

  const favIds = mediaFiles.map((f) => f.id)

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-800 mb-6">
        Favoriler <span className="text-stone-400 font-normal text-base">({mediaFiles.length})</span>
      </h2>

      {mediaFiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-400 text-sm">Henüz favori eklemediniz.</p>
          <p className="text-stone-400 text-xs mt-1">Fotoğrafların üzerindeki kalp ikonuna tıklayın.</p>
        </div>
      ) : (
        <CoupleMediaGrid
          files={mediaFiles}
          favSet={favIds}
          weddingId={weddingId}
        />
      )}
    </div>
  )
}
