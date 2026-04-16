'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createWedding(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title      = (formData.get('title')      as string).trim()
  const bride_name = (formData.get('bride_name') as string).trim()
  const groom_name = (formData.get('groom_name') as string).trim()
  const event_date = (formData.get('event_date') as string) || null
  const venue      = (formData.get('venue')      as string).trim()

  if (!title) return

  const { data, error } = await supabase
    .from('weddings')
    .insert({ title, bride_name, groom_name, event_date, venue, created_by: user.id })
    .select('id')
    .single()

  if (error || !data) return

  revalidatePath('/dashboard/weddings')
  redirect(`/dashboard/weddings/${data.id}`)
}

export async function updateWedding(weddingId: string, formData: FormData) {
  const supabase = await createClient()

  const title      = (formData.get('title')      as string).trim()
  const bride_name = (formData.get('bride_name') as string).trim()
  const groom_name = (formData.get('groom_name') as string).trim()
  const event_date = (formData.get('event_date') as string) || null
  const venue      = (formData.get('venue')      as string).trim()
  const status     =  formData.get('status')     as string

  const { error } = await supabase
    .from('weddings')
    .update({ title, bride_name, groom_name, event_date, venue, status })
    .eq('id', weddingId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}`)
  return { success: true }
}

export async function deleteWedding(weddingId: string) {
  const supabase = await createClient()
  await supabase.from('weddings').delete().eq('id', weddingId)
  revalidatePath('/dashboard/weddings')
  redirect('/dashboard/weddings')
}
