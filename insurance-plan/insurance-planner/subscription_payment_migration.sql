-- ==========================================
-- 구독 결제 시스템 마이그레이션
-- ==========================================

-- 1. planners 테이블에 구독 관련 컬럼 추가
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='planners' AND column_name='subscription_end_date') THEN
    ALTER TABLE public.planners ADD COLUMN subscription_end_date timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='planners' AND column_name='payment_customer_key') THEN
    ALTER TABLE public.planners ADD COLUMN payment_customer_key text;
  END IF;
END $$;

-- 2. 구독 결제 내역 테이블
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id uuid NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
  payment_key text,                          -- 토스 paymentKey
  order_id text UNIQUE,                      -- 우리가 생성하는 주문번호
  amount integer NOT NULL DEFAULT 5900,      -- 결제 금액 (원)
  status text NOT NULL DEFAULT 'PENDING',    -- PENDING, DONE, CANCELED, FAILED
  method text,                               -- 결제 수단 (카드, 가상계좌 등)
  card_number text,                          -- 카드 번호 뒤 4자리
  card_company text,                         -- 카드사
  receipt_url text,                          -- 영수증 URL
  canceled_at timestamptz,                   -- 취소 시각
  paid_at timestamptz,                       -- 결제 완료 시각
  period_start timestamptz,                  -- 구독 기간 시작
  period_end timestamptz,                    -- 구독 기간 종료
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- 설계사 자신의 결제 내역만 조회 가능
DROP POLICY IF EXISTS "Planners view own payments" ON public.subscription_payments;
CREATE POLICY "Planners view own payments" ON public.subscription_payments
  FOR SELECT USING (auth.uid() = planner_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_subscription_payments_planner_id ON public.subscription_payments(planner_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_order_id ON public.subscription_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON public.subscription_payments(status);
