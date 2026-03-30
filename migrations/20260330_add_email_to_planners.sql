-- 비밀번호 재설정 및 실제 이메일 연동을 위한 마이그레이션
-- planners 테이블에 email 컬럼 추가 및 트리거 업데이트

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='planners' AND column_name='email') THEN
        ALTER TABLE public.planners ADD COLUMN email text;
    END IF;
END $$;

-- auth.users 가입 시 정보를 planners 테이블로 복사하는 트리거 함수 업데이트
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.planners (id, name, phone, email, affiliation, region)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '새 설계사'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'affiliation', ''),
    coalesce(new.raw_user_meta_data->>'region', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
