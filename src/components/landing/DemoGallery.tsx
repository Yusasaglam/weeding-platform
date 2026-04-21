'use client'

import { motion } from 'framer-motion'

export default function DemoGallery() {
  return (
    <section className="relative py-28 bg-stone-50 px-6 overflow-hidden">
      {/* Side ornament lines */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-px h-8 bg-stone-200" />
        ))}
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-px h-8 bg-stone-200" />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-stone-300" />
            <span className="text-stone-300">✦</span>
            <div className="h-px w-12 bg-stone-300" />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Demo</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Galeriniz böyle görünür</h2>
          <p className="text-stone-400 max-w-xl mx-auto">Misafirlerinizin yüklediği tüm anılar, tek panelde düzenli şekilde.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/30 overflow-hidden bg-white"
        >
          {/* Browser chrome */}
          <div className="bg-stone-50 px-5 py-3.5 flex items-center gap-3 border-b border-stone-100">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-200" />
              <div className="w-3 h-3 rounded-full bg-amber-200" />
              <div className="w-3 h-3 rounded-full bg-green-200" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-stone-400 font-mono border border-stone-100">
              app.weddinglens.com/wedding/elif-mert
            </div>
          </div>

          <div className="bg-white">
            {/* App nav */}
            <div className="border-b border-stone-100 px-8 py-4 flex items-center justify-between">
              <div>
                <span className="font-serif text-stone-900 text-lg">Elif & Mert</span>
                <span className="text-stone-300 text-xs ml-3">23 Haziran 2025</span>
              </div>
              <div className="flex gap-6 text-xs text-stone-400">
                <span className="text-stone-900 font-medium border-b border-stone-900 pb-0.5">Galeri</span>
                <span>Favoriler</span>
                <span>Çıkış</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-stone-100">
                <h3 className="font-serif text-2xl text-stone-900">Düğün Fotoğrafları</h3>
                <span className="text-xs text-stone-300 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">247 fotoğraf</span>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-4 gap-2 mb-4" style={{ height: '240px' }}>
                <div className="col-span-2 row-span-2 bg-stone-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl opacity-20">🌸</span>
                </div>
                <div className="bg-stone-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl opacity-20">💐</span>
                </div>
                <div className="bg-stone-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl opacity-20">🕊️</span>
                </div>
                <div className="bg-stone-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl opacity-20">🎂</span>
                </div>
                <div className="bg-stone-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl opacity-20">💍</span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-stone-100" />
                <span className="text-xs text-stone-300 tracking-widest uppercase">Misafir Fotoğrafları</span>
                <div className="h-px flex-1 bg-stone-100" />
              </div>

              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-50 border border-stone-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
