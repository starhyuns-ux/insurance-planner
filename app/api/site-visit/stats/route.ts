import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    // Fetch last 30 days of site visits
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0]

    const { data, error } = await supabaseAdmin
      .from('site_visits')
      .select('visit_date, visit_count')
      .gte('visit_date', dateStr)
      .order('visit_date', { ascending: true })

    if (error) {
      console.error('Fetch stats error:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Stats catch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
