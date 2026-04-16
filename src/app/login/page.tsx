import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-stone-800">Giriş Yap</h1>
          <p className="text-stone-500 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-stone-500 mt-4">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="text-stone-800 font-medium underline underline-offset-2">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
