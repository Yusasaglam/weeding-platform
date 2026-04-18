'use client'

import { motion } from 'framer-motion'

const photos = [
  { bg: 'bg-rose-100', emoji: '🌹', size: 'col-span-2 row-span-2' },
  { bg: 'bg-amber-50', emoji: '🕊️', size: '' },
  { bg: 'bg-stone-100', emoji: '💐', size: '' },
  { bg: 'bg-rose-50', emoji: '🎂', size: '' },
  { bg: 'bg-amber-100', emoji: '💍', size: '' },
  { bg: 'bg-stone-200', emoji: '🥂', size: '' },
  { bg: 'bg-rose-200', emoji: '🌸', size: '' },
]

export default function DemoGallery() {
  return (
    <section className="py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">Demo</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Galeriniz böyle görünür</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Misafirlerinizin yüklediği tüm anılar, tek panelde düzenli şekilde.
          </p>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="bg-stone-100 px-5 py-3.5 flex items-center gap-3 border-b border-stone-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-stone-400 font-mono">
              app.weddinglens.com/wedding/demo
            </div>
          </div>

          {/* App content */}
          <div className="bg-[#fffbf7]">
            {/* Couple nav */}
            <div className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-800">Elif & Mert</p>
                <p className="text-xs text-stone-400">23 Haziran 2025 Düğünü</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-stone-900 font-medium">Galeri</span>
                <span className="text-sm text-stone-400">Favoriler</span>
                <span className="text-sm text-stone-400">Çıkış</span>
              </div>
            </div>

            {/* Gallery grid */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-stone-800">Düğün Fotoğrafları</h3>
                <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">247 fotoğraf</span>
              </div>

              <div className="grid grid-cols-4 gap-3 h-80">
                {photos.map((p, i) => (
                  <motion.div
                    key={i}
                    className={`${p.bg} ${p.size} rounded-2xl flex items-center justify-center cursor-pointer`}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <span className="text-4xl opacity-60">{p.emoji}</span>
                  </motion.div>
                ))}
              </div>

              {/* Guest uploads section */}
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-100" />
                <span className="text-xs text-stone-400 tracking-wider uppercase">Misafirlerden Gelen Fotoğraflar</span>
                <div className="h-px flex-1 bg-stone-100" />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-4">
                {['bg-rose-50','bg-amber-50','bg-stone-50','bg-rose-100','bg-amber-100','bg-stone-100'].map((bg, i) => (
                  <div key={i} className={`aspect-square ${bg} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl opacity-40">🌸</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
