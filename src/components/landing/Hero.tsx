'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white px-6 pt-24 pb-16 overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      {/* Corner ornaments */}
      <div className="absolute top-28 left-8 w-24 h-24 border-l border-t border-stone-200 pointer-events-none" />
      <div className="absolute top-28 right-8 w-24 h-24 border-r border-t border-stone-200 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-stone-100 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-stone-100 pointer-events-none" />
      {/* Soft radial glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-stone-300" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400">
              Türkiye&apos;nin ilk QR düğün galerisi
            </p>
          </motion.div>

          <motion.h1 variants={item} className="font-serif text-5xl md:text-6xl text-stone-950 leading-tight mb-6">
            Düğününüzün<br />
            her anını<br />
            <span className="italic text-stone-400">yaşayın</span>
          </motion.h1>

          <motion.p variants={item} className="text-stone-400 text-lg leading-relaxed mb-10 max-w-md">
            Misafirleriniz QR kodu tarar, fotoğraf ve videolarını yükler.
            Siz de özel panelinizden tüm anıları görüntüler, indirirsiniz.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-stone-200"
            >
              Ücretsiz Dene →
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium px-8 py-4 rounded-full transition-colors"
            >
              Nasıl çalışır?
            </Link>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-8 mt-10 pt-8 border-t border-stone-100">
            {[['500+', 'Mutlu çift'], ['50K+', 'Yüklenen fotoğraf'], ['4.9★', 'Müşteri puanı']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-serif text-2xl text-stone-900">{val}</p>
                <p className="text-xs text-stone-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Decorative ring behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-stone-100 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-stone-50 rounded-full" />

          <div className="relative">
            <div className="w-64 bg-stone-100 rounded-[2.5rem] p-2.5 shadow-xl shadow-stone-200/80">
              <div className="bg-white rounded-4xl overflow-hidden border border-stone-100">
                <div className="bg-stone-900 px-6 pt-3 pb-1 flex justify-between items-center">
                  <span className="text-stone-400 text-[10px]">9:41</span>
                  <div className="w-20 h-5 bg-stone-800 rounded-full" />
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-stone-600 rounded-sm" />
                    <div className="w-1.5 h-1.5 bg-stone-600 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-serif text-stone-800 text-sm text-center mb-0.5">Elif & Mert</p>
                  <p className="text-stone-300 text-[10px] text-center mb-3">23 Haziran 2025</p>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {['bg-stone-100','bg-stone-200','bg-stone-100','bg-stone-200','bg-stone-100','bg-stone-200'].map((c, i) => (
                      <div key={i} className={`aspect-square rounded-lg ${c} flex items-center justify-center`}>
                        <span className="text-lg opacity-40">🌸</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-stone-200 rounded-xl py-3 text-center">
                    <p className="text-[10px] text-stone-400">📷 Fotoğraf Yükle</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -left-20 top-16 bg-white rounded-2xl shadow-lg shadow-stone-200/60 border border-stone-100 p-3 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center text-sm shrink-0">⬛</div>
              <div>
                <p className="text-xs font-semibold text-stone-800">QR Tarandı</p>
                <p className="text-[10px] text-stone-400">Galeri açılıyor…</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-16 bottom-24 bg-white rounded-2xl shadow-lg shadow-stone-200/60 border border-stone-100 p-3"
            >
              <p className="text-[10px] text-stone-500 mb-1.5">Yüklendi ✓</p>
              <div className="flex -space-x-1.5">
                {['bg-stone-200','bg-stone-300','bg-stone-200'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-white`} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-stone-50/50 to-transparent pointer-events-none" />
    </section>
  )
}
