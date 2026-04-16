'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

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
        width: 200,
        margin: 2,
        color: { dark: '#1c1917', light: '#ffffff' },
      })
    })
  }, [activeTokens, appUrl])

  if (activeTokens.length === 0) {
    return (
      <p className="text-sm text-stone-400">Henüz aktif barkod yok. Fotoğrafçınız oluşturacak.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {activeTokens.map((token) => {
        const albumTitle = token.album_id
          ? albums.find((a) => a.id === token.album_id)?.title
          : null

        return (
          <div key={token.id} className="bg-white rounded-2xl border border-stone-200 p-5 text-center">
            <p className="text-sm font-semibold text-stone-800 mb-0.5">{token.label}</p>
            <p className="text-xs text-stone-400 mb-4">
              {albumTitle ? albumTitle : 'Tüm misafir galerisi'}
            </p>
            <canvas
              ref={(el) => { canvasRefs.current[token.id] = el }}
              className="rounded-lg mx-auto block"
            />
            {token.expires_at && (
              <p className="text-xs text-stone-400 mt-3">
                Bitiş: {new Date(token.expires_at).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
