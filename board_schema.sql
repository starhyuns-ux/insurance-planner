-- ==========================================
-- 커뮤니티 게시판 테이블
-- ==========================================

-- 1. 게시글 테이블
create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  board_type text not null check (board_type in ('qna', 'free')),
  title text not null,
  content text not null,
  author_name text not null,
  author_affiliation text not null default '',
  author_password text not null default '',
  planner_id uuid references public.planners(id) on delete set null,
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. 댓글 테이블
create table if not exists public.board_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.board_posts(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ==========================================
-- RLS 정책
-- ==========================================
alter table public.board_posts enable row level security;
alter table public.board_comments enable row level security;

-- board_posts: 누구나 읽기/쓰기 가능
drop policy if exists "Anyone can read posts" on public.board_posts;
create policy "Anyone can read posts" on public.board_posts for select using (true);

drop policy if exists "Anyone can insert posts" on public.board_posts;
create policy "Anyone can insert posts" on public.board_posts for insert with check (true);

drop policy if exists "Anyone can update posts" on public.board_posts;
create policy "Anyone can update posts" on public.board_posts for update using (true);

drop policy if exists "Anyone can delete posts" on public.board_posts;
create policy "Anyone can delete posts" on public.board_posts for delete using (true);

-- board_comments: 누구나 읽기/쓰기 가능
drop policy if exists "Anyone can read comments" on public.board_comments;
create policy "Anyone can read comments" on public.board_comments for select using (true);

drop policy if exists "Anyone can insert comments" on public.board_comments;
create policy "Anyone can insert comments" on public.board_comments for insert with check (true);

drop policy if exists "Anyone can delete comments" on public.board_comments;
create policy "Anyone can delete comments" on public.board_comments for delete using (true);
