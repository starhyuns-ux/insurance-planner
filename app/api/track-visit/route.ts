import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    const { source } = await request.json().catch(() => ({ source: 'unknown' }))
    
    // Calling the RPC to atomically increment today's visit count
    // Optional: Pass source to a more advanced RPC if available
    const { error } = await supabaseAdmin.rpc('increment_site_visit', { p_source: source || 'direct' })
    
    if (error) {
      // Fallback if RPC doesn't support source yet
      console.warn('RPC source error, falling back to default increment:', error)
      await supabaseAdmin.rpc('increment_site_visit')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Track visit catch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
