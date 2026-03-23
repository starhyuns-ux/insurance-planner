-- 기존 board_posts 테이블에 누락된 컬럼 추가
ALTER TABLE public.board_posts
  ADD COLUMN IF NOT EXISTS author_affiliation text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS planner_id uuid REFERENCES public.planners(id) ON DELETE SET NULL;

-- 기존 board_comments 테이블에 누락된 컬럼 추가
ALTER TABLE public.board_comments
  ADD COLUMN IF NOT EXISTS author_affiliation text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS planner_id uuid REFERENCES public.planners(id) ON DELETE SET NULL;
