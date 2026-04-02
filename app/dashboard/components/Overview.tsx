'use client'

import React from 'react'
import { 
  UsersIcon, 
  ChartBarIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline'
import { isSameDay } from 'date-fns'
import PerformanceCharts from './PerformanceCharts'

interface OverviewProps {
  leads: any[]
  customers: any[]
  planner: any | null
  totalVisits: number
  visitStats: any[]
  getInsuranceAge: (birthDate: string | null) => string | null
}

export default function Overview({ leads, customers, planner, totalVisits, visitStats, getInsuranceAge }: OverviewProps) {
  const { differenceInDays, parseISO } = require('date-fns')
  
  const todayLeads = leads.filter(l => isSameDay(new Date(l.created_at), new Date())).length
  
  const needsManagementCount = customers.filter(c => 
    c.last_touch_at && differenceInDays(new Date(), parseISO(c.last_touch_at)) >= 30
  ).length

  const upcomingDDayCount = customers.filter(c => {
    const dDayStr = getInsuranceAge(c.birth_date)
    return dDayStr && dDayStr.startsWith('D-') && parseInt(dDayStr.split('-')[1]) <= 14
  }).length

  return (
    <div className="space-y-12">
      {/* 1. Analytics Section */}
      <PerformanceCharts leads={leads} visitStats={visitStats} />

      {/* 2. Core Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Today's Leads */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-primary-500 uppercase tracking-widest">오늘의 영업</span>
          <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
            <UsersIcon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="text-4xl font-black text-gray-900 mb-1">{todayLeads}건</h4>
          <p className="text-xs text-gray-400 font-medium tracking-tight mt-1">오늘 접수된 새로운 상담 신청</p>
        </div>
      </div>

      {/* Total Visits */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">누적 방문자</span>
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <ChartBarIcon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="text-4xl font-black text-gray-900 mb-1">{(planner?.visit_count || 0).toLocaleString()}회</h4>
          <p className="text-xs text-gray-400 font-medium tracking-tight mt-1">나의 디지털 명함 총 조회수</p>
        </div>
      </div>

      {/* Traffic Stats */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 flex flex-col justify-between overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest">사이트 트래픽 (30일)</span>
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <GlobeAltIcon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="text-4xl font-black text-gray-900 mb-1">{totalVisits.toLocaleString()}회</h4>
          <div className="flex items-end gap-2 mt-4 h-12">
            {visitStats.slice(-7).map((s, i) => (
              <div 
                key={i} 
                className="flex-1 bg-rose-100 rounded-sm transition-all hover:bg-rose-400 group/bar relative" 
                style={{ height: `${Math.min(Math.max((s.visit_count / (Math.max(...visitStats.map(v => v.visit_count)) || 1)) * 100, 10), 100)}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {s.visit_count}회
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">Last 7 Days Trend</p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-xl"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* CRM Alert Sumamry */}
      <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2rem] shadow-xl p-8 border border-rose-100 flex items-center justify-between group transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="flex flex-col">
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            관리가 시급한 고객
          </span>
          <h4 className="text-3xl font-black text-gray-900">{needsManagementCount}명</h4>
          <p className="text-[11px] text-gray-400 font-bold mt-1">30일 이상 연락이 닿지 않은 고객</p>
        </div>
        <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:rotate-6 transition-transform">
          <UsersIcon className="w-7 h-7" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-white rounded-[2rem] shadow-xl p-8 border border-primary-100 flex items-center justify-between group transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="flex flex-col">
          <span className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            보험료 인상(상령일) 임박
          </span>
          <h4 className="text-3xl font-black text-gray-900">{upcomingDDayCount}명</h4>
          <p className="text-[11px] text-gray-400 font-bold mt-1">14일 이내 상령일 도래 고객 (집중 공략 권장)</p>
        </div>
        <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:-rotate-6 transition-transform">
          <ChartBarIcon className="w-7 h-7" />
        </div>
    </div>
    </div>
    </div>
  )
}
