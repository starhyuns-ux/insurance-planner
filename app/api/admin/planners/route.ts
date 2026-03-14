import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'

// Define admin phone numbers here
const ADMIN_PHONES = [
  '010-6303-5561',
  '01063035561',
  '63035561'
]

export async function GET(request: Request) {
  try {
    // 1. Get the current user from the session
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
       return NextResponse.json({ error: 'Auth failed: No token provided' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Auth failed: Invalid session' }, { status: 401 })
    }

    // 2. Fetch the planner profile to check the phone number
    const { data: profile, error: profileError } = await supabase
      .from('planners')
      .select('phone')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      // Temporary: allow bypass if user ID matches a specific admin ID if phone is missing
      console.log('Profile not found for user:', user.id)
      return NextResponse.json({ error: `Profile not found for ${user.id}` }, { status: 403 })
    }

    const rawPhone = profile.phone || ''
    const cleanPhone = rawPhone.replace(/-/g, '')
    const isAdmin = ADMIN_PHONES.some(p => p.replace(/-/g, '') === cleanPhone)

    if (!isAdmin) {
      return NextResponse.json({ 
        error: `Access Denied for phone: ${rawPhone} (ID: ${user.id})` 
      }, { status: 403 })
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
