'use client'

import { motion } from 'framer-motion'

const steps = [
  { number: '01', title: 'QR Kodu Yerleştirin', desc: 'Her masaya özel QR kodunuzu yazdırın. Misafirler telefon kameralarıyla tarar, uygulama gerekmez.' },
  { number: '02', title: 'Misafirler Yükler', desc: 'Fotoğraf ve video yüklerler. Her misafir yalnızca kendi yüklediklerini görür.' },
  { number: '03', title: 'Siz İncelersiniz', desc: 'Panelinizde tüm içerikleri görün, albümlere ayırın, favorileyin ve indirin.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-stone-50 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Nasıl Çalışır?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Üç adımda hazır</h2>
          <p className="text-stone-400 text-lg">Kurulum 5 dakika, anılar ömür boyu.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <p className="font-serif text-6xl text-stone-100 mb-4 leading-none">{step.number}</p>
              <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
