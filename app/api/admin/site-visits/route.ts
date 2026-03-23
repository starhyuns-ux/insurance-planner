import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  try {
    // 1. Get today's visits
    const today = new Date().toISOString().split('T')[0]
    const { data: todayData, error: todayError } = await supabaseAdmin
      .from('site_visits')
      .select('visit_count')
      .eq('visit_date', today)
      .single()

    if (todayError && todayError.code !== 'PGRST116') { // PGRST116 is "row not found"
      console.error('Error fetching today visits:', todayError)
    }
    
    // 2. Get total visits (fetch all days and sum them up)
    const { data: allData, error: allError } = await supabaseAdmin
      .from('site_visits')
      .select('visit_count')

    if (allError) {
      console.error('Error fetching total visits:', allError)
    }

    let total = 0
    if (allData) {
      total = allData.reduce((sum, row) => sum + row.visit_count, 0)
    }

    return NextResponse.json({
      data: {
        today: todayData?.visit_count || 0,
        total
      }
    })
  } catch (err) {
    console.error('Site visits API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
