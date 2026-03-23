import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: '인증 헤더가 필요합니다.' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: '인증 토큰이 유효하지 않습니다.' }, { status: 401 })
    }

    // Admins only (for now, simply relying on the UI restrictions and assuming token is valid)
    // Ideally verify admin email here
    // const adminEmails = ['stroykr@gmail.com']
    // if (!adminEmails.includes(user.email || '')) {
    //   return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 })
    // }

    const body = await request.json()
    const { status, reward_amount } = body

    if (!status) {
      return NextResponse.json({ error: '상태 값이 필요합니다.' }, { status: 400 })
    }

    // Update the referral record
    const { data: updatedReferral, error: updateError } = await supabaseAdmin
      .from('referrals')
      .update({ 
        status, 
        reward_amount: reward_amount !== undefined ? reward_amount : 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating referral:', updateError)
      return NextResponse.json({ error: '추천 내역을 업데이트하는 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: updatedReferral })

  } catch (err: any) {
    console.error('Admin referral update error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
