'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MagnifyingGlassIcon,
    BuildingOffice2Icon,
    PhoneIcon,
    MapPinIcon,
    UserGroupIcon,
    BeakerIcon,
    ShieldCheckIcon,
    StarIcon,
    HeartIcon,
    ChevronRightIcon,
    XMarkIcon,
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

interface HospitalItem {
    ykiho: string
    name: string
    type: string
    addr: string
    tel: string
    sidoNm: string
    sgguNm: string
    drTotCnt: number
}

interface HospitalDetail {
    basic: {
        name: string
        type: string
        addr: string
        tel: string
        estbDd: string
        drTotCnt: number
        hospUrl: string
        mdtrSDayNm: string
        mdtrEDayNm: string
    } | null
    subjects: { name: string; code: string }[]
    equipment: { name: string; count: number }[]
    medicalStaff: { name: string; count: number }[]
    nursingGrade: { typeName: string; grade: string }[]
    specialDiag: { name: string }[]
}

type MainMode = 'hospital' | 'disease'
type TabKey = 'basic' | 'subjects' | 'equipment' | 'nursing' | 'special'

const HOS_TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'basic', label: '기본정보', icon: BuildingOffice2Icon },
    { key: 'subjects', label: '진료과목', icon: UserGroupIcon },
    { key: 'equipment', label: '의료장비', icon: BeakerIcon },
    { key: 'nursing', label: '간호등급', icon: ShieldCheckIcon },
    { key: 'special', label: '특수진료', icon: StarIcon },
]

