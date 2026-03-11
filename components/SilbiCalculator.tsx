'use client'

import { useState, useMemo } from 'react'
import { CalculatorIcon, InformationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

type Result = {
    gen: string
    title: string
    reimbursement: number
    selfPay: number
    description: string
    highlight?: boolean
}

export default function SilbiCalculator() {
    // Inputs
    const [treatmentType, setTreatmentType] = useState<'hospital' | 'outpatient'>('hospital')
    const [coveredAmount, setCoveredAmount] = useState<string>('') // 급여
    const [uncoveredAmount, setUncoveredAmount] = useState<string>('') // 비중증/일반 비급여
    const [threeMajorAmount, setThreeMajorAmount] = useState<string>('') // 3대 비급여 (도수/MRI/주사)

    const calculateResults = useMemo(() => {
        const covered = parseFloat(coveredAmount) || 0
        const uncovered = parseFloat(uncoveredAmount) || 0
        const threeMajor = parseFloat(threeMajorAmount) || 0
        const total = covered + uncovered + threeMajor

        // If nothing is entered, return empty
        if (total === 0) return []

        // 통원시 최소 공제금액 미달 체크 (의원급 기준 약 1만원)
        if (treatmentType === 'outpatient' && total < 10000) {
            const descriptionForZero = '통원 최소 공제금액(1만원) 미달로 보상 불가'
            return [
                { gen: '1세대', title: '2009.09 이전', reimbursement: 0, selfPay: total, description: descriptionForZero },
                { gen: '2세대', title: '2009.10-2017.03', reimbursement: 0, selfPay: total, description: descriptionForZero },
                { gen: '3세대', title: '2017.04-2021.06', reimbursement: 0, selfPay: total, description: descriptionForZero },
                { gen: '4세대', title: '2021.07-현재', reimbursement: 0, selfPay: total, description: descriptionForZero, highlight: true }
            ]
        }

        const results: Result[] = []

        if (treatmentType === 'hospital') {
            // --- 입원 (Hospitalization) ---
            // 1세대: 100% (또는 상해의료비 등 100%)
            results.push({
                gen: '1세대',
                title: '2009.09 이전',
                reimbursement: total,
                selfPay: 0,
                description: '자기부담금 0% (대부분 100% 보상)'
            })
            // 2세대: 90% (표준화 초기 90% 보장 일반적)
            results.push({
                gen: '2세대',
                title: '2009.10-2017.03',
                reimbursement: total * 0.9,
                selfPay: total * 0.1,
                description: '급여/비급여 통합 10% 본인 부담'
            })
            // 3세대: 급여 90%, 비급여 80%, 3대 70%
            results.push({
                gen: '3세대',
                title: '2017.04-2021.06',
                reimbursement: (covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7),
                selfPay: total - ((covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7)),
                description: '급여 10%, 비급여 20%, 3대비급여 30% 부담'
            })
            // 4세대: 급여 80%, 비급여 70%, 3대 70%
            results.push({
                gen: '4세대',
                title: '2021.07-현재',
                reimbursement: (covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7),
                selfPay: total - ((covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7)),
                description: '급여 20%, 비급여 30% 본인 부담',
                highlight: true
            })
        } else {
            // --- 통원 (Outpatient) ---
            // 1세대: 총액 - 5,000원 공제
            results.push({
                gen: '1세대',
                title: '2009.09 이전',
                reimbursement: Math.max(0, total - 5000),
                selfPay: Math.min(total, 5000),
                description: '1일당 5,000원 정액 공제'
            })
            // 2세대: 총액 - 15,000원 (의원~상종 평균치)
            results.push({
                gen: '2세대',
                title: '2009.10-2017.03',
                reimbursement: Math.max(0, total - 15000),
                selfPay: Math.min(total, 15000),
                description: '보통 1~2만원 정액 공제 (병원급 1.5만 기준)'
            })
            // 3세대: Max(1.5만, 비율제) 공제
            const gen3Ratio = (covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7)
            results.push({
                gen: '3세대',
                title: '2017.04-2021.06',
                reimbursement: Math.min(Math.max(0, total - 15000), gen3Ratio),
                selfPay: total - Math.min(Math.max(0, total - 15000), gen3Ratio),
                description: '정액(1.5만) 또는 정률 중 큰 금액 공제'
            })
            // 4세대: Max(2만, 비율제) 공제
            const gen4Ratio = (covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7)
            results.push({
                gen: '4세대',
                title: '2021.07-현재',
                reimbursement: Math.min(Math.max(0, total - 20000), gen4Ratio),
                selfPay: total - Math.min(Math.max(0, total - 20000), gen4Ratio),
                description: '급여 20%, 비급여 30% 중 큰 금액 공제',
                highlight: true
            })
        }

        return results
    }, [coveredAmount, uncoveredAmount, threeMajorAmount, treatmentType])


    const formatMoney = (amount: number) => {
        if (amount <= 0) return '0원'
        const manwon = Math.floor(amount / 10000)
        const remainder = Math.round(amount % 10000)

        if (manwon > 0 && remainder > 0) {
            return `${manwon.toLocaleString()}만 ${remainder.toLocaleString()}원`
        } else if (manwon > 0 && remainder === 0) {
            return `${manwon.toLocaleString()}만 원`
        }
        return `${Math.round(amount).toLocaleString()}원`
    }

    const totalExpense = (parseFloat(coveredAmount) || 0) + (parseFloat(uncoveredAmount) || 0) + (parseFloat(threeMajorAmount) || 0)


    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                
                {/* Left Side: Inputs */}
                <div className="w-full lg:w-5/12 bg-gray-50 p-6 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary-100 p-2.5 rounded-xl text-primary-600">
                            <CalculatorIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">병원비 입력</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Treatment Type Toggle */}
                        <div className="bg-white p-1 rounded-2xl border border-gray-200 flex mb-8">
                            <button
                                onClick={() => setTreatmentType('hospital')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${treatmentType === 'hospital' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                입원 치료
                            </button>
                            <button
                                onClick={() => setTreatmentType('outpatient')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${treatmentType === 'outpatient' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                통원 치료
                            </button>
                        </div>

                        {/* Covered */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                건강보험 적용(급여) 진료비
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="block w-full pl-4 pr-12 py-3 md:py-4 text-left text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    placeholder="0"
                                    value={coveredAmount}
                                    onChange={(e) => setCoveredAmount(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium">
                                    원
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">진찰료, 검사료 등 급여 항목 영수증 금액</p>
                        </div>

                        {/* Uncovered (General) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                일반 비급여 진료비
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="block w-full pl-4 pr-12 py-3 md:py-4 text-left text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    placeholder="0"
                                    value={uncoveredAmount}
                                    onChange={(e) => setUncoveredAmount(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium">
                                    원
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">비급여 초음파, 영양제 등 일반 비급여 항목</p>
                        </div>

                        {/* 3 Major Uncovered */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                3대 비급여 진료비
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="block w-full pl-4 pr-12 py-3 md:py-4 text-left text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    placeholder="0"
                                    value={threeMajorAmount}
                                    onChange={(e) => setThreeMajorAmount(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium">
                                    원
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">도수치료, 체외충격파, 비급여 주사, MRI/MRA</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Results */}
                <div className="w-full lg:w-7/12 bg-white p-6 md:p-8 lg:p-10 flex flex-col">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full self-start">
                                {treatmentType === 'hospital' ? '입원 기준' : '통원 기준'}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">세대별 예상 보상금액</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">총 청구 금액</p>
                            <p className="text-2xl font-black text-primary-600">{formatMoney(totalExpense)}</p>
                        </div>
                    </div>

                    {calculateResults.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-gray-400">
                            <CalculatorIcon className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium text-gray-600">진료비를 원 단위로 입력해주세요.</p>
                            <p className="text-sm mt-2">입력 즉시 세대별로 얼마를 돌려받는지 비교해 드립니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {calculateResults.map((result, idx) => (
                                <div 
                                    key={idx} 
                                    className={`relative p-5 rounded-2xl border-2 transition-all ${result.highlight ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'}`}
                                >
                                    {result.highlight && (
                                        <div className="absolute -top-3 right-4 bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wider">
                                            현재 가입 세대
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-bold text-lg ${result.highlight ? 'text-primary-900' : 'text-gray-900'}`}>{result.gen}</h3>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{result.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{result.description}</p>
                                        </div>

                                        <div className="flex gap-4 sm:flex-col sm:gap-1 sm:text-right shrink-0">
                                            <div className="flex-1 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">내가 낼 돈 (공제금액)</div>
                                                <div className="font-semibold text-gray-600">{formatMoney(result.selfPay)}</div>
                                            </div>
                                            <div className="flex-1 bg-primary-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                                                <div className="text-[11px] font-bold text-primary-400 uppercase tracking-wider mb-0.5">돌려받는 돈 (보상액)</div>
                                                <div className={`font-black text-lg ${result.highlight ? 'text-primary-700' : 'text-gray-900'}`}>{formatMoney(result.reimbursement)}</div>
                                            </div>
                                        </div>

                                    </div>
                                    
                                    {/* Visual Bar */}
                                    <div className="mt-4 flex h-2 rounded-full overflow-hidden bg-gray-100">
                                        <div 
                                            className={`h-full transition-all duration-1000 ease-out ${result.highlight ? 'bg-primary-500' : 'bg-gray-400'}`}
                                            style={{ width: `${totalExpense > 0 ? (result.reimbursement / totalExpense) * 100 : 0}%` }}
                                        />
                                        <div 
                                            className="h-full bg-rose-400 transition-all duration-1000 ease-out"
                                            style={{ width: `${totalExpense > 0 ? (result.selfPay / totalExpense) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1.5 px-1">
                                        <span className={`text-[10px] font-bold ${result.highlight ? 'text-primary-600' : 'text-gray-500'}`}>
                                            보상 {totalExpense > 0 ? Math.round((result.reimbursement / totalExpense) * 100) : 0}%
                                        </span>
                                        <span className="text-[10px] font-bold text-rose-500">
                                            부담 {totalExpense > 0 ? Math.round((result.selfPay / totalExpense) * 100) : 0}%
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 mb-2">계산기 이용 전 꼭 확인하세요!</h4>
                    <ul className="text-sm text-blue-800/80 space-y-1.5 list-disc list-inside">
                        <li>총 진료비가 <strong>의원급 통원 최소 공제금액인 1만 원 미만일 경우 세대별로 보상되지 않을 수 있습니다.</strong></li>
                        <li>통원의 경우 하루 한도(보통 20~30만원)가 정해져 있어 이를 초과하는 금액은 보상되지 않습니다.</li>
                        <li>위 계산 결과는 본인부담금 상한제, 비과세 등 복잡한 요소를 제외하고 <strong>오로지 "세대별 기본 보장 비율"만을 기준으로 단순화된 예상치</strong>입니다.</li>
                        <li>단순히 보상금액만 보고 판단하기 보다, 현재 가입자의 평소 병원 이용 빈도와 건강 상태, 유지 중인 보험 번들을 종합적으로 따져서 전환을 고려해야 합니다.</li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-10 text-center">
                 <a href="/#consultation" className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-colors">
                    상황에 맞는 최적의 실손 찾기 (무료 상담)
                    <ArrowRightIcon className="w-5 h-5" />
                 </a>
            </div>
        </div>
    )
}
