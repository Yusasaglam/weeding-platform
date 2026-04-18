'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-28 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-stone-900 rounded-3xl px-8 py-16 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-500/20 blur-3xl rounded-full" />

          <div className="relative">
            <span className="text-5xl block mb-6">💍</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              Düğününüzü<br />unutulmaz kılın
            </h2>
            <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
              Bugün başlayın. Kurulum 5 dakika, anılar ömür boyu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-rose-900/30"
              >
                Ücretsiz Başla →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full transition-colors border border-white/10"
              >
                Fiyatları Gör
              </Link>
            </div>
            <p className="text-stone-600 text-xs mt-6">Kredi kartı gerekmez · 14 gün ücretsiz deneme</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
