import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-stone-800">Kayıt Ol</h1>
          <p className="text-stone-500 text-sm mt-1">Yeni hesap oluşturun</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-stone-500 mt-4">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-stone-800 font-medium underline underline-offset-2">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
