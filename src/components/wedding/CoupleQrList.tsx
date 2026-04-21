'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

interface Token {
  id: string
  token: string
  label: string
  album_id: string | null
  expires_at: string | null
  is_active: boolean
}

interface Album { id: string; title: string }

interface Props {
  tokens: Token[]
  albums: Album[]
  appUrl: string
}

export default function CoupleQrList({ tokens, albums, appUrl }: Props) {
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({})
  const activeTokens = tokens.filter((t) => t.is_active)

  useEffect(() => {
    activeTokens.forEach((t) => {
      const canvas = canvasRefs.current[t.id]
      if (!canvas) return
      QRCode.toCanvas(canvas, `${appUrl}/access/${t.token}`, {
        width: 180,
        margin: 2,
        color: { dark: '#fbbf24', light: '#1c1917' },
      })
    })
  }, [activeTokens, appUrl])

  async function handleDownload(token: Token) {
    const canvas = canvasRefs.current[token.id]
    if (!canvas) return
    await QRCode.toCanvas(canvas, `${appUrl}/access/${token.token}`, {
      width: 500, margin: 2, color: { dark: '#1c1917', light: '#ffffff' },
    })
    const link = document.createElement('a')
    link.download = `qr-${token.label.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL()
    link.click()
    await QRCode.toCanvas(canvas, `${appUrl}/access/${token.token}`, {
      width: 180, margin: 2, color: { dark: '#fbbf24', light: '#1c1917' },
    })
  }

  if (activeTokens.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        Henüz aktif QR kod yok. Fotoğrafçınız yakında oluşturacak.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {activeTokens.map((token) => {
        const albumTitle = token.album_id
          ? albums.find((a) => a.id === token.album_id)?.title
          : null

        return (
          <div key={token.id} className="bg-stone-950/60 rounded-2xl border border-white/6 p-5 flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-white mb-0.5">{token.label}</p>
            <p className="text-xs text-stone-500 mb-4">{albumTitle ?? 'Tüm misafir galerisi'}</p>

            <div className="bg-stone-800 rounded-xl p-3 border border-amber-400/15 mb-4">
              <canvas
                ref={(el) => { canvasRefs.current[token.id] = el }}
                className="block rounded-lg"
              />
            </div>

            {token.expires_at && (
              <p className="text-[11px] text-stone-600 mb-3">
                Bitiş: {new Date(token.expires_at).toLocaleDateString('tr-TR')}
              </p>
            )}

            <button
              onClick={() => handleDownload(token)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors px-3 py-1.5 bg-stone-800 rounded-lg border border-white/6 hover:border-amber-400/30"
            >
              <Download size={11} /> İndir
            </button>
          </div>
        )
      })}
    </div>
  )
}
