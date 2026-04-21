'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Başlangıç',
    price: '299',
    desc: 'Tek düğün için mükemmel',
    features: ['1 düğün etkinliği', '500 fotoğraf / 50 video', '3 QR kod', '30 gün erişim', 'Toplu indirme'],
    cta: 'Başla',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '599',
    desc: 'En çok tercih edilen',
    features: ['1 düğün etkinliği', 'Sınırsız fotoğraf & video', '10 QR kod', '1 yıl erişim', 'Öncelikli destek', 'Albüm yönetimi', 'Favoriler'],
    cta: 'Hemen Al',
    highlight: true,
  },
  {
    name: 'Stüdyo',
    price: '1.499',
    desc: 'Fotoğrafçılar için',
    features: ['Sınırsız etkinlik', 'Sınırsız içerik', 'Sınırsız QR kod', 'Ömür boyu erişim', 'Özel domain'],
    cta: 'İletişime Geç',
    highlight: false,
  },
]

export default function PricingPreview() {
  return (
    <section className="py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Fiyatlar</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900">Düğününüze özel plan</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 border border-stone-100'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-xs font-semibold px-4 py-1 rounded-full border border-stone-100 whitespace-nowrap">
                  En Popüler
                </div>
              )}
              <div className="mb-6">
                <p className={`text-xs font-medium mb-2 ${plan.highlight ? 'text-stone-400' : 'text-stone-400'}`}>{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-serif text-4xl">{plan.price}₺</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-stone-500' : 'text-stone-400'}`}>/etkinlik</span>
                </div>
                <p className={`text-sm mt-1.5 ${plan.highlight ? 'text-stone-400' : 'text-stone-400'}`}>{plan.desc}</p>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-stone-300' : 'text-stone-500'}`}>
                    <span className={plan.highlight ? 'text-stone-500' : 'text-stone-300'}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-stone-900 hover:bg-stone-100'
                    : 'bg-stone-900 text-white hover:bg-stone-700'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-4">
            Tüm planları karşılaştır →
          </Link>
        </div>
      </div>
    </section>
  )
}
