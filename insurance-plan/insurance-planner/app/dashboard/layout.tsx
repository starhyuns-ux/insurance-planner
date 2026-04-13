'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { 
  UserCircleIcon, 
  UsersIcon, 
  CreditCardIcon, 
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  XMarkIcon,
  IdentificationIcon,
  DocumentCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { clearAttribution } from '@/lib/attribution'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { planner, loading } = usePlanner()
  const router = useRouter()

  const handleLogout = async () => {
    clearAttribution()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (path: string) => {
    if (!pathname) return false
    if (path === '/dashboard' && pathname === '/dashboard') return true
    return pathname.startsWith(path) && path !== '/dashboard'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 pb-24 lg:pb-0">
      <NavBar />
      
      <div className="flex-1 container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Overlay Background */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-[70] w-72 bg-gray-50 overflow-y-auto shadow-2xl pb-24 transition-transform duration-300 transform 
            lg:translate-x-0 lg:static lg:block lg:pb-0 lg:w-72 lg:shrink-0 lg:p-0 lg:bg-transparent lg:shadow-none lg:h-auto lg:z-auto space-y-3
            ${isMobileMenuOpen ? 'translate-x-0 pt-6 px-6' : '-translate-x-full lg:px-0 lg:pt-0'}
          `}>
            
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between lg:hidden mb-6 px-1">
              <h2 className="text-2xl font-black text-gray-900">플래너 메뉴</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 bg-white rounded-full shadow-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* ── 홈 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-primary-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">홈</span>
              </div>
              <div className="p-2">
                <Link
                  href="/dashboard/calendar"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/calendar') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  일정 관리 (달력)
                </Link>
              </div>
            </div>

            {/* ── 영업 관리 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">영업 관리</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/dashboard/notifications"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/notifications') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UsersIcon className="w-4 h-4 shrink-0" />
                  상담 알림 / 현황
                </Link>
                <Link
                  href="/dashboard/chat"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/chat') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 shrink-0" />
                  1:1 채팅 관리
                </Link>
                <Link
                  href="/dashboard/customers"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/customers') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UsersIcon className="w-4 h-4 shrink-0" />
                  고객 관리
                </Link>
                <Link
                  href="/dashboard/claims"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/claims') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <DocumentCheckIcon className="w-4 h-4 shrink-0" />
                  보상청구 관리
                </Link>
                <Link
                  href="/dashboard/kakaotalk"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/kakaotalk') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4 shrink-0" />
                  카카오톡 보내기
                </Link>
              </div>
            </div>

            {/* ── 업무 지원 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-rose-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">업무 지원</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/dashboard/disclosure"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/disclosure') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <DocumentTextIcon className="w-4 h-4 shrink-0" />
                  상품공시실 (약관)
                </Link>
                <a
                  href="http://www.gasupport.co.kr/Gasys/mega/inc/pop_insuCon.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GlobeAltIcon className="w-4 h-4 shrink-0 text-blue-500" />
                  보험사 바로가기
                </a>
              </div>
            </div>

            {/* ── 내 설정 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">내 설정</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/dashboard/profile"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/profile') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircleIcon className="w-4 h-4 shrink-0" />
                  프로필 관리
                </Link>
                <Link
                  href="/dashboard/card"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/card') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IdentificationIcon className="w-4 h-4 shrink-0" />
                  명함 만들기
                </Link>
              </div>
            </div>

            {/* ── 커뮤니티 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-green-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">커뮤니티</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/board/qna"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                >
                  <CalendarIcon className="w-4 h-4 shrink-0 text-green-500" />
                  Q&A 게시판
                </Link>
                <Link
                  href="/board/free"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                >
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4 shrink-0 text-teal-500" />
                  자유 게시판
                </Link>
              </div>
            </div>

            {/* ── 시스템 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-gray-400 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">시스템</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/dashboard/subscription"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/subscription') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCardIcon className="w-4 h-4 shrink-0" />
                  멤버십 구독
                </Link>
                <Link
                  href="/dashboard/referrals"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    isActive('/dashboard/referrals') ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GiftIcon className="w-4 h-4 shrink-0" />
                  친구추천 리워드
                </Link>
              </div>
            </div>

            {/* Footer actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-rose-500 hover:bg-rose-50 transition-all text-sm"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
                로그아웃
              </button>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

        </div>
      </div>

      {/* Mobile Toggle Button (Floating) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-2xl shadow-primary-500/50 flex items-center justify-center"
        >
          <CalendarIcon className="w-6 h-6" />
        </button>
      </div>
    </main>
  )
}
