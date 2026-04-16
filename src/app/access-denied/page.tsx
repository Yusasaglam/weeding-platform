export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">🔒</span>
        </div>
        <h1 className="text-xl font-semibold text-stone-800 mb-2">Erişim Geçersiz</h1>
        <p className="text-stone-500 text-sm">
          Bu QR kodu geçersiz, süresi dolmuş veya devre dışı bırakılmış.
          Fotoğrafçınızdan yeni bir QR kod isteyin.
        </p>
      </div>
    </div>
  )
}
