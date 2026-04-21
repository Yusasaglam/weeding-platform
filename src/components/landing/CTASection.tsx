'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-28 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-stone-900 rounded-3xl px-8 py-16 text-center overflow-hidden"
        >
          {/* Decorative pattern inside dark card */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          {/* Corner ornaments inside card */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-white/10 pointer-events-none" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-white/10 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-white/10 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-white/10 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-8 bg-white/20" />
              <span className="text-white/30 text-sm">✦</span>
              <div className="h-px w-8 bg-white/20" />
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">Hemen Başlayın</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              Düğününüzü<br />
              <span className="italic text-stone-400">unutulmaz kılın</span>
            </h2>
            <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
              Bugün başlayın. Kurulum 5 dakika, anılar ömür boyu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-white hover:bg-stone-100 text-stone-900 font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-black/20"
              >
                Hemen Başla →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-white font-medium px-8 py-4 rounded-full transition-colors"
              >
                Fiyatları Gör
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
