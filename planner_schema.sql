-- 1) 설계사(Planner) 테이블
-- Supabase Auth의 users 테이블과 연동되는 프로필 테이블입니다.
create table if not exists public.planners (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  profile_image_url text,
  business_card_url text,
  affiliation text, -- 소속 (예: 삼성생명, GA 등)
  region text,      -- 지역 (예: 서울 강남구, 부산 등)
  subscription_status text not null default 'inactive', -- active, inactive, pending
  subscription_end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) 고객(Customer) 테이블
-- 설계사가 직접 등록/관리하는 고객 데이터입니다.
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  planner_id uuid not null references public.planners(id) on delete cascade,
  name text not null,
  address text,
  riders jsonb not null default '[]'::jsonb, -- 특약 사항들
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security (RLS) 설정
alter table public.planners enable row level security;
alter table public.customers enable row level security;

-- Planners 정책: 본인 정보만 조회/수정 가능
create policy "Planners can view own profile"
  on public.planners for select
  using (auth.uid() = id);

create policy "Planners can update own profile"
  on public.planners for update
  using (auth.uid() = id);

-- Customers 정책: 등록한 설계사만 조회/수정/삭제 가능
create policy "Planners can manage own customers"
  on public.customers for all
  using (auth.uid() = planner_id);

-- 공개 열람 정책 (Individual Planner Page용)
create policy "Anyone can view limited planner info"
  on public.planners for select
  to anon
  using (subscription_status = 'active');

-- consultations 테이블에 planner_id 추가 (선택사항)
alter table public.consultations add column if not exists planner_id uuid references public.planners(id) on delete set null;

-- Planners가 본인에게 온 상담 신청을 볼 수 있게 RLS 추가
create policy "Planners can view own leads"
  on public.consultations for select
  using (auth.uid() = planner_id);

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_planners_updated_at
  before update on public.planners
  for each row execute procedure public.handle_updated_at();

create trigger set_customers_updated_at
  before update on public.customers
  for each row execute procedure public.handle_updated_at();
