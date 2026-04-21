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
    <section className="relative min-h-screen flex items-center justify-center bg-stone-950 px-6 pt-24 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#451a03_0%,transparent_60%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            ✦ Türkiye&apos;nin ilk QR düğün galerisi
          </motion.div>

          <motion.h1 variants={item} className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6">
            Düğününüzün<br />
            <span className="text-amber-400">her anını</span><br />
            yaşayın
          </motion.h1>

          <motion.p variants={item} className="text-stone-400 text-lg leading-relaxed mb-10 max-w-md">
            Misafirleriniz QR kodu tarar, fotoğraf ve videolarını yükler.
            Siz de özel panelinizden tüm anıları görüntüler, indirirsiniz.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-sm font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-amber-900/20"
            >
              Ücretsiz Dene →
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-stone-300 hover:bg-white/5 text-sm font-medium px-8 py-4 rounded-full transition-colors"
            >
              Nasıl çalışır?
            </Link>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5">
            {[['500+', 'Mutlu çift'], ['50K+', 'Yüklenen fotoğraf'], ['4.9★', 'Müşteri puanı']].map(([val, label]) => (
              <div key={label}>
                <p className="font-serif text-2xl text-amber-400">{val}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
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
            <div className="w-64 bg-stone-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/60 border border-white/5">
              <div className="bg-stone-950 rounded-[2rem] overflow-hidden">
                <div className="bg-stone-900 px-6 pt-3 pb-1 flex justify-between items-center border-b border-white/5">
                  <span className="text-stone-400 text-[10px]">9:41</span>
                  <div className="w-20 h-5 bg-stone-800 rounded-full" />
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-stone-600 rounded-sm" />
                    <div className="w-1.5 h-1.5 bg-stone-600 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-serif text-white text-sm text-center mb-0.5">Elif & Mert</p>
                  <p className="text-stone-500 text-[10px] text-center mb-3">23 Haziran 2025</p>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {['bg-amber-900/40','bg-stone-800','bg-amber-800/30','bg-stone-700/50','bg-amber-900/20','bg-stone-800/80'].map((c, i) => (
                      <div key={i} className={`aspect-square rounded-lg ${c} flex items-center justify-center`}>
                        <span className="text-lg opacity-60">🌸</span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-dashed border-amber-400/30 rounded-xl py-3 text-center bg-amber-400/5">
                    <p className="text-[10px] text-amber-400">📷 Fotoğraf Yükle</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -left-16 top-16 bg-stone-900 rounded-2xl shadow-xl border border-white/10 p-3 flex items-center gap-2.5"
            >
              <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">⬛</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">QR Tarandı</p>
                <p className="text-[10px] text-stone-500">Galeri açılıyor…</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-14 bottom-24 bg-stone-900 rounded-2xl shadow-xl border border-white/10 p-3"
            >
              <p className="text-[10px] text-amber-400 mb-1">Yüklendi ✓</p>
              <div className="flex -space-x-1.5">
                {['bg-amber-600','bg-stone-600','bg-amber-800'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-stone-900`} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
