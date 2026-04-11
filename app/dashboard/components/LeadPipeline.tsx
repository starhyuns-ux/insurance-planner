'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShareIcon,
  BellIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  InboxIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'

interface LeadPipelineProps {
  leads: any[]
  planner: any | null
  pushEnabled: boolean
  pushLoading: boolean
  lastSeenAt: string | null
  onShareCard: (name: string, phone: string) => void
  onTogglePush: () => Promise<void>
  onUpdate: () => Promise<void>
}

export default function LeadPipeline({ 
  leads, 
  planner, 
  pushEnabled, 
  pushLoading, 
  lastSeenAt,
  onShareCard,
  onTogglePush,
  onUpdate
}: LeadPipelineProps) {
  const [activeStatus, setActiveStatus] = useState('All')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const statusCategories = [
    { id: 'All', label: '전체', icon: InboxIcon, color: 'text-gray-500 bg-gray-50' },
    { id: 'New', label: '신규접수', icon: BellIcon, color: 'text-blue-600 bg-blue-50' },
    { id: 'Consulting', label: '상담중', icon: ArrowPathIcon, color: 'text-amber-600 bg-amber-50' },
    { id: 'Completed', label: '계약완료', icon: CheckCircleIcon, color: 'text-green-600 bg-green-50' },
    { id: 'Hold', label: '보류', icon: NoSymbolIcon, color: 'text-rose-600 bg-rose-50' },
  ]

  const filteredLeads = leads.filter(l => {
    if (activeStatus === 'All') return true
    return (l.status || 'New') === activeStatus
  })

  // Get current status label for empty state
  const currentStatusLabel = statusCategories.find(c => c.id === activeStatus)?.label || activeStatus

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(id)
    try {
      const res = await fetch('/api/consultations/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || '상태 변경 처리 반환 오류')
      }
      
      await onUpdate()
    } catch (err: any) {
      console.error('Error updating lead status:', err)
      alert(`상태 변경 중 오류가 발생했습니다: \n${err.message}`)
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = status || 'New'
    const cat = statusCategories.find(c => c.id === s) || statusCategories[1]
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${cat.color} border border-current opacity-80`}>
        {cat.label}
      </span>
    )
  }
  return (
    <div className="space-y-6">
      {/* Push Notification Toggle */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <BellIcon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">브라우저 푸시 알림</h3>
        </div>
        <p className="text-sm text-gray-500 font-medium mb-6 ml-[52px]">
          상담 신청이 들어오면 브라우저 알림으로 실시간 알려드립니다.
        </p>

        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-sm">푸시 알림 {pushEnabled ? '활성화됨 ✅' : '비활성화됨'}</p>
            <p className="text-xs text-gray-500 mt-1">{pushEnabled ? '이 브라우저에서 알림을 받고 있습니다.' : '알림을 켜면 상담 접수 시 바로 알림을 받을 수 있습니다.'}</p>
          </div>
          <button
            onClick={onTogglePush}
            disabled={pushLoading}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap disabled:opacity-50 ${
              pushEnabled
                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                : 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700'
            }`}
          >
            {pushLoading ? '처리 중...' : pushEnabled ? '알림 끄기' : '🔔 알림 켜기'}
          </button>
        </div>
      </div>

      <div className="flex justify-end pr-4">
        <button 
          onClick={() => window.location.href = '/dashboard/chat'}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          실시간 채팅 상담창 열기
        </button>
      </div>
      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statusCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveStatus(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all border-2 shrink-0 ${
              activeStatus === cat.id
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-100'
                : 'bg-white text-gray-500 border-gray-100 hover:border-primary-200 hover:text-primary-600'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${
              activeStatus === cat.id ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {cat.id === 'All' ? leads.length : leads.filter(l => (l.status || 'New') === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Full Consultation List */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-xl">실시간 상담 신청 현황</h3>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{leads.length}건 접수</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left border-b border-gray-100 uppercase tracking-widest">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400">신청인</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400">연락처</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400">신청일시</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400">상태</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 text-right">관리 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-medium italic">
                    {activeStatus === 'All' ? '아직 접수된 상담 신청이 없습니다.' : `${currentStatusLabel} 상태의 신청 건이 없습니다.`}
                  </td>
                </tr>
              ) : (
                filteredLeads.map(l => {
                  const isNew = lastSeenAt ? new Date(l.created_at) > new Date(lastSeenAt) : false
                  return (
                    <tr key={l.id} className={`transition-colors ${isNew ? 'bg-primary-50/50' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-8 py-5 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          {isNew && <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shrink-0" />}
                          {l.name}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-600 font-mono tracking-tight text-sm">
                        {l.phone ? l.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '-'}
                      </td>
                      <td className="px-8 py-5 text-gray-400 text-sm">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        {getStatusBadge(l.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={l.status || 'New'}
                            disabled={isUpdating === l.id}
                            onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                            className="text-[11px] font-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none hover:border-primary-300 transition-colors cursor-pointer"
                          >
                            {statusCategories.slice(1).map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => onShareCard(l.name, l.phone)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg font-bold text-xs hover:bg-primary-100 transition-colors"
                            title="명함 메시지 복사"
                          >
                            <ShareIcon className="w-4 h-4" />
                            전송
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
