-- 기존 가입된 모든 설계사의 이메일 정보를 auth.users에서 public.planners로 채워넣는 쿼리
-- 이메일이 누락된 planners 레코드에 대해 일치하는 auth.users 레코드의 이메일을 업데이트합니다.

UPDATE public.planners p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '');

-- 휴대폰 번호 형식에 관계없이(하이픈 유무) 이메일이 정확히 반영되도록 합니다.
-- 향후 가입되는 사용자를 위해 트리거 재확인
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
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      phone = coalesce(EXCLUDED.phone, planners.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
