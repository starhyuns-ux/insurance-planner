-- ==========================================
-- 통합 추천(리워드) 시스템 스키마 추가 (Planner + Guest)
-- ==========================================

-- 0. updated_at 자동 갱신 권한 함수 생성 (누락 방지)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. planners 테이블에 추천 코드(referral_code) 컬럼 추가
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS referral_code text;

UPDATE public.planners 
SET referral_code = UPPER(SUBSTRING(MD5(id::text || RANDOM()::text) FROM 1 FOR 6))
WHERE referral_code IS NULL;

ALTER TABLE public.planners DROP CONSTRAINT IF EXISTS planners_referral_code_key;
ALTER TABLE public.planners ADD CONSTRAINT planners_referral_code_key UNIQUE (referral_code);

-- 2. 비회원 추천인 (guest_referrers) 테이블 생성
CREATE TABLE IF NOT EXISTS public.guest_referrers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  referral_code text UNIQUE NOT NULL,
  bank_name text,
  bank_account text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 비회원 추천인 updated_at 갱신 트리거
DROP TRIGGER IF EXISTS set_guest_referrers_updated_at ON public.guest_referrers;
CREATE TRIGGER set_guest_referrers_updated_at
  BEFORE UPDATE ON public.guest_referrers
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.guest_referrers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert guest_referrers" ON public.guest_referrers;
CREATE POLICY "Public can insert guest_referrers" 
ON public.guest_referrers FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Guest referrers can be updated by admin" ON public.guest_referrers;
CREATE POLICY "Guest referrers can be updated by admin" 
ON public.guest_referrers FOR UPDATE 
USING (true);


-- 3. referrals (추천 이력) 테이블 생성
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES public.planners(id) ON DELETE CASCADE,
  referrer_guest_id uuid REFERENCES public.guest_referrers(id) ON DELETE CASCADE,
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

-- 만약 이미 테이블이 존재했다면 `referrer_id`의 NOT NULL 조건 제거 및 `referrer_guest_id` 컬럼 추가
ALTER TABLE public.referrals ALTER COLUMN referrer_id DROP NOT NULL;
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS referrer_guest_id uuid REFERENCES public.guest_referrers(id) ON DELETE CASCADE;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Planners can view own referrals" ON public.referrals;
CREATE POLICY "Planners can view own referrals" 
ON public.referrals FOR SELECT 
USING (auth.uid() = referrer_id);

DROP TRIGGER IF EXISTS set_referrals_updated_at ON public.referrals;
CREATE TRIGGER set_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();


-- 4. auth.users 가입 시 referral_code 관련 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_ref_code text;
  new_planner_id uuid;
  referrer_pl_id uuid;
  referrer_gst_id uuid;
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
    
    -- 1) 설계사 중에서 찾기
    SELECT id INTO referrer_pl_id 
    FROM public.planners 
    WHERE referral_code = NEW.raw_user_meta_data->>'referrer_code' 
    LIMIT 1;

    -- 2) 비회원 추천인 중에서 찾기
    IF referrer_pl_id IS NULL THEN
      SELECT id INTO referrer_gst_id
      FROM public.guest_referrers
      WHERE referral_code = NEW.raw_user_meta_data->>'referrer_code'
      LIMIT 1;
    END IF;

    -- 설계사 추천인인 경우
    IF referrer_pl_id IS NOT NULL AND 
       (SELECT phone FROM public.planners WHERE id = referrer_pl_id) != COALESCE(NEW.raw_user_meta_data->>'phone', '') THEN
      INSERT INTO public.referrals (referrer_id, referee_name, referee_phone, referee_type, referred_planner_id, status)
      VALUES (
        referrer_pl_id,
        COALESCE(NEW.raw_user_meta_data->>'name', '새 설계사'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'SIGNUP', new_planner_id, 'PENDING'
      ) ON CONFLICT (referee_phone, referee_type) DO NOTHING;
    
    -- 비회원 추천인인 경우
    ELSIF referrer_gst_id IS NOT NULL AND
       (SELECT phone FROM public.guest_referrers WHERE id = referrer_gst_id) != COALESCE(NEW.raw_user_meta_data->>'phone', '') THEN
      INSERT INTO public.referrals (referrer_guest_id, referee_name, referee_phone, referee_type, referred_planner_id, status)
      VALUES (
        referrer_gst_id,
        COALESCE(NEW.raw_user_meta_data->>'name', '새 설계사'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'SIGNUP', new_planner_id, 'PENDING'
      ) ON CONFLICT (referee_phone, referee_type) DO NOTHING;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