export default function HospitalPage() {
    const [mode, setMode] = useState<MainMode>('hospital')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<HospitalItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [searching, setSearching] = useState(false)
    const [searchError, setSearchError] = useState('')

    const [selected, setSelected] = useState<HospitalItem | null>(null)
    const [detail, setDetail] = useState<HospitalDetail | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('basic')

    // Disease specific state
    const [diseases, setDiseases] = useState<{ rank: string; name: string; code: string; count: string }[]>([])
    const [loadingDiseases, setLoadingDiseases] = useState(false)

    const handleSearch = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!query.trim()) return
        setSearching(true)
        setSearchError('')
        setSelected(null)
        setDetail(null)
        setDiseases([])

        try {
            const res = await fetch(`/api/hospital/search?keyword=${encodeURIComponent(query)}&numOfRows=30`)
            const data = await res.json()
            if (!data.success) throw new Error(data.error)
            setResults(data.items)
            setTotalCount(data.totalCount)
        } catch (err: any) {
            setSearchError(err.message || '검색 중 오류가 발생했습니다.')
            setResults([])
        } finally {
            setSearching(false)
        }
    }, [query])

    const handleHospitalSelect = useCallback(async (item: HospitalItem) => {
        setSelected(item)
        setLoadingDetail(true)
        setActiveTab('basic')
        setDetail(null)

        try {
            const res = await fetch(`/api/hospital/detail?ykiho=${encodeURIComponent(item.ykiho)}`)
            const data = await res.json()
            if (!data.success) throw new Error(data.error)
            setDetail(data.detail)
        } catch (err: any) {
            console.error('Detail error:', err)
        } finally {
            setLoadingDetail(false)
        }
    }, [])

    const handleDiseaseSelect = useCallback(async (item: HospitalItem) => {
        setSelected(item)
        setLoadingDiseases(true)
        setDiseases([])

        try {
            const params = new URLSearchParams({ ykiho: item.ykiho, yadmNm: item.name })
            const res = await fetch(`/api/hospital/diseases?${params.toString()}`)
            const data = await res.json()
            setDiseases(data.diseases || [])
        } catch {
            setDiseases([])
        } finally {
            setLoadingDiseases(false)
        }
    }, [])

    const switchMode = (newMode: MainMode) => {
        setMode(newMode)
        setQuery('')
        setResults([])
        setSelected(null)
        setDetail(null)
        setDiseases([])
        setSearchError('')
    }

    return (
        <div className="space-y-6">
            {/* Main Mode Toggle */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto lg:mx-0 shadow-inner">
                <button
                    onClick={() => switchMode('hospital')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        mode === 'hospital' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <BuildingOffice2Icon className="w-4 h-4" />
                    병원 시설정보 조회
                </button>
                <button
                    onClick={() => switchMode('disease')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        mode === 'disease' ? 'bg-white text-rose-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <HeartIcon className="w-4 h-4" />
                    고객 질병 정보 조회
                </button>
            </div>

            {/* Header */}
            <div className={`rounded-3xl p-6 text-white relative overflow-hidden transition-all duration-500 ${
                mode === 'hospital' ? 'bg-gradient-to-br from-teal-600 to-emerald-700' : 'bg-gradient-to-br from-rose-600 to-pink-700'
            }`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                            {mode === 'hospital' ? <BuildingOffice2Icon className="w-6 h-6" /> : <ClipboardDocumentCheckIcon className="w-6 h-6" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">
                                {mode === 'hospital' ? '의료기관 정보 조회' : '고객 맞춤형 질병 데이터'}
                            </h1>
                            <p className="text-white/60 text-xs font-medium">건강보험심사평가원 실시간 데이터</p>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm mt-3 leading-relaxed max-w-2xl">
                        {mode === 'hospital' 
                            ? '조회하려는 병원명을 입력하세요. 주소, 전화번호, 진료과목부터 보유한 의료 장비와 간호 등급까지 모든 시설 정보를 제공합니다.'
                            : '특정 의원에서 주로 발생하는 질병(Top 5) 통계를 확인합니다. 고객의 방문 예정 병원이나 거주지 근처 의원의 진료 데이터를 기반으로 전문적인 상담을 준비하세요.'}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${mode === 'hospital' ? 'text-teal-400' : 'text-rose-400'}`} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={`${mode === 'hospital' ? '시설 정보를 볼 병원명 입력' : '진료 질환을 볼 의원명 입력'}`}
                        className={`w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 shadow-sm ${
                            mode === 'hospital' ? 'focus:ring-teal-400' : 'focus:ring-rose-400'
                        }`}
                    />
                </div>
                <button
                    type="submit"
                    disabled={searching || !query.trim()}
                    className={`px-6 py-4 text-white rounded-2xl font-bold text-sm disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg ${
                        mode === 'hospital' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                    }`}
                >
                    {searching ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <MagnifyingGlassIcon className="w-5 h-5" />}
                    검사
                </button>
            </form>

            {searchError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                    ⚠️ {searchError}
                </div>
            )}

            {/* Main Content Layout */}
            <div className={`grid gap-4 ${selected ? 'lg:grid-cols-[380px_1fr]' : 'grid-cols-1'}`}>
                
                {/* 1. Results List */}
                {results.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-xs font-bold text-gray-400">검색결과 {totalCount.toLocaleString()}건</p>
                            {mode === 'disease' && <p className="text-[10px] text-rose-500 font-bold">* 의원급만 조회 가능</p>}
                        </div>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                            {results.map(item => (
                                <motion.button
                                    key={item.ykiho}
                                    onClick={() => mode === 'hospital' ? handleHospitalSelect(item) : handleDiseaseSelect(item)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                        selected?.ykiho === item.ykiho
                                            ? (mode === 'hospital' ? 'border-teal-400 bg-teal-50 shadow-md' : 'border-rose-400 bg-rose-50 shadow-md')
                                            : 'border-gray-100 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-gray-900 text-sm truncate">{item.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold mb-1">{item.type}</p>
                                            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                <MapPinIcon className="w-3 h-3" /> {item.addr}
                                            </p>
                                        </div>
                                        <ChevronRightIcon className={`w-4 h-4 mt-1 shrink-0 ${selected?.ykiho === item.ykiho ? (mode === 'hospital' ? 'text-teal-500' : 'text-rose-500') : 'text-gray-300'}`} />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Detail Data Section */}
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div
                            key={selected.ykiho}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full"
                        >
                            {/* Detail Header UI */}
                            <div className={`px-6 py-6 border-b border-gray-100 flex items-start justify-between ${mode === 'hospital' ? 'bg-teal-50/30' : 'bg-rose-50/30'}`}>
                                <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black mb-1 inline-block ${mode === 'hospital' ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {selected.type}
                                    </span>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{selected.name}</h2>
                                    <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {selected.addr}</p>
                                </div>
                                <button onClick={() => { setSelected(null); setDetail(null); setDiseases([]) }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mode Specific Logic Rendering */}
                            {mode === 'hospital' ? (
                                <>
                                    {/* Tabs for Hospital mode */}
                                    <div className="flex border-b border-gray-100 overflow-x-auto bg-white sticky top-0 z-10">
                                        {HOS_TABS.map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex items-center gap-2 px-6 py-4 text-xs font-black whitespace-nowrap border-b-2 transition-all ${
                                                    activeTab === tab.key ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                                                }`}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content Scroll Area */}
                                    <div className="p-6 overflow-y-auto max-h-[600px]">
                                        {loadingDetail ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-teal-500 gap-3">
                                                <ArrowPathIcon className="w-8 h-8 animate-spin" />
                                                <span className="text-sm font-bold animate-pulse">상세 데이터 분석 중...</span>
                                            </div>
                                        ) : detail ? (
                                            <div className="space-y-6">
                                                {activeTab === 'basic' && (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {[
                                                            { label: '대표 주소', value: detail.basic?.addr, icon: MapPinIcon },
                                                            { label: '대표 전화', value: detail.basic?.tel, icon: PhoneIcon },
                                                            { label: '전문의수', value: detail.basic?.drTotCnt ? `${detail.basic.drTotCnt}명` : '-', icon: UserGroupIcon },
                                                            { label: '설립일자', value: detail.basic?.estbDd, icon: ClipboardDocumentCheckIcon },
                                                        ].map(item => (
                                                            <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-500"><item.icon className="w-5 h-5" /></div>
                                                                <div>
                                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{item.label}</p>
                                                                    <p className="text-sm font-bold text-gray-700">{item.value}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeTab === 'subjects' && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {detail.subjects.map(s => (
                                                            <div key={s.code} className="p-3 border border-gray-100 rounded-xl text-center text-xs font-bold text-gray-600 bg-gray-50/50">
                                                                {s.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeTab === 'equipment' && (
                                                    <div className="space-y-2">
                                                        {detail.equipment.map(e => (
                                                            <div key={e.name} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl">
                                                                <span className="text-xs font-bold text-gray-600">{e.name}</span>
                                                                <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">{e.count}대</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeTab === 'nursing' && (
                                                    <div className="space-y-4">
                                                        {detail.nursingGrade.map(n => (
                                                            <div key={n.typeName} className="p-4 bg-teal-50/30 rounded-2xl border border-teal-100/50">
                                                                <p className="text-[10px] text-teal-600 font-black mb-1">{n.typeName}</p>
                                                                <div className="flex items-end justify-between">
                                                                    <span className="text-lg font-black text-teal-700">{n.grade}등급</span>
                                                                    <div className="flex gap-1">
                                                                        {[1,2,3,4,5,6].map(i => (
                                                                            <div key={i} className={`w-2 h-4 rounded-sm ${i <= (7 - parseInt(n.grade)) ? 'bg-teal-500' : 'bg-gray-200'}`} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {activeTab === 'special' && (
                                                     <div className="flex flex-wrap gap-2">
                                                        {detail.specialDiag.map((s, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
                                                                {s.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                /* Disease Info Mode */
                                <div className="p-6">
                                    <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                        <p className="text-xs text-rose-700 font-bold leading-relaxed">
                                            📊 최근 1년간 해당 의료기관에서 실제 진료된 상위 5개 질병 정보를 분석합니다. 고객 상담 시 참고용으로만 활용하세요.
                                        </p>
                                    </div>

                                    {loadingDiseases ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-rose-500 gap-3">
                                           <ArrowPathIcon className="w-8 h-8 animate-spin" />
                                           <span className="text-sm font-bold animate-pulse">질병 통계 데이터 추출 중...</span>
                                        </div>
                                    ) : diseases.length > 0 ? (
                                        <div className="space-y-3">
                                            {diseases.map((d, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-rose-200 transition-colors">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${
                                                        i === 0 ? 'bg-rose-500 text-white' :
                                                        i === 1 ? 'bg-orange-400 text-white' :
                                                        i === 2 ? 'bg-amber-400 text-white' :
                                                        'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {d.rank || i + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-black text-gray-800">{d.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{d.code}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
                                                            {Number(d.count).toLocaleString()}건
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                            <ClipboardDocumentCheckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500 font-bold">진료 통계 결과가 없습니다.</p>
                                            <p className="text-xs text-gray-400 mt-1">의원급 의료기관만 정보를 제공합니다.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Initial Empty State */}
                {!results.length && !selected && !searching && (
                    <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-sm">
                        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 ${
                            mode === 'hospital' ? 'bg-teal-50 text-teal-400 animate-bounce' : 'bg-rose-50 text-rose-400 animate-pulse'
                        }`}>
                            {mode === 'hospital' ? <BuildingOffice2Icon className="w-12 h-12" /> : <HeartIcon className="w-12 h-12" />}
                        </div>
                        <h2 className="text-xl font-black text-gray-800 mb-2">
                            {mode === 'hospital' ? '궁금한 병원을 검색해 보세요' : '의원의 주요 질병을 조회하세요'}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                            {mode === 'hospital' 
                                ? '전국의 모든 병원 시설 데이터를 한눈에 확인하여 고객에게 정확한 정보를 제공하세요.'
                                : '해당 의원에서 가장 많이 다뤄지는 상위 5개 질환 데이터를 통해 상담 전략을 세울 수 있습니다.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
