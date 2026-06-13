'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useAttribution } from '@/lib/attribution'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false) // Mobile menu
  const [activeMenu, setActiveMenu] = useState<'disease' | 'cancer' | null>(null) // Desktop dropdowns
  const [user, setUser] = useState<User | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const { planner } = useAttribution()
  const { t } = useLanguage()
  const pathname = usePathname()

  const isPlannerPage = pathname?.startsWith('/p/')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close menus on navigation or outside click
  useEffect(() => {
    setIsOpen(false)
    setActiveMenu(null)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [navRef])

  const toggleMenu = (menu: 'disease' | 'cancer') => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Row 1: Logo & Actions */}
        <div className="flex items-center justify-between h-14 relative">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-gray-900 leading-none">
                인슈<span className="text-primary-600">닷</span>
              </span>
              {planner && (
                <div className="flex items-center gap-1.5 -mt-0.5">
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-primary-200">
                    {planner.profile_image_url ? (
                      <img src={planner.profile_image_url} alt={planner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-600 flex items-center justify-center text-[6px] text-white font-black">
                        {planner.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-primary-600 tracking-tighter truncate max-w-[60px] xs:max-w-[80px]">{planner.name} 설계사</span>
                </div>
              )}
            </div>
          </Link>

          {/* Right: Dashboard & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 border-r border-gray-100 pr-4">
              <LanguageSwitcher />
            </div>
            <div className="hidden lg:flex items-center">
              <Link
                href={user ? "/dashboard" : "/login"}
                className={`text-sm font-black transition-colors ${user ? 'text-gray-700 hover:text-primary-600' : 'text-primary-600 hover:text-primary-700'}`}
                suppressHydrationWarning
              >
                {user ? t('navDashboard') : t('navAdminLogin')}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center lg:hidden gap-0.5 sm:gap-1">
              <LanguageSwitcher />
              <Link href={user ? "/dashboard" : "/login"} className={`p-1.5 sm:p-2 ${user ? 'text-gray-600 hover:text-primary-600' : 'text-primary-600 hover:text-primary-700'}`}>
                <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 sm:p-2 -mr-1 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isOpen ? <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" /> : <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Desktop Service Links */}
        <div className="hidden lg:flex items-center justify-center h-12 border-t border-gray-100/50" suppressHydrationWarning>
          <div className="flex items-center space-x-6 xl:space-x-8 text-[13px] font-bold text-gray-600 tracking-tighter flex-nowrap whitespace-nowrap">
            <Link href="/calculator/insurance-premium" className="text-amber-600 font-extrabold hover:text-amber-700 transition-colors">{t('navPremiumCalc')}</Link>
            <Link href="/guide/pension" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">{t('navPension')}</Link>
            <Link href="/guide/critical-illness-relief" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">{t('navCriticalIllness')}</Link>
            
            {/* Disease Study Slider Toggle */}
            <button 
              onClick={() => toggleMenu('disease')}
              className={`flex items-center gap-1 font-bold transition-colors outline-none ${activeMenu === 'disease' ? 'text-rose-700' : 'text-rose-600 hover:text-rose-700'}`}
            >
              {t('navDiseaseStudy')}
              <motion.div animate={{ rotate: activeMenu === 'disease' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDownIcon className="w-3 h-3" />
              </motion.div>
            </button>

            <Link href="/guide/5th-gen" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('navSilbiGen5')}</Link>
            
            {/* Cancer Treatment Slider Toggle */}
            <button 
              onClick={() => toggleMenu('cancer')}
              className={`flex items-center gap-1 font-bold transition-colors outline-none ${activeMenu === 'cancer' ? 'text-primary-800' : 'text-primary-600 hover:text-primary-700'}`}
            >
              {t('navCancerTreat')}
              <motion.div animate={{ rotate: activeMenu === 'cancer' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDownIcon className="w-3 h-3" />
              </motion.div>
            </button>

            <Link href="/calculator" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('navSilbiCalc')}</Link>
            <Link href="/guide/disease-codes" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('navDiseaseSearch')}</Link>
          </div>
        </div>

        {/* Sliding Mega Menu for Desktop Dropdowns */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden lg:block overflow-hidden bg-gray-50/80 rounded-b-2xl border-t border-gray-100"
            >
              <div className="flex items-center justify-center py-4 px-6 gap-8">
                {activeMenu === 'disease' && (
                  <>
                    <Link href="/guide/vascular-disease" className="flex flex-col items-center p-3 rounded-xl hover:bg-white transition-colors group">
                      <span className="text-rose-600 font-black text-sm group-hover:-translate-y-0.5 transition-transform">{t('navHeartStudy')}</span>
                      <span className="text-[10px] text-gray-500 font-bold mt-1">심혈관질환 가이드</span>
                    </Link>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <Link href="/guide/cerebrovascular-disease" className="flex flex-col items-center p-3 rounded-xl hover:bg-white transition-colors group">
                      <span className="text-rose-600 font-black text-sm group-hover:-translate-y-0.5 transition-transform">{t('navBrainStudy')}</span>
                      <span className="text-[10px] text-gray-500 font-bold mt-1">뇌혈관질환 가이드</span>
                    </Link>
                  </>
                )}
                {activeMenu === 'cancer' && (
                  <>
                    <Link href="/guide/cancer-treatment" className="flex flex-col items-center p-3 rounded-xl hover:bg-white transition-colors group">
                      <span className="text-primary-600 font-black text-sm group-hover:-translate-y-0.5 transition-transform">{t('navCancerGuide')}</span>
                      <span className="text-[10px] text-gray-500 font-bold mt-1">기본 항암 치료</span>
                    </Link>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <Link href="/guide/advanced-radiation" className="flex flex-col items-center p-3 rounded-xl hover:bg-white transition-colors group">
                      <span className="text-primary-600 font-black text-sm group-hover:-translate-y-0.5 transition-transform">{t('navRadiation')}</span>
                      <span className="text-[10px] text-gray-500 font-bold mt-1">표적/중입자 방사선</span>
                    </Link>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <Link href="/guide/hifu-therapy" className="flex flex-col items-center p-3 rounded-xl hover:bg-white transition-colors group">
                      <span className="text-primary-600 font-black text-sm group-hover:-translate-y-0.5 transition-transform">{t('navHifu')}</span>
                      <span className="text-[10px] text-gray-500 font-bold mt-1">비침습 하이푸 시술</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden absolute top-14 left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-y-auto max-h-[calc(100vh-3.5rem)]"
          >
            <div className="flex flex-col container mx-auto px-6 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/calculator/insurance-premium" className="flex flex-col p-4 bg-amber-50 rounded-2xl">
                  <span className="text-amber-600 font-black text-lg">{t('navPremiumCalc')}</span>
                  <span className="text-[10px] text-amber-500 font-bold opacity-70">보험료 자가진단</span>
                </Link>
                <Link href="/calculator" className="flex flex-col p-4 bg-blue-50 rounded-2xl">
                  <span className="text-blue-600 font-black text-lg">{t('navSilbiCalc')}</span>
                  <span className="text-[10px] text-blue-500 font-bold opacity-70">실비 혜택 비교</span>
                </Link>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">보험 가이드 & 스터디</span>
                <div className="flex flex-col gap-1">
                  <Link href="/guide/pension" className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navPension')}</span>
                  </Link>
                  <Link href="/guide/critical-illness-relief" className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navCriticalIllness')}</span>
                  </Link>
                  <Link href="/guide/5th-gen" className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navSilbiGen5')}</span>
                  </Link>
                  <Link href="/guide/disease-codes" className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navDiseaseSearch')}</span>
                  </Link>
                </div>
              </div>

              {/* Sub-groups for Disease and Cancer */}
              <div className="flex flex-col gap-4">
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-rose-500 uppercase tracking-widest pl-1">{t('navDiseaseStudy')}</span>
                  <div className="flex flex-col gap-2 pl-3 border-l-2 border-rose-100">
                    <Link href="/guide/vascular-disease" className="text-gray-600 font-bold text-sm hover:text-rose-600">{t('navHeartStudy')}</Link>
                    <Link href="/guide/cerebrovascular-disease" className="text-gray-600 font-bold text-sm hover:text-rose-600">{t('navBrainStudy')}</Link>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-primary-500 uppercase tracking-widest pl-1">{t('navCancerTreat')}</span>
                  <div className="flex flex-col gap-2 pl-3 border-l-2 border-primary-100">
                    <Link href="/guide/cancer-treatment" className="text-gray-600 font-bold text-sm hover:text-primary-600">{t('navCancerGuide')}</Link>
                    <Link href="/guide/advanced-radiation" className="text-gray-600 font-bold text-sm hover:text-primary-600">{t('navRadiation')}</Link>
                    <Link href="/guide/hifu-therapy" className="text-gray-600 font-bold text-sm hover:text-primary-600">{t('navHifu')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
