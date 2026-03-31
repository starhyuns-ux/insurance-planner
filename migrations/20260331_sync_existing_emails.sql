-- 기존 가입된 모든 설계사의 이메일 정보를 auth.users에서 public.planners로 채워넣는 쿼리
-- 이메일이 누락된 planners 레코드에 대해 일치하는 auth.users 레코드의 이메일을 업데이트합니다.

UPDATE public.planners p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '');

-- 향후 가입자가 발생할 때 데이터를 안정적으로 쌓기 위한 트리거 함수 (안전한 버전)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 이미 존재하는 아이디인 경우 작업을 무시하며(ON CONFLICT DO NOTHING), 기존 정보를 절대 건드리지 않습니다.
  INSERT INTO public.planners (id, name, phone, email, affiliation, region)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '새 설계사'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'affiliation', ''),
    coalesce(new.raw_user_meta_data->>'region', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
