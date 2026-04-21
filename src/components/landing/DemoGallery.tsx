'use client'

import { motion } from 'framer-motion'

const photos = [
  { bg: 'bg-stone-800', emoji: '🌹', size: 'col-span-2 row-span-2' },
  { bg: 'bg-amber-900/40', emoji: '🕊️', size: '' },
  { bg: 'bg-stone-700', emoji: '💐', size: '' },
  { bg: 'bg-stone-800/80', emoji: '🎂', size: '' },
  { bg: 'bg-amber-800/30', emoji: '💍', size: '' },
  { bg: 'bg-stone-700/60', emoji: '🥂', size: '' },
  { bg: 'bg-amber-900/20', emoji: '🌸', size: '' },
]

export default function DemoGallery() {
  return (
    <section className="py-28 bg-stone-950 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">Demo</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Galeriniz böyle görünür</h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Misafirlerinizin yüklediği tüm anılar, tek panelde düzenli şekilde.
          </p>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="bg-stone-900 px-5 py-3.5 flex items-center gap-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-stone-600" />
              <div className="w-3 h-3 rounded-full bg-stone-600" />
              <div className="w-3 h-3 rounded-full bg-stone-600" />
            </div>
            <div className="flex-1 bg-stone-800 rounded-lg px-4 py-1.5 text-xs text-stone-500 font-mono">
              app.weddinglens.com/wedding/demo
            </div>
          </div>

          {/* App content */}
          <div className="bg-stone-950">
            {/* Couple nav */}
            <div className="bg-stone-900 border-b border-white/5 px-8 py-4 flex items-center justify-between">
              <div>
                <p className="font-serif text-white">Elif & Mert</p>
                <p className="text-xs text-stone-500">23 Haziran 2025 Düğünü</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-amber-400 font-medium">Galeri</span>
                <span className="text-sm text-stone-500">Favoriler</span>
                <span className="text-sm text-stone-500">Çıkış</span>
              </div>
            </div>

            {/* Gallery grid */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-white">Düğün Fotoğrafları</h3>
                <span className="text-xs text-stone-500 bg-stone-900 border border-white/5 px-3 py-1.5 rounded-full">247 fotoğraf</span>
              </div>

              <div className="grid grid-cols-4 gap-3 h-80">
                {photos.map((p, i) => (
                  <motion.div
                    key={i}
                    className={`${p.bg} ${p.size} rounded-2xl flex items-center justify-center cursor-pointer border border-white/5`}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <span className="text-4xl opacity-50">{p.emoji}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs text-stone-600 tracking-wider uppercase">Misafirlerden Gelen Fotoğraflar</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-4">
                {['bg-stone-800','bg-amber-900/30','bg-stone-700/50','bg-stone-800/80','bg-amber-800/20','bg-stone-900'].map((bg, i) => (
                  <div key={i} className={`aspect-square ${bg} rounded-xl flex items-center justify-center border border-white/5`}>
                    <span className="text-xl opacity-30">🌸</span>
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
