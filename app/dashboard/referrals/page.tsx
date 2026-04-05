'use client'

import React, { useState, useEffect } from 'react'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { GiftIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function ReferralsPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [referrals, setReferrals] = useState<any[]>([])

  const fetchReferrals = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const res = await fetch('/api/referrals/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReferrals(data.data || [])
      }
    }
  }

  useEffect(() => {
    if (planner) fetchReferrals()
  }, [planner])

  if (plannerLoading) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
            <GiftIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">친구추천 리워드 현황</h3>
            <p className="text-sm font-bold text-gray-500">지인에게 서비스를 추천하고 리워드를 받으세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-transparent">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">총 추천 수</span>
            <span className="text-2xl font-black text-gray-900">{referrals.length}건</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-transparent">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">지급 완료</span>
            <span className="text-2xl font-black text-green-600">{referrals.filter(r => r.status === 'PAID').length}건</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-transparent">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">예상 리워드</span>
            <span className="text-2xl font-black text-primary-600">
              {referrals.reduce((acc, curr) => acc + (curr.status !== 'REJECTED' ? curr.reward_amount : 0), 0).toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">일시</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">피추천인</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">유형</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">상태</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {new Date(ref.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">
                    {ref.referee_name} ({ref.referee_phone.slice(-4)})
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black px-2 py-1 bg-gray-100 rounded-md text-gray-600 uppercase">
                      {ref.referee_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {ref.status === 'PENDING' && <ClockIcon className="w-4 h-4 text-amber-500" />}
                      {ref.status === 'APPROVED' && <CheckCircleIcon className="w-4 h-4 text-primary-500" />}
                      {ref.status === 'PAID' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                      {ref.status === 'REJECTED' && <XCircleIcon className="w-4 h-4 text-rose-500" />}
                      <span className="text-xs font-black uppercase">{ref.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    {ref.reward_amount.toLocaleString()}원
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-300 font-bold italic">
                    추천 내역이 없습니다. 지인에게 내 명함 사이트를 공유해보세요!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
