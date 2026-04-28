'use client'

import React from 'react'
import { format, differenceInDays, parseISO } from 'date-fns'
import { getInsuranceAge } from '@/lib/time'
import { SparklesIcon, CalendarIcon, UserGroupIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface DashboardGreetingProps {
  planner: any
  todos: any[]
  customers: any[]
}

export default function DashboardGreeting({ planner, todos, customers }: DashboardGreetingProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  
  // 1. 오늘의 주요일정 (완료되지 않은 오늘 날짜의 할일)
  const todaysTodos = todos.filter(t => t.target_date === todayStr && !t.is_completed)

  // 2. 연락해볼 고객 (D-Day 14일 이내 거나, 30일 초과 미연락 상태인 고객)
  const contactTargets = customers.filter(c => {
    const dDayStr = getInsuranceAge(c.birth_date)
    const dDay = dDayStr && dDayStr.startsWith('D-') ? parseInt(dDayStr.split('-')[1]) : 999
    const lastTouch = c.last_touch_at ? differenceInDays(new Date(), parseISO(c.last_touch_at)) : 999
    
    return dDay <= 14 || lastTouch >= 30
  }).sort((a, b) => {
    // 최근 터치가 오래된 순서대로 정렬 추가
    const touchA = a.last_touch_at ? differenceInDays(new Date(), parseISO(a.last_touch_at)) : 999
    const touchB = b.last_touch_at ? differenceInDays(new Date(), parseISO(b.last_touch_at)) : 999
    return touchB - touchA
  })

  // 너무 많이 표시되지 않도록 상위 5명만 짜르기
  const topTargets = contactTargets.slice(0, 5)

  if (!planner) return null

  return (
    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2rem] shadow-xl p-8 text-white mb-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <SparklesIcon className="w-48 h-48 -mt-12 -mr-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {planner.name}님 반가워요! <br />오늘도 멋진 하루 되세요 ☀️
          </h2>
          <p className="text-primary-100 font-medium text-sm">
            {format(new Date(), 'yyyy년 MM월 dd일')} 기준 업무 요약입니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          {/* 주요 일정 요약 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full sm:w-56 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-sm tracking-widest uppercase">오늘의 주요 일정</h3>
            </div>
            {todaysTodos.length > 0 ? (
              <div className="space-y-2">
                <span className="text-3xl font-black tabular-nums">{todaysTodos.length}<span className="text-sm font-bold text-white/70 ml-1">건</span></span>
                <p className="text-xs text-white/80 truncate">{todaysTodos[0].content}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-center h-full pb-2">
                <span className="text-sm font-bold text-white/70">오늘 예정된<br/>특별한 일정이 없습니다.</span>
              </div>
            )}
          </div>

          {/* 연락 고객 요약 */}
          <Link href="/dashboard/customers" className="block w-full sm:w-64">
            <div className="bg-white border-2 border-primary-500 rounded-2xl p-5 w-full h-full shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <UserGroupIcon className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-gray-900 tracking-widest uppercase flex-1">연락해볼 고객</h3>
                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">{contactTargets.length}명</span>
              </div>
              {topTargets.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {topTargets.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold hover:bg-white hover:border-gray-300 transition-colors shadow-sm cursor-pointer" title={c.last_touch_at ? `마지막 연락: ${differenceInDays(new Date(), parseISO(c.last_touch_at))}일 전` : '연락처 없음'}>
                      <span className="text-rose-500 shrink-0"><ExclamationCircleIcon className="w-3 h-3" /></span>
                      <span className="truncate max-w-[80px]">{c.name}</span>
                    </span>
                  ))}
                  {contactTargets.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 text-[10px] font-black text-gray-400">
                      +{contactTargets.length - 5}명 더보기
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col justify-center h-full pb-2">
                  <span className="text-sm font-bold text-gray-500">모든 고객과 최근에<br/>연락을 주고받았습니다! 🎉</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
