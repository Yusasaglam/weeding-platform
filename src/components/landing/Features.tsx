'use client'

import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', title: 'Anında Yükleme', desc: 'Fotoğraf ve videolar saniyeler içinde galerinize ulaşır. Gerçek zamanlı senkronizasyon.' },
  { icon: '🎬', title: 'Video Desteği', desc: 'Fotoğrafların yanı sıra yüksek kaliteli video yüklemesi. Sınırsız format desteği.' },
  { icon: '🔒', title: 'Gizli Galeri', desc: 'Her misafir yalnızca kendi yüklediklerini görür. Mahremiyeti koruyarak paylaşım.' },
  { icon: '📱', title: 'Uygulama Gerekmez', desc: 'Misafirler sadece kamerayı açar ve QR\'ı tarar. Tek tıkla galeri açılır.' },
  { icon: '💾', title: 'Güvenli Depolama', desc: 'Tüm içerikler şifreli bulutta saklanır. Düğününüzden sonra da erişilebilir.' },
  { icon: '📥', title: 'Toplu İndirme', desc: 'Tüm fotoğrafları tek tıkla bilgisayarınıza indirin. Albüm bazlı seçim imkânı.' },
  { icon: '🎨', title: 'Albüm Yönetimi', desc: 'Fotoğrafları albümlere ayırın, sıralayın ve misafir görünürlüğünü yönetin.' },
  { icon: '❤️', title: 'Favoriler', desc: 'En güzel kareleri favorileyin, özel koleksiyon oluşturun.' },
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
          className="text-center mb-16"
        >
          <p className="text-amber-500 text-xs font-semibold tracking-widest uppercase mb-4">Özellikler</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">İhtiyacınız olan her şey</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Düğün galerisini yönetmek hiç bu kadar kolay olmamıştı.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
            >
              <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center mb-4 text-lg group-hover:bg-amber-400 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
