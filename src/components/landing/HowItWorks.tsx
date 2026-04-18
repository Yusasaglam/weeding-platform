'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: '⬛',
    title: 'QR Kodu Yerleştirin',
    desc: 'Her masaya özel QR kodunuzu yazdırın. Misafirler telefon kameralarıyla tarar, herhangi bir uygulama indirmelerine gerek yok.',
  },
  {
    number: '02',
    icon: '📸',
    title: 'Misafirler Yükler',
    desc: 'Misafirler fotoğraf, video ve dilerlerse not ekler. Her misafir yalnızca kendi yüklediklerini görür.',
  },
  {
    number: '03',
    icon: '💝',
    title: 'Siz İncelersiniz',
    desc: 'Panelinizde tüm içerikleri görün, albümlere ayırın, favorileyin ve yükseltin. Her şey güvenle saklanır.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">Nasıl Çalışır?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Üç adımda hazır</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Kurulum 5 dakika, anılar ömür boyu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-rose-100 via-rose-200 to-rose-100" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl border border-rose-100 shadow-sm">
                {step.icon}
              </div>
              <span className="absolute top-2 right-[calc(50%-3.5rem)] text-xs font-bold text-rose-200 tracking-widest">
                {step.number}
              </span>
              <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
