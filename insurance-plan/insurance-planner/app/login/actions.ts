'use server'

import { supabaseAdmin } from '@/lib/supabaseServer'

export async function lookupEmailByPhone(phone: string): Promise<string | null> {
  if (!phone) return null;
  
  const cleanPhone = phone.replace(/-/g, '')
  const withDashes = cleanPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  
  // 1. 휴대폰 번호로 설계사의 id를 찾습니다 (planners 테이블의 email 컬럼 누락 우회)
  const { data: planners, error: lookupError } = await supabaseAdmin
    .from('planners')
    .select('id')
    .or(`phone.eq.${cleanPhone},phone.eq.${withDashes}`)
    
  if (lookupError || !planners || planners.length === 0) {
    console.error('Phone lookup error from planners:', lookupError)
    return null;
  }
  
  const plannerId = planners[0].id;
  
  // 2. 알아낸 id로 auth.users에서 실제 이메일을 가져옵니다 (서버 측 권한 활용)
  const { data: userResp, error: userError } = await supabaseAdmin.auth.admin.getUserById(plannerId);
  
  if (userError || !userResp?.user?.email) {
    console.error('Error fetching user email from auth.users:', userError)
    return null;
  }
  
  return userResp.user.email;
}
