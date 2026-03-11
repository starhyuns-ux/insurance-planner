-- 1) 상담 신청 테이블
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 검색/집계 성능용 인덱스
create index if not exists consultations_created_at_idx
on public.consultations (created_at desc);

-- 2) (선택) Row Level Security
alter table public.consultations enable row level security;

-- 3) 공개 Insert만 허용 (랜딩페이지 폼 제출용)
-- ※ anon key로 insert 할 것이므로 정책이 필요합니다.
drop policy if exists "Allow public insert" on public.consultations;
create policy "Allow public insert"
on public.consultations
for insert
to anon
with check (true);

-- 4) Stats는 서버에서 service role로 읽을 예정이므로
-- 읽기 정책은 굳이 공개할 필요 없습니다(보안상 비권장).
