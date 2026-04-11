'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useAttribution } from '@/lib/attribution'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { planner, loading: attrLoading } = useAttribution()
  const { t } = useLanguage()
  const pathname = usePathname()

  const isPlannerPage = pathname?.startsWith('/p/')

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container">
        {/* Top Row: Brand & Actions */}
        <div className="flex items-center justify-between h-14 relative">
          <Link href="/" className="flex items-center gap-2.5 z-50 group" onClick={() => setIsOpen(false)}>
            {/* Logo Image (Optional) - User can place logo.png in public folder */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {/* 
                  To use an actual image logo:
                  1. Place your logo image in /public/logo.png
                  2. Uncomment the Image component below
                */}
                {/* <Image src="/logo.png" alt="Logo" width={32} height={32} className="absolute inset-0 object-contain" /> */}
              </div>
            <span className="font-black text-2xl tracking-tighter text-gray-900 flex items-baseline" suppressHydrationWarning>
              {(() => {
                const name = t('brandName')
                if (typeof name === 'string' && name.includes('인슈')) {
                  const parts = name.split('닷')
                  return (
                    <>
                      <span className="tracking-tight">인슈</span>
                      {name.includes('닷') && <span className="text-primary-600 ml-px">닷</span>}
                    </>
                  )
                }
                return <span>{typeof name === 'string' ? name : '인슈닷'}</span>
              })()}
            </span>
          </div>
          {planner && user?.id !== planner.id && (
            <div className="mt-0.5 ml-0.5 flex items-center gap-1 leading-none" suppressHydrationWarning>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{t('navAttributedTo')}</span>
              <span className="text-[9px] font-black text-primary-600/70 italic">{planner.name}</span>
            </div>
          )}
          </Link>

          {/* Desktop Top Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                suppressHydrationWarning
              >
                <UserCircleIcon className="w-5 h-5" />
                {t('navDashboard')}
              </Link>
            ) : !isPlannerPage && (
              <Link
                href="/login"
                className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors"
                suppressHydrationWarning
              >
                {t('navAdminLogin')}
              </Link>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile: minimal top bar — just login icon + hamburger */}
          <div className="flex items-center lg:hidden gap-2 z-50">
            {user ? (
              <Link
                href="/dashboard"
                className="p-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                title="대시보드"
              >
                <UserCircleIcon className="w-6 h-6" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                title="설계사 로그인"
              >
                <UserCircleIcon className="w-6 h-6" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Desktop Navigation Links (Only visible if planner is attributed OR user is logged in on a sub-page) */}
        {((planner && user?.id !== planner.id) || (user && typeof pathname === 'string' && pathname !== '/')) && (
          <div className="hidden lg:flex items-center justify-center py-2.5 border-t border-gray-50/50" suppressHydrationWarning>
            <div className="flex items-center space-x-8 text-[13px] lg:text-sm font-bold text-gray-600">
              <Link href="/calculator/insurance-premium" className="text-amber-600 font-black hover:text-amber-700 transition-colors whitespace-nowrap">{t('navPremiumCalc')}</Link>
              <Link href="/guide/pension" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors whitespace-nowrap">{t('navPension')}</Link>
              <Link href="/guide/critical-illness-relief" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors whitespace-nowrap">{t('navCriticalIllness')}</Link>
              
              {/* Disease Study Dropdown */}
              <div className="relative group py-1">
                <button className="flex items-center gap-1 text-rose-600 font-bold hover:text-rose-700 transition-colors whitespace-nowrap outline-none">
                  {t('navDiseaseStudy')}
                  <ChevronDownIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                  <Link href="/guide/vascular-disease" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-rose-600 transition-colors">{t('navHeartStudy')}</Link>
                  <Link href="/guide/cerebrovascular-disease" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-rose-600 transition-colors">{t('navBrainStudy')}</Link>
                </div>
              </div>
              <Link href="/guide/5th-gen" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">{t('navSilbiGen5')}</Link>
              
              {/* Cancer Treatment Dropdown */}
              <div className="relative group py-1">
                <button className="flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap outline-none">
                  {t('navCancerTreat')}
                  <ChevronDownIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                  <Link href="/guide/cancer-treatment" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">{t('navCancerGuide')}</Link>
                  <Link href="/guide/advanced-radiation" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">{t('navRadiation')}</Link>
                  <Link href="/guide/hifu-therapy" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">{t('navHifu')}</Link>
                </div>
              </div>

              <Link href="/calculator" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">{t('navSilbiCalc')}</Link>
              <Link href="/disease-codes" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">{t('navDiseaseSearch')}</Link>
            </div>
          </div>
        )}
      </div>


      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[calc(100vh-4rem)] py-6 fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col container space-y-5 px-6">
            {( (planner && user?.id !== planner.id) || (user && typeof pathname === 'string' && pathname !== '/')) && (
              <>
                <Link href="/calculator/insurance-premium" onClick={() => setIsOpen(false)} className="text-amber-600 font-black text-xl hover:text-amber-700">{t('navPremiumCalc')}</Link>
                <Link href="/guide/pension" onClick={() => setIsOpen(false)} className="text-indigo-700 font-bold text-lg hover:text-indigo-600">{t('navPension')}</Link>
                <Link href="/guide/critical-illness-relief" onClick={() => setIsOpen(false)} className="text-indigo-700 font-bold text-lg hover:text-indigo-600">{t('navCriticalIllness')}</Link>
                <Link href="/guide/5th-gen" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">{t('navSilbiGen5')} {t('noticeTitle')}</Link>
                
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-rose-400 uppercase tracking-widest pl-1">{t('navDiseaseStudy')}</span>
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-rose-100 italic">
                    <Link href="/guide/vascular-disease" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-rose-600">{t('navHeartStudy')}</Link>
                    <Link href="/guide/cerebrovascular-disease" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-rose-600">{t('navBrainStudy')}</Link>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">{t('navCancerTreat')}</span>
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-100 italic">
                    <Link href="/guide/cancer-treatment" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">{t('navCancerGuide')}</Link>
                    <Link href="/guide/advanced-radiation" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">{t('navRadiation')} {t('noticeTitle')}</Link>
                    <Link href="/guide/hifu-therapy" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">{t('navHifu')} {t('noticeTitle')}</Link>
                  </div>
                </div>

                <Link href="/calculator" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">{t('navSilbiCalc')}</Link>
                <Link href="/disease-codes" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">{t('navDiseaseSearch')}</Link>
              </>
            )}
            
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">언어</span>
                <LanguageSwitcher />
              </div>
              {/* Dashboard or Login */}
              {user ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-600 font-bold hover:text-gray-900">
                  <UserCircleIcon className="w-6 h-6" />
                  {t('navDashboard')}
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-primary-600 font-black hover:text-primary-700">
                  <UserCircleIcon className="w-6 h-6" />
                  {t('navAdminLogin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
