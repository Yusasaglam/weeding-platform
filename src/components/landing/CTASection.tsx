'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-28 bg-stone-50 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-stone-900 rounded-3xl px-8 py-16 text-center"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-6">Hemen Başlayın</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
            Düğününüzü<br />unutulmaz kılın
          </h2>
          <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
            Bugün başlayın. Kurulum 5 dakika, anılar ömür boyu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-white hover:bg-stone-100 text-stone-900 font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Ücretsiz Başla →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-white font-medium px-8 py-4 rounded-full transition-colors"
            >
              Fiyatları Gör
            </Link>
          </div>
          <p className="text-stone-600 text-xs mt-6">Kredi kartı gerekmez · 14 gün ücretsiz deneme</p>
        </motion.div>
      </div>
    </section>
  )
}
