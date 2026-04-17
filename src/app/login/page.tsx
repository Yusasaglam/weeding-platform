import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">💍</span>
          <h1 className="font-serif text-3xl text-stone-800 mt-3">Wedding Studio</h1>
          <p className="text-stone-400 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-stone-400 mt-5">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="text-stone-700 font-medium hover:text-stone-900 transition-colors">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
