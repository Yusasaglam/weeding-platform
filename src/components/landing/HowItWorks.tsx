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
    icon: '✦',
    title: 'Siz İncelersiniz',
    desc: 'Panelinizde tüm içerikleri görün, albümlere ayırın, favorileyin ve indirin. Her şey güvenle saklanır.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-stone-950 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#1c1408_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">Nasıl Çalışır?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Üç adımda hazır</h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">Kurulum 5 dakika, anılar ömür boyu.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.6%+3rem)] right-[calc(16.6%+3rem)] h-px bg-linear-to-r from-amber-400/10 via-amber-400/30 to-amber-400/10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center group"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="w-20 h-20 bg-stone-900 border border-amber-400/20 rounded-2xl flex items-center justify-center text-3xl group-hover:border-amber-400/50 transition-colors">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 text-[10px] font-bold text-amber-400/60 tracking-widest bg-stone-950 px-1 rounded">
                  {step.number}
                </span>
              </div>
              <h3 className="font-serif text-xl text-white mb-3">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
