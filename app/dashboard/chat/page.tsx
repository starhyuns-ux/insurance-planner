'use client'

import React from 'react'
import ChatInboxPanel from '../components/ChatInboxPanel'
import { usePlanner } from '@/lib/providers/PlannerProvider'

export default function ChatDashboardPage() {
  const { planner, loading } = usePlanner()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">1:1 채팅 관리</h1>
        <p className="text-gray-500 font-medium">홈페이지 방문자와 실시간으로 상담을 진행할 수 있습니다.</p>
      </div>

      <ChatInboxPanel 
        plannerId={planner?.id || null} 
        plannerName={planner?.name || '관리자'} 
      />
    </div>
  )
}
