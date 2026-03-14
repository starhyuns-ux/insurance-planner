import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'

// Define admin phone numbers here
const ADMIN_PHONES = [
  '010-6303-5561',
  '01063035561'
]

export async function GET() {
  try {
    // 1. Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch the planner profile to check the phone number
    const { data: profile, error: profileError } = await supabase
      .from('planners')
      .select('phone')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const cleanPhone = profile.phone?.replace(/-/g, '')
    const isAdmin = ADMIN_PHONES.some(p => p.replace(/-/g, '') === cleanPhone)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    // 3. Fetch all planners as admin
    const { data: planners, error: fetchError } = await supabaseAdmin
      .from('planners')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: planners })
  } catch (err: any) {
    console.error('Admin API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
