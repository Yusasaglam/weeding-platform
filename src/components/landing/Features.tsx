'use client'

import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', title: 'Anında Yükleme', desc: 'Fotoğraf ve videolar saniyeler içinde galerinize ulaşır. Gerçek zamanlı senkronizasyon.' },
  { icon: '🎬', title: 'Video Desteği', desc: 'Fotoğrafların yanı sıra yüksek kaliteli video yüklemesi. Sınırsız format desteği.' },
  { icon: '🔒', title: 'Gizli Galeri', desc: 'Her misafir yalnızca kendi yüklediklerini görür. Mahremiyeti koruyarak paylaşım.' },
  { icon: '📱', title: 'Uygulama Gerekmez', desc: 'Misafirler sadece kamerayı açar ve QR&apos;ı tarar. Tek tıkla galeri açılır.' },
  { icon: '💾', title: 'Güvenli Depolama', desc: 'Tüm içerikler şifreli bulutta saklanır. Düğününüzden sonra da erişilebilir.' },
  { icon: '📥', title: 'Toplu İndirme', desc: 'Tüm fotoğrafları tek tıkla bilgisayarınıza indirin. Albüm bazlı seçim imkânı.' },
  { icon: '🎨', title: 'Albüm Yönetimi', desc: 'Fotoğrafları albümlere ayırın, sıralayın ve misafir görünürlüğünü yönetin.' },
  { icon: '❤️', title: 'Favoriler', desc: 'En güzel kareleri favorileyin, özel koleksiyon oluşturun.' },
]

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#fffbf7] px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-3">Özellikler</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">İhtiyacınız olan her şey</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Düğün galerisini yönetmek hiç bu kadar kolay olmamıştı.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl block mb-4">{f.icon}</span>
              <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
