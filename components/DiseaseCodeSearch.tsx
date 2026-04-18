'use client'

import { useState, useMemo, useEffect } from 'react'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, InformationCircleIcon, FolderIcon, FolderOpenIcon, ChevronDownIcon, ListBulletIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import ICDMindMap from './ICDMindMap'

import { getGroupedDiseaseData, TopCategory, DiseaseItem } from '@/lib/constants/diseaseData'


// Text Highlighter Helper
const Highlighter = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>
  
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-primary-200 text-primary-900 rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export default function DiseaseCodeSearch() {
  const { t, locale } = useLanguage()
  const groupedDiseaseData = useMemo(() => getGroupedDiseaseData(t, locale), [t, locale])
  
  const [searchTerm, setSearchTerm] = useState('')
  // activeFolders stores the IDs of folders that are currently EXPANDED
  const [activeFolders, setActiveFolders] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  // Derived state for filtering
  const filteredData = useMemo(() => {
    // If not searching, return all top categories
    if (!searchTerm.trim()) {
      return groupedDiseaseData
    }

    const lowerSearch = searchTerm.toLowerCase()
    
    return groupedDiseaseData.map(group => {
      // Find subcategories and items that match
      const matchedSubs = group.subCategories.map(sub => {
         const matchedItems = sub.items.filter(item => 
            item.name.toLowerCase().includes(lowerSearch) || 
            item.code.toLowerCase().includes(lowerSearch) ||
            (item.desc && item.desc.toLowerCase().includes(lowerSearch)) ||
            (item.riders && item.riders.some(rider => rider.toLowerCase().includes(lowerSearch)))
         )
         return { ...sub, items: matchedItems }
      }).filter(sub => sub.items.length > 0)

      // Only return groups that have matching items
      if (matchedSubs.length > 0) {
        return { ...group, subCategories: matchedSubs }
      }
      return null
    }).filter(Boolean) as TopCategory[]
  }, [searchTerm])

  // Automatically expand folders when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Auto-expand all that match the search
      const matchedIds = filteredData.map(g => g.id)
      setActiveFolders(matchedIds)
    } else {
      // Collapse all when search is cleared
      setActiveFolders([])
    }
  }, [searchTerm, filteredData])

  const toggleFolder = (id: string) => {
    setActiveFolders(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-gray-200">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'list'
                ? 'bg-white text-primary-700 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
            목록으로 보기
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              viewMode === 'map'
                ? 'bg-white text-primary-700 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            마인드맵 탐색
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <ICDMindMap />
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative mb-8 max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 sm:text-lg border-2 border-primary-200 rounded-2xl focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm transition-all focus:shadow-md outline-none font-bold"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Disclaimer UI */}
          <div className="max-w-4xl mx-auto mb-10 bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-xl">
                 <InformationCircleIcon className="w-6 h-6 text-amber-600 shrink-0" />
              </div>
              <div>
                <h4 className="font-black text-amber-900 mb-1">{t('disclaimerTitle')}</h4>
                <ul className="text-sm text-amber-800/80 space-y-1 mt-2 list-disc list-inside font-medium leading-relaxed">
                  <li>{t('disclaimerItem1')}</li>
                  <li>{t('disclaimerItem2')}</li>
                  <li>{t('disclaimerItem3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Folders (Accordion) */}
      {viewMode === 'list' && (filteredData.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-4xl mx-auto">
          <div className="text-gray-400 mb-4 inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t('noResults')}</h3>
          <p className="text-gray-500">{t('tryAgain')}</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredData.map((group) => {
            const isExpanded = activeFolders.includes(group.id)

            return (
              <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
                
                {/* Accordion Folder Header */}
                <button
                  onClick={() => toggleFolder(group.id)}
                  className={`w-full flex items-center justify-between p-4 md:p-6 transition-colors duration-200
                    ${isExpanded 
                      ? 'bg-primary-50/50 hover:bg-primary-50' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-xl transition-colors shrink-0 ${isExpanded ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isExpanded ? <FolderOpenIcon className="w-6 h-6 md:w-8 md:h-8" /> : <FolderIcon className="w-6 h-6 md:w-8 md:h-8" />}
                     </div>
                     <div>
                       <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                          <Highlighter text={group.title} highlight={searchTerm} />
                       </h3>
                       <p className="text-sm text-gray-500 mt-0.5">
                          <Highlighter text={group.desc} highlight={searchTerm} />
                       </p>
                     </div>
                  </div>
                  <div className={`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 md:p-6 md:pt-4 bg-white border-t border-gray-100">
                      <div className="space-y-8">
                        {group.subCategories.map((sub, sIdx) => (
                            <div key={sIdx}>
                              <h4 className="font-bold text-gray-800 text-lg border-b border-primary-200 inline-block mb-4 pb-1">
                                {sub.name}
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sub.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="p-4 flex flex-col justify-between rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all gap-4 bg-gray-50/30">
                                    <div className="flex flex-col xs:flex-row justify-between items-start w-full gap-3">
                                      <div className="flex-1 flex flex-col gap-1.5">
                                          <div className="flex items-center gap-2 flex-wrap">
                                              <span className="font-extrabold text-gray-900 text-base break-keep">
                                                <Highlighter text={item.name} highlight={searchTerm} />
                                              </span>
                                              {item.isImportant && (
                                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                                                  <ExclamationTriangleIcon className="w-3 h-3" />
                                                  {t('freqHigh')}
                                              </span>
                                              )}
                                          </div>
                                          {item.desc && (
                                              <span className="text-xs text-gray-500 block break-keep mt-0.5">
                                                <Highlighter text={item.desc} highlight={searchTerm} />
                                              </span>
                                          )}
                                        </div>
                                        <div className={`font-black px-2.5 py-1 rounded-lg text-sm whitespace-nowrap border shadow-sm shrink-0 tracking-wider ${item.isImportant ? 'bg-rose-50 text-rose-700 border-rose-200 selection:bg-rose-200' : 'bg-primary-50 text-primary-700 border-primary-200 selection:bg-primary-200'}`}>
                                          <Highlighter text={item.code} highlight={searchTerm} />
                                        </div>
                                    </div>

                                    {/* Mapped Riders */}
                                    {item.riders && item.riders.length > 0 && (
                                      <div className="pt-3 border-t border-gray-200/60">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                          <span className="text-[10px] font-bold text-gray-400 mr-1">{t('relatedRiders')}</span>
                                          {item.riders.map((rider, rIdx) => (
                                              <span key={rIdx} className="bg-white border border-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded font-semibold shadow-sm text-center">
                                                <Highlighter text={rider} highlight={searchTerm} />
                                              </span>
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
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
