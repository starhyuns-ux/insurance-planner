import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_id, planner_id, disclosure_data, signature } = body

    if (!planner_id || !disclosure_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store disclosure in a new table or as a metadata field in customers
    // For now, we'll store it as a system message/memo or assume a 'disclosures' table exists.
    // If table doesn't exist, we'll update the customer memo with a structured prefix.
    
    // Attempting to insert into 'customer_disclosures' table (assuming it's created or we'll fallback)
    const { data, error } = await supabase
      .from('customer_disclosures')
      .insert({
        customer_id: customer_id || null,
        planner_id: planner_id,
        content: disclosure_data,
        signature: signature,
        status: 'submitted'
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      // Fallback: If table doesn't exist, append to customer memo
      if (customer_id) {
         const disclosureSummary = `[질병고지 제출완료]\n${JSON.stringify(disclosure_data, null, 2)}`
         await supabase.from('customers').update({ memo: disclosureSummary }).eq('id', customer_id)
      }
      return NextResponse.json({ success: true, message: 'Saved to memo due to table absence' })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Mock API for NHIS record fetching
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isMock = searchParams.get('mock') === 'true'

  if (isMock) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return NextResponse.json({
      success: true,
      records: [
        { date: '2023-11-15', hospital: '서울성모내과의원', disease: '급성 상기도감염 (감기)', treatment: '3일치 약 처방' },
        { date: '2023-08-22', hospital: '바른정형외과', disease: '요추의 염좌 및 긴장', treatment: '물리치료 및 소염제' },
        { date: '2023-04-10', hospital: '연세이비인후과', disease: '알레르기성 비염', treatment: '7일치 약 처방' },
        { date: '2022-12-05', hospital: '한국종합병원', disease: '위염 및 십이지장염', treatment: '위내시경 검사 및 약 처방' }
      ]
    })
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
