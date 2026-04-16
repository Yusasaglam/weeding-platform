'use client'

export default function GuestAccessError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-3xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold text-stone-800 mb-2">Sayfa yüklenemedi</h1>
        <p className="text-stone-500 text-sm mb-4">
          Bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
        <p className="text-xs text-stone-300 font-mono break-all">{error.message}</p>
      </div>
    </div>
  )
}
