'use client'

import { useState, useMemo } from 'react'
import { CalculatorIcon, InformationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'

type Result = {
    gen: string
    title: string
    reimbursement: number
    selfPay: number
    description: string
    highlight?: boolean
}

export default function SilbiCalculator() {
    const { t, locale } = useLanguage();
    // Inputs
    const [treatmentType, setTreatmentType] = useState<'hospital' | 'outpatient'>('hospital')
    const [coveredAmount, setCoveredAmount] = useState<string>('') // 급여
    const [uncoveredAmount, setUncoveredAmount] = useState<string>('') // 비급여
    const [threeMajorAmount, setThreeMajorAmount] = useState<string>('') // 3대 비급여 (도수/MRI/주사)

    const calculateResults = useMemo(() => {
        const covered = parseFloat(coveredAmount) || 0
        const uncovered = parseFloat(uncoveredAmount) || 0
        const threeMajor = parseFloat(threeMajorAmount) || 0
        const total = covered + uncovered + threeMajor

        // If nothing is entered, return empty
        if (total === 0) return []

        const genLabels = {
            '1세대': t('gen1'),
            '2세대': t('gen2'),
            '3세대': t('gen3'),
            '4세대': t('gen4'),
        };

        const descriptions = {
            hospital: {
                gen1: t('silbiHospitalGen1'),
                gen2: t('silbiHospitalGen2'),
                gen3: t('silbiHospitalGen3'),
                gen4: t('silbiHospitalGen4'),
            },
            outpatient: {
                gen1: t('silbiOutpatientGen1'),
                gen2: t('silbiOutpatientGen2'),
                gen3: t('silbiOutpatientGen3'),
                gen4: t('silbiOutpatientGen4'),
            },
            zero: t('alertBirthDate')
        };

        // 통원시 최소 공제금액 미달 체크 (의원급 기준 약 1만원)
        if (treatmentType === 'outpatient' && total < 10000) {
            return [
                { gen: genLabels['1세대'], title: '2009.09 ~', reimbursement: 0, selfPay: total, description: descriptions.zero },
                { gen: genLabels['2세대'], title: '2009.10 ~', reimbursement: 0, selfPay: total, description: descriptions.zero },
                { gen: genLabels['3세대'], title: '2017.04 ~', reimbursement: 0, selfPay: total, description: descriptions.zero },
                { gen: genLabels['4세대'], title: '2021.07 ~', reimbursement: 0, selfPay: total, description: descriptions.zero, highlight: true }
            ]
        }

        const results: Result[] = []

        if (treatmentType === 'hospital') {
            results.push({
                gen: genLabels['1세대'],
                title: '2009.09 ~',
                reimbursement: total,
                selfPay: 0,
                description: descriptions.hospital.gen1
            })
            results.push({
                gen: genLabels['2세대'],
                title: '2009.10 ~',
                reimbursement: total * 0.9,
                selfPay: total * 0.1,
                description: descriptions.hospital.gen2
            })
            results.push({
                gen: genLabels['3세대'],
                title: '2017.04 ~',
                reimbursement: (covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7),
                selfPay: total - ((covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7)),
                description: descriptions.hospital.gen3
            })
            results.push({
                gen: genLabels['4세대'],
                title: '2021.07 ~',
                reimbursement: (covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7),
                selfPay: total - ((covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7)),
                description: descriptions.hospital.gen4,
                highlight: true
            })
        } else {
            results.push({
                gen: genLabels['1세대'],
                title: '2009.09 ~',
                reimbursement: Math.max(0, total - 5000),
                selfPay: Math.min(total, 5000),
                description: descriptions.outpatient.gen1
            })
            results.push({
                gen: genLabels['2세대'],
                title: '2009.10 ~',
                reimbursement: Math.max(0, total - 15000),
                selfPay: Math.min(total, 15000),
                description: descriptions.outpatient.gen2
            })
            const gen3Ratio = (covered * 0.9) + (uncovered * 0.8) + (threeMajor * 0.7)
            results.push({
                gen: genLabels['3세대'],
                title: '2017.04 ~',
                reimbursement: Math.min(Math.max(0, total - 15000), gen3Ratio),
                selfPay: total - Math.min(Math.max(0, total - 15000), gen3Ratio),
                description: descriptions.outpatient.gen3
            })
            const gen4Ratio = (covered * 0.8) + (uncovered * 0.7) + (threeMajor * 0.7)
            results.push({
                gen: genLabels['4세대'],
                title: '2021.07 ~',
                reimbursement: Math.min(Math.max(0, total - 20000), gen4Ratio),
                selfPay: total - Math.min(Math.max(0, total - 20000), gen4Ratio),
                description: descriptions.outpatient.gen4,
                highlight: true
            })
        }

        return results
    }, [coveredAmount, uncoveredAmount, threeMajorAmount, treatmentType, t])


    const formatMoney = (amount: number) => {
        if (amount <= 0) return `0 ${t('currencyUnit')}`
        
        if (locale !== 'ko') {
            return `${Math.round(amount).toLocaleString()} ${t('currencyUnit')}`
        }

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
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('hospitalFee')}</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Treatment Type Toggle */}
                        <div className="bg-white p-1 rounded-2xl border border-gray-200 flex mb-8">
                            <button
                                onClick={() => setTreatmentType('hospital')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${treatmentType === 'hospital' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {t('hospitalization')}
                            </button>
                            <button
                                onClick={() => setTreatmentType('outpatient')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${treatmentType === 'outpatient' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {t('outpatient')}
                            </button>
                        </div>

                        {/* Covered */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {t('covered')}
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
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium whitespace-nowrap">
                                    {t('currencyUnit')}
                                </div>
                            </div>
                        </div>

                        {/* Uncovered (General) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {t('uncovered')}
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
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium whitespace-nowrap">
                                    {t('currencyUnit')}
                                </div>
                            </div>
                        </div>

                        {/* 3 Major Uncovered */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {t('threeMajor')}
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
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium whitespace-nowrap">
                                    {t('currencyUnit')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Results */}
                <div className="w-full lg:w-7/12 bg-white p-6 md:p-8 lg:p-10 flex flex-col">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full self-start">
                                {treatmentType === 'hospital' ? t('hospitalization') : t('outpatient')}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">{t('estimatedReward')}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">{t('totalClaim')}</p>
                            <p className="text-2xl font-black text-primary-600">{formatMoney(totalExpense)}</p>
                        </div>
                    </div>

                    {calculateResults.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-gray-400">
                            <CalculatorIcon className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium text-gray-600">{t('inputAmount')}</p>
                            <p className="text-sm mt-2">{t('calculateNow')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {calculateResults.map((result: Result, idx: number) => (
                                <div 
                                    key={idx} 
                                    className={`relative p-5 rounded-2xl border-2 transition-all ${result.highlight ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'}`}
                                >
                                    {result.highlight && (
                                        <div className="absolute -top-3 right-4 bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wider uppercase">
                                            {t('currentGen')}
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-bold text-lg ${result.highlight ? 'text-primary-900' : 'text-gray-900'}`}>{result.gen}</h3>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{result.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">{result.description}</p>
                                        </div>

                                        <div className="flex gap-4 sm:flex-col sm:gap-1 sm:text-right shrink-0">
                                            <div className="flex-1 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{t('selfPay')}</div>
                                                <div className="font-bold text-gray-600">{formatMoney(result.selfPay)}</div>
                                            </div>
                                            <div className="flex-1 bg-primary-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                                                <div className="text-[10px] font-black text-primary-400 uppercase tracking-wider mb-0.5">{t('rewardAmount')}</div>
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
                                    <div className="flex justify-between mt-1.5 px-0.5">
                                        <span className={`text-[10px] font-black ${result.highlight ? 'text-primary-600' : 'text-gray-500'}`}>
                                            {t('reimbLabel')} {totalExpense > 0 ? Math.round((result.reimbursement / totalExpense) * 100) : 0}%
                                        </span>
                                        <span className="text-[10px] font-black text-rose-500">
                                            {t('payLabel')} {totalExpense > 0 ? Math.round((result.selfPay / totalExpense) * 100) : 0}%
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 bg-blue-50/50 rounded-3xl p-6 md:p-8 border border-blue-100 flex flex-col md:flex-row items-start gap-6">
                <InformationCircleIcon className="w-8 h-8 text-blue-500 shrink-0" />
                <div>
                    <h4 className="font-black text-blue-900 mb-3 text-lg">💡 {t('noticeTitle')}</h4>
                    <ul className="text-sm text-blue-800/80 space-y-2.5 list-disc list-inside font-bold leading-relaxed">
                        <li>{t('noticeSilbi')}</li>
                    </ul>
                    <ul className="mt-3 text-xs text-blue-700/60 space-y-1 list-disc list-inside">
                        <li>본 계산 결과는 참고용입니다.</li>
                        <li>상품 추천 또는 가입 권유 목적이 아닙니다.</li>
                        <li>실제 보험료는 조건에 따라 달라질 수 있습니다.</li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                 <a href="/#consultation" className="inline-flex items-center gap-3 bg-gray-900 text-white font-black px-10 py-5 rounded-2xl shadow-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 text-lg">
                    {t('requestConsultation')}
                    <ArrowRightIcon className="w-5 h-5" />
                 </a>
            </div>
        </div>
    )
}
