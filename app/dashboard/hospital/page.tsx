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
    ChevronRightIcon,
    XMarkIcon,
    ArrowPathIcon,
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

type TabKey = 'basic' | 'subjects' | 'equipment' | 'nursing' | 'special'

const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'basic', label: '기본정보', icon: BuildingOffice2Icon },
    { key: 'subjects', label: '진료과목', icon: UserGroupIcon },
    { key: 'equipment', label: '의료장비', icon: BeakerIcon },
    { key: 'nursing', label: '간호등급', icon: ShieldCheckIcon },
    { key: 'special', label: '특수진료', icon: StarIcon },
]

export default function HospitalPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<HospitalItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [searching, setSearching] = useState(false)
    const [searchError, setSearchError] = useState('')

    const [selected, setSelected] = useState<HospitalItem | null>(null)
    const [detail, setDetail] = useState<HospitalDetail | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('basic')

    const handleSearch = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!query.trim()) return
        setSearching(true)
        setSearchError('')
        setSelected(null)
        setDetail(null)

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

    const handleSelect = useCallback(async (item: HospitalItem) => {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                            <BuildingOffice2Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">의료기관 정보 조회</h1>
                            <p className="text-teal-200 text-xs font-medium">건강보험심사평가원 공공데이터 활용</p>
                        </div>
                    </div>
                    <p className="text-teal-100 text-sm mt-3 leading-relaxed">
                        병원명으로 검색하여 진료과목, 의료장비, 간호등급 등 상세 정보를 조회합니다.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="병원명을 입력하세요 (예: 서울아산병원, 삼성서울병원)"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={searching || !query.trim()}
                    className="px-6 py-4 bg-teal-600 text-white rounded-2xl font-bold text-sm hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/30"
                >
                    {searching
                        ? <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        : <MagnifyingGlassIcon className="w-5 h-5" />
                    }
                    검색
                </button>
            </form>

            {searchError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                    ⚠️ {searchError}
                </div>
            )}

            {/* Results + Detail Panel */}
            <div className={`grid gap-4 ${selected ? 'lg:grid-cols-[380px_1fr]' : ''}`}>

                {/* Results List */}
                {results.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 px-1">
                            검색결과 {totalCount.toLocaleString()}건 (최대 30건 표시)
                        </p>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                            {results.map(item => (
                                <motion.button
                                    key={item.ykiho}
                                    onClick={() => handleSelect(item)}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                        selected?.ykiho === item.ykiho
                                            ? 'border-teal-400 bg-teal-50 shadow-md'
                                            : 'border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/30'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-black text-gray-900 text-sm">{item.name}</span>
                                                {item.type && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
                                                <MapPinIcon className="w-3 h-3 shrink-0" />
                                                {item.addr || `${item.sidoNm} ${item.sgguNm}`}
                                            </p>
                                            {item.tel && (
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <PhoneIcon className="w-3 h-3 shrink-0" />
                                                    {item.tel}
                                                </p>
                                            )}
                                        </div>
                                        <ChevronRightIcon className={`w-4 h-4 shrink-0 mt-1 transition-colors ${selected?.ykiho === item.ykiho ? 'text-teal-500' : 'text-gray-300'}`} />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detail Panel */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
                        >
                            {/* Detail Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-3 bg-gray-50/50">
                                <div>
                                    <h2 className="font-black text-gray-900 text-lg leading-tight">{selected.name}</h2>
                                    <p className="text-teal-600 text-xs font-bold mt-0.5">{selected.type}</p>
                                </div>
                                <button onClick={() => { setSelected(null); setDetail(null) }} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                                            activeTab === tab.key
                                                ? 'border-teal-500 text-teal-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 min-h-[300px]">
                                {loadingDetail ? (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <ArrowPathIcon className="w-8 h-8 animate-spin text-teal-500" />
                                            <span className="text-sm font-medium">정보를 불러오는 중...</span>
                                        </div>
                                    </div>
                                ) : !detail ? (
                                    <p className="text-gray-400 text-sm text-center mt-10">정보를 불러오지 못했습니다.</p>
                                ) : (
                                    <>
                                        {/* 기본정보 */}
                                        {activeTab === 'basic' && detail.basic && (
                                            <div className="space-y-3">
                                                {[
                                                    { label: '기관명', value: detail.basic.name },
                                                    { label: '종별', value: detail.basic.type },
                                                    { label: '주소', value: detail.basic.addr },
                                                    { label: '전화번호', value: detail.basic.tel },
                                                    { label: '의사 수', value: detail.basic.drTotCnt ? `${detail.basic.drTotCnt}명` : '-' },
                                                    { label: '진료 요일', value: [detail.basic.mdtrSDayNm, detail.basic.mdtrEDayNm].filter(Boolean).join(' ~ ') || '-' },
                                                    { label: '설립일', value: detail.basic.estbDd || '-' },
                                                ].map(row => (
                                                    <div key={row.label} className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
                                                        <span className="text-xs font-black text-gray-400 w-20 shrink-0">{row.label}</span>
                                                        <span className="text-sm font-medium text-gray-800">{row.value || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 진료과목 */}
                                        {activeTab === 'subjects' && (
                                            <div>
                                                {detail.subjects.length === 0
                                                    ? <p className="text-gray-400 text-sm text-center mt-10">진료과목 정보가 없습니다.</p>
                                                    : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {detail.subjects.map((s, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-xl border border-teal-100">
                                                                    {s.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )}

                                        {/* 의료장비 */}
                                        {activeTab === 'equipment' && (
                                            <div className="space-y-2">
                                                {detail.equipment.length === 0
                                                    ? <p className="text-gray-400 text-sm text-center mt-10">의료장비 정보가 없습니다.</p>
                                                    : detail.equipment.map((e, i) => (
                                                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                                                            <span className="text-sm font-medium text-gray-700">{e.name}</span>
                                                            <span className="text-sm font-black text-teal-600">{e.count}대</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}

                                        {/* 간호등급 */}
                                        {activeTab === 'nursing' && (
                                            <div className="space-y-2">
                                                {detail.nursingGrade.length === 0
                                                    ? <p className="text-gray-400 text-sm text-center mt-10">간호등급 정보가 없습니다.</p>
                                                    : detail.nursingGrade.map((n, i) => (
                                                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                                                            <span className="text-sm font-medium text-gray-700">{n.typeName}</span>
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg">{n.grade}등급</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}

                                        {/* 특수진료 */}
                                        {activeTab === 'special' && (
                                            <div>
                                                {detail.specialDiag.length === 0
                                                    ? <p className="text-gray-400 text-sm text-center mt-10">특수진료 정보가 없습니다.</p>
                                                    : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {detail.specialDiag.map((s, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
                                                                    {s.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {results.length === 0 && !searching && !searchError && (
                    <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BuildingOffice2Icon className="w-8 h-8 text-teal-400" />
                        </div>
                        <h3 className="font-bold text-gray-700 mb-1">병원명으로 검색하세요</h3>
                        <p className="text-gray-400 text-sm">검색 결과를 클릭하면 상세 정보를 확인할 수 있습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
