'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadMediaFiles } from '@/lib/actions/media'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  weddingId: string
  albums: { id: string; title: string }[]
  defaultAlbumId?: string
}

interface FileItem {
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

export default function BulkUploader({ weddingId, albums, defaultAlbumId }: Props) {
  const [files, setFiles]         = useState<FileItem[]>([])
  const [albumId, setAlbumId]     = useState(defaultAlbumId ?? '')
  const [uploading, setUploading] = useState(false)
  const [summary, setSummary]     = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...accepted.map((f) => ({ file: f, status: 'pending' as const })),
    ])
    setSummary(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
  })

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) return
    setUploading(true)
    setSummary(null)

    const formData = new FormData()
    formData.append('weddingId', weddingId)
    if (albumId) formData.append('albumId', albumId)
    files.forEach((item) => formData.append('files', item.file))

    const result = await uploadMediaFiles(formData)
    const uploaded = result.uploaded ?? 0

    setFiles([])
    setSummary(
      result.errors && result.errors.length > 0
        ? `${uploaded} dosya yüklendi. Hatalar: ${result.errors.join(', ')}`
        : `${uploaded} dosya başarıyla yüklendi.`
    )
    setUploading(false)
  }

  return (
    <div className="space-y-5">
      {albums.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <label className="block text-sm font-medium text-stone-700 mb-2">Albüm (opsiyonel)</label>
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition bg-white"
          >
            <option value="">Albüm seçme (bağımsız)</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`bg-white rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-all shadow-sm ${
          isDragActive
            ? 'border-rose-300 bg-rose-50'
            : 'border-stone-200 hover:border-rose-200 hover:bg-rose-50/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
          isDragActive ? 'bg-rose-100' : 'bg-stone-100'
        }`}>
          <Upload size={22} className={isDragActive ? 'text-rose-500' : 'text-stone-400'} />
        </div>
        <p className="text-sm font-medium text-stone-700">
          {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyin veya tıklayın'}
        </p>
        <p className="text-xs text-stone-400 mt-1.5">JPG, PNG, WebP, HEIC · MP4, MOV · Maks 30 MB / 500 MB</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/40">
            <p className="text-sm font-medium text-stone-700">{files.length} dosya seçildi</p>
            <button onClick={() => setFiles([])} className="text-xs text-stone-400 hover:text-stone-700 transition">
              Temizle
            </button>
          </div>
          <ul className="divide-y divide-stone-50 max-h-64 overflow-y-auto">
            {files.map((item, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                  <span className="text-xs text-stone-600 truncate">{item.file.name}</span>
                  <span className="text-xs text-stone-300 shrink-0">
                    {(item.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <button onClick={() => removeFile(i)} className="text-stone-300 hover:text-red-400 transition shrink-0 ml-2 p-0.5 rounded hover:bg-red-50">
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-stone-100">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {uploading ? 'Yükleniyor…' : `${files.length} Dosyayı Yükle`}
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className={`flex items-start gap-2.5 px-4 py-3.5 rounded-xl text-sm ${
          summary.includes('Hata') ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-green-50 border border-green-100 text-green-700'
        }`}>
          {summary.includes('Hata')
            ? <AlertCircle size={16} className="shrink-0 mt-0.5" />
            : <CheckCircle size={16} className="shrink-0 mt-0.5" />}
          {summary}
        </div>
      )}
    </div>
  )
}
