-- ==========================================
-- 1:1 채팅 테이블
-- ==========================================

-- 채팅 세션 (방문자 1명 : 설계사 1명)
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_phone text not null default '',
  planner_id uuid references public.planners(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

-- 채팅 메시지
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'planner')),
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- chat_sessions: 누구나 생성 가능, 본인 세션만 조회, 설계사는 모든 세션 조회
drop policy if exists "Anyone can insert chat sessions" on public.chat_sessions;
create policy "Anyone can insert chat sessions" on public.chat_sessions for insert with check (true);

drop policy if exists "Anyone can select chat sessions" on public.chat_sessions;
create policy "Anyone can select chat sessions" on public.chat_sessions for select using (true);

drop policy if exists "Anyone can update chat sessions" on public.chat_sessions;
create policy "Anyone can update chat sessions" on public.chat_sessions for update using (true);

-- chat_messages: 누구나 읽기/쓰기 (세션 기반 접근)
drop policy if exists "Anyone can insert chat messages" on public.chat_messages;
create policy "Anyone can insert chat messages" on public.chat_messages for insert with check (true);

drop policy if exists "Anyone can select chat messages" on public.chat_messages;
create policy "Anyone can select chat messages" on public.chat_messages for select using (true);

drop policy if exists "Anyone can update chat messages" on public.chat_messages;
create policy "Anyone can update chat messages" on public.chat_messages for update using (true);
