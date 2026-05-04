import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'
import { faxClient } from '@/lib/fax-client'

const ADMIN_PHONES = [
  '010-6303-5561',
  '01063035561',
  '63035561'
]

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Check
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: '유효하지 않은 세션입니다.' }, { status: 401 })

    // Admin Verify
    const { data: profile } = await supabase.from('planners').select('phone').eq('id', user.id).single()
    const cleanPhone = (profile?.phone || '').replace(/-/g, '')
    const isAdmin = ADMIN_PHONES.some(p => p.replace(/-/g, '') === cleanPhone)
    if (!isAdmin) return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 })

    // 2. Parse Multipart Data (File + Fields)
    const formData = await req.formData()
    const receiverNum = formData.get('receiverNum') as string
    const receiverName = (formData.get('receiverName') as string) || '수신자'
    const senderName = (formData.get('senderName') as string) || '인슈닷 관리자'
    const senderNum = (formData.get('senderNum') as string) || '010-6303-5561'
    const files = formData.getAll('files') as File[]

    if (!receiverNum || files.length === 0) {
      return NextResponse.json({ error: '팩스 번호와 파일은 필수입니다.' }, { status: 400 })
    }

    // 3. Convert All Files to Buffers
    const filesToTransmit = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      return {
        name: file.name,
        data: Buffer.from(arrayBuffer)
      }
    }))

    // 4. Transmit via Fax API
    console.log(`[ADMIN FAX] Sending manual fax with ${files.length} files to ${receiverNum}...`)
    const faxResult = await faxClient.sendFax({
      receiverNum,
      receiverName,
      senderName,
      senderNum,
      title: `[수동전송] ${receiverName}님 앞 (총 ${files.length}건)`,
      files: filesToTransmit,
    })

    // 5. Record to Database (manual_faxes)
    try {
      await supabaseAdmin
        .from('manual_faxes')
        .insert({
          receipt_id: faxResult.receiptId,
          receiver_num: receiverNum,
          receiver_name: receiverName,
          sender_name: senderName,
          sender_num: senderNum,
          status: 'SENT',
          pages: files.length,
          created_at: new Date().toISOString()
        })
    } catch (dbErr) {
      console.warn('[ADMIN FAX] DB Recording failed (non-critical):', dbErr)
    }

    return NextResponse.json({
      success: true,
      message: `${receiverNum}으로 팩스 전송을 요청했습니다.`,
      receiptId: faxResult.receiptId
    })

  } catch (err: any) {
    console.error('[ADMIN FAX ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
