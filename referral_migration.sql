-- ==========================================
-- 친구추천 리워드 시스템 스키마 추가 (Referral Reward System)
-- ==========================================

-- 1. planners 테이블에 추천 코드(referral_code) 컬럼 추가
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS referral_code text;

-- 기존 설계사들에게 고유 추천 코드 일괄 부여 (이미 가입된 사용자를 위함)
UPDATE public.planners 
SET referral_code = UPPER(SUBSTRING(MD5(id::text || RANDOM()::text) FROM 1 FOR 6))
WHERE referral_code IS NULL;

-- 추천 코드 컬럼에 UNIQUE 제약 조건 추가
ALTER TABLE public.planners ADD CONSTRAINT planners_referral_code_key UNIQUE (referral_code);


-- 2. referrals (추천 이력) 테이블 생성
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
  referee_name text NOT NULL,
  referee_phone text NOT NULL,
  referee_type text NOT NULL CHECK (referee_type IN ('CONSULTATION', 'SIGNUP')),
  referred_consultation_id uuid REFERENCES public.consultations(id) ON DELETE SET NULL,
  referred_planner_id uuid REFERENCES public.planners(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PAID', 'REJECTED')),
  reward_amount integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- 어뷰징 방지: 같은 전화번호로 같은 타입(상담/가입)의 중복 추천을 막음
  CONSTRAINT referrals_phone_type_unique UNIQUE (referee_phone, referee_type)
);

-- RLS 활성화 및 관리자/본인 조회 정책
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 설계사는 본인의 추천 이력만 조회 가능
CREATE POLICY "Planners can view own referrals" 
ON public.referrals FOR SELECT 
USING (auth.uid() = referrer_id);

-- 3. referrals updated_at 갱신 트리거 생성
CREATE TRIGGER set_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. auth.users 가입 시 referral_code 자동 발급 및 가입 추천 이력 저장 (트리거 수정)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_ref_code text;
  new_planner_id uuid;
  referrer_pl_id uuid;
BEGIN
  -- 6자리 고유 추천코드 생성
  new_ref_code := UPPER(SUBSTRING(MD5(NEW.id::text || RANDOM()::text) FROM 1 FOR 6));

  -- planners 테이블 삽입 (referral_code 포함)
  INSERT INTO public.planners (id, name, phone, affiliation, region, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '새 설계사'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'affiliation', ''),
    COALESCE(NEW.raw_user_meta_data->>'region', ''),
    new_ref_code
  ) RETURNING id INTO new_planner_id;

  -- raw_user_meta_data에 referrer_code가 있을 경우 referrals 테이블에 등록
  IF NEW.raw_user_meta_data->>'referrer_code' IS NOT NULL THEN
    -- 유효한 추천인인지 확인
    SELECT id INTO referrer_pl_id 
    FROM public.planners 
    WHERE referral_code = NEW.raw_user_meta_data->>'referrer_code' 
    LIMIT 1;

    -- 본인 추천 방지 (전화번호 비교)
    IF referrer_pl_id IS NOT NULL AND 
       (SELECT phone FROM public.planners WHERE id = referrer_pl_id) != COALESCE(NEW.raw_user_meta_data->>'phone', '') THEN
      
      INSERT INTO public.referrals (
        referrer_id, 
        referee_name, 
        referee_phone, 
        referee_type, 
        referred_planner_id, 
        status
      )
      VALUES (
        referrer_pl_id,
        COALESCE(NEW.raw_user_meta_data->>'name', '새 설계사'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'SIGNUP',
        new_planner_id,
        'PENDING'
      ) ON CONFLICT (referee_phone, referee_type) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
