import { createAdminClient } from '@/lib/supabase/admin'

export default async function DemoGallery() {
  const admin = createAdminClient()

  const [{ data: media }, { data: weddings }] = await Promise.all([
    admin
      .from('media_files')
      .select('id, storage_path, file_type')
      .eq('file_type', 'image')
      .order('created_at', { ascending: false })
      .limit(9),
    admin
      .from('weddings')
      .select('bride_name, groom_name, event_date')
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const photos = media ?? []
  const w = weddings?.[0]
  const coupleName = w?.bride_name && w?.groom_name
    ? `${w.bride_name} & ${w.groom_name}`
    : 'Elif & Mert'
  const eventDate = w?.event_date
    ? new Date(w.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '23 Haziran 2025'
  const photoCount = photos.length > 0 ? `${photos.length}+ fotoğraf` : '247 fotoğraf'

  const placeholders = [
    'bg-stone-200', 'bg-stone-100', 'bg-stone-300',
    'bg-stone-100', 'bg-stone-200', 'bg-stone-300',
    'bg-stone-100', 'bg-stone-200', 'bg-stone-300',
  ]

  return (
    <section className="relative py-20 md:py-28 bg-white px-5 md:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-stone-300" />
            <span className="text-stone-300">✦</span>
            <div className="h-px w-12 bg-stone-300" />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Demo</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Galeriniz böyle görünür</h2>
          <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto">
            Misafirlerinizin yüklediği tüm anılar, tek panelde düzenli şekilde.
            {photos.length > 0 && <span className="text-rose-400 font-medium"> Gerçek fotoğraflar.</span>}
          </p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-2xl md:rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/30 overflow-hidden bg-white">
          {/* Browser chrome */}
          <div className="bg-stone-50 px-4 md:px-5 py-3 flex items-center gap-2 md:gap-3 border-b border-stone-100">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-amber-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-[10px] md:text-xs text-stone-400 font-mono border border-stone-100 truncate">
              weeding-platform.vercel.app/wedding/…
            </div>
          </div>

          {/* App content — matches actual CoupleNav + page design */}
          <div className="bg-white">
            {/* Nav — matches CoupleNav */}
            <div className="border-b border-stone-100 bg-white">
              <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
                <span className="font-serif text-stone-900 text-sm md:text-lg tracking-tight">{coupleName}</span>
                <div className="flex items-center gap-3 md:gap-6 text-xs text-stone-400">
                  <span className="font-medium text-stone-800 border-b border-stone-800 pb-0.5">Galeri</span>
                  <span className="hidden sm:inline">Favoriler</span>
                  <span className="hidden sm:inline">Çıkış</span>
                </div>
              </div>
            </div>

            {/* Page content — matches couple page */}
            <div className="px-4 md:px-8 py-5 md:py-8">
              {/* Wedding hero section */}
              <div className="pb-5 mb-5 border-b border-stone-100">
                <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">Düğün Galerisi</p>
                <h1 className="font-serif text-xl md:text-3xl text-stone-950 mb-3">{coupleName}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-5 text-stone-400 text-xs">
                  <span>📅 {eventDate}</span>
                  <span>🖼 {photoCount}</span>
                </div>
              </div>

              {/* Album header — matches CoupleGallerySection */}
              <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-stone-100">
                <h3 className="font-serif text-base md:text-xl text-stone-900">Düğün Fotoğrafları</h3>
                <span className="text-xs text-stone-300 shrink-0 ml-4">{photos.length > 0 ? photos.length : 247} fotoğraf</span>
              </div>

              {/* Photo grid — matches CoupleGallerySection grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
                {photos.length > 0
                  ? photos.slice(0, 10).map((photo) => (
                      <div key={photo.id} className="aspect-square bg-stone-100 overflow-hidden">
                        <img
                          src={`${supabaseUrl}/storage/v1/object/public/wedding-media/${photo.storage_path}`}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))
                  : placeholders.map((c, i) => (
                      <div key={i} className={`aspect-square ${c} flex items-center justify-center`}>
                        <span className="text-xl opacity-20">🌸</span>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
