import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  try {
    const { phone, name, code } = await request.json()

    if (!phone || !name || !code) {
      return NextResponse.json({ error: '인증 정보가 부족합니다.' }, { status: 400 })
    }

    // Mock Verification
    if (code !== '123456') {
      return NextResponse.json({ error: '인증번호가 일치하지 않습니다.' }, { status: 400 })
    }

    // 1. Check if the guest already exists in `guest_referrers`
    let { data: guest, error: fetchError } = await supabaseAdmin
      .from('guest_referrers')
      .select('*')
      .eq('phone', phone)
      .single()

    // 2. If not, create a new guest referrer
    if (!guest) {
      // Generate a unique 6-character referral code
      const uniqueCode = crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()

      const { data: newGuest, error: insertError } = await supabaseAdmin
        .from('guest_referrers')
        .insert({
          name,
          phone,
          referral_code: uniqueCode
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert Error:', insertError)
        return NextResponse.json({ error: '계정 생성 중 오류가 발생했습니다.' }, { status: 500 })
      }
      guest = newGuest
    }

    // 3. Set a simple HTTP-only cookie for session management
    const cookieStore = await cookies()
    cookieStore.set('guest_session_id', guest.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        id: guest.id,
        name: guest.name,
        referral_code: guest.referral_code
      }
    })

  } catch (err) {
    console.error('verify-code error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}

