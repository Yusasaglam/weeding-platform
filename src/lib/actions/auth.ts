'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email    = (formData.get('email')    as string).trim()
  const password =  formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Email veya şifre hatalı.' }

  revalidatePath('/', 'layout')
  redirect('/auth/redirect')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const full_name = (formData.get('full_name') as string)?.trim()
  const email     = (formData.get('email')     as string)?.trim()
  const password  =  formData.get('password')  as string

  if (!full_name || !email || !password)
    return { error: 'Tüm alanları doldurun.' }

  if (password.length < 6)
    return { error: 'Şifre en az 6 karakter olmalı.' }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })

  if (error) {
    if (error.message.includes('already registered'))
      return { error: 'Bu email zaten kayıtlı. Giriş yapmayı deneyin.' }
    if (error.message.includes('rate limit'))
      return { error: 'Çok fazla deneme yapıldı. Birkaç dakika bekleyin.' }
    return { error: error.message }
  }

  // Auto sign-in after registration
  await supabase.auth.signInWithPassword({ email, password })

  revalidatePath('/', 'layout')
  redirect('/auth/redirect')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
