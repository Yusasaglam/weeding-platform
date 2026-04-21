'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-28 bg-stone-950 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-stone-900 border border-amber-400/15 rounded-3xl px-8 py-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-400/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400/20 to-transparent" />

          <div className="relative">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-xl text-amber-400">✦</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              Düğününüzü<br />unutulmaz kılın
            </h2>
            <p className="text-stone-500 text-lg mb-10 max-w-lg mx-auto">
              Bugün başlayın. Kurulum 5 dakika, anılar ömür boyu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-8 py-4 rounded-full transition-colors"
              >
                Ücretsiz Başla →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-stone-300 font-medium px-8 py-4 rounded-full transition-colors"
              >
                Fiyatları Gör
              </Link>
            </div>
            <p className="text-stone-700 text-xs mt-6">Kredi kartı gerekmez · 14 gün ücretsiz deneme</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
