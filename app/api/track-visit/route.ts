import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    // Calling the RPC to atomically increment today's visit count
    const { error } = await supabaseAdmin.rpc('increment_site_visit')
    
    if (error) {
      console.error('Track visit error:', error)
      return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Track visit catch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
