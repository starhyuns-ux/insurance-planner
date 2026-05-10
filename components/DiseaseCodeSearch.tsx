'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  ChevronDownIcon, 
  ListBulletIcon, 
  ChartBarIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
  XMarkIcon,
  ShareIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { 
  Activity, 
  Dna, 
  Heart, 
  Stethoscope, 
  Bone, 
  Flame, 
  Bandage, 
  Microscope,
  BriefcaseMedical,
  ShieldCheck,
  FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import ICDMindMap from './ICDMindMap'

import { getGroupedDiseaseData, TopCategory, DiseaseItem } from '@/lib/constants/diseaseData'

// Constants
const POPULAR_KEYWORDS = ['암', '용종', '근종', '뇌경색', '협심증', '골절', '디스크', '충수염']

// Category Icon Mapping
const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'C': return <Dna className="w-full h-full" />
    case 'D': return <Microscope className="w-full h-full" />
    case 'I': return <Heart className="w-full h-full" />
    case 'M': return <Bone className="w-full h-full" />
    case 'K': return <Activity className="w-full h-full" />
    case 'S': return <Bandage className="w-full h-full" />
    default: return <BriefcaseMedical className="w-full h-full" />
  }
}

// Category Style Mapping
const getCategoryStyle = (id: string) => {
  switch (id) {
    case 'C': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', iconBg: 'bg-rose-500' }
    case 'D': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-500' }
    case 'I': return { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', iconBg: 'bg-pink-500' }
    case 'M': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-500' }
    case 'K': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-500' }
    case 'S': return { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', iconBg: 'bg-violet-500' }
    default: return { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100', iconBg: 'bg-primary-500' }
  }
}

// Text Highlighter Helper
const Highlighter = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>
  
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-primary-200 text-primary-900 rounded-sm px-0.5">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export default function DiseaseCodeSearch() {
  const { t, locale } = useLanguage()
  const groupedDiseaseData = useMemo(() => getGroupedDiseaseData(t, locale), [t, locale])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFolders, setActiveFolders] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({})

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('insudot-recent-disease-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches')
      }
    }
  }, [])

  // Save search term to recent when it's long enough and search is performed
  const addToRecent = (term: string) => {
    if (!term.trim() || term.length < 2) return
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t !== term)
      const updated = [term, ...filtered].slice(0, 5)
      localStorage.setItem('insudot-recent-disease-searches', JSON.stringify(updated))
      return updated
    })
  }

  // Clear specific recent search
  const removeRecent = (term: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term)
      localStorage.setItem('insudot-recent-disease-searches', JSON.stringify(updated))
      return updated
    })
  }

  // Copy code helper
  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(`${name} (${code})`)
    setCopiedCode(code)
    toast.success(`${name} ${t('copied')}`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Share helper
  const shareCode = (code: string, name: string) => {
    if (navigator.share) {
      navigator.share({
        title: `질병코드 안내: ${name}`,
        text: `[인슈닷] ${name} (코드: ${code}) 관련 보험 보상 정보를 확인해보세요.`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      copyCode(code, name)
      toast.info('공유 기능이 지원되지 않는 브라우저입니다. 정보가 복사되었습니다.')
    }
  }

  const handleFeedback = (code: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [code]: type }))
    toast.success(type === 'up' ? '도움이 되었다니 기쁩니다!' : '피드백 감사합니다. 더 발전하겠습니다.')
  }

  // Derived state for filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return groupedDiseaseData
    }

    const lowerSearch = searchTerm.toLowerCase()
    
    return groupedDiseaseData.map(group => {
      const matchedSubs = group.subCategories.map(sub => {
         const matchedItems = sub.items.filter(item => 
            item.name.toLowerCase().includes(lowerSearch) || 
            item.code.toLowerCase().includes(lowerSearch) ||
            (item.desc && item.desc.toLowerCase().includes(lowerSearch)) ||
            (item.riders && item.riders.some(rider => rider.toLowerCase().includes(lowerSearch)))
         )
         return { ...sub, items: matchedItems }
      }).filter(sub => sub.items.length > 0)

      if (matchedSubs.length > 0) {
        return { ...group, subCategories: matchedSubs }
      }
      return null
    }).filter(Boolean) as TopCategory[]
  }, [searchTerm, groupedDiseaseData])

  // Automatically expand folders when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const matchedIds = filteredData.map(g => g.id)
      setActiveFolders(matchedIds)
    } else {
      setActiveFolders([])
    }
  }, [searchTerm, filteredData])

  const toggleFolder = (id: string) => {
    setActiveFolders(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    )
  }

  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
  }

  const handleKeywordClick = (word: string) => {
    setSearchTerm(word)
    addToRecent(word)
  }

  // New State for active Tab and selected Detail
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [selectedItem, setSelectedItem] = useState<DiseaseItem | null>(null)

  const codeTabs = useMemo(() => {
    const letters = ['ALL', ...groupedDiseaseData.map(g => g.id)]
    return letters
  }, [groupedDiseaseData])

  const displayList = useMemo(() => {
    let base = filteredData
    if (activeTab !== 'ALL') {
      base = base.filter(g => g.id === activeTab)
    }
    
    // Flatten the nested structure for easier listing
    const flatList: Array<{ group: string, sub: string, item: DiseaseItem }> = []
    base.forEach(group => {
      group.subCategories.forEach(sub => {
        sub.items.forEach(item => {
          flatList.push({ group: group.title, sub: sub.name, item })
        })
      })
    })
    return flatList
  }, [filteredData, activeTab])

  return (
    <div className="w-full">
      {/* View Toggle (List vs Map) */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-gray-200/50">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'list' ? 'bg-white text-primary-700 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
            {locale === 'ko' ? '코드별 목록' : 'List'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'map' ? 'bg-white text-primary-700 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            {locale === 'ko' ? '마인드맵' : 'Map'}
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <ICDMindMap />
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto px-4">
          {/* Search Header */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-6 w-6 ${searchTerm ? 'text-primary-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-gray-50 transition-all outline-none font-bold"
                placeholder="코드번호나 질병명을 입력하세요 (예: C16, 위암)"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            
            {/* Quick Code Tabs */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">CODE GROUPS</span>
              {codeTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                  className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${
                    activeTab === tab 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 scale-105' 
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {tab === 'ALL' ? '전체' : `${tab}코드`}
                </button>
              ))}
            </div>
          </div>

          {/* Simple List View */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-[120px_1fr_150px] gap-4 p-6 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
              <div>코드</div>
              <div>질병명</div>
              <div className="text-right">상세 정보</div>
            </div>

            <div className="divide-y divide-gray-50">
              {displayList.length === 0 ? (
                <div className="py-20 text-center text-gray-300 font-bold">검색 결과가 없습니다.</div>
              ) : (
                displayList.map(({ group, sub, item }, idx) => (
                  <div key={idx} className="group hover:bg-primary-50/30 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_150px] gap-4 p-5 md:p-6 items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
                          {item.code}
                        </span>
                        {item.isImportant && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-black text-base md:text-lg">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{group} · {sub}</span>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => setSelectedItem(selectedItem?.code === item.code ? null : item)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            selectedItem?.code === item.code
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-primary-600 hover:border-primary-500'
                          }`}
                        >
                          {selectedItem?.code === item.code ? '닫기' : '설명 보기'}
                          <ChevronDownIcon className={`w-4 h-4 transition-transform ${selectedItem?.code === item.code ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Detail Section */}
                    <AnimatePresence>
                      {selectedItem?.code === item.code && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-gray-50 overflow-hidden"
                        >
                          <div className="p-6 md:p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Strategy Card */}
                              <div className="bg-white p-6 rounded-3xl border border-primary-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 text-primary-600">
                                  <ShieldCheck className="w-5 h-5" />
                                  <span className="text-xs font-black uppercase tracking-widest">Loss Adjuster Tips</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed font-bold">{item.claimTips || '현재 준비된 실무 팁이 없습니다.'}</p>
                                
                                {item.riders && (
                                  <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                    {item.riders.map(r => (
                                      <span key={r} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[10px] font-black rounded-lg">#{r}</span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Academic Card */}
                              <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <Microscope className="w-16 h-16" />
                                </div>
                                <div className="flex items-center gap-3 text-indigo-400">
                                  <Microscope className="w-5 h-5" />
                                  <span className="text-xs font-black uppercase tracking-widest">Professor&apos;s Deep Analysis</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">{item.deepAnalysis || '심화 연구 데이터를 불러오는 중입니다.'}</p>
                              </div>
                            </div>

                            {/* Required Docs */}
                            {item.requiredDocs && (
                              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400" />
                                  <span className="text-xs font-black text-gray-500">필요 서류</span>
                                  <div className="flex flex-wrap gap-3">
                                    {item.requiredDocs.map(doc => (
                                      <span key={doc} className="text-xs font-bold text-gray-700">✓ {doc}</span>
                                    ))}
                                  </div>
                                </div>
                                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-primary-600 transition-all">
                                  상담 신청
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 mt-12 pb-20">
        <div className="flex items-start gap-4 p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
          <InformationCircleIcon className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="text-xs text-amber-900/60 leading-relaxed font-medium">
            인슈닷에서 제공하는 정보는 학술적 참고용이며 법적 증빙 자료로 사용할 수 없습니다. 정확한 보상 여부는 개별 보험 약관과 손해사정사의 검토를 거쳐야 합니다.
          </div>
        </div>
      </div>
    </div>
  )
}
