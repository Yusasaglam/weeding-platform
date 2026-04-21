'use client'

import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', title: 'Anında Yükleme', desc: 'Fotoğraf ve videolar saniyeler içinde galerinize ulaşır.' },
  { icon: '🎬', title: 'Video Desteği', desc: 'Yüksek kaliteli video yüklemesi. Sınırsız format desteği.' },
  { icon: '🔒', title: 'Gizli Galeri', desc: 'Her misafir yalnızca kendi yüklediklerini görür.' },
  { icon: '📱', title: 'Uygulama Gerekmez', desc: 'Sadece QR\'ı tara, galeri anında açılır.' },
  { icon: '💾', title: 'Güvenli Depolama', desc: 'Tüm içerikler şifreli bulutta saklanır.' },
  { icon: '📥', title: 'Toplu İndirme', desc: 'Tüm fotoğrafları tek tıkla bilgisayarınıza indirin.' },
  { icon: '🎨', title: 'Albüm Yönetimi', desc: 'Fotoğrafları albümlere ayırın ve yönetin.' },
  { icon: '❤️', title: 'Favoriler', desc: 'En güzel kareleri favorileyin, koleksiyon oluşturun.' },
]

export default function Features() {
  return (
    <section id="features" className="relative py-28 bg-white px-6 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      {/* Decorative large serif text */}
      <div className="absolute -right-8 top-16 font-serif text-[180px] text-stone-100 leading-none select-none pointer-events-none opacity-60">
        ✦
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-3">Özellikler</p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900">İhtiyacınız olan her şey</h2>
          </div>
          <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
            Düğün galerisini yönetmek hiç bu kadar kolay olmamıştı.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-stone-100 rounded-3xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className={`p-7 border-stone-100 hover:bg-stone-50 transition-colors group
                ${i % 4 !== 3 ? 'border-r' : ''}
                ${i < 4 ? 'border-b' : ''}
              `}
            >
              <span className="text-2xl block mb-4 grayscale group-hover:grayscale-0 transition-all">{f.icon}</span>
              <h3 className="font-medium text-stone-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
