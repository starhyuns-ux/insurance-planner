'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { CalculatorIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function FifthGenGuide() {
  const { locale } = useLanguage()

  // Calculator state
  const [coveredAmount, setCoveredAmount] = useState<string>('')
  const [severeAmount, setSevereAmount] = useState<string>('')
  const [nonSevereAmount, setNonSevereAmount] = useState<string>('')

  const calcResults = useMemo(() => {
    const covered = parseFloat(coveredAmount) || 0
    const severe = parseFloat(severeAmount) || 0
    const nonSevere = parseFloat(nonSevereAmount) || 0
    const total = covered + severe + nonSevere
    if (total === 0) return null

    // 1. Inpatient Logic (입원)
    // - Covered: 20% self-pay, capped at 2M
    // - Severe: 30% self-pay, capped at 5M (Gen/Tertiary)
    // - Non-severe: 50% self-pay
    const hospSelfPayCovered = Math.min(covered * 0.2, 2000000)
    const hospSelfPaySevere = Math.min(severe * 0.3, 5000000)
    const hospSelfPayNonSevere = nonSevere * 0.5
    const hospTotalSelfPay = hospSelfPayCovered + hospSelfPaySevere + hospSelfPayNonSevere
    const hospReimb = total - hospTotalSelfPay

    // 2. Outpatient Logic (통원)
    // - Covered: MAX(20%, 20k) -> using 20k as representative of Gen hospital
    // - Severe: MAX(30%, 30k)
    // - Non-severe: MAX(50%, 50k)
    const outSelfPayCovered = Math.max(covered * 0.2, covered > 0 ? 20000 : 0)
    const outSelfPaySevere = Math.max(severe * 0.3, severe > 0 ? 30000 : 0)
    const outSelfPayNonSevere = Math.max(nonSevere * 0.5, nonSevere > 0 ? 50000 : 0)
    const outTotalSelfPay = outSelfPayCovered + outSelfPaySevere + outSelfPayNonSevere
    const outReimb = Math.max(0, total - outTotalSelfPay)

    return {
      total,
      hospital: { reimbursement: hospReimb, selfPay: hospTotalSelfPay },
      outpatient: { reimbursement: outReimb, selfPay: outTotalSelfPay }
    }
  }, [coveredAmount, severeAmount, nonSevereAmount])

  const formatMoney = (amount: number) => {
    if (amount <= 0) return '0원'
    const manwon = Math.floor(amount / 10000)
    const remainder = Math.round(amount % 10000)
    if (manwon > 0 && remainder > 0) return `${manwon.toLocaleString()}만 ${remainder.toLocaleString()}원`
    if (manwon > 0) return `${manwon.toLocaleString()}만 원`
    return `${Math.round(amount).toLocaleString()}원`
  }

  const content = {
    ko: {
      title: '5세대 실손의료보험 핵심 가이드',
      intro: '2026년 새롭게 개편된 5세대 실손의 보장 한도와 자기부담금을 정리했습니다.',
      
      section1Title: '1. 급여 및 중증 비급여 (보장 강화)',
      section1Desc: '필수 의료 및 산정특례 질환(암, 심장/뇌혈관 등)에 대한 보장을 유지하고 한도를 설정했습니다.',
      
      limitTitle: '자기부담 및 한도 (입원)',
      limitItems: [
        { label: '급여 의료비', value: '본인부담 20% (연간 최대 200만 원 한도)', type: 'benefit' },
        { label: '중증 비급여', value: '본인부담 30% (종합/상급종합 연간 500만 원 한도)', type: 'benefit' },
        { label: '비중증 비급여', value: '본인부담 50% (별도 한도 없음)', type: 'warning' }
      ],

      section2Title: '2. 통원 공제 금액 (회당)',
      section2Desc: '과잉 진료 방지를 위해 통원 시 항목별로 공제 금액이 적용됩니다.',
      section2Items: [
        { title: '급여 (건보)', value: 'MAX(20%, 1~2만 원) 중 큰 금액 공제', type: 'normal' },
        { title: '중증 비급여', value: 'MAX(30%, 3만 원) 중 큰 금액 공제', type: 'normal' },
        { title: '비중증 비급여', value: 'MAX(50%, 5만 원) 중 큰 금액 공제', type: 'warning' }
      ],

      summaryTitle: '핵심 요약 (급여 vs 비급여)',
      tableHeaders: ['구분', '급여(건보)', '중증 비급여', '비중증 비급여'],
      tableRows: [
        { label: '보상 비율', covered: '80%', severe: '70%', nonSevere: '50%' },
        { label: '입원한도(본인)', covered: '200만 원', severe: '500만 원', nonSevere: '-' },
        { label: '통원공제(최소)', covered: '1~2만 원', severe: '3만 원', nonSevere: '5만 원' }
      ],

      specialTitle: '3대 비급여 특약 (중증 한정)',
      specialItems: [
        { label: '도수·체외충격파', value: '연간 350만 원 / 최대 50회 (중증 질환 시)' },
        { label: '주사료', value: '연간 250만 원 / 최대 50회 (중증 질환 시)' },
        { label: 'MRI/MRA', value: '연간 300만 원 이내' }
      ],

      warning: '비중증 3대 비급여 보장 제외',
      warningDesc: '비중증(일반 질환)의 경우 비급여 도수치료, 체외충격파, 주사료는 보상하지 않습니다. (면책)',
      calcTitle: '5세대 실손 정밀 계산기',
      calcDesc: '입원/통원별 자기부담 한도와 공제액을 적용한 결과입니다.',
    },
    en: {
      title: '5th Gen Silbi Insurance Core Guide',
      intro: 'Summary of coverage limits and self-pay for the 2026 5th Gen Silbi.',
      section1Title: '1. Covered & Severe Non-covered',
      section1Desc: 'Maintains coverage for essential and serious illnesses with set limits.',
      limitTitle: 'Self-pay & Limits (Inpatient)',
      limitItems: [
        { label: 'Covered', value: '20% Self-pay (Max 2M KRW annually)', type: 'benefit' },
        { label: 'Severe Non-covered', value: '30% Self-pay (Max 5M KRW at Gen Hospitals)', type: 'benefit' },
        { label: 'Non-severe Non-covered', value: '50% Self-pay (No specific cap)', type: 'warning' }
      ],
      section2Title: '2. Outpatient Deductions',
      section2Desc: 'Deductions applied per item to prevent over-treatment.',
      section2Items: [
        { title: 'Covered', value: 'MAX(20%, 10k~20k KRW)', type: 'normal' },
        { title: 'Severe Non-covered', value: 'MAX(30%, 30k KRW)', type: 'normal' },
        { title: 'Non-severe Non-covered', value: 'MAX(50%, 50k KRW)', type: 'warning' }
      ],
      summaryTitle: 'Core Summary',
      tableHeaders: ['Category', 'Covered', 'Severe', 'Non-severe'],
      tableRows: [
        { label: 'Reimb. Rate', covered: '80%', severe: '70%', nonSevere: '50%' },
        { label: 'Inpatient Cap', covered: '2M KRW', severe: '5M KRW', nonSevere: '-' },
        { label: 'Outpatient Min', covered: '10k~20k', severe: '30k', nonSevere: '50k' }
      ],
      specialTitle: '3 Major Non-covered (Severe Only)',
      specialItems: [
        { label: 'Manual/Shockwave', value: '3.5M KRW / Max 50 sessions' },
        { label: 'Injections', value: '2.5M KRW / Max 50 sessions' },
        { label: 'MRI/MRA', value: 'Within 3M KRW annually' }
      ],
      warning: 'Non-severe Exclusions',
      warningDesc: 'Manual therapy, shockwave, and injections are not covered for non-severe cases.',
      calcTitle: '5th Gen Precise Calculator',
      calcDesc: 'Calculation results based on 5th gen limits and deductions.',
    },
    cn: {
      title: '第5代实费保险核心指南',
      intro: '2026年全新改版的第5代实费保险保额及自付标准。',
      section1Title: '1. 医保及重症非医保',
      section1Desc: '维持对核心医疗及重症疾病的保障，并设定自付限额。',
      limitTitle: '自付比例及限额 (住院)',
      limitItems: [
        { label: '医保费用', value: '自付 20% (年度最高限额 200万 韩元)', type: 'benefit' },
        { label: '重症非医保', value: '自付 30% (综合医院年度 500万 韩元限额)', type: 'benefit' },
        { label: '非重症非医保', value: '自付 50% (无特定限额)', type: 'warning' }
      ],
      section2Title: '2. 门诊扣除额 (每次)',
      section2Desc: '为防止过度医疗，门诊按项目适用不同的起赔额。',
      section2Items: [
        { title: '医保 (给付)', value: 'MAX(20%, 1~2万 韩元) 取大者', type: 'normal' },
        { title: '重症非医保', value: 'MAX(30%, 3万 韩元) 取大者', type: 'normal' },
        { title: '非重症非医保', value: 'MAX(50%, 5万 韩元) 取大者', type: 'warning' }
      ],
      summaryTitle: '核心摘要 (医保 vs 非医保)',
      tableHeaders: ['分类', '医保', '重症非医保', '非重症非医保'],
      tableRows: [
        { label: '赔付比例', covered: '80%', severe: '70%', nonSevere: '50%' },
        { label: '住院自付限额', covered: '200万', severe: '500万', nonSevere: '-' },
        { label: '门诊起赔额', covered: '1~2万', severe: '3万', nonSevere: '5万' }
      ],
      specialTitle: '三大类非医保特约 (仅限重症)',
      specialItems: [
        { label: '徒手/冲击波', value: '年度 350万 / 最多 50次' },
        { label: '注射费', value: '年度 250万 / 最多 50次' },
        { label: 'MRI/MRA', value: '年度 300万 以내' }
      ],
      warning: '注意：非重症三大类不予理赔',
      warningDesc: '对于非重症情况，徒手治疗、体外冲击波及注射费属于免责范围。',
      calcTitle: '第5代精确计算器',
      calcDesc: '应用第5代自付限额及扣除额后的计算结果。',
    }
  }

  const t_curr = content[locale as keyof typeof content] || content.ko

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-8 md:p-12 text-white text-center rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
          {t_curr.title}
        </h1>
        <p className="text-blue-100 font-medium text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          {t_curr.intro}
        </p>
      </div>

      {/* 1. 보장 한도 및 입원 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            {t_curr.section1Title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t_curr.section1Desc}
          </p>
          
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">{t_curr.limitTitle}</h3>
            {t_curr.limitItems.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl ${item.type === 'benefit' ? 'bg-blue-50/50' : 'bg-rose-50/50'}`}>
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === 'benefit' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.label}</p>
                  <p className={`font-semibold ${item.type === 'benefit' ? 'text-blue-700' : 'text-rose-700'}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 통원 공제 */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            {t_curr.section2Title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t_curr.section2Desc}
          </p>

          <div className="space-y-3">
            {t_curr.section2Items.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-500">{item.title}</span>
                  {item.type === 'warning' && <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">High Self-Pay</span>}
                </div>
                <p className="text-lg font-black text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요약 표 */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t_curr.summaryTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-gray-400 font-bold text-sm uppercase tracking-wider text-left">Category</th>
                {t_curr.tableHeaders.slice(1).map((h, i) => (
                  <th key={i} className="py-4 px-4 text-gray-900 font-black text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t_curr.tableRows.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-4 text-left font-bold text-gray-600">{row.label}</td>
                  <td className="py-5 px-4 font-black text-blue-600">{row.covered}</td>
                  <td className="py-5 px-4 font-black text-indigo-600">{row.severe}</td>
                  <td className="py-5 px-4 font-bold text-rose-500">{row.nonSevere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 특약 안내 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-indigo-300" />
            {t_curr.specialTitle}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t_curr.specialItems.map((item, idx) => (
              <li key={idx} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-indigo-200 text-xs font-bold mb-1">{item.label}</p>
                <p className="font-bold text-sm leading-tight">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-rose-600 font-black mb-3">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span>NOTICE</span>
          </div>
          <p className="font-black text-rose-900 mb-2">{t_curr.warning}</p>
          <p className="text-sm text-rose-700 leading-relaxed font-medium">
            {t_curr.warningDesc}
          </p>
        </div>
      </div>

      {/* 정밀 계산기 */}
      <section className="pt-12 border-t border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-black mb-4 shadow-lg">
            <CalculatorIcon className="w-5 h-5 text-blue-400" />
            {t_curr.calcTitle}
          </div>
          <p className="text-gray-500 font-medium">{t_curr.calcDesc}</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Inputs */}
          <div className="bg-slate-50 p-8 md:p-12 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">급여 (Health Insurance)</label>
                <div className="relative group">
                  <input type="number" min="0" placeholder="0" value={coveredAmount} onChange={(e) => setCoveredAmount(e.target.value)} className="block w-full pl-6 pr-12 py-5 text-xl font-black bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-blue-500 transition-all outline-none shadow-sm group-hover:shadow-md" />
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 font-bold">원</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-blue-500 uppercase tracking-widest pl-1">중증 비급여 (Severe)</label>
                <div className="relative group">
                  <input type="number" min="0" placeholder="0" value={severeAmount} onChange={(e) => setSevereAmount(e.target.value)} className="block w-full pl-6 pr-12 py-5 text-xl font-black bg-white border-2 border-blue-100 rounded-[1.5rem] focus:border-blue-500 transition-all outline-none shadow-sm group-hover:shadow-md" />
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 font-bold">원</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-rose-500 uppercase tracking-widest pl-1">비중증 비급여 (Non-Severe)</label>
                <div className="relative group">
                  <input type="number" min="0" placeholder="0" value={nonSevereAmount} onChange={(e) => setNonSevereAmount(e.target.value)} className="block w-full pl-6 pr-12 py-5 text-xl font-black bg-white border-2 border-rose-100 rounded-[1.5rem] focus:border-rose-500 transition-all outline-none shadow-sm group-hover:shadow-md" />
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 font-bold">원</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-8 md:p-12">
            {!calcResults ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <CalculatorIcon className="w-10 h-10 text-slate-300" />
                </div>
                <p className="font-black text-slate-400 text-lg">의료비를 입력하시면 정확한 보상액을 산출합니다</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Total Medical Expenses</p>
                  <p className="text-5xl font-black text-slate-900">{formatMoney(calcResults.total)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 입원 결과 */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl">
                      <div className="flex justify-between items-center mb-8">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest">HOSPITALIZATION</span>
                        <span className="text-2xl">🏥</span>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-gray-500 font-bold">보상금액</span>
                          <span className="text-3xl font-black text-blue-600">{formatMoney(calcResults.hospital.reimbursement)}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-gray-500 font-bold">본인부담 <span className="text-[10px] text-gray-300 ml-1">(한도적용)</span></span>
                          <span className="text-xl font-black text-rose-600">{formatMoney(calcResults.hospital.selfPay)}</span>
                        </div>
                        <div className="pt-4">
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(calcResults.hospital.reimbursement / calcResults.total) * 100}%` }}></div>
                          </div>
                          <p className="text-center mt-3 text-xs font-black text-gray-400">보상률 {Math.round((calcResults.hospital.reimbursement / calcResults.total) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 통원 결과 */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl">
                      <div className="flex justify-between items-center mb-8">
                        <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest">OUTPATIENT</span>
                        <span className="text-2xl">🚶</span>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-gray-500 font-bold">보상금액</span>
                          <span className="text-3xl font-black text-emerald-600">{formatMoney(calcResults.outpatient.reimbursement)}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-gray-500 font-bold">본인부담 <span className="text-[10px] text-gray-300 ml-1">(항목별공제)</span></span>
                          <span className="text-xl font-black text-rose-600">{formatMoney(calcResults.outpatient.selfPay)}</span>
                        </div>
                        <div className="pt-4">
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(calcResults.outpatient.reimbursement / calcResults.total) * 100}%` }}></div>
                          </div>
                          <p className="text-center mt-3 text-xs font-black text-gray-400">보상률 {Math.round((calcResults.outpatient.reimbursement / calcResults.total) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 세부 산출 기준 안내 */}
                <div className="bg-slate-50 rounded-[2rem] p-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-500 leading-relaxed font-medium">
                      <div className="space-y-2">
                        <p className="font-black text-slate-800 text-sm mb-3">🏥 입원 본인부담 상한액 (한도)</p>
                        <p className="flex justify-between"><span>급여 의료비:</span> <span className="font-bold text-slate-700">연간 200만 원</span></p>
                        <p className="flex justify-between"><span>중증 비급여 (종합/상급):</span> <span className="font-bold text-slate-700">연간 500만 원</span></p>
                        <p className="flex justify-between"><span>비중증 비급여:</span> <span className="font-bold text-slate-700">제한 없음 (전액 50% 부담)</span></p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-slate-800 text-sm mb-3">🚶 통원 공제액 (Deduction)</p>
                        <p className="flex justify-between"><span>급여:</span> <span className="font-bold text-slate-700">MAX(20%, 1~2만 원)</span></p>
                        <p className="flex justify-between"><span>중증 비급여:</span> <span className="font-bold text-slate-700">MAX(30%, 3만 원)</span></p>
                        <p className="flex justify-between"><span>비중증 비급여:</span> <span className="font-bold text-slate-700">MAX(50%, 5만 원)</span></p>
                      </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-1">
                      <p>※ 본 계산은 5세대 실손 표준 약관의 보상 비율 및 한도를 바탕으로 산출된 예시입니다.</p>
                      <p>※ 실제 보상 시 가입하신 상품의 세부 특약 및 병원급별 기준에 따라 차이가 발생할 수 있습니다.</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
