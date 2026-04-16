import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoupleNav from '@/components/wedding/CoupleNav'
import { logout } from '@/lib/actions/auth'

interface Props {
  children: React.ReactNode
  params: Promise<{ weddingId: string }>
}

export default async function WeddingLayout({ children, params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify couple is assigned to this wedding
  const { data: assignment } = await supabase
    .from('wedding_couples')
    .select('wedding_id')
    .eq('user_id', user.id)
    .eq('wedding_id', weddingId)
    .single()

  if (!assignment) redirect('/waiting')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('title, bride_name, groom_name')
    .eq('id', weddingId)
    .single()

  return (
    <div className="min-h-screen bg-stone-50">
      <CoupleNav wedding={wedding} weddingId={weddingId} logoutAction={logout} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
