'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ClipboardCheck,
  Layout,
  FileText,
  AlertTriangle,
  TrendingUp,
  Hospital,
  ChevronRight,
  Minus
} from 'lucide-react'

const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="h-[1px] w-12 bg-black"></div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{text}</span>
  </div>
)

const Card = ({ title, children, number }: { title: string, children: React.ReactNode, number: string }) => (
  <div className="group relative border-t border-black pt-8 pb-12">
    <div className="flex justify-between items-start mb-6">
      <span className="text-xs font-bold font-mono tracking-tighter">[{number}]</span>
      <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter leading-none">
      {title}
    </h3>
    <div className="text-sm text-gray-600 leading-relaxed max-w-md">
      {children}
    </div>
  </div>
)

export default function DuballoMagazineManual() {
  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[14px] font-black uppercase tracking-[0.4em] mb-4"
            >
              두발로병원 운영 매뉴얼
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="magazine-header text-7xl md:text-[120px] lg:text-[160px] tracking-tighter relative"
            >
              Operational<br />
              Manual <span className="text-[#33bbc5]">(+)</span>
            </motion.h1>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden md:block">
               <span className="script-accent text-5xl lg:text-7xl -rotate-12 block">
                hello duballo
              </span>
            </div>
          </div>

          {/* Hero Image & Concept */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 relative">
              <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                <img 
                  src="/Users/stroy/.gemini/antigravity/brain/e7ae57cb-9d43-4b33-9d2f-6adebda32279/duballo_hero_magazine_1777648617003.png" 
                  alt="Duballo Hospital Aesthetic"
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-black text-white p-6 md:p-12 max-w-sm">
                <div className="text-xs font-mono mb-4">CONCEPT</div>
                <p className="text-sm leading-relaxed font-medium">
                  압구정 소재 정형외과 전문의 10인 중심의 병원급 정형외과. 
                  보험금 청구가 아닌 "청구 지원"이라는 고품격 서비스를 지향합니다.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-4 lg:pl-12 pb-12">
              <div className="vertical-label hidden lg:block text-black mb-12 opacity-10">
                ADMINISTRATION 2026
              </div>
              <div className="text-xs font-black uppercase tracking-[0.2em] mb-4">Core Principles</div>
              <ul className="space-y-4 text-sm font-bold uppercase">
                <li className="flex items-center gap-3"><Minus size={16} /> 서비스 중심 응대</li>
                <li className="flex items-center gap-3"><Minus size={16} /> 민감정보 보안 철저</li>
                <li className="flex items-center gap-3"><Minus size={16} /> 보험사 심사 기반 안내</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Decorative Sparks */}
        <Sparkles className="absolute top-20 right-20 text-gray-100" size={120} strokeWidth={0.5} />
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mt-20">
        
        {/* 01. Hospital Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          <div className="lg:col-span-4">
            <SectionLabel text="01 / Profile" />
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">
              Hospital<br />Summary
            </h2>
            <div className="space-y-6">
              {[
                { label: '위치', val: '서울 강남구 압구정로30길 45' },
                { label: '진료', label2: '족부·발목, 관절·척추, 소아정형' },
                { label: '의료진', val: '전문의 9~10명 규모' }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">{item.label}</div>
                  <div className="text-sm font-bold uppercase">{item.val || item.label2}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <Card title="Positining" number="01">
              창구의 핵심은 보험 판매가 아닙니다. 
              환자의 수납 직후 동선에서 "보험금 청구 서류 안내"라는 실질적 편의를 제공하는 것입니다.
            </Card>
            <Card title="Ethics" number="02">
              "무조건 보상된다"는 확정적 발언을 금지합니다. 
              보험 모집 질서를 준수하며 의료진의 진료 행위에 개입하지 않는 것을 원칙으로 합니다.
            </Card>
            <Card title="Pre-check" number="03">
              입점 전 병원급 실손24 연계 여부와 EMR 연동 상태를 반드시 확인하십시오. 
              환자 이동 동선을 파악하여 최적의 부스를 설치합니다.
            </Card>
            <Card title="Security" number="04">
              건강정보는 민감정보입니다. 
              화면보호필름, 파쇄함 설치, 전용 와이파이 사용을 통해 환자의 데이터를 안전하게 보호합니다.
            </Card>
          </div>
        </div>

        {/* 02. Process Flow - Big Editorial Section */}
        <section className="mb-32">
          <SectionLabel text="02 / Method" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-12">
                Standard<br />Process
              </h2>
              <div className="bg-black text-white p-12">
                <div className="text-xs font-mono mb-8 opacity-50">HOW WE WORK</div>
                <p className="text-xl font-bold leading-snug">
                  수납 직후 첫 응대부터 개인정보 동의, 서류 체크, 그리고 최종 청구 접수까지 
                  체계적인 6단계 프로세스를 따릅니다.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-1">
              {[
                '첫 응대: 서류 누락 확인 도와드리기',
                '청구 가능성 기본 확인 (질병/상해/통원)',
                '개인정보 수집 및 이용 동의 수령',
                '진료 항목별 필수 서류 누락 체크',
                '최적의 청구 방식 제안 (실손24/앱)',
                '보완 서류 발생 시 사후 관리'
              ].map((text, i) => (
                <div key={i} className="group flex items-center justify-between p-6 hover:bg-[#33bbc5] hover:text-white transition-all cursor-default border-b border-gray-100">
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono opacity-50">0{i+1}</span>
                    <span className="text-sm font-black uppercase tracking-tight">{text}</span>
                  </div>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03. Document Guide - Visual Grid */}
        <section className="mb-32">
          <SectionLabel text="03 / Documents" />
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-16 text-center">
            The Essentials <span className="script-accent lowercase text-4xl">guide</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { type: '통원', basic: '영수증, 세부내역서', extra: '처방전(병명코드)' },
              { type: 'MRI·초음파', basic: '영수증, 세부내역서', extra: '의사소견서, 영상판독지' },
              { type: '골절', basic: '진단서, 세부내역서', extra: '초진차트, X-ray 판독지' },
              { type: '수술', basic: '진단서, 수술확인서', extra: '수술기록지, 입퇴원확인서' },
              { type: '깁스·보조기', basic: '영수증, 세부내역서', extra: '보조기 처방 확인서' },
              { type: '소아골절', basic: '진단서, 세부내역서', extra: '가족관계 확인서류' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-10 hover:bg-black hover:text-white transition-colors">
                <div className="text-[10px] font-black uppercase opacity-50 mb-4">{item.type}</div>
                <div className="text-lg font-black mb-2 uppercase leading-tight">{item.basic}</div>
                <div className="text-xs font-medium uppercase text-gray-400 group-hover:text-gray-300">{item.extra}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Editorial Info */}
        <footer className="pt-20 border-t border-black flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="magazine-header text-4xl mb-4">Duballo Ops</div>
            <p className="text-xs text-gray-500 font-medium">
              본 매뉴얼은 2026년 두발로병원 현장 운영을 위해 제작되었습니다. 
              개인정보보호법 및 보험업법을 준수하여 운영해 주시기 바랍니다.
            </p>
          </div>
          <div className="flex gap-20">
            <div>
              <div className="text-[10px] font-black uppercase mb-4">Contact</div>
              <div className="text-sm font-bold uppercase underline">Administration Dept</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase mb-4">Updated</div>
              <div className="text-sm font-bold uppercase">MAY 2026</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
