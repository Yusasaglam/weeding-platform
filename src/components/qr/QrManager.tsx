'use client'

import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import { createGuestToken, toggleGuestToken, deleteGuestToken } from '@/lib/actions/tokens'
import { Download, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

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
      width: 280,
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
    <div className="space-y-6">
      {/* Token list */}
      {tokens.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {tokens.map((token) => (
            <div key={token.id} className="bg-white rounded-2xl border border-stone-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{token.label}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {token.album_id
                      ? `Album QR · ${albums.find((a) => a.id === token.album_id)?.title ?? token.album_id}`
                      : 'Tüm misafir galerisi'}
                  </p>
                  {token.expires_at && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      Bitiş: {new Date(token.expires_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  token.is_active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-400'
                }`}>
                  {token.is_active ? 'Aktif' : 'Devre dışı'}
                </span>
              </div>

              <canvas
                ref={(el) => { canvasRefs.current[token.id] = el; if (el) drawQr(token.token, el) }}
                className="rounded-lg mx-auto block"
              />

              <p className="text-xs text-stone-400 text-center mt-2 font-mono break-all">
                {getUrl(token.token)}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => downloadQr(token)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Download size={12} /> İndir
                </button>
                <form action={toggleGuestToken.bind(null, token.id, !token.is_active, weddingId)}>
                  <button type="submit" className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1.5">
                    {token.is_active
                      ? <><ToggleRight size={14} /> Devre Dışı</>
                      : <><ToggleLeft size={14} /> Aktifleştir</>
                    }
                  </button>
                </form>
                <form action={deleteGuestToken.bind(null, token.id, weddingId)} className="ml-auto">
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-600 transition-colors p-1.5"
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

      {/* Create new token */}
      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-dashed border-stone-300 hover:border-stone-400 text-stone-500 hover:text-stone-800 text-sm rounded-2xl transition-colors w-full justify-center"
        >
          <Plus size={15} /> Yeni QR Kodu Oluştur
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-800 mb-4">Yeni QR Kodu</h3>
          <form
            action={async (fd) => {
              fd.append('weddingId', weddingId)
              await createGuestToken(fd)
              setCreating(false)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Etiket</label>
              <input name="label" placeholder="Örn: Masa 1, Tüm Misafirler…" defaultValue="Misafirler"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Albüm (opsiyonel)</label>
              <select name="albumId"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition">
                <option value="">Tüm misafir galerisine erişim</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Bitiş Tarihi (opsiyonel)</label>
              <input name="expires_at" type="datetime-local"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition">
                Oluştur
              </button>
              <button type="button" onClick={() => setCreating(false)} className="text-sm text-stone-500 hover:text-stone-700 transition">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
