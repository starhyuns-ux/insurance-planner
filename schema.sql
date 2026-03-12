-- ==========================================
-- 통합 데이터베이스 스키마 (Unified Schema)
-- ==========================================

-- 1. 상담 신청 기본 테이블
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 2. 설계사(Planner) 관리 테이블
create table if not exists public.planners (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  profile_image_url text,
  business_card_url text,
  affiliation text, -- 소속
  region text,      -- 활동 지역
  subscription_status text not null default 'inactive', -- active, inactive
  subscription_end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. 고객(Customer) 직접 등록 테이블
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  planner_id uuid not null references public.planners(id) on delete cascade,
  name text not null,
  address text,
  riders jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. consultations 테이블에 planner_id 연결 (선택사항)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='consultations' and column_name='planner_id') then
    alter table public.consultations add column planner_id uuid references public.planners(id) on delete set null;
  end if;
end $$;

-- ==========================================
-- Row Level Security (RLS) 및 보안 정책
-- ==========================================
alter table public.consultations enable row level security;
alter table public.planners enable row level security;
alter table public.customers enable row level security;

-- Consultations 정책
drop policy if exists "Allow public insert" on public.consultations;
create policy "Allow public insert" on public.consultations for insert to anon with check (true);

drop policy if exists "Planners can view own leads" on public.consultations;
create policy "Planners can view own leads" on public.consultations for select using (auth.uid() = planner_id);

-- Planners 정책
drop policy if exists "Planners can view own profile" on public.planners;
create policy "Planners can view own profile" on public.planners for select using (auth.uid() = id);

drop policy if exists "Planners can update own profile" on public.planners;
create policy "Planners can update own profile" on public.planners for update using (auth.uid() = id);

drop policy if exists "Individuals can create their own planner profile" on public.planners;
create policy "Individuals can create their own planner profile" on public.planners for insert with check (auth.uid() = id);

drop policy if exists "Anyone can view limited planner info" on public.planners;
create policy "Anyone can view planner profiles" on public.planners for select to public using (true);

-- Customers 정책
drop policy if exists "Planners can manage own customers" on public.customers;
create policy "Planners can manage own customers" on public.customers for all using (auth.uid() = planner_id);

-- ==========================================
-- 자동 프로필 생성 트리거 (auth.users 가입 시)
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.planners (id, name, phone, affiliation, region)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '새 설계사'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'affiliation', ''),
    coalesce(new.raw_user_meta_data->>'region', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_planners_updated_at on public.planners;
create trigger set_planners_updated_at
  before update on public.planners
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
  before update on public.customers
  for each row execute procedure public.handle_updated_at();
