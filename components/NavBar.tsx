'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

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
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex space-x-6 text-sm font-medium text-gray-600 mr-4">
            <Link href="/calculator/insurance-premium" className="text-amber-600 font-black hover:text-amber-700 transition-colors">보험료 계산기</Link>
            <Link href="/guide/5th-gen" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">5세대 실손</Link>
            <Link href="/guide/cancer-treatment" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">암 치료 가이드</Link>
            <Link href="/guide/advanced-radiation" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">방사선치료</Link>
            <Link href="/guide/hifu-therapy" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">하이푸시술</Link>
            <Link href="/calculator" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">실비 계산기</Link>
            <Link href="/disease-codes" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">질병코드 검색</Link>
            <Link href="/contacts" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">고객센터</Link>
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
              href="#consultation"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              무료 진단받기
            </a>
          </div>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center md:hidden gap-3 z-50">
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
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden py-4 fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col container space-y-4 px-4">
            <Link href="/calculator/insurance-premium" onClick={() => setIsOpen(false)} className="text-amber-600 font-black text-lg hover:text-amber-700 border-b border-gray-50 pb-3">보험료 계산기</Link>
            <Link href="/guide/5th-gen" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">5세대 실손 안내</Link>
            <Link href="/guide/cancer-treatment" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">암 치료 가이드</Link>
            <Link href="/guide/advanced-radiation" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">방사선치료 안내</Link>
            <Link href="/guide/hifu-therapy" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">하이푸 시술 안내</Link>
            <Link href="/calculator" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">실비 계산기</Link>
            <Link href="/disease-codes" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">질병코드 검색</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 border-b border-gray-50 pb-3">설계사 전용 입구</Link>
            <Link href="/contacts" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg hover:text-primary-600 pb-2">고객센터 연락처</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
