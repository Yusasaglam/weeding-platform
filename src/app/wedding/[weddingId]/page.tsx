import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Calendar, MapPin, QrCode, Images } from 'lucide-react'
import CoupleQrList from '@/components/wedding/CoupleQrList'
import CoupleGallerySection from '@/components/wedding/CoupleGallerySection'

interface Props { params: Promise<{ weddingId: string }> }

export default async function CoupleDashboardPage({ params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [weddingRes, albumsRes, tokensRes, favsRes] = await Promise.all([
    supabase.from('weddings').select('*').eq('id', weddingId).single(),
    supabase
      .from('albums')
      .select('id, title, description, visibility')
      .eq('wedding_id', weddingId)
      .in('visibility', ['couple', 'guest'])
      .order('sort_order'),
    admin
      .from('guest_tokens')
      .select('id, token, label, album_id, expires_at, is_active')
      .eq('wedding_id', weddingId)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase.from('favorites').select('media_file_id').eq('user_id', user.id),
  ])

  const wedding = weddingRes.data
  const albums = albumsRes.data ?? []
  const tokens = tokensRes.data ?? []
  const favSet = (favsRes.data ?? []).map((f) => f.media_file_id)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const albumIds = albums.map((a) => a.id)
  const { data: allMedia } = albumIds.length > 0
    ? await admin
        .from('media_files')
        .select('id, storage_path, file_name, file_type, album_id')
        .in('album_id', albumIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const albumsWithMedia = albums.map((a) => ({
    ...a,
    media_files: (allMedia ?? []).filter((m) => m.album_id === a.id),
  }))

  const totalPhotos = (allMedia ?? []).length

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">

      {/* Wedding hero */}
      <div className="pt-6 md:pt-8 pb-6 border-b border-stone-100">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-3">Düğün Galerisi</p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-950 leading-none mb-4">
          {wedding?.bride_name && wedding?.groom_name
            ? `${wedding.bride_name} & ${wedding.groom_name}`
            : wedding?.title ?? 'Düğünüm'}
        </h1>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {wedding?.event_date && (
            <div className="flex items-center gap-2 text-stone-400 text-xs md:text-sm">
              <Calendar size={12} className="shrink-0" />
              {new Date(wedding.event_date).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          )}
          {wedding?.venue && (
            <div className="flex items-center gap-2 text-stone-400 text-xs md:text-sm">
              <MapPin size={12} className="shrink-0" />
              {wedding.venue}
            </div>
          )}
          <div className="flex items-center gap-2 text-stone-300 text-xs md:text-sm ml-auto">
            <Images size={12} className="shrink-0" />
            {totalPhotos} fotoğraf
          </div>
        </div>
      </div>

      {/* QR Kodlar */}
      {tokens.length > 0 && (
        <section className="py-6 md:py-8 border-b border-stone-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-stone-900 mb-1">Misafir QR Kodları</h2>
              <p className="text-xs text-stone-400">Misafirlerinize paylaşın — fotoğraf yüklesinler</p>
            </div>
            <QrCode size={16} className="text-stone-200 shrink-0" />
          </div>
          <CoupleQrList tokens={tokens} albums={albums} appUrl={appUrl} />
        </section>
      )}

      {/* Fotoğraflar */}
      <section className="py-6 md:py-8 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif text-xl md:text-2xl text-stone-900 mb-1">Fotoğraflar</h2>
            <p className="text-xs text-stone-400">
              {totalPhotos > 0 ? `${totalPhotos} fotoğraf · ${albums.length} albüm` : 'Henüz fotoğraf yok'}
            </p>
          </div>
        </div>
        <CoupleGallerySection
          albums={albumsWithMedia}
          favSet={favSet}
          weddingId={weddingId}
        />
      </section>

    </div>
  )
}
