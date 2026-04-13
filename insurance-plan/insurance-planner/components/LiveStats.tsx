"use client"

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/time'

export default function LiveStats() {
  const [stats, setStats] = useState({ totalApplications: 10500, savedAmount: 1837500000 })
  const [recentTime, setRecentTime] = useState('')

  useEffect(() => {
    // Set time on client side to avoid hydration mismatch
    const now = new Date()
    setRecentTime(formatDate(now).split(' ').slice(0, 3).join(' ') + ' 기준')

    // Fetch actual stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats(data.data)
        }
      })
      .catch(err => console.error("Failed to load stats", err))
  }, [])

  return (
    <section className="py-5 bg-primary-50 border-y border-primary-100">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-gray-800 font-bold tracking-tight">실시간 신규 신청 현황</span>
          {recentTime && <span className="text-sm text-gray-500 hidden md:inline-block">({recentTime})</span>}
        </div>

        <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base whitespace-nowrap overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div>
            누적 신청 <strong className="text-xl text-primary-700 ml-1">{stats.totalApplications.toLocaleString()}</strong>명
          </div>
          <div className="w-px h-6 bg-primary-200 hide-on-mobile"></div>
          <div>
            예상 총 절감액 <strong className="text-xl text-primary-700 ml-1">{(stats.savedAmount / 100000000).toFixed(1)}</strong>억원
          </div>
        </div>
      </div>
    </section>
  )
}
