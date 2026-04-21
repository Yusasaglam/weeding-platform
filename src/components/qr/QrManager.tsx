'use client'

import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import { createGuestToken, toggleGuestToken, deleteGuestToken } from '@/lib/actions/tokens'
import { Download, Plus, Trash2, ToggleLeft, ToggleRight, QrCode } from 'lucide-react'

interface Token {
  id: string; token: string; label: string; album_id: string | null
  expires_at: string | null; is_active: boolean; created_at: string
}
interface Album { id: string; title: string }

interface Props {
  weddingId: string
  tokens: Token[]
  albums: Album[]
  appUrl: string
}

export default function QrManager({ weddingId, tokens, albums, appUrl }: Props) {
  const [creating, setCreating] = useState(false)
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({})

  function getUrl(token: string) {
    return `${appUrl}/access/${token}`
  }

  async function drawQr(tokenStr: string, canvas: HTMLCanvasElement | null) {
    if (!canvas) return
    await QRCode.toCanvas(canvas, getUrl(tokenStr), {
      width: 240,
      margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    })
  }

  async function downloadQr(token: Token) {
    const canvas = canvasRefs.current[token.id]
    if (!canvas) return
    await drawQr(token.token, canvas)
    const link = document.createElement('a')
    link.download = `qr-${token.label.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-5">

      {/* Empty state */}
      {tokens.length === 0 && !creating && (
        <div className="bg-white rounded-3xl border border-stone-100 px-8 py-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <QrCode size={24} className="text-violet-400" />
          </div>
          <p className="font-serif text-xl text-stone-700 mb-2">Henüz QR kodu yok</p>
          <p className="text-stone-400 text-sm mb-7 max-w-xs mx-auto">
            QR kodu oluşturun, misafirleriniz okutarak galeriye erişsin.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors"
          >
            <Plus size={15} /> İlk QR Kodunu Oluştur
          </button>
        </div>
      )}

      {/* Token grid */}
      {tokens.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {tokens.map((token) => (
            <div key={token.id} className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{token.label}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {token.album_id
                      ? albums.find((a) => a.id === token.album_id)?.title ?? '—'
                      : 'Tüm misafir galerisi'}
                  </p>
                  {token.expires_at && (
                    <p className="text-xs text-stone-300 mt-0.5">
                      Bitiş: {new Date(token.expires_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  token.is_active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-400'
                }`}>
                  {token.is_active ? 'Aktif' : 'Devre Dışı'}
                </span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 flex items-center justify-center mb-4">
                <canvas
                  ref={(el) => { canvasRefs.current[token.id] = el; if (el) drawQr(token.token, el) }}
                  className="rounded-xl"
                />
              </div>

              <p className="text-[10px] text-stone-300 text-center font-mono break-all mb-5">
                {getUrl(token.token)}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadQr(token)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <Download size={12} /> İndir
                </button>
                <form action={toggleGuestToken.bind(null, token.id, !token.is_active, weddingId)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-2 rounded-xl hover:bg-stone-50"
                  >
                    {token.is_active
                      ? <><ToggleRight size={14} /> Devre Dışı</>
                      : <><ToggleLeft size={14} /> Aktifleştir</>
                    }
                  </button>
                </form>
                <form action={deleteGuestToken.bind(null, token.id, weddingId)} className="ml-auto">
                  <button
                    type="submit"
                    className="p-2 text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors rounded-xl"
                    onClick={(e) => { if (!confirm('Bu QR kodu silmek istediğinize emin misiniz?')) e.preventDefault() }}
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new button */}
      {tokens.length > 0 && !creating && (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-stone-200 hover:border-rose-300 hover:text-rose-500 text-stone-400 text-sm font-medium rounded-3xl transition-colors"
        >
          <Plus size={15} /> Yeni QR Kodu Ekle
        </button>
      )}

      {/* Create form */}
      {creating && (
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-stone-100">
            <h3 className="font-serif text-lg text-stone-900">Yeni QR Kodu</h3>
            <p className="text-xs text-stone-400 mt-0.5">QR kodu oluşturun ve misafirlerinizle paylaşın.</p>
          </div>
          <div className="p-7">
            <form
              action={async (fd) => {
                fd.append('weddingId', weddingId)
                await createGuestToken(fd)
                setCreating(false)
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Etiket</label>
                <input
                  name="label"
                  placeholder="Örn: Masa 1, Tüm Misafirler…"
                  defaultValue="Misafirler"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Albüm (opsiyonel)</label>
                <select
                  name="albumId"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition bg-white"
                >
                  <option value="">Tüm misafir galerisine erişim</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Bitiş Tarihi (opsiyonel)</label>
                <input
                  name="expires_at"
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
                />
              </div>
              <div className="pt-2 flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
