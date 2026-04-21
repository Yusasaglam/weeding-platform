'use client'

import { motion } from 'framer-motion'

const steps = [
  { number: '01', title: 'QR Kodu Yerleştirin', desc: 'Her masaya özel QR kodunuzu yazdırın. Misafirler telefon kameralarıyla tarar, uygulama gerekmez.' },
  { number: '02', title: 'Misafirler Yükler', desc: 'Fotoğraf ve video yüklerler. Her misafir yalnızca kendi yüklediklerini görür.' },
  { number: '03', title: 'Siz İncelersiniz', desc: 'Panelinizde tüm içerikleri görün, albümlere ayırın, favorileyin ve indirin.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 bg-stone-50 px-6 overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-stone-200 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-stone-200 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-stone-300" />
            <span className="text-stone-300 text-lg">✦</span>
            <div className="h-px w-12 bg-stone-300" />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Nasıl Çalışır?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Üç adımda hazır</h2>
          <p className="text-stone-400 text-lg">Kurulum 5 dakika, anılar ömür boyu.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-linear-to-r from-transparent via-stone-200 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xs font-semibold text-stone-500 shadow-sm">
                  {i + 1}
                </div>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
              <p className="font-serif text-7xl text-stone-100 mt-4 leading-none select-none">{step.number}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
