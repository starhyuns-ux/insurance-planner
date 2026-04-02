'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowTrendingUpIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface PerformanceChartsProps {
  leads: any[]
  visitStats: any[]
}

export default function PerformanceCharts({ leads, visitStats }: PerformanceChartsProps) {
  // 1. Data Processing for Status Doughnut
  const statusCounts = useMemo(() => {
    const counts = { New: 0, Consulting: 0, Completed: 0, Hold: 0 }
    leads.forEach(l => {
      const s = l.status || 'New'
      if (counts[s as keyof typeof counts] !== undefined) {
        counts[s as keyof typeof counts]++
      }
    })
    return counts
  }, [leads])

  const totalLeads = leads.length || 1
  const closingRate = Math.round((statusCounts.Completed / totalLeads) * 100)

  // 2. Data Processing for Weekly Inflow
  const weeklyData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    return days.map(date => ({
      date: date.split('-').slice(1).join('.'),
      leads: leads.filter(l => l.created_at.startsWith(date)).length,
      visits: visitStats.find(v => v.date === date)?.visit_count || 0
    }))
  }, [leads, visitStats])

  const maxVal = Math.max(...weeklyData.map(d => Math.max(d.leads, d.visits/20)), 1)

  // 3. Acquisition Source Data
  const sourceStats = useMemo(() => {
    const stats: Record<string, number> = {}
    leads.forEach(l => {
      let src = l.meta?.source || 'direct'
      if (src.includes('share')) src = 'Kakao'
      else if (src.includes('copy')) src = 'Link'
      else if (src.includes('planner_page')) src = 'Card'
      else src = 'Others'
      
      stats[src] = (stats[src] || 0) + 1
    })
    return Object.entries(stats).sort((a, b) => b[1] - a[1])
  }, [leads])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* 1. Lead Status Pipeline Chart */}
        <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-primary-600" />
              리드 파이프라인 현황
            </h4>
            <div className="px-4 py-1.5 bg-primary-50 rounded-full text-xs font-bold text-primary-600">
              실시간 집계중
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
            {/* Custom SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-gray-50" />
                {/* Calculating strokes for status proportions */}
                {(() => {
                  let currentOffset = 0
                  const colors = { New: '#3b82f6', Consulting: '#f59e0b', Completed: '#10b981', Hold: '#f43f5e' }
                  const radius = 60
                  const circumference = 2 * Math.PI * radius // ~377
                  return Object.entries(statusCounts).map(([key, val], i) => {
                    const percentage = (val / totalLeads) * 100
                    const dashArr = (percentage * (circumference / 100)).toString()
                    const strokeOffset = currentOffset
                    currentOffset += percentage * (circumference / 100)
                    return (
                      <motion.circle
                        key={key}
                        initial={{ strokeDasharray: `0 ${circumference}` }}
                        animate={{ strokeDasharray: `${dashArr} ${circumference}` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        cx="72" cy="72" r={radius}
                        stroke={colors[key as keyof typeof colors]}
                        strokeWidth="15"
                        fill="transparent"
                        strokeDashoffset={-strokeOffset}
                      />
                    )
                  })
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{totalLeads}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Leads</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {Object.entries(statusCounts).map(([key, val], i) => {
                const labels = { New: '신규', Consulting: '상담', Completed: '성사', Hold: '보류' }
                const colors = { New: 'bg-blue-500', Consulting: 'bg-amber-500', Completed: 'bg-emerald-500', Hold: 'bg-rose-500' }
                return (
                  <div key={key} className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors[key as keyof typeof colors]}`} />
                      <span className="text-[10px] font-bold text-gray-400">{labels[key as keyof typeof labels]}</span>
                    </div>
                    <div className="text-base font-black text-gray-900">{val}건</div>
                  </div>
                )
              })}
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-emerald-600 leading-none">{closingRate}% 성사율</span>
                </div>
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Weekly Activity Performance */}
        <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
              주간 활동 성과
            </h4>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Past 7 Days Activity</span>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-end justify-between gap-3 h-40 pt-10 pb-2">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full group">
                  <div className="flex-1 w-full flex items-end justify-center gap-1 relative">
                    {/* Visitor Pulse (scaled) */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.visits / 20 / maxVal) * 100}%` }}
                      className="w-1 bg-indigo-100 rounded-full group-hover:bg-indigo-300 transition-colors"
                    />
                    {/* Leads Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.leads / maxVal) * 100}%` }}
                      className="w-2.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100 relative"
                    >
                      {d.leads > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.leads}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-[9px] font-black text-gray-400 rotate-[-45deg] whitespace-nowrap mt-1">{d.date}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                  <span className="text-xs font-bold text-gray-500">상담 신청</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-100 rounded-full" />
                  <span className="text-xs font-bold text-gray-500">잠재 유입</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl">
                <UserGroupIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-black text-indigo-600">활성 유입 증가세</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Acquisition Channels Analysis */}
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 -tr-10 p-12 bg-primary-50 rounded-full blur-[100px] opacity-20 -z-10"></div>
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-600" />
            유입 채널별 리드 분석 (Acquisition)
          </h4>
          <p className="text-xs font-bold text-gray-400">어떤 홍보 채널이 가장 효과적인가요?</p>
        </div>

        <div className="space-y-6">
          {sourceStats.map(([name, count], i) => (
            <div key={i} className="group relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-gray-700 uppercase tracking-wide group-hover:text-primary-600 transition-colors">
                  {name} {name === 'Kakao' ? '📱' : name === 'Link' ? '🔗' : name === 'Card' ? '🪪' : '🌐'}
                </span>
                <span className="text-sm font-black text-gray-900">{count}건 <span className="text-xs text-gray-400 ml-1">({Math.round(count/totalLeads*100)}%)</span></span>
              </div>
              <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / Math.max(...sourceStats.map(s => s[1]))) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-primary-500 rounded-full"
                />
              </div>
            </div>
          ))}
          {sourceStats.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-300 font-bold italic">유입 데이터가 수집 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
