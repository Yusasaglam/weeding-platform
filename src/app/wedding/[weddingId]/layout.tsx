import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import CoupleNav from '@/components/wedding/CoupleNav'
import CoupleBottomNav from '@/components/wedding/CoupleBottomNav'

interface Props {
  children: React.ReactNode
  params: Promise<{ weddingId: string }>
}

export default async function WeddingLayout({ children, params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
    <div className="min-h-screen bg-cream-50">
      <CoupleNav wedding={wedding} weddingId={weddingId} logoutAction={logout} />
      <main className="pb-24 md:pb-8">
        {children}
      </main>
      <CoupleBottomNav weddingId={weddingId} />
    </div>
  )
}
