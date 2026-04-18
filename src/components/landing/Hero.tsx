'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#fffbf7] px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute top-32 -left-32 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-16 -right-24 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ Türkiye&apos;nin ilk QR düğün galerisi
          </motion.div>

          <motion.h1 variants={item} className="font-serif text-5xl md:text-6xl text-stone-900 leading-tight mb-6">
            Düğününüzün<br />
            <span className="text-rose-500">her anını</span><br />
            yaşayın
          </motion.h1>

          <motion.p variants={item} className="text-stone-500 text-lg leading-relaxed mb-10 max-w-md">
            Misafirleriniz QR kodu tarar, fotoğraf ve videolarını yükler.
            Siz de özel panelinizden tüm anıları görüntüler, indirirsiniz.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-rose-200"
            >
              Ücretsiz Dene →
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 hover:border-stone-300 text-sm font-medium px-8 py-4 rounded-full transition-colors"
            >
              Nasıl çalışır?
            </Link>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-6 mt-10 pt-8 border-t border-stone-100">
            {[['500+', 'Mutlu çift'], ['50K+', 'Yüklenen fotoğraf'], ['4.9★', 'Müşteri puanı']].map(([val, label]) => (
              <div key={label}>
                <p className="font-serif text-2xl text-stone-900">{val}</p>
                <p className="text-xs text-stone-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <div className="w-64 bg-stone-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-stone-400/30">
              <div className="bg-[#fffbf7] rounded-[2rem] overflow-hidden">
                <div className="bg-stone-900 px-6 pt-3 pb-1 flex justify-between items-center">
                  <span className="text-white text-[10px]">9:41</span>
                  <div className="w-20 h-5 bg-stone-800 rounded-full" />
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-serif text-stone-800 text-sm text-center mb-0.5">Elif & Mert</p>
                  <p className="text-stone-400 text-[10px] text-center mb-3">23 Haziran 2025</p>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {['bg-rose-100','bg-amber-100','bg-stone-200','bg-rose-200','bg-stone-100','bg-amber-50'].map((c, i) => (
                      <div key={i} className={`aspect-square rounded-lg ${c} flex items-center justify-center`}>
                        <span className="text-lg opacity-50">🌸</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-rose-200 rounded-xl py-3 text-center">
                    <p className="text-[10px] text-rose-400">📷 Fotoğraf Yükle</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -left-16 top-16 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 flex items-center gap-2.5"
            >
              <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-lg">⬛</div>
              <div>
                <p className="text-xs font-semibold text-stone-800">QR Tarandı</p>
                <p className="text-[10px] text-stone-400">Galeri açılıyor…</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-14 bottom-24 bg-white rounded-2xl shadow-xl border border-stone-100 p-3"
            >
              <p className="text-[10px] text-stone-500 mb-1">Yüklendi ✓</p>
              <div className="flex -space-x-1.5">
                {['bg-rose-300','bg-amber-300','bg-stone-300'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-white`} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
