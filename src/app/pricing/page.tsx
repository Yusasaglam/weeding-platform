'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const plans = [
  {
    name: 'Başlangıç',
    price: '299',
    desc: 'Küçük düğünler için ideal başlangıç paketi.',
    features: {
      'Düğün etkinliği': '1',
      'Fotoğraf': '500',
      'Video': '50',
      'QR kod sayısı': '3',
      'Galeri erişimi': '30 gün',
      'Toplu indirme': true,
      'Albüm yönetimi': false,
      'Favoriler': false,
      'Öncelikli destek': false,
      'Özel domain': false,
    },
    cta: 'Başla',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '599',
    desc: 'Büyük düğünler için eksiksiz çözüm.',
    features: {
      'Düğün etkinliği': '1',
      'Fotoğraf': 'Sınırsız',
      'Video': 'Sınırsız',
      'QR kod sayısı': '10',
      'Galeri erişimi': '1 yıl',
      'Toplu indirme': true,
      'Albüm yönetimi': true,
      'Favoriler': true,
      'Öncelikli destek': true,
      'Özel domain': false,
    },
    cta: 'Hemen Al',
    highlight: true,
  },
  {
    name: 'Stüdyo',
    price: '1.499',
    desc: 'Düğün fotoğrafçıları ve stüdyolar için.',
    features: {
      'Düğün etkinliği': 'Sınırsız',
      'Fotoğraf': 'Sınırsız',
      'Video': 'Sınırsız',
      'QR kod sayısı': 'Sınırsız',
      'Galeri erişimi': 'Ömür boyu',
      'Toplu indirme': true,
      'Albüm yönetimi': true,
      'Favoriler': true,
      'Öncelikli destek': true,
      'Özel domain': true,
    },
    cta: 'İletişime Geç',
    highlight: false,
  },
]

const featureKeys = Object.keys(plans[0].features)

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">Fiyatlar</p>
            <h1 className="font-serif text-5xl text-white mb-4">Düğününüze özel plan</h1>
            <p className="text-stone-500 text-lg">
              Tek seferlik ödeme. Abonelik yok. İstediğiniz zaman başlayın.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  plan.highlight
                    ? 'bg-stone-900 border border-amber-400/25 shadow-2xl shadow-amber-900/10 scale-105'
                    : 'bg-stone-900/50 border border-white/6'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    En Popüler
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-1 text-stone-400">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`font-serif text-4xl ${plan.highlight ? 'text-amber-400' : 'text-white'}`}>{plan.price}₺</span>
                    <span className="text-sm mb-1.5 text-stone-500">/etkinlik</span>
                  </div>
                  <p className="text-sm mt-2 text-stone-500">{plan.desc}</p>
                </div>
                <Link
                  href="/register"
                  className={`w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-colors mt-auto ${
                    plan.highlight
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-stone-900 rounded-3xl border border-white/6 overflow-hidden"
          >
            <div className="grid grid-cols-4 bg-stone-950/50 border-b border-white/5">
              <div className="px-6 py-4 text-sm font-medium text-stone-400">Özellik</div>
              {plans.map((p) => (
                <div key={p.name} className={`px-6 py-4 text-sm font-semibold text-center ${p.highlight ? 'text-amber-400' : 'text-stone-300'}`}>
                  {p.name}
                </div>
              ))}
            </div>

            {featureKeys.map((key, i) => (
              <div key={key} className={`grid grid-cols-4 ${i % 2 === 0 ? '' : 'bg-white/2'} border-b border-white/4`}>
                <div className="px-6 py-4 text-sm text-stone-500">{key}</div>
                {plans.map((p) => {
                  const val = p.features[key as keyof typeof p.features]
                  return (
                    <div key={p.name} className="px-6 py-4 text-center">
                      {typeof val === 'boolean' ? (
                        val
                          ? <span className="text-amber-400 text-lg">✓</span>
                          : <span className="text-stone-700 text-lg">—</span>
                      ) : (
                        <span className="text-sm text-stone-300">{val as string}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <h2 className="font-serif text-3xl text-white mb-12">Sık sorulan sorular</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
              {[
                ['Misafirler uygulama indirmek zorunda mı?', 'Hayır. QR kodu tarayınca doğrudan tarayıcıda galeri açılır, hiçbir uygulama gerekmez.'],
                ['Ödeme güvenli mi?', 'Evet. Tüm ödemeler SSL şifreli altyapı üzerinden gerçekleşir.'],
                ['Galeri ne zaman hazır olur?', 'Ödemenin ardından anında aktif olur. Hemen QR kodlarınızı oluşturabilirsiniz.'],
                ['Abonelik var mı?', 'Hayır. Tek seferlik ödeme yaparsınız, gizli ücret yoktur.'],
              ].map(([q, a]) => (
                <div key={q} className="bg-stone-900 rounded-2xl border border-white/6 p-6">
                  <p className="font-medium text-white mb-2">{q}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
