'use client'

import React from 'react'
import { usePlanner } from '@/lib/providers/PlannerProvider'

export default function ProfilePage() {
  const { planner, loading: plannerLoading } = usePlanner()

  if (plannerLoading) return null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-8">기본 정보 관리</h3>
        <div className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이름</label>
            <input type="text" value={planner?.name || ''} readOnly className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-gray-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">연락처</label>
            <input type="text" value={planner?.phone || ''} readOnly className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-gray-500 outline-none" />
          </div>
          <p className="text-sm text-gray-400 font-medium">※ 이름과 연락처는 계정 정보 보호를 위해 명함 만들기 탭에서 수정하실 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
