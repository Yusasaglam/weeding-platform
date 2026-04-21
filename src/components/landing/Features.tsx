'use client'

import { motion } from 'framer-motion'

const features = [
  { title: 'Anında Yükleme', desc: 'Fotoğraf ve videolar saniyeler içinde galerinize ulaşır.' },
  { title: 'Video Desteği', desc: 'Yüksek kaliteli video yüklemesi. Sınırsız format desteği.' },
  { title: 'Gizli Galeri', desc: 'Her misafir yalnızca kendi yüklediklerini görür.' },
  { title: 'Uygulama Gerekmez', desc: 'Sadece QR\'ı tara, galeri anında açılır.' },
  { title: 'Güvenli Depolama', desc: 'Tüm içerikler şifreli bulutta saklanır.' },
  { title: 'Toplu İndirme', desc: 'Tüm fotoğrafları tek tıkla bilgisayarınıza indirin.' },
  { title: 'Albüm Yönetimi', desc: 'Fotoğrafları albümlere ayırın ve yönetin.' },
  { title: 'Favoriler', desc: 'En güzel kareleri favorileyin, koleksiyon oluşturun.' },
]

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Özellikler</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900">İhtiyacınız olan her şey</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <div className="w-px h-8 bg-stone-200 mb-4" />
              <h3 className="font-medium text-stone-900 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
