'use client'

import { motion } from 'framer-motion'

export default function DemoGallery() {
  return (
    <section className="py-28 bg-stone-50 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Demo</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Galeriniz böyle görünür</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">Misafirlerinizin yüklediği tüm anılar, tek panelde düzenli şekilde.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200 shadow-sm overflow-hidden bg-white"
        >
          {/* Browser chrome */}
          <div className="bg-stone-50 px-5 py-3.5 flex items-center gap-3 border-b border-stone-100">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-stone-200" />
              <div className="w-3 h-3 rounded-full bg-stone-200" />
              <div className="w-3 h-3 rounded-full bg-stone-200" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-stone-400 font-mono border border-stone-100">
              app.weddinglens.com/wedding/demo
            </div>
          </div>

          {/* App content */}
          <div className="bg-white">
            <div className="border-b border-stone-100 px-8 py-4 flex items-center justify-between">
              <span className="font-serif text-stone-900">Elif & Mert</span>
              <span className="text-xs text-stone-300">23 Haziran 2025</span>
            </div>

            <div className="p-8">
              <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-stone-100">
                <h3 className="font-serif text-2xl text-stone-900">Düğün Fotoğrafları</h3>
                <span className="text-xs text-stone-300">247 fotoğraf</span>
              </div>

              <div className="grid grid-cols-4 gap-2 h-64">
                <div className="col-span-2 row-span-2 bg-stone-100 rounded-xl" />
                <div className="bg-stone-100 rounded-xl" />
                <div className="bg-stone-200 rounded-xl" />
                <div className="bg-stone-200 rounded-xl" />
                <div className="bg-stone-100 rounded-xl" />
              </div>

              <div className="grid grid-cols-6 gap-2 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-50 border border-stone-100 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
