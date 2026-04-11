'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  ChevronDownIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useAttribution } from '@/lib/attribution'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false) // Mobile menu
  const [isServiceBarOpen, setIsServiceBarOpen] = useState(false) // Desktop service bar
  const [user, setUser] = useState<User | null>(null)
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

  // Close service bar on navigation
  useEffect(() => {
    setIsServiceBarOpen(false)
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Main Bar: Logo, Dashboard, Multi-Menu Trigger */}
        <div className="flex items-center h-16 relative">
          {/* Left: Logo (Pinned to Left) */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="relative w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-gray-900 leading-none">
                  인슈<span className="text-primary-600">닷</span>
                </span>
                {planner && (
                  <span className="text-[9px] font-bold text-gray-400 -mt-0.5 tracking-tighter">by {planner.name}</span>
                )}
              </div>
            </Link>
          </div>

          {/* Center: Desktop Service Toggle (Aboslutely Centered to prevent overlap) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center">
            <button 
              onClick={() => setIsServiceBarOpen(!isServiceBarOpen)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 font-black text-sm ${
                isServiceBarOpen 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
              <span>{t('professionalToolkit')}</span>
              <motion.div
                animate={{ rotate: isServiceBarOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Right: Dashboard & Mobile Toggle (Pinned to Right) */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-3">
              {/* Desktop Dashboard Link */}
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-black text-gray-700 hover:text-primary-600 transition-colors"
                  suppressHydrationWarning
                >
                  {t('navDashboard')}
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center lg:hidden gap-1">
                <Link href="/dashboard" className="p-2 text-gray-600 hover:text-primary-600">
                  <UserCircleIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {isOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sliding Service Bar */}
        <AnimatePresence>
          {isServiceBarOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="hidden lg:block overflow-hidden border-t border-gray-50 bg-gray-50/50 rounded-b-3xl"
            >
              <div className="flex items-center justify-center gap-6 xl:gap-8 whitespace-nowrap px-4 py-5 overflow-x-auto no-scrollbar">
                {/* Language (Moved here to match user list grouping) */}
                <div className="flex items-center pr-6 border-r border-gray-200">
                   <LanguageSwitcher />
                </div>
                
                <Link href="/calculator/insurance-premium" className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">{t('navPremiumCalc')}</Link>
                <Link href="/guide/pension" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">{t('navPension')}</Link>
                <Link href="/guide/critical-illness-relief" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">{t('navCriticalIllness')}</Link>
                <Link href="/guide/vascular-disease" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">{t('navDiseaseStudy')}</Link>
                <Link href="/guide/5th-gen" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">{t('navSilbiGen5')}</Link>
                <Link href="/guide/cancer-treatment" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">{t('navCancerTreat')}</Link>
                <Link href="/calculator" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">{t('navSilbiCalc')}</Link>
                <Link href="/disease-codes" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">{t('navDiseaseSearch')}</Link>
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
            className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col container mx-auto px-6 py-8 space-y-6">
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
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">보험 가이드</span>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/guide/pension" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navPension')}</span>
                    <ChevronDownIcon className="w-4 h-4 -rotate-90 text-gray-400" />
                  </Link>
                  <Link href="/guide/critical-illness-relief" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navCriticalIllness')}</span>
                    <ChevronDownIcon className="w-4 h-4 -rotate-90 text-gray-400" />
                  </Link>
                  <Link href="/guide/5th-gen" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navSilbiGen5')}</span>
                    <ChevronDownIcon className="w-4 h-4 -rotate-90 text-gray-400" />
                  </Link>
                  <Link href="/guide/cancer-treatment" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navCancerTreat')}</span>
                    <ChevronDownIcon className="w-4 h-4 -rotate-90 text-gray-400" />
                  </Link>
                  <Link href="/disease-codes" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                    <span>{t('navDiseaseSearch')}</span>
                    <ChevronDownIcon className="w-4 h-4 -rotate-90 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('navDashboard')}</span>
                  <Link href="/dashboard" className="text-primary-600 font-black">바로가기 →</Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">언어 설정</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
