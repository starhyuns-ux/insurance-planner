'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { CalculatorIcon } from '@heroicons/react/24/outline'

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

    const hospReimb = (covered * 0.8) + (severe * 0.7) + (nonSevere * 0.5)
    const outRatio = (covered * 0.8) + (severe * 0.7) + (nonSevere * 0.5)
    const outReimb = Math.min(Math.max(0, total - 20000), outRatio)

    return {
      total,
      hospital: { reimbursement: hospReimb, selfPay: total - hospReimb },
      outpatient: { reimbursement: outReimb, selfPay: total - outReimb }
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
      intro: '중증부터 비중증, 급여까지 알기 쉽게 정리했습니다.',
      section1Title: '1. 중증 비급여 의료비(상해/질병)',
      section1Desc: '산정특례 대상 질환(암, 심장/뇌혈관 질환, 희귀난치성 질환 등)으로 인한 비급여 치료에 해당합니다.',
      limitTitle: '연간 한도',
      limitDesc: '입원과 통원을 합산하여 상해 비급여 연간 5,000만 원, 질병 비급여 연간 5,000만 원 한도 내에서 보상합니다.',
      specialTitle: '중증 3대 비급여 (특약)',
      specialItems: [
        { label: '도수·체외충격파 치료', value: '연간 350만 원 / 최대 50회 한도' },
        { label: '주사료', value: '연간 250만 원 / 최대 50회 한도' },
        { label: 'MRI/MRA', value: '연간 300만 원 이내' }
      ],
      section2Title: '2. 비중증 비급여 의료비 (상해/질병)',
      section2Desc: '일반적인 질환으로 인한 비급여 치료로, 중증 대비 한도가 대폭 축소되었습니다.',
      section2Items: [
        { title: '연간 한도 축소', value: '상해/질병 각각 연간 1,000만 원 한도 (중증의 1/5 수준)', type: 'normal' },
        { title: '자기부담금 상향', value: '비급여 의료비의 50% 본인 부담 (통원 공제 최소 5만 원)', type: 'warning' }
      ],
      summaryTitle: '핵심 요약 (중증 vs 비중증)',
      tableHeaders: ['구분', '중증 비급여', '비중증 비급여'],
      tableRows: [
        { label: '연간 한도', main: '5,000만 원', sub: '1,000만 원' },
        { label: '본인부담률', main: '30%', sub: '50%' }
      ],
      warning: '비중증 3대 비급여 면책 주의',
      warningDesc: '비중증의 경우 비급여 도수치료, 체외충격파, 주사료는 보상하지 않습니다. (면책)',
      calcTitle: '5세대 실손 계산해보기',
      calcDesc: '예상 의료비를 입력하면 5세대 기준으로 보상액을 계산합니다.',
    },
    en: {
      title: '5th Gen Silbi Insurance Core Guide',
      intro: 'A clear summary from severe to non-severe coverage.',
      section1Title: '1. Severe Non-covered Expenses',
      section1Desc: 'Applies to non-medical treatments for serious illnesses (Cancer, Heart/Brain diseases, rare diseases, etc.).',
      limitTitle: 'Annual Limit',
      limitDesc: 'Up to 50M KRW annually for injury and disease combined (Inpatient + Outpatient).',
      specialTitle: '3 Major Non-covered (Special Rider)',
      specialItems: [
        { label: 'Manual/Shockwave Therapy', value: '3.5M KRW / Max 50 sessions' },
        { label: 'Injection Fees', value: '2.5M KRW / Max 50 sessions' },
        { label: 'MRI/MRA', value: 'Within 3M KRW annually' }
      ],
      section2Title: '2. Non-severe Non-covered Expenses',
      section2Desc: 'Non-medical treatments for general illnesses. Limits are significantly lower than severe cases.',
      section2Items: [
        { title: 'Reduced Annual Limit', value: '10M KRW limit (1/5 of severe limit)', type: 'normal' },
        { title: 'Increased Self-pay', value: '50% self-pay for non-covered (Min 50k KRW for outpatient)', type: 'warning' }
      ],
      summaryTitle: 'Core Summary (Severe vs Non-severe)',
      tableHeaders: ['Category', 'Severe cases', 'Non-severe cases'],
      tableRows: [
        { label: 'Annual Limit', main: '50M KRW', sub: '10M KRW' },
        { label: 'Self-pay Ratio', main: '30%', sub: '50%' }
      ],
      warning: 'Warning: Non-severe 3 Major Exclusions',
      warningDesc: 'Manual therapy, shockwave therapy, and injections are not covered for non-severe cases.',
      calcTitle: '5th Gen Calculator',
      calcDesc: 'Enter estimated medical expenses to calculate reimbursement.',
    },
    cn: {
      title: '第5代实费保险核心指南',
      intro: '从重疾到普通疾病，全方位为您解析。',
      section1Title: '1. 重症非医保费用 (意外/疾病)',
      section1Desc: '适用于特定重疾（癌症、心脑血管疾病、罕见病等）导致的非医保治疗。',
      limitTitle: '年度限额',
      limitDesc: '住院与门诊合并计算，意外/疾病非医保各项年度限额 5,000万 韩元。',
      specialTitle: '重症三大类非医保 (特约)',
      specialItems: [
        { label: '徒手及体外冲击波', value: '年度 350万 韩元 / 最多 50次' },
        { label: '注射费', value: '年度 250万 韩元 / 最多 50次' },
        { label: 'MRI/MRA', value: '年度 300万 韩元以内' }
      ],
      section2Title: '2. 非重症非医保费用 (意外/疾病)',
      section2Desc: '普通疾病导致的非医保治疗，限额较重症大幅缩减。',
      section2Items: [
        { title: '年度限额缩减', value: '意外/疾病各项每年限额 1,000万 韩元 (重症的 1/5)', type: 'normal' },
        { title: '自付比例上调', value: '非医保费用自付 50% (门诊起赔额至少 5万 韩元)', type: 'warning' }
      ],
      summaryTitle: '核心摘要 (重症 vs 非重症)',
      tableHeaders: ['分类', '重症非医保', '非重症非医保'],
      tableRows: [
        { label: '年度限额', main: '5,000万 韩元', sub: '1,000万 韩元' },
        { label: '自付比例', main: '30%', sub: '50%' }
      ],
      warning: '注意：非重症三大类非医保免责',
      warningDesc: '对于非重症情况，非医保徒手治疗、体外冲击波及注射费不予理赔。',
      calcTitle: '第5代实费计算器',
      calcDesc: '输入预估医疗费用，按第5代标准计算赔付额。',
    }
  }

  const t_curr = content[locale as keyof typeof content] || content.ko

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-8 md:p-12 text-white text-center rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t_curr.title}
        </h1>
        <p className="mt-4 text-blue-100 font-medium text-lg">
          {t_curr.intro}
        </p>
      </div>

      {/* 1. 중증 비급여 */}
      <section>
        <h2 className="text-[1.15rem] sm:text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-6 inline-block tracking-tight whitespace-nowrap">
          {t_curr.section1Title}
        </h2>
        <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
          {t_curr.section1Desc}
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-400 rounded-full inline-block"></span>
              {t_curr.limitTitle}
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>{t_curr.limitDesc}</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4">{t_curr.specialTitle}</h3>
            <ul className="space-y-5 md:space-y-2 text-blue-800 text-sm md:text-base">
              {t_curr.specialItems.map((item, idx) => (
                <li key={idx} className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                  <span className="font-bold shrink-0">· {item.label}:</span>
                  <span className="pl-3 md:pl-0 leading-relaxed font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. 비중증 비급여 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-6 inline-block">
          {t_curr.section2Title}
        </h2>
        <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
          {t_curr.section2Desc}
        </p>

        <div className="space-y-4">
          {t_curr.section2Items.map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border ${item.type === 'warning' ? 'bg-red-50 border-red-100' : 'bg-gray-100 border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-2 ${item.type === 'warning' ? 'text-red-800' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={item.type === 'warning' ? 'text-red-700' : 'text-gray-700'}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 핵심 요약표 */}
      <section className="pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t_curr.summaryTitle}</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                {t_curr.tableHeaders.map((header, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold border-b border-gray-200">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {t_curr.tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium border-b border-gray-100 text-gray-900">{row.label}</td>
                  <td className="px-6 py-4 border-b border-gray-100 text-blue-600 font-bold">{row.main}</td>
                  <td className="px-6 py-4 border-b border-gray-100 text-gray-500">{row.sub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Warning */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900">
        <p className="font-bold flex items-center gap-2 mb-2">
          <span className="text-lg">⚠️</span> {t_curr.warning}
        </p>
        <p className="text-sm leading-relaxed">
          {t_curr.warningDesc}
        </p>
      </div>

      {/* 5세대 계산해보기 */}
      <section className="pt-8 border-t border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <CalculatorIcon className="w-5 h-5" />
            {t_curr.calcTitle}
          </div>
          <p className="text-gray-500 text-sm">{t_curr.calcDesc}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Inputs */}
          <div className="bg-gray-50 p-6 md:p-8 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">급여 (건보 적용)</label>
                <div className="relative">
                  <input type="number" min="0" step="1" placeholder="0" value={coveredAmount} onChange={(e) => setCoveredAmount(e.target.value)} className="block w-full pl-4 pr-10 py-3 text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-sm font-medium">원</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">중증 비급여 <span className="text-gray-400 font-normal">(암·뇌·심장)</span></label>
                <div className="relative">
                  <input type="number" min="0" step="1" placeholder="0" value={severeAmount} onChange={(e) => setSevereAmount(e.target.value)} className="block w-full pl-4 pr-10 py-3 text-lg font-semibold bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-sm font-medium">원</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-600 mb-2 uppercase tracking-wider">비중증 비급여 <span className="text-gray-400 font-normal">(일반)</span></label>
                <div className="relative">
                  <input type="number" min="0" step="1" placeholder="0" value={nonSevereAmount} onChange={(e) => setNonSevereAmount(e.target.value)} className="block w-full pl-4 pr-10 py-3 text-lg font-semibold bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none" />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-sm font-medium">원</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 md:p-8">
            {!calcResults ? (
              <div className="text-center py-8 text-gray-400">
                <CalculatorIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-bold text-gray-500">금액을 입력하면 계산 결과가 표시됩니다</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">총 의료비</p>
                  <p className="text-3xl font-black text-gray-900">{formatMoney(calcResults.total)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 입원 */}
                  <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">🏥 입원</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">보상금액</span>
                        <span className="text-xl font-black text-indigo-700">{formatMoney(calcResults.hospital.reimbursement)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">본인부담</span>
                        <span className="text-lg font-bold text-rose-600">{formatMoney(calcResults.hospital.selfPay)}</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden bg-gray-200 mt-2">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${calcResults.total > 0 ? (calcResults.hospital.reimbursement / calcResults.total) * 100 : 0}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 text-center font-bold">
                        보상률 {calcResults.total > 0 ? Math.round((calcResults.hospital.reimbursement / calcResults.total) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  {/* 통원 */}
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">🚶 통원 <span className="text-xs font-normal text-gray-400">(공제 2만원)</span></h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">보상금액</span>
                        <span className="text-xl font-black text-emerald-700">{formatMoney(calcResults.outpatient.reimbursement)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">본인부담</span>
                        <span className="text-lg font-bold text-rose-600">{formatMoney(calcResults.outpatient.selfPay)}</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden bg-gray-200 mt-2">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${calcResults.total > 0 ? (calcResults.outpatient.reimbursement / calcResults.total) * 100 : 0}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 text-center font-bold">
                        보상률 {calcResults.total > 0 ? Math.round((calcResults.outpatient.reimbursement / calcResults.total) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* 기준 안내 */}
                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
                  <p>• <strong className="text-gray-700">급여:</strong> 본인부담 20% (보상 80%)</p>
                  <p>• <strong className="text-blue-600">중증 비급여:</strong> 본인부담 30% (보상 70%)</p>
                  <p>• <strong className="text-rose-600">비중증 비급여:</strong> 본인부담 50% (보상 50%)</p>
                  <p>• <strong className="text-gray-700">통원:</strong> 위 비율 적용 후 2만원 추가 공제</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-0.5 text-gray-400">
                    <p>• 본 계산 결과는 참고용입니다.</p>
                    <p>• 상품 추천 또는 가입 권유 목적이 아닙니다.</p>
                    <p>• 실제 보험료는 조건에 따라 달라질 수 있습니다.</p>
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
