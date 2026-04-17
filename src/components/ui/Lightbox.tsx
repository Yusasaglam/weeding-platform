'use client'

import { useEffect, useCallback } from 'react'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaFile {
  id: string
  storage_path: string
  file_name: string
  file_type: string
}

interface Props {
  files: MediaFile[]
  index: number
  supabaseUrl: string
  onClose: () => void
  onNav: (index: number) => void
}

export default function Lightbox({ files, index, supabaseUrl, onClose, onNav }: Props) {
  const file = files[index]

  function mediaUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/wedding-media/${path}`
  }

  const prev = useCallback(() => {
    if (index > 0) onNav(index - 1)
  }, [index, onNav])

  const next = useCallback(() => {
    if (index < files.length - 1) onNav(index + 1)
  }, [index, files.length, onNav])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  async function handleDownload() {
    const url = mediaUrl(file.storage_path)
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = file.file_name
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (!file) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <span className="text-white/60 text-sm">{index + 1} / {files.length}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload() }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            title="İndir"
          >
            <Download size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Media */}
      <div className="max-w-5xl max-h-screen w-full h-full flex items-center justify-center p-16" onClick={(e) => e.stopPropagation()}>
        {file.file_type === 'image' ? (
          <img
            src={mediaUrl(file.storage_path)}
            alt={file.file_name}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            draggable={false}
          />
        ) : (
          <video
            src={mediaUrl(file.storage_path)}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        )}
      </div>

      {/* Next */}
      {index < files.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  )
}
