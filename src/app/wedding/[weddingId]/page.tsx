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
    supabase
      .from('favorites')
      .select('media_file_id')
      .eq('user_id', user.id),
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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">

      {/* Hero card */}
      <div className="relative bg-stone-900 rounded-3xl border border-white/6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#1c1408_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-7 pt-8 pb-6">
          <p className="text-amber-400 text-[10px] font-semibold tracking-widest uppercase mb-3">
            ✦ Düğün Galerisi
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
            {wedding?.bride_name && wedding?.groom_name
              ? `${wedding.bride_name} & ${wedding.groom_name}`
              : wedding?.title ?? 'Düğünüm'}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-white/5">
            {wedding?.event_date && (
              <div className="flex items-center gap-2 text-stone-400 text-sm">
                <Calendar size={13} className="text-amber-400 shrink-0" />
                {new Date(wedding.event_date).toLocaleDateString('tr-TR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            )}
            {wedding?.venue && (
              <div className="flex items-center gap-2 text-stone-400 text-sm">
                <MapPin size={13} className="text-amber-400 shrink-0" />
                {wedding.venue}
              </div>
            )}
            <div className="flex items-center gap-2 text-stone-500 text-sm ml-auto">
              <Images size={13} className="text-stone-600 shrink-0" />
              {totalPhotos} fotoğraf
            </div>
          </div>
        </div>
      </div>

      {/* QR Kodlar */}
      {tokens.length > 0 && (
        <section className="bg-stone-900 rounded-3xl border border-white/6 overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
            <div>
              <h2 className="font-serif text-lg text-white">Misafir QR Kodları</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Bu kodları misafirlerinizle paylaşın — fotoğraf yüklesinler
              </p>
            </div>
            <div className="w-9 h-9 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
              <QrCode size={16} className="text-amber-400" />
            </div>
          </div>
          <div className="px-7 py-5">
            <CoupleQrList tokens={tokens} albums={albums} appUrl={appUrl} />
          </div>
        </section>
      )}

      {/* Fotoğraflar */}
      <section className="bg-stone-900 rounded-3xl border border-white/6 overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
          <div>
            <h2 className="font-serif text-lg text-white">Fotoğraflar</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {totalPhotos > 0 ? `${totalPhotos} fotoğraf · ${albums.length} albüm` : 'Henüz fotoğraf yok'}
            </p>
          </div>
        </div>
        <div className="px-7 py-6 space-y-8">
          <CoupleGallerySection
            albums={albumsWithMedia}
            favSet={favSet}
            weddingId={weddingId}
          />
        </div>
      </section>

    </div>
  )
}
