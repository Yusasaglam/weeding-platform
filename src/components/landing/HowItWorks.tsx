'use client'

import { motion } from 'framer-motion'
import { Heart, FolderOpen, Upload } from 'lucide-react'

function QRVisual() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-stone-50 border-b border-stone-100 px-4 py-2.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-200" />
        <div className="w-2 h-2 rounded-full bg-amber-200" />
        <div className="w-2 h-2 rounded-full bg-green-200" />
        <span className="text-[10px] text-stone-400 font-mono ml-1">QR Yönetimi</span>
      </div>
      <div className="p-4 space-y-2.5">
        {[
          { label: 'Masa 1 · Salon', count: '18 fotoğraf', active: true },
          { label: 'Masa 2 · Balkon', count: '24 fotoğraf', active: true },
          { label: 'Masa 3 · Bahçe', count: '—', active: false },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-900 rounded-lg p-1 shrink-0">
              <div className="grid grid-cols-3 gap-px w-full h-full">
                {[1,1,0,1,0,1,0,1,1].map((c, i) => (
                  <div key={i} className={`rounded-sm ${c ? 'bg-white' : 'bg-stone-900'}`} />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-800 truncate">{row.label}</p>
              <p className="text-[10px] text-stone-400">{row.count}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
              row.active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-400'
            }`}>
              {row.active ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UploadVisual() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-stone-50 border-b border-stone-100 px-4 py-2.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-200" />
        <div className="w-2 h-2 rounded-full bg-amber-200" />
        <div className="w-2 h-2 rounded-full bg-green-200" />
        <span className="text-[10px] text-stone-400 font-mono ml-1">Galeri · Misafir Yüklemesi</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-50">
          <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
            <Upload size={14} className="text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-800">3 misafir yüklüyor</p>
            <p className="text-[10px] text-stone-400">Elif & Mert Düğünü</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { name: 'IMG_2341.jpg', size: '2.3 MB', pct: 100 },
            { name: 'VID_0018.mp4', size: '18 MB', pct: 100 },
            { name: 'IMG_2345.jpg', size: '3.1 MB', pct: 62 },
          ].map((f) => (
            <div key={f.name} className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center shrink-0 text-[11px]">
                {f.name.endsWith('.mp4') ? '🎬' : '📷'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-stone-700 truncate">{f.name}</p>
                <div className="mt-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-800 rounded-full" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-stone-400 shrink-0">{f.pct === 100 ? '✓' : f.size}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-green-600 text-center mt-3 font-medium">2/3 tamamlandı</p>
      </div>
    </div>
  )
}

function GalleryVisual() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-stone-50 border-b border-stone-100 px-4 py-2.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-200" />
        <div className="w-2 h-2 rounded-full bg-amber-200" />
        <div className="w-2 h-2 rounded-full bg-green-200" />
        <span className="text-[10px] text-stone-400 font-mono ml-1">Admin Paneli · Albümler</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-stone-800">Düğün Fotoğrafları</p>
            <p className="text-[10px] text-stone-400">247 fotoğraf · 3 albüm</p>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-6 bg-rose-50 rounded-lg flex items-center justify-center">
              <Heart size={9} className="text-rose-500" />
            </div>
            <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
              <FolderOpen size={9} className="text-amber-500" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            'bg-stone-200', 'bg-stone-300', 'bg-stone-100', 'bg-stone-200',
            'bg-stone-100', 'bg-stone-200', 'bg-stone-300', 'bg-stone-100',
          ].map((c, i) => (
            <div key={i} className={`aspect-square ${c} rounded-lg flex items-center justify-center relative group`}>
              {i === 3 && (
                <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                  <Heart size={10} className="text-white fill-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const steps = [
  {
    number: '01',
    title: 'QR Kodu Yerleştirin',
    desc: 'Her masaya özel QR kodunuzu yazdırın. Misafirler telefon kameralarıyla tarar, uygulama gerekmez.',
    Visual: QRVisual,
  },
  {
    number: '02',
    title: 'Misafirler Yükler',
    desc: 'Fotoğraf ve video yüklerler. Her misafir yalnızca kendi yüklediklerini görür.',
    Visual: UploadVisual,
  },
  {
    number: '03',
    title: 'Siz İncelersiniz',
    desc: 'Panelinizde tüm içerikleri görün, albümlere ayırın, favorileyin ve indirin.',
    Visual: GalleryVisual,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-stone-50 px-5 md:px-6 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-stone-200 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-stone-200 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-stone-300" />
            <span className="text-stone-300 text-lg">✦</span>
            <div className="h-px w-12 bg-stone-300" />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4">Nasıl Çalışır?</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Üç adımda hazır</h2>
          <p className="text-stone-400 text-base md:text-lg">Kurulum 5 dakika, anılar ömür boyu.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => {
            const Visual = step.Visual
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Visual />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xs font-semibold text-stone-500 shadow-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                <p className="font-serif text-7xl text-stone-100 mt-4 leading-none select-none">{step.number}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
