'use client'

import { useState, useMemo } from 'react'
import { CalculatorIcon, InformationCircleIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'

type Result = {
    gen: string
    title: string
    date: string
    feature: string
    reimbursement: number
    selfPay: number
    description: string
    highlight?: boolean
}

export default function SilbiCalculator() {
    const { t, locale } = useLanguage();
    
    // Inpatient Inputs
    const [hospCovered, setHospCovered] = useState<string>('')
    const [hospUncovered, setHospUncovered] = useState<string>('')
    const [hospThreeMajor, setHospThreeMajor] = useState<string>('')

    // Outpatient Inputs
    const [outCovered, setOutCovered] = useState<string>('')
    const [outUncovered, setOutUncovered] = useState<string>('')
    const [outThreeMajor, setOutThreeMajor] = useState<string>('')

    const calculateResults = useMemo(() => {
        const hCov = parseFloat(hospCovered) || 0
        const hUnc = parseFloat(hospUncovered) || 0
        const hThr = parseFloat(hospThreeMajor) || 0
        const hTotal = hCov + hUnc + hThr

        const oCov = parseFloat(outCovered) || 0
        const oUnc = parseFloat(outUncovered) || 0
        const oThr = parseFloat(outThreeMajor) || 0
        const oTotal = oCov + oUnc + oThr

        if (hTotal === 0 && oTotal === 0) return []

        const genLabels = {
            '1세대': t('gen1'),
            '2세대': t('gen2'),
            '3세대': t('gen3'),
            '4세대': t('gen4'),
            '5세대': t('gen5'),
        };

        const genDates = {
            '1세대': t('gen1Date'),
            '2세대': t('gen2Date'),
            '3세대': t('gen3Date'),
            '4세대': t('gen4Date'),
            '5세대': t('gen5Date'),
        }

        const genFeatures = {
            '1세대': t('gen1Feature'),
            '2세대': t('gen2Feature'),
            '3세대': t('gen3Feature'),
            '4세대': t('gen4Feature'),
            '5세대': t('gen5Feature'),
        }

        const gens = ['1세대', '2세대', '3세대', '4세대', '5세대'] as const;
        
        return gens.map(g => {
            let hReimb = 0;
            let oReimb = 0;

            // Inpatient Calculation
            if (g === '1세대') {
                hReimb = hTotal;
            } else if (g === '2세대') {
                hReimb = hTotal * 0.9;
            } else if (g === '3세대') {
                hReimb = (hCov * 0.9) + (hUnc * 0.8) + (hThr * 0.7);
            } else if (g === '4세대') {
                hReimb = (hCov * 0.8) + (hUnc * 0.7) + (hThr * 0.7);
            } else if (g === '5세대') {
                const selfPayCovered = Math.min(hCov * 0.2, 2000000);
                const selfPaySevere = Math.min((hUnc + hThr) * 0.3, 5000000);
                hReimb = hTotal - (selfPayCovered + selfPaySevere);
            }

            // Outpatient Calculation
            if (g === '1세대') {
                oReimb = Math.max(0, oTotal - 5000);
            } else if (g === '2세대') {
                oReimb = Math.max(0, oTotal - 15000);
            } else if (g === '3세대') {
                const ratio = (oCov * 0.9) + (oUnc * 0.8) + (oThr * 0.7);
                oReimb = Math.min(Math.max(0, oTotal - 15000), ratio);
            } else if (g === '4세대') {
                const ratio = (oCov * 0.8) + (oUnc * 0.7) + (oThr * 0.7);
                oReimb = Math.min(Math.max(0, oTotal - 20000), ratio);
            } else if (g === '5세대') {
                const selfPayCovered = Math.max(oCov * 0.2, oCov > 0 ? 20000 : 0);
                const selfPaySevere = Math.max((oUnc + oThr) * 0.3, (oUnc + oThr) > 0 ? 30000 : 0);
                oReimb = Math.max(0, oTotal - (selfPayCovered + selfPaySevere));
            }

            return {
                gen: genLabels[g],
                title: g,
                date: genDates[g],
                feature: genFeatures[g],
                reimbursement: hReimb + oReimb,
                selfPay: (hTotal + oTotal) - (hReimb + oReimb),
                description: g === '5세대' ? t('silbiHospitalGen5') : (hTotal > 0 ? t(`silbiHospitalGen${g.at(0)}` as any) : t(`silbiOutpatientGen${g.at(0)}` as any)),
                highlight: g === '5세대'
            };
        });
    }, [hospCovered, hospUncovered, hospThreeMajor, outCovered, outUncovered, outThreeMajor, t])

    const formatMoney = (amount: number) => {
        if (amount <= 0) return `0 ${t('currencyUnit')}`
        if (locale !== 'ko') return `${Math.round(amount).toLocaleString()} ${t('currencyUnit')}`
        const manwon = Math.floor(amount / 10000)
        const remainder = Math.round(amount % 10000)
        if (manwon > 0 && remainder > 0) return `${manwon.toLocaleString()}만 ${remainder.toLocaleString()}원`
        if (manwon > 0) return `${manwon.toLocaleString()}만 원`
        return `${Math.round(amount).toLocaleString()}원`
    }

    const totalExpense = (parseFloat(hospCovered) || 0) + (parseFloat(hospUncovered) || 0) + (parseFloat(hospThreeMajor) || 0) + 
                         (parseFloat(outCovered) || 0) + (parseFloat(outUncovered) || 0) + (parseFloat(outThreeMajor) || 0)

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col xl:flex-row">
                
                {/* Left Side: Inputs */}
                <div className="w-full xl:w-[450px] bg-gray-50 p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary-600 p-2.5 rounded-2xl text-white shadow-lg shadow-primary-200">
                            <CalculatorIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">{t('hospitalFee')}</h2>
                    </div>

                    <div className="space-y-10">
                        {/* Hospitalization Inputs */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-primary-700 font-black text-sm px-1">
                                <PlusIcon className="w-4 h-4" />
                                {t('hospitalization')}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('covered')}</label>
                                    <div className="relative">
                                        <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-bold text-lg" placeholder="0" value={hospCovered} onChange={e => setHospCovered(e.target.value)} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('uncovered')}</label>
                                        <div className="relative">
                                            <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-bold" placeholder="0" value={hospUncovered} onChange={e => setHospUncovered(e.target.value)} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('threeMajor')}</label>
                                        <div className="relative">
                                            <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-bold" placeholder="0" value={hospThreeMajor} onChange={e => setHospThreeMajor(e.target.value)} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outpatient Inputs */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-indigo-700 font-black text-sm px-1">
                                <PlusIcon className="w-4 h-4" />
                                {t('outpatient')}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('covered')}</label>
                                    <div className="relative">
                                        <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-bold text-lg" placeholder="0" value={outCovered} onChange={e => setOutCovered(e.target.value)} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('uncovered')}</label>
                                        <div className="relative">
                                            <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-bold" placeholder="0" value={outUncovered} onChange={e => setOutUncovered(e.target.value)} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{t('threeMajor')}</label>
                                        <div className="relative">
                                            <input type="number" min="0" className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-bold" placeholder="0" value={outThreeMajor} onChange={e => setOutThreeMajor(e.target.value)} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Results */}
                <div className="flex-1 bg-white p-6 md:p-8 lg:p-10 flex flex-col">
                    <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full self-start mb-1">
                                {t('estimatedReward')}
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">총 예상 보상금액</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('totalClaim')}</p>
                            <p className="text-3xl font-black text-primary-600">{formatMoney(totalExpense)}</p>
                        </div>
                    </div>

                    {calculateResults.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-gray-400">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                                <CalculatorIcon className="w-12 h-12 opacity-20" />
                            </div>
                            <p className="text-xl font-black text-gray-800 mb-2">{t('inputAmount')}</p>
                            <p className="text-sm font-medium">{t('calculateNow')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            {calculateResults.map((result: Result, idx: number) => (
                                <div 
                                    key={idx} 
                                    className={`relative p-6 rounded-3xl border-2 transition-all ${result.highlight ? 'border-primary-500 bg-primary-50/20' : 'border-gray-50 bg-white hover:border-gray-200 hover:shadow-xl'}`}
                                >
                                    {result.highlight && (
                                        <div className="absolute -top-3 right-6 bg-primary-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest shadow-lg shadow-primary-200">
                                            {t('currentGen')}
                                        </div>
                                    )}
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className={`font-black text-xl ${result.highlight ? 'text-primary-900' : 'text-gray-900'}`}>{result.gen}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{result.date}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${result.highlight ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {result.feature}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-6">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold text-gray-400">{t('rewardAmount')}</span>
                                                <span className={`text-2xl font-black ${result.highlight ? 'text-primary-600' : 'text-gray-900'}`}>{formatMoney(result.reimbursement)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-bold text-gray-500 bg-gray-50/50 p-3 rounded-2xl">
                                                <span>{t('selfPay')}</span>
                                                <span>{formatMoney(result.selfPay)}</span>
                                            </div>
                                        </div>

                                        {/* Visual Bar */}
                                        <div>
                                            <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ease-out ${result.highlight ? 'bg-primary-500' : 'bg-gray-400'}`}
                                                    style={{ width: `${totalExpense > 0 ? (result.reimbursement / totalExpense) * 100 : 0}%` }}
                                                />
                                                <div 
                                                    className="h-full bg-rose-400 transition-all duration-1000 ease-out"
                                                    style={{ width: `${totalExpense > 0 ? (result.selfPay / totalExpense) * 100 : 0}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-2 px-1">
                                                <span className={`text-[10px] font-black ${result.highlight ? 'text-primary-600' : 'text-gray-500'}`}>
                                                    보상 {totalExpense > 0 ? Math.round((result.reimbursement / totalExpense) * 100) : 0}%
                                                </span>
                                                <span className="text-[10px] font-black text-rose-500">
                                                    부담 {totalExpense > 0 ? Math.round((result.selfPay / totalExpense) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Table for detailed info */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 md:p-10 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">세대별 실손보험 한눈에 비교</h3>
                    <p className="text-gray-500 text-sm font-medium">1세대부터 5세대까지, 보장 범위와 특징을 확인해 보세요.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="py-6 px-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">구분</th>
                                {['1세대', '2세대', '3세대', '4세대', '5세대'].map(g => (
                                    <th key={g} className={`py-6 px-4 font-black text-sm ${g === '5세대' ? 'text-primary-600 bg-primary-50/30' : 'text-gray-900'}`}>{g}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-gray-600">
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-6 px-6 text-left font-black text-gray-400 text-[10px] uppercase tracking-widest">가입 시기</td>
                                {['gen1Date', 'gen2Date', 'gen3Date', 'gen4Date', 'gen5Date'].map((k, i) => (
                                    <td key={i} className={`py-6 px-4 ${i === 4 ? 'bg-primary-50/20' : ''}`}>{t(k as any)}</td>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-6 px-6 text-left font-black text-gray-400 text-[10px] uppercase tracking-widest">입원 보상</td>
                                <td className="py-6 px-4">100%</td>
                                <td className="py-6 px-4">90%</td>
                                <td className="py-6 px-4">80~90%</td>
                                <td className="py-6 px-4">70~80%</td>
                                <td className="py-6 px-4 bg-primary-50/20 text-primary-700">70~80% (한도설정)</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-6 px-6 text-left font-black text-gray-400 text-[10px] uppercase tracking-widest">통원 공제</td>
                                <td className="py-6 px-4">5천원</td>
                                <td className="py-6 px-4">1~2만원</td>
                                <td className="py-6 px-4">1~2만원/20%</td>
                                <td className="py-6 px-4">2~3만원/30%</td>
                                <td className="py-6 px-4 bg-primary-50/20 text-primary-700">2~5만원/50%</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-6 px-6 text-left font-black text-gray-400 text-[10px] uppercase tracking-widest">핵심 특징</td>
                                {['gen1Feature', 'gen2Feature', 'gen3Feature', 'gen4Feature', 'gen5Feature'].map((k, i) => (
                                    <td key={i} className={`py-6 px-4 text-xs ${i === 4 ? 'bg-primary-50/20' : ''}`}>{t(k as any)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 bg-blue-50/50 rounded-[2.5rem] p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-start gap-8">
                <div className="bg-white p-4 rounded-3xl shadow-sm text-blue-500 shrink-0">
                    <InformationCircleIcon className="w-10 h-10" />
                </div>
                <div>
                    <h4 className="font-black text-blue-900 mb-4 text-xl">💡 실손보험 계산기 이용 안내</h4>
                    <ul className="text-sm text-blue-800/80 space-y-3 font-bold leading-relaxed list-disc list-inside">
                        <li>본 계산기는 각 세대별 표준 약관을 기준으로 산출된 예상치입니다.</li>
                        <li>보험사, 가입 상품, 병원급(의원/병원/종합병원/상급종합병원)에 따라 실제 공제 금액은 달라질 수 있습니다.</li>
                        <li>통원의 경우 1일 보상 한도가 존재하므로, 고액 병원비의 경우 한도를 초과할 수 있습니다.</li>
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-blue-600 border border-blue-100">#실비비교</span>
                        <span className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-blue-600 border border-blue-100">#5세대실손</span>
                        <span className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-blue-600 border border-blue-100">#보험금계산</span>
                    </div>
                </div>
            </div>
            
            <div className="text-center py-12">
                 <a href="/#consultation" className="inline-flex items-center gap-4 bg-gray-900 text-white font-black px-12 py-6 rounded-3xl shadow-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 text-xl tracking-tight">
                    {t('requestConsultation')}
                    <ArrowRightIcon className="w-6 h-6" />
                 </a>
                 <p className="mt-6 text-gray-400 text-sm font-medium">전문가와 상담하면 더 정확한 보상 여부를 확인할 수 있습니다.</p>
            </div>
        </div>
    )
}
