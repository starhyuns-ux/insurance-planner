'use client'

import React from 'react'
import { 
  IdentificationIcon, 
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function MedicalSupportPage() {
  const hiraLink = "https://www.hira.or.kr/rb/m_info/main.do"
  const nhisLink = "https://www.nhis.or.kr/nhis/index.do"

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <IdentificationIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">진료기록 열람 지원 가이드</h1>
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest">HIRA & NHIS Service Guide</p>
            </div>
          </div>
          <p className="max-w-xl text-indigo-50/80 leading-relaxed font-medium">
            정확한 질병 고지를 위해 고객의 실제 진료 및 투약 내역을 확인하는 과정은 매우 중요합니다. 
            심사평가원(HIRA)과 건강보험공단(NHIS) 서비스를 통해 확실한 고지 데이터를 확보하세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HIRA Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col group hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900">심사평가원(HIRA)</h2>
            </div>
            <a 
              href={hiraLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              사이트 이동 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          </div>
          
          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
              주요 조회 가능 내용
            </h3>
            <ul className="space-y-2">
              {[
                "최근 1년간 방문한 병의원/약국 내역",
                "투약 정보 (성분명, 효능, 조제 일자)",
                "진료 일자 및 진단 내역 상세",
                "진료비 명세서 확인"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl">
            <p className="text-[11px] text-indigo-600 font-bold leading-relaxed flex gap-2">
              <InformationCircleIcon className="w-4 h-4 shrink-0" />
              고객 본인이 공동인증서 또는 간편인증(카카오, 네이버 등)을 통해 로그인해야 열람 및 PDF 다운로드가 가능합니다.
            </p>
          </div>
        </div>

        {/* NHIS Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col group hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900">건강보험공단(NHIS)</h2>
            </div>
            <a 
              href={nhisLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              사이트 이동 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          </div>
          
          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              주요 조회 가능 내용
            </h3>
            <ul className="space-y-2">
              {[
                "5년 이내의 수진 내역 (방문 일자)",
                "건강검진 결과 보고서 (상세 수치)",
                "장기요양 보험 관련 정보",
                "산정특례 등록 여부 확인"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl">
            <p className="text-[11px] text-blue-600 font-bold leading-relaxed flex gap-2">
              <InformationCircleIcon className="w-4 h-4 shrink-0" />
              설계사는 고객과 함께 화면을 확인하거나, 고객으로부터 다운로드 받은 '진료내역 PDF'를 받아 고객 관리에 업로드하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Step */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="w-2 h-6 bg-indigo-500 rounded-full" />
          실무 활용 프로세스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "사이트 접속", desc: "심평원 또는 공단 사이트에 고객과 함께 접속합니다." },
            { step: "02", title: "본인 인증", desc: "고객의 간편인증(카카오 등)을 통해 로그인을 진행합니다." },
            { step: "03", title: "내역 조회/출력", desc: "필요한 기간의 진료 내역을 조회하고 PDF로 저장합니다." },
            { step: "04", title: "파일 업로드", desc: "고객 관리 메뉴에서 해당 PDF를 업로드하고 병력을 기록합니다." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-4xl font-black text-gray-100 group-hover:text-indigo-50 transition-colors absolute -top-4 -left-2 z-0">{item.step}</div>
              <div className="relative z-10 pt-2">
                <h4 className="font-black text-gray-900 mb-2 truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gray-100 z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
