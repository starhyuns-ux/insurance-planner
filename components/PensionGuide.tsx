'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

/* ─────────────────────────────────────────
   Chart A: 복리 성장 Bar Chart (10/20/30년)
───────────────────────────────────────── */
function CompoundBarChart({ locale }: { locale: string }) {
  const data = [
    { label: locale === 'cn' ? '10年' : locale === 'en' ? '10 yrs' : '10년', paid: 6000, asset: 7300 },
    { label: locale === 'cn' ? '20年' : locale === 'en' ? '20 yrs' : '20년', paid: 12000, asset: 18000 },
    { label: locale === 'cn' ? '30年' : locale === 'en' ? '30 yrs' : '30년', paid: 18000, asset: 34000 },
  ]
  const max = 36000
  const w = 280, h = 160, pad = 36

  const paidLabel = locale === 'cn' ? '总纳入额' : locale === 'en' ? 'Total Paid' : '총 납입'
  const assetLabel = locale === 'cn' ? '预期资产' : locale === 'en' ? 'Expected Asset' : '예상 자산'

  return (
    <div>
      <div className="flex gap-4 mb-3 text-xs font-bold justify-center">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-200"></span>{paidLabel}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-600"></span>{assetLabel}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs mx-auto">
        {data.map((d, i) => {
          const bw = 30, gap = 16
          const groupW = bw * 2 + 6
          const x = pad + i * (groupW + gap)
          const paidH = (d.paid / max) * (h - pad - 10)
          const assetH = (d.asset / max) * (h - pad - 10)
          const baseY = h - pad
          return (
            <g key={i}>
              <rect x={x} y={baseY - paidH} width={bw} height={paidH} rx={4} fill="#bfdbfe" />
              <rect x={x + bw + 6} y={baseY - assetH} width={bw} height={assetH} rx={4} fill="#2563eb" />
              <text x={x + bw + 3} y={baseY + 14} textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="600">{d.label}</text>
              <text x={x + bw + 3} y={baseY - assetH - 4} textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="700">
                {(d.asset / 10000).toFixed(1)}억
              </text>
            </g>
          )
        })}
        <line x1={pad - 6} y1={h - pad} x2={w - 10} y2={h - pad} stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   Chart B: 연금 자산 → 월 수령액 도넛
───────────────────────────────────────── */
function PensionDonutChart({ locale }: { locale: string }) {
  const cx = 80, cy = 80, r = 60, stroke = 22
  const circ = 2 * Math.PI * r
  // 구조: 월수령 60% / 세금 15% / 잔여 25%
  const segments = [
    { pct: 0.60, color: '#4f46e5', label: locale === 'cn' ? '月收款' : locale === 'en' ? 'Monthly Income' : '월 수령' },
    { pct: 0.15, color: '#a5b4fc', label: locale === 'cn' ? '税金' : locale === 'en' ? 'Taxes' : '세금' },
    { pct: 0.25, color: '#e0e7ff', label: locale === 'cn' ? '残余资产' : locale === 'en' ? 'Residual' : '잔여' },
  ]
  let offset = 0
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 160" className="w-44 mx-auto">
        {segments.map((s, i) => {
          const dash = s.pct * circ
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ}
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
            />
          )
          offset += s.pct
          return el
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="800">
          {locale === 'cn' ? '月約' : locale === 'en' ? '~Monthly' : '월 약'}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="14" fill="#312e81" fontWeight="900">
          {locale === 'cn' ? '100~150만' : locale === 'en' ? '1~1.5M' : '100~150만'}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="700">
          {locale === 'cn' ? '韩元/月' : locale === 'en' ? 'KRW/mo' : '원'}
        </text>
      </svg>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {segments.map((s, i) => (
          <span key={i} className="flex items-center gap-1 text-xs font-semibold text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: s.color }}></span>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Chart C: 목돈 1억 운용 타임라인
───────────────────────────────────────── */
function LumpSumTimeline({ locale }: { locale: string }) {
  const steps = locale === 'cn'
    ? ['投入1亿韩元', '10年运作 (美元年金)', '约1.5亿韩元', '选择方式', '一次领取 / 年金转换']
    : locale === 'en'
    ? ['Invest 100M KRW', '10yr Operation (USD)', '~150M KRW', 'Choose Method', 'Lump Sum / Annuity']
    : ['1억 투입', '10년 운용 (달러 연금)', '약 1.5억', '방식 선택', '일시금 / 연금 전환']

  const colors = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']

  return (
    <div className="flex flex-col items-center gap-0 w-full py-2">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className="px-5 py-2 rounded-full text-sm font-bold text-white text-center shadow-md"
            style={{ background: colors[i], minWidth: '160px' }}
          >
            {s}
          </div>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 24 16" className="w-6 h-4">
              <path d="M12 0 L12 10 M6 6 L12 12 L18 6" stroke="#818cf8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   연금 복리 계산기
───────────────────────────────────────── */
function PensionCalculator({ locale }: { locale: string }) {
  const [monthly, setMonthly] = useState(500000)
  const [rate, setRate] = useState(4)
  const [years, setYears] = useState(20)

  const totalPaid = monthly * 12 * years
  const monthlyRate = rate / 100 / 12
  const months = years * 12
  const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  const gain = futureValue - totalPaid
  const gainPct = ((gain / totalPaid) * 100).toFixed(0)

  const fmt = (v: number) => {
    if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`
    return `${Math.round(v / 10000).toLocaleString()}만`
  }

  const labels = {
    title: locale === 'cn' ? '年金复利计算器' : locale === 'en' ? 'Pension Calculator' : '연금 복리 계산기',
    monthly: locale === 'cn' ? '月缴金额 (韩元)' : locale === 'en' ? 'Monthly (KRW)' : '월 납입액 (원)',
    rate: locale === 'cn' ? '年收益率 (%)' : locale === 'en' ? 'Annual Return (%)' : '연 수익률 (%)',
    years: locale === 'cn' ? '持有期间 (年)' : locale === 'en' ? 'Period (Years)' : '납입 기간 (년)',
    paid: locale === 'cn' ? '总缴额' : locale === 'en' ? 'Total Paid' : '총 납입액',
    future: locale === 'cn' ? '预期资产' : locale === 'en' ? 'Expected Asset' : '예상 자산',
    gain: locale === 'cn' ? '복利收益' : locale === 'en' ? 'Compound Gain' : '복리 수익',
    unit: locale === 'cn' ? '韩元' : locale === 'en' ? 'KRW' : '원',
    note: locale === 'cn' ? '※ 仅为参考示例，实际收益因产品而异' : locale === 'en' ? '※ Example only. Actual returns vary by product.' : '※ 단순 예시이며 실제 수익은 상품에 따라 다릅니다',
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 md:p-8">
      <h3 className="text-xl font-black text-indigo-900 mb-6 text-center">{labels.title} 🧮</h3>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {/* Monthly */}
        <div>
          <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">{labels.monthly}</label>
          <input
            type="range" min="100000" max="2000000" step="50000"
            value={monthly} onChange={e => setMonthly(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <p className="text-center text-indigo-700 font-black mt-1">{(monthly / 10000).toLocaleString()}만원</p>
        </div>
        {/* Rate */}
        <div>
          <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">{labels.rate}</label>
          <input
            type="range" min="2" max="10" step="0.5"
            value={rate} onChange={e => setRate(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <p className="text-center text-indigo-700 font-black mt-1">{rate}%</p>
        </div>
        {/* Years */}
        <div>
          <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">{labels.years}</label>
          <input
            type="range" min="5" max="40" step="5"
            value={years} onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <p className="text-center text-indigo-700 font-black mt-1">{years}{locale === 'en' ? 'yr' : locale === 'cn' ? '年' : '년'}</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center border border-blue-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 mb-1">{labels.paid}</p>
          <p className="text-lg font-black text-gray-700">{fmt(totalPaid)}</p>
          <p className="text-[10px] text-gray-300">{labels.unit}</p>
        </div>
        <div className="bg-indigo-600 rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xs font-bold text-indigo-200 mb-1">{labels.future}</p>
          <p className="text-lg font-black text-white">{fmt(futureValue)}</p>
          <p className="text-[10px] text-indigo-300">{labels.unit}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border border-green-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 mb-1">{labels.gain}</p>
          <p className="text-lg font-black text-green-600">+{fmt(gain)}</p>
          <p className="text-[10px] text-green-400">+{gainPct}%</p>
        </div>
      </div>

      {/* Mini bar visual */}
      <div className="mt-5 bg-white rounded-xl p-3 border border-gray-100">
        <div className="flex h-6 rounded-lg overflow-hidden">
          <div
            className="bg-blue-200 flex items-center justify-center text-[9px] font-black text-blue-800 transition-all duration-500"
            style={{ width: `${(totalPaid / futureValue) * 100}%` }}
          >
            {labels.paid}
          </div>
          <div
            className="bg-indigo-500 flex items-center justify-center text-[9px] font-black text-white transition-all duration-500"
            style={{ width: `${(gain / futureValue) * 100}%` }}
          >
            {labels.gain}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-3">{labels.note}</p>
    </div>
  )
}

/* ─────────────────────────────────────────
   메인 컴포넌트
───────────────────────────────────────── */
export default function PensionGuide() {
  const { locale } = useLanguage()

  const content = {
    ko: {
      badge: '노후 준비 전략 리포트',
      title: '연금 전략, 이렇게 나뉩니다',
      subtitle: '한눈에 보기',
      intro: '노후 준비는 시작하는 시점에 따라 전략이 달라집니다. 40대와 50대의 핵심 차이를 먼저 파악하세요.',

      sec1Title: '① 40대 vs 50대 핵심 차이',
      tableHeaders: ['구분', '40대', '50대'],
      tableRows: [
        { label: '전략 핵심', a: '자산 증식', b: '현금 흐름' },
        { label: '포인트', a: '복리 구조', b: '연금 수령 구조' },
        { label: '목표', a: '자산 키우기', b: '매달 얼마 받을지' },
        { label: '중요 요소', a: '시간', b: '세금 + 수령 방식' },
      ],

      sec2Title: '② 복리 구조 — 월 50만 원, 연 4% 가정',
      sec2Note: '뒤로 갈수록 증가 속도가 폭발적으로 커집니다. "복리는 시간 싸움"',
      compoundHeaders: ['기간', '총 납입액', '예상 자산'],
      compoundRows: [
        { period: '10년', paid: '6,000만 원', asset: '약 7,300만 원' },
        { period: '20년', paid: '1억 2,000만 원', asset: '약 1억 8,000만 원' },
        { period: '30년', paid: '1억 8,000만 원', asset: '약 3억 4,000만 원' },
      ],

      sec3Title: '③ 연금 전환 시 현금 흐름 (3억 ~ 3.5억 기준 가정)',
      sec3Desc: '연금화 시 → 월 100만 ~ 150만 원 수준 현금 흐름 가능',
      sec3Note: '※ 수령 방식 / 기간 / 상품 구조에 따라 달라짐',

      sec4Title: '④ 자산가 전략 — 목돈 1억 기준',
      sec4Steps: ['1억 투입', '10년 운용 (달러 연금)', '약 1.5억 확보', '방식 선택', '일시금 수령 OR 연금 전환'],

      sec5Title: '⑤ 왜 연금인가',
      sec5Items: ['자산 → 소득으로 바뀜', '세금 구조가 달라짐', '평생 현금 흐름 확보 가능'],

      sec6Title: '⑥ 가장 중요한 질문',
      sec6Wrong: '"얼마 있습니까?" ❌',
      sec6Right: '"매달 얼마 나옵니까?" ⭕',

      conclusionTitle: '한 줄 결론',
      conclusion40: '40대는 "시간으로 돈을 만든다"',
      conclusion50: '50대는 "돈으로 월급을 만든다"',

      warning: '중요 유의사항',
      warningDesc: '장기 상품은 중도 해지 시 손실이 발생할 수 있습니다. 전문가와 충분한 상담 후 재무 상황에 맞는 전략을 선택하세요.',
    },
    en: {
      badge: 'Retirement Strategy Report',
      title: 'Pension Strategies at a Glance',
      subtitle: 'The 40s vs 50s Breakdown',
      intro: 'Retirement preparation strategy changes depending on when you start. First, understand the key differences between your 40s and 50s.',

      sec1Title: '① Key Differences: 40s vs 50s',
      tableHeaders: ['Category', '40s', '50s'],
      tableRows: [
        { label: 'Core Strategy', a: 'Asset Growth', b: 'Cash Flow' },
        { label: 'Focus', a: 'Compound Structure', b: 'Pension Income Structure' },
        { label: 'Goal', a: 'Grow Assets', b: 'Monthly Income Amount' },
        { label: 'Key Factor', a: 'Time', b: 'Tax + Payout Method' },
      ],

      sec2Title: '② Compound Growth — 500k KRW/mo at 4%/yr',
      sec2Note: 'Growth accelerates explosively over time. "Compound interest is a game of time."',
      compoundHeaders: ['Period', 'Total Paid', 'Expected Asset'],
      compoundRows: [
        { period: '10 yrs', paid: '60M KRW', asset: '~73M KRW' },
        { period: '20 yrs', paid: '120M KRW', asset: '~180M KRW' },
        { period: '30 yrs', paid: '180M KRW', asset: '~340M KRW' },
      ],

      sec3Title: '③ Monthly Pension Income (Asset base ~300-350M KRW)',
      sec3Desc: 'After conversion → ~1M to 1.5M KRW/month cash flow is achievable',
      sec3Note: '※ Varies by payout method, duration, and product structure',

      sec4Title: '④ Lump-Sum Strategy — Based on 100M KRW',
      sec4Steps: ['Invest 100M KRW', '10yr Operation (USD Pension)', 'Secure ~150M KRW', 'Choose Method', 'Lump Sum OR Annuity Conversion'],

      sec5Title: '⑤ Why Pension?',
      sec5Items: ['Assets convert to income', 'Tax structure changes favorably', 'Lifelong cash flow is achievable'],

      sec6Title: '⑥ The Most Important Question',
      sec6Wrong: '"How much do you have?" ❌',
      sec6Right: '"How much do you get per month?" ⭕',

      conclusionTitle: 'One-Line Conclusion',
      conclusion40: 'In your 40s: "Use time to make money"',
      conclusion50: 'In your 50s: "Use money to make a salary"',

      warning: 'Important Notice',
      warningDesc: 'Long-term products may incur losses upon early cancellation. Always consult an expert and choose a strategy that fits your financial situation.',
    },
    cn: {
      badge: '退休准备策略报告',
      title: '年金战略，一目了然',
      subtitle: '40岁与50岁的核心差异',
      intro: '退休准备的策略因开始时间不同而有所差异。首先了解40多岁与50多岁的核心差别。',

      sec1Title: '① 40岁 vs 50岁 核心差异',
      tableHeaders: ['分类', '40岁', '50岁'],
      tableRows: [
        { label: '核心战略', a: '资产增值', b: '现金流' },
        { label: '关键点', a: '复利结构', b: '年金收款结构' },
        { label: '目标', a: '扩大资产', b: '每月能领多少' },
        { label: '重要因素', a: '时间', b: '税务 + 收款方式' },
      ],

      sec2Title: '② 复利结构 — 月缴50万韩元，年收益4%',
      sec2Note: '时间越长，增长速度越快。"复利是时间的较量"',
      compoundHeaders: ['期限', '总缴额', '预期资产'],
      compoundRows: [
        { period: '10年', paid: '6000万韩元', asset: '约7300万韩元' },
        { period: '20年', paid: '1.2亿韩元', asset: '约1.8亿韩元' },
        { period: '30年', paid: '1.8亿韩元', asset: '约3.4亿韩元' },
      ],

      sec3Title: '③ 年金转换后现金流 (资产约3~3.5亿韩元)',
      sec3Desc: '转换年金后 → 月约100万~150万韩元现金流',
      sec3Note: '※ 因领取方式/期限/产品结构而有所不同',

      sec4Title: '④ 大额资金策略 — 以1亿韩元为例',
      sec4Steps: ['投入1亿韩元', '10年运作 (美元年金)', '约1.5亿韩元', '选择方式', '一次领取 OR 年金转换'],

      sec5Title: '⑤ 为什么选择年金',
      sec5Items: ['资产转化为收入', '税务结构发生有利变化', '可实现终身现金流'],

      sec6Title: '⑥ 最重要的问题',
      sec6Wrong: '"您有多少钱？" ❌',
      sec6Right: '"您每月领多少？" ⭕',

      conclusionTitle: '一句话结论',
      conclusion40: '40岁："用时间创造财富"',
      conclusion50: '50岁："用财富创造月薪"',

      warning: '重要提示',
      warningDesc: '长期产品中途退保可能产生损失。请务必充分咨询专家，选择符合您财务状况的策略。',
    },
  }

  const c = content[locale as keyof typeof content] || content.ko

  return (
    <div className="space-y-14">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-10"></div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-700/80 text-indigo-100 text-sm font-bold mb-6">{c.badge}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">{c.title}</h1>
          <p className="text-indigo-300 text-xl font-bold mb-4">{c.subtitle}</p>
          <p className="text-slate-300 max-w-2xl leading-relaxed">{c.intro}</p>
        </div>
      </div>

      {/* ── Section 1: 비교표 ── */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{c.sec1Title}</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                {c.tableHeaders.map((h, i) => (
                  <th key={i} className="px-5 py-4 font-bold text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.tableRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3 font-bold text-gray-700">{row.label}</td>
                  <td className="px-5 py-3 text-blue-700 font-semibold">{row.a}</td>
                  <td className="px-5 py-3 text-emerald-700 font-semibold">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 2: 복리표 + Chart A ── */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{c.sec2Title}</h2>
        <p className="text-indigo-600 font-bold text-sm mb-6">👉 {c.sec2Note}</p>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>{c.compoundHeaders.map((h, i) => <th key={i} className="px-4 py-3 font-bold text-gray-700 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.compoundRows.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3 font-bold text-indigo-700">{row.period}</td>
                    <td className="px-4 py-3 text-gray-500">{row.paid}</td>
                    <td className="px-4 py-3 font-black text-blue-700">{row.asset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Chart A */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <p className="text-xs font-black text-blue-800 mb-3 text-center uppercase tracking-wide">
              {locale === 'cn' ? '图表 A — 复利成长' : locale === 'en' ? 'Chart A — Compound Growth' : 'Chart A — 복리 성장'}
            </p>
            <CompoundBarChart locale={locale} />
          </div>
        </div>
      </section>

      {/* ── Section 3: 연금 전환 + Chart B ── */}
      <section className="bg-emerald-50 p-6 md:p-8 rounded-3xl border border-emerald-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{c.sec3Title}</h2>
        <p className="text-emerald-700 font-bold text-lg mb-1">➡ {c.sec3Desc}</p>
        <p className="text-gray-400 text-xs mb-6">{c.sec3Note}</p>
        <div className="flex justify-center">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm w-full max-w-sm">
            <p className="text-xs font-black text-emerald-800 mb-3 text-center uppercase tracking-wide">
              {locale === 'cn' ? '图表 B — 年金结构' : locale === 'en' ? 'Chart B — Pension Structure' : 'Chart B — 연금 구조'}
            </p>
            <PensionDonutChart locale={locale} />
          </div>
        </div>
      </section>

      {/* ── Section 4: 목돈 전략 + Chart C ── */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{c.sec4Title}</h2>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <p className="text-xs font-black text-indigo-800 mb-4 text-center uppercase tracking-wide">
              {locale === 'cn' ? '图表 C — 资金运营路径' : locale === 'en' ? 'Chart C — Fund Flow Path' : 'Chart C — 자금 운용 경로'}
            </p>
            <LumpSumTimeline locale={locale} />
          </div>
          <div className="space-y-3">
            {(c.sec4Steps).map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="font-semibold text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: 왜 연금 ── */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl">
        <h2 className="text-2xl font-extrabold mb-6 text-indigo-300">{c.sec5Title}</h2>
        <div className="space-y-4">
          {c.sec5Items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-green-400 font-black text-xl">✔</span>
              <span className="text-lg font-bold">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: 가장 중요한 질문 ── */}
      <section className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">{c.sec6Title}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-xl font-black text-red-500">{c.sec6Wrong}</p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl border border-green-200 shadow-md">
            <p className="text-xl font-black text-green-600">{c.sec6Right}</p>
          </div>
        </div>
      </section>

      {/* ── 연금 복리 계산기 ── */}
      <section>
        <PensionCalculator locale={locale} />
      </section>

      {/* ── 한 줄 결론 ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-10 rounded-3xl text-center">
        <h2 className="text-xl font-black mb-6 text-blue-100">{c.conclusionTitle}</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white/10 rounded-2xl px-8 py-5 backdrop-blur-sm">
            <p className="text-xs font-bold text-blue-200 mb-2">40s</p>
            <p className="text-lg md:text-xl font-black">{c.conclusion40}</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-8 py-5 backdrop-blur-sm border border-white/30">
            <p className="text-xs font-bold text-blue-200 mb-2">50s</p>
            <p className="text-lg md:text-xl font-black">{c.conclusion50}</p>
          </div>
        </div>
      </section>

      {/* ── Warning ── */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <p className="font-bold flex items-center gap-2 mb-2 text-amber-900"><span>⚠️</span> {c.warning}</p>
        <p className="text-sm leading-relaxed text-amber-800">{c.warningDesc}</p>
      </div>
    </div>
  )
}
