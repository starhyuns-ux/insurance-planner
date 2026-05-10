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

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-gray-200/50">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'list'
                ? 'bg-white text-primary-700 shadow-md scale-105 ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
            {locale === 'ko' ? '목록으로 보기' : 'List View'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'map'
                ? 'bg-white text-primary-700 shadow-md scale-105 ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            {locale === 'ko' ? '마인드맵 탐색' : 'Mind Map'}
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ICDMindMap />
        </motion.div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-6 w-6 transition-colors ${searchTerm ? 'text-primary-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-14 py-5 text-lg border-2 border-primary-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-white shadow-sm transition-all focus:shadow-xl outline-none font-bold placeholder:text-gray-300"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onBlur={() => addToRecent(searchTerm)}
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <XMarkIcon className="h-6 w-6 bg-gray-100 rounded-full p-1" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Keywords */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t('popularSearches')}</span>
              {POPULAR_KEYWORDS.map(word => (
                <button
                  key={word}
                  onClick={() => handleKeywordClick(word)}
                  className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t('recentSearches')}</span>
                {recentSearches.map(word => (
                  <div key={word} className="flex items-center gap-1 group">
                    <button
                      onClick={() => handleKeywordClick(word)}
                      className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                      {word}
                    </button>
                    <button 
                      onClick={() => removeRecent(word)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-rose-500 transition-opacity"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => { setRecentSearches([]); localStorage.removeItem('insudot-recent-disease-searches'); }}
                  className="text-[10px] font-bold text-gray-300 hover:text-gray-500 underline ml-2"
                >
                  {locale === 'ko' ? '기록 삭제' : 'Clear'}
                </button>
              </div>
            )}
          </div>

          {/* Disclaimer UI */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <InformationCircleIcon className="w-24 h-24 text-amber-500" />
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-amber-100 p-2.5 rounded-2xl">
                 <InformationCircleIcon className="w-6 h-6 text-amber-600 shrink-0" />
              </div>
              <div>
                <h4 className="font-black text-amber-900 mb-2">{t('disclaimerTitle')}</h4>
                <ul className="text-sm text-amber-800/80 space-y-1.5 mt-2 font-medium leading-relaxed">
                  <li className="flex gap-2"><span className="text-amber-400">•</span>{t('disclaimerItem1')}</li>
                  <li className="flex gap-2"><span className="text-amber-400">•</span>{t('disclaimerItem2')}</li>
                  <li className="flex gap-2"><span className="text-amber-400">•</span>{t('disclaimerItem3')}</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Folders (Accordion) */}
          {filteredData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
            >
              <div className="text-gray-200 mb-6 inline-flex items-center justify-center p-6 bg-gray-50 rounded-full">
                <MagnifyingGlassIcon className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{t('noResults')}</h3>
              <p className="text-gray-500 mb-8">{t('tryAgain')}</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg active:scale-95"
              >
                <ArrowPathIcon className="w-5 h-5" />
                {t('searchAll')}
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6 pb-20">
              <AnimatePresence mode="popLayout">
                {filteredData.map((group) => {
                  const isExpanded = activeFolders.includes(group.id)
                  const categoryStyle = getCategoryStyle(group.id)

                  return (
                    <motion.div 
                      layout
                      key={group.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`bg-white rounded-[2.5rem] shadow-sm border transition-all duration-500 overflow-hidden ${isExpanded ? `shadow-xl ${categoryStyle.border}` : 'border-gray-100 hover:border-primary-100 hover:shadow-md'}`}
                    >
                      
                      {/* Accordion Folder Header */}
                      <button
                        onClick={() => toggleFolder(group.id)}
                        className={`w-full flex items-center justify-between p-6 md:p-8 transition-all duration-300
                          ${isExpanded 
                            ? `${categoryStyle.bg}/80` 
                            : 'bg-white hover:bg-gray-50/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-5 text-left">
                           <div className={`p-4 rounded-2xl transition-all duration-300 shadow-lg shrink-0 ${isExpanded ? `${categoryStyle.iconBg} text-white rotate-6 scale-110 shadow-current/20` : 'bg-gray-50 text-gray-400'}`}>
                              <div className="w-7 h-7 md:w-9 md:h-9">
                                {getCategoryIcon(group.id)}
                              </div>
                           </div>
                           <div>
                             <div className="flex items-center gap-2">
                               <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${isExpanded ? categoryStyle.text : 'text-gray-400'}`}>{group.id} CODE SECTION</span>
                             </div>
                             <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                                <Highlighter text={group.title} highlight={searchTerm} />
                             </h3>
                             <p className={`text-sm mt-2 transition-colors ${isExpanded ? categoryStyle.text : 'text-gray-400'}`}>
                                <Highlighter text={group.desc} highlight={searchTerm} />
                             </p>
                           </div>
                        </div>
                        <div className={`shrink-0 ml-4 p-2.5 rounded-full transition-all duration-500 ${isExpanded ? `rotate-180 ${categoryStyle.bg} ${categoryStyle.text} scale-110` : 'bg-gray-50 text-gray-300'}`}>
                          <ChevronDownIcon className="w-6 h-6" />
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <motion.div 
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 md:p-10 md:pt-4 bg-white border-t border-gray-50">
                          <div className="space-y-12">
                            {group.subCategories.map((sub, sIdx) => (
                                <div key={sIdx}>
                                  <div className="flex items-center gap-3 mb-6">
                                    <h4 className="font-black text-gray-900 text-lg">
                                      {sub.name}
                                    </h4>
                                    <div className={`h-px flex-1 bg-gradient-to-r to-transparent ${isExpanded ? categoryStyle.bg : 'from-primary-100'}`} />
                                  </div>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sub.items.map((item, itemIdx) => (
                                      <li key={itemIdx} className="group/item p-6 flex flex-col justify-between rounded-[2rem] border border-gray-100 hover:border-primary-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 gap-6 bg-gray-50/30 relative">
                                        <div className="flex flex-col xs:flex-row justify-between items-start w-full gap-4">
                                          <div className="flex-1 flex flex-col gap-2">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                  <span className="font-black text-gray-900 text-lg break-keep leading-tight">
                                                    <Highlighter text={item.name} highlight={searchTerm} />
                                                  </span>
                                                  {item.isImportant && (
                                                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 font-black px-2 py-0.5 rounded-lg text-[10px] shrink-0 border border-rose-100 shadow-sm animate-pulse">
                                                      <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                                      {t('freqHigh')}
                                                  </span>
                                                  )}
                                              </div>
                                              {item.desc && (
                                                  <span className="text-xs text-gray-500 block break-keep leading-relaxed font-medium">
                                                    <Highlighter text={item.desc} highlight={searchTerm} />
                                                  </span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              <button 
                                                onClick={() => shareCode(item.code, item.name)}
                                                className="p-2.5 bg-white text-gray-400 border border-gray-100 rounded-2xl hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm active:scale-95"
                                                title="공유하기"
                                              >
                                                <ShareIcon className="w-5 h-5" />
                                              </button>
                                              <div className="flex flex-col items-end gap-1">
                                                <button 
                                                  onClick={() => copyCode(item.code, item.name)}
                                                  className={`group/copy flex items-center gap-1.5 font-black px-4 py-2.5 rounded-2xl text-sm whitespace-nowrap border transition-all shadow-sm tracking-wider ${
                                                    copiedCode === item.code 
                                                      ? 'bg-green-500 text-white border-green-500 scale-105' 
                                                      : 'bg-white text-primary-700 border-primary-100 hover:border-primary-500 hover:bg-primary-50 active:scale-95'
                                                  }`}
                                                >
                                                  {copiedCode === item.code ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4 text-primary-400 group-hover/copy:text-primary-600" />}
                                                  <Highlighter text={item.code} highlight={searchTerm} />
                                                </button>
                                              </div>
                                            </div>
                                        </div>

                                        {/* Mapped Riders */}
                                        {item.riders && item.riders.length > 0 && (
                                          <div className="pt-4 border-t border-gray-100/80">
                                            <div className="flex flex-wrap gap-2 items-center">
                                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">{t('relatedRiders')}</span>
                                              {item.riders.map((rider, rIdx) => (
                                                  <span key={rIdx} className="bg-white border border-gray-100 text-gray-600 text-[11px] px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 cursor-default">
                                                    <Highlighter text={rider} highlight={searchTerm} />
                                                  </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Loss Adjuster Tips */}
                                        {item.claimTips && (
                                          <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100/50 group/tip relative overflow-hidden shadow-inner">
                                            <div className="flex items-start gap-3 relative z-10">
                                              <div className="p-1.5 bg-primary-500 rounded-lg text-white shadow-sm shrink-0">
                                                <ShieldCheck className="w-4 h-4" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1 flex items-center justify-between">
                                                  <span>Loss Adjuster&apos;s Insight</span>
                                                  <div className="flex items-center gap-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
                                                    <button onClick={() => handleFeedback(item.code, 'up')} className={`hover:text-green-500 transition-colors ${feedbackGiven[item.code] === 'up' ? 'text-green-500 scale-125' : ''}`}><HandThumbUpIcon className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleFeedback(item.code, 'down')} className={`hover:text-rose-500 transition-colors ${feedbackGiven[item.code] === 'down' ? 'text-rose-500 scale-125' : ''}`}><HandThumbDownIcon className="w-3.5 h-3.5" /></button>
                                                  </div>
                                                </div>
                                                <p className="text-xs text-primary-900/80 font-bold leading-relaxed break-keep">
                                                  <Highlighter text={item.claimTips} highlight={searchTerm} />
                                                </p>
                                              </div>
                                            </div>
                                            <div className="absolute top-0 right-0 p-2 opacity-[0.03] pointer-events-none group-hover/tip:opacity-[0.08] transition-opacity">
                                               <ShieldCheck className="w-16 h-16 text-primary-900" />
                                            </div>
                                          </div>
                                        )}

                                        {/* Professor's Deep Analysis (Collapsible for Readability) */}
                                        {item.deepAnalysis && (
                                          <div className="space-y-3">
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const id = `analysis-${item.code}`;
                                                setActiveFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
                                              }}
                                              className="flex items-center gap-2 text-[11px] font-black text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg group/btn"
                                            >
                                              <Microscope className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                                              {activeFolders.includes(`analysis-${item.code}`) ? '심화 분석 닫기' : '교수급 심화 분석 보기'}
                                              <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${activeFolders.includes(`analysis-${item.code}`) ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                              {activeFolders.includes(`analysis-${item.code}`) && (
                                                <motion.div 
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: 'auto', opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  transition={{ duration: 0.3, ease: 'easeOut' }}
                                                  className="overflow-hidden"
                                                >
                                                  <div className="bg-slate-900 rounded-2xl p-6 text-slate-100 relative overflow-hidden group/analysis shadow-2xl border border-indigo-500/20">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover/analysis:scale-110">
                                                      <Microscope className="w-16 h-16 text-white" />
                                                    </div>
                                                    <div className="relative z-10">
                                                      <div className="flex items-center gap-2 mb-3">
                                                        <div className="px-2 py-0.5 bg-indigo-500 text-[9px] font-black rounded uppercase tracking-widest">Expert Research</div>
                                                        <div className="h-px flex-1 bg-slate-700" />
                                                      </div>
                                                      <h6 className="text-sm font-black text-indigo-300 mb-2 flex items-center gap-2">
                                                        <span className="w-1 h-3.5 bg-indigo-500 rounded-full" />
                                                        실무 쟁점 및 판례 분석
                                                      </h6>
                                                      <p className="text-xs text-slate-300 leading-relaxed break-keep font-medium opacity-90">
                                                        <Highlighter text={item.deepAnalysis} highlight={searchTerm} />
                                                      </p>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                      <span className="text-[9px] text-slate-500 font-bold italic">Latest Update: 2026.05.10</span>
                                                    </div>
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        )}

                                        {/* Required Documents */}
                                        {item.requiredDocs && item.requiredDocs.length > 0 && (
                                          <div className="bg-gray-100/50 rounded-2xl p-5 border border-gray-200/50">
                                            <div className="flex items-center gap-2 mb-3">
                                              <ClipboardDocumentListIcon className="w-4 h-4 text-gray-500" />
                                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">청구 필요 서류</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                              {item.requiredDocs.map((doc, dIdx) => (
                                                <div key={dIdx} className="flex items-center gap-1.5">
                                                  <div className="w-1 h-1 bg-primary-400 rounded-full" />
                                                  <span className="text-[11px] font-bold text-gray-700">{doc}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                            ))}
                          </div>
                          
                          {/* Section Footer Expert CTA */}
                          <div className="mt-12 bg-primary-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                               <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-400 rounded-full blur-3xl" />
                             </div>
                             <div className="relative z-10 text-center md:text-left">
                               <h5 className="text-xl font-black mb-2">{t('expertConsult')}</h5>
                               <p className="text-primary-200 text-sm opacity-80 break-keep">{t('disclaimerItem3')}</p>
                             </div>
                             <button className="relative z-10 px-8 py-4 bg-white text-primary-900 rounded-2xl font-black text-sm hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all shadow-xl">
                               {locale === 'ko' ? '보험 전문가에게 무료 점검 받기' : 'Free Expert Checkup'}
                             </button>
                          </div>
                        </div>
                      </motion.div>

                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
