-- 고객 테이블에 보험료 필드 추가
alter table public.customers add column if not exists monthly_premium bigint default 0;
