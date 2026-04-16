'use client'

import { useState } from 'react'
import { register } from '@/lib/actions/auth'

export default function RegisterForm() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-stone-700 mb-1.5">
            Ad Soyad
          </label>
          <input
            id="full_name" name="full_name" type="text" required
            placeholder="Adınız Soyadınız"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
            Email
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="ornek@email.com"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
            Şifre
          </label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password"
            placeholder="En az 6 karakter"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100">
            {error}
          </p>
        )}
        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-400 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? 'Kayıt olunuyor…' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  )
}
