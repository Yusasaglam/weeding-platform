'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const plans = [
  {
    name: 'Başlangıç', price: '299', desc: 'Küçük düğünler için.',
    features: { 'Düğün etkinliği': '1', 'Fotoğraf': '500', 'Video': '50', 'QR kod': '3', 'Galeri erişimi': '30 gün', 'Toplu indirme': true, 'Albüm yönetimi': false, 'Favoriler': false, 'Öncelikli destek': false, 'Özel domain': false },
    cta: 'Başla', highlight: false,
  },
  {
    name: 'Premium', price: '599', desc: 'Büyük düğünler için.',
    features: { 'Düğün etkinliği': '1', 'Fotoğraf': 'Sınırsız', 'Video': 'Sınırsız', 'QR kod': '10', 'Galeri erişimi': '1 yıl', 'Toplu indirme': true, 'Albüm yönetimi': true, 'Favoriler': true, 'Öncelikli destek': true, 'Özel domain': false },
    cta: 'Hemen Al', highlight: true,
  },
  {
    name: 'Stüdyo', price: '1.499', desc: 'Fotoğrafçılar için.',
    features: { 'Düğün etkinliği': 'Sınırsız', 'Fotoğraf': 'Sınırsız', 'Video': 'Sınırsız', 'QR kod': 'Sınırsız', 'Galeri erişimi': 'Ömür boyu', 'Toplu indirme': true, 'Albüm yönetimi': true, 'Favoriler': true, 'Öncelikli destek': true, 'Özel domain': true },
    cta: 'İletişime Geç', highlight: false,
  },
]

const featureKeys = Object.keys(plans[0].features)

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Fiyatlar</p>
            <h1 className="font-serif text-5xl text-stone-900 mb-3">Düğününüze özel plan</h1>
            <p className="text-stone-400 text-lg">Tek seferlik ödeme. Abonelik yok.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight ? 'bg-stone-900 text-white scale-105' : 'bg-stone-50 border border-stone-100'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-xs font-semibold px-4 py-1 rounded-full border border-stone-100 whitespace-nowrap">
                    En Popüler
                  </div>
                )}
                <p className="text-xs text-stone-400 mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-serif text-4xl">{plan.price}₺</span>
                  <span className="text-sm mb-1 text-stone-400">/etkinlik</span>
                </div>
                <p className="text-sm text-stone-400 mb-6">{plan.desc}</p>
                <Link
                  href="/register"
                  className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors mt-auto ${plan.highlight ? 'bg-white text-stone-900 hover:bg-stone-100' : 'bg-stone-900 text-white hover:bg-stone-700'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-4 bg-stone-50 border-b border-stone-100">
              <div className="px-6 py-4 text-sm text-stone-500">Özellik</div>
              {plans.map((p) => (
                <div key={p.name} className={`px-6 py-4 text-sm font-semibold text-center ${p.highlight ? 'text-stone-900' : 'text-stone-500'}`}>{p.name}</div>
              ))}
            </div>
            {featureKeys.map((key, i) => (
              <div key={key} className={`grid grid-cols-4 border-b border-stone-50 ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}>
                <div className="px-6 py-4 text-sm text-stone-500">{key}</div>
                {plans.map((p) => {
                  const val = p.features[key as keyof typeof p.features]
                  return (
                    <div key={p.name} className="px-6 py-4 text-center">
                      {typeof val === 'boolean'
                        ? val ? <span className="text-stone-700">✓</span> : <span className="text-stone-200">—</span>
                        : <span className="text-sm text-stone-600">{val as string}</span>}
                    </div>
                  )
                })}
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-20 text-center">
            <h2 className="font-serif text-3xl text-stone-900 mb-12">Sık sorulan sorular</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
              {[
                ['Misafirler uygulama indirmek zorunda mı?', 'Hayır. QR kodu tarayınca doğrudan tarayıcıda galeri açılır.'],
                ['Ödeme güvenli mi?', 'Evet. Tüm ödemeler SSL şifreli altyapı üzerinden gerçekleşir.'],
                ['Galeri ne zaman hazır olur?', 'Ödemenin ardından anında aktif olur.'],
                ['Abonelik var mı?', 'Hayır. Tek seferlik ödeme yaparsınız, gizli ücret yoktur.'],
              ].map(([q, a]) => (
                <div key={q} className="bg-stone-50 rounded-2xl border border-stone-100 p-6">
                  <p className="font-medium text-stone-900 mb-2">{q}</p>
                  <p className="text-stone-400 text-sm leading-relaxed">{a}</p>
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
