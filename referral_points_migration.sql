-- ==========================================
-- 소개 보상 포인트 시스템 고도화 (Referral Points)
-- ==========================================

-- 1. 비회원 추천인 (guest_referrers) 테이블 보충
ALTER TABLE public.guest_referrers ADD COLUMN IF NOT EXISTS points_balance integer NOT NULL DEFAULT 0;
ALTER TABLE public.guest_referrers ADD COLUMN IF NOT EXISTS total_referrals integer NOT NULL DEFAULT 0;

-- 2. 소개 보상 지급 로그 (point_transactions) - 선택사항이지만 투명성을 위해 권장
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_referrer_id uuid REFERENCES public.guest_referrers(id) ON DELETE CASCADE,
  referral_id uuid REFERENCES public.referrals(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('EARN', 'USE', 'EXPIRE')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS 및 정책 설정
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- 3. 관리자 및 본인 조회 정책 (추후 인증 시 필요)
DROP POLICY IF EXISTS "Public can view own points info" ON public.guest_referrers;
CREATE POLICY "Public can view own points info" 
ON public.guest_referrers FOR SELECT 
USING (true); -- 실제 서비스 시 휴대폰 번호 세션 등으로 제한 필요
