import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'
import { faxClient } from '@/lib/fax-client'

const ADMIN_PHONES = [
  '010-6303-5561',
  '01063035561',
  '63035561'
]

export async function GET(req: NextRequest) {
  try {
    // 1. Auth Check
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Auth failed' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Auth failed' }, { status: 401 })

    // Admin Verify
    const { data: profile } = await supabase.from('planners').select('phone').eq('id', user.id).single()
    const cleanPhone = (profile?.phone || '').replace(/-/g, '')
    if (!ADMIN_PHONES.some(p => p.replace(/-/g, '') === cleanPhone)) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    // 2. Fetch Recent Manual Faxes from DB
    const { data: history, error: fetchError } = await supabaseAdmin
      .from('manual_faxes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (fetchError) throw fetchError

    // 3. Update Status for pending faxes (SENT status)
    const updatedHistory = await Promise.all((history || []).map(async (fax) => {
      // If it's already a final state, skip API call
      if (fax.status === 'SUCCESS' || fax.status === 'FAIL') return fax

      try {
        const result = await faxClient.getFaxResult(fax.receipt_id)
        
        // Popbill result states: 1: Waiting, 2: Sending, 3: Finished, 4: Cancelled
        // result.result codes: 1: Success, other: Failure
        let newStatus = fax.status
        if (result.state === 3) {
          newStatus = result.result === 1 ? 'SUCCESS' : 'FAIL'
        }

        if (newStatus !== fax.status) {
          await supabaseAdmin
            .from('manual_faxes')
            .update({ 
              status: newStatus, 
              updated_at: new Date().toISOString(),
              error_message: result.result !== 1 ? `Error code: ${result.result}` : null
            })
            .eq('id', fax.id)
          
          return { ...fax, status: newStatus }
        }
      } catch (err) {
        console.error(`Failed to update status for ${fax.receipt_id}:`, err)
      }
      return fax
    }))

    return NextResponse.json({ success: true, data: updatedHistory })

  } catch (err: any) {
    console.error('[FAX HISTORY ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
