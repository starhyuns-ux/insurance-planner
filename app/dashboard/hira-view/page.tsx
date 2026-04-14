'use client'

import React, { useState } from 'react'
import { 
  ArrowTopRightOnSquareIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function HiraViewPage() {
  const hiraUrl = "https://www.hira.or.kr/anyid?endPoint=DIAG&acrValues=2&tx=20260414213112132_5000000389_c2004a92-46c5-47ad-9571-141f11159ea1#/"

  return (
    <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] flex flex-col bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in duration-700">
      
      {/* Integrated Header Toolbar */}
      <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary-200">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 leading-tight">심평원 진료정보 통합 조회</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HIRA External Connection</p>
          </div>
        </div>
      </div>

      {/* Main Connection Area - Redesigned for New Window Approach */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />

        <div className="max-w-md w-full relative z-10 text-center space-y-8">
          <div className="space-y-4">
             <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-500 border border-gray-100">
                <ArrowTopRightOnSquareIcon className="w-10 h-10 text-primary-600" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">외부 보안 페이지 연결</h2>
             <p className="text-sm text-gray-500 leading-relaxed font-medium">
                심사평가원(HIRA)의 진료정보 조회 서비스는 <br />
                건강보험공단 보안 전체 정책에 따라 <br />
                <span className="text-primary-600 font-bold underline underline-offset-4">항상 새로운 보안 창</span>에서 이용하셔야 안전합니다.
             </p>
          </div>

          <div className="space-y-4">
            <a 
              href={hiraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-[24px] font-black text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-primary-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 group"
            >
              심평원 조회창 열기
              <ArrowTopRightOnSquareIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </a>
            
            <div className="pt-8 grid grid-cols-2 gap-4">
               <div className="bg-white/60 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">보안 연결</span>
               </div>
               <div className="bg-white/60 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">실시간 동기화</span>
               </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 font-medium">
            새 창에서 조회를 완료하신 후, 대시보드로 다시 돌아오시면 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
