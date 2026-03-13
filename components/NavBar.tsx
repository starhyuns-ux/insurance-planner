'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useAttribution } from '@/lib/attribution'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { planner, loading: attrLoading } = useAttribution()

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
      <div className="container flex items-center justify-between h-16 relative">
        <Link href="/" className="flex items-center gap-2 z-50" onClick={() => setIsOpen(false)}>
          {/* Shield Icon styling */}
          <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">보험<span className="text-primary-600">다이어트</span></span>
          {planner && (
            <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 bg-primary-50 rounded-full border border-primary-100">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter">Attributed to</span>
              <span className="text-xs font-black text-primary-700">{planner.name} 설계사</span>
            </div>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center space-x-5 text-[13px] lg:text-sm font-medium text-gray-600 mr-2">
            <Link href="/calculator/insurance-premium" className="text-amber-600 font-black hover:text-amber-700 transition-colors whitespace-nowrap">보험료 계산기</Link>
            <Link href="/guide/5th-gen" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">5세대 실손</Link>
            
            {/* Cancer Treatment Dropdown */}
            <div className="relative group py-5">
              <button className="flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap outline-none">
                암 치료 방법
                <ChevronDownIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
                <Link href="/guide/cancer-treatment" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">암 치료 가이드</Link>
                <Link href="/guide/advanced-radiation" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">방사선치료</Link>
                <Link href="/guide/hifu-therapy" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">하이푸시술</Link>
              </div>
            </div>

            <Link href="/calculator" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">실비 계산기</Link>
            <Link href="/disease-codes" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">질병코드 검색</Link>
            <Link href="/contacts" className="text-primary-600 font-bold hover:text-primary-700 transition-colors whitespace-nowrap">보험사별 고객센터</Link>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <UserCircleIcon className="w-5 h-5" />
                대시보드
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors"
              >
                설계사 로그인
              </Link>
            )}
            <a
              href={planner?.kakao_url || "#consultation"}
              target={planner?.kakao_url ? "_blank" : undefined}
              rel={planner?.kakao_url ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
            >
              {planner ? '1:1 실시간 상담' : '무료 진단받기'}
            </a>
          </div>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center lg:hidden gap-3 z-50">
          <a
            href="#consultation"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
          >
            무료 진단
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[calc(100vh-4rem)] py-6 fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col container space-y-5 px-6">
            <Link href="/calculator/insurance-premium" onClick={() => setIsOpen(false)} className="text-amber-600 font-black text-xl hover:text-amber-700">보험료 계산기</Link>
            <Link href="/guide/5th-gen" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">5세대 실손 안내</Link>
            
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">암 치료 방법</span>
              <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-100 italic">
                <Link href="/guide/cancer-treatment" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">암 치료 가이드</Link>
                <Link href="/guide/advanced-radiation" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">방사선치료 안내</Link>
                <Link href="/guide/hifu-therapy" onClick={() => setIsOpen(false)} className="text-gray-600 font-bold text-base hover:text-primary-600">하이푸 시술 안내</Link>
              </div>
            </div>

            <Link href="/calculator" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">실비 계산기</Link>
            <Link href="/disease-codes" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">질병코드 검색</Link>
            <Link href="/contacts" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600">보험사별 고객센터</Link>
            
            <div className="pt-4 mt-4 border-t border-gray-50 flex flex-col gap-4">
              {user ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-600 font-bold hover:text-gray-900">
                  <UserCircleIcon className="w-6 h-6" />
                  플래너 대시보드
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-primary-600 font-black hover:text-primary-700">설계사 전용 입구</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
