'use client'

import React, { useState } from 'react'
import { 
  ArrowTopRightOnSquareIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function HiraViewPage() {
  const hiraUrl = "https://www.hira.or.kr/anyid?endPoint=DIAG&acrValues=2&tx=20260414213112132_5000000389_c2004a92-46c5-47ad-9571-141f11159ea1#/"
  const [loadError, setLoadError] = useState(false)

  // Note: Government sites often block iframes (X-Frame-Options). 
  // We provide a fallback just in case.

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
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HIRA Connected Service</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="새로고침"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <a 
            href={hiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            새 창으로 열기
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Connection Area */}
      <div className="flex-1 relative bg-gray-50/30">
        {!loadError ? (
          <iframe 
            src={hiraUrl}
            className="w-full h-full border-0"
            title="심사평가원 진료정보"
            onError={() => setLoadError(true)}
            onLoad={(e) => {
               // Check if the iframe content is actually accessible
               // In some cases we can't detect X-Frame-Options via onError, 
               // so we add a help message explaining what to do if it remains white.
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExclamationCircleIcon className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-gray-900">브라우저 보안으로 인해 차단되었습니다</h2>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                심사평가원 사이트 보호 정책으로 인해 현재 창 내에서의 직접 연결이 제한될 수 있습니다. 
                아래 버튼을 눌러 안전하게 별도 창에서 서비스를 이용해 주세요.
              </p>
              <a 
                href={hiraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all"
              >
                심평원 페이지로 직접 이동하기
              </a>
            </div>
          </div>
        )}

        {/* Support Alert Overlay (Always show small helper) */}
        {!loadError && (
          <div className="absolute bottom-6 right-6 z-10 max-w-xs scale-90 origin-bottom-right">
             <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">Help</div>
                <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
                  화면이 하얗게 나오거나 로그인이 안 된다면 <br/>
                  <span className="text-primary-600">상단의 [새 창으로 열기]</span> 버튼을 이용해 주세요.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
