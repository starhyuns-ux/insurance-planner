-- ==========================================
-- 할 일(Todos) 테이블 상태(O, △, X) 및 메모 컬럼 추가
-- ==========================================

-- 1. status 컬럼 추가 ('none', 'circle', 'triangle', 'cross')
ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'none';

-- 2. memo 컬럼 추가 (작은 메모 작성용)
ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS memo text;

-- 3. 기존의 is_completed 값을 기반으로 status 데이터 마이그레이션
UPDATE public.todos 
SET status = 'circle' 
WHERE is_completed = true;

-- (선택 사항) 이후 애플리케이션 코드가 완전히 배포되면 is_completed 컬럼을 제거할 수 있습니다.
-- ALTER TABLE public.todos DROP COLUMN is_completed;
