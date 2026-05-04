'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpRight, 
  ChevronRight, 
  Minus, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  ClipboardList,
  Target
} from 'lucide-react'

const SectionLabel = ({ text, number }: { text: string, number: string }) => (
  <div className="flex items-center gap-6 mb-12">
    <span className="text-[10px] font-black font-mono tracking-tighter opacity-30">{number}</span>
    <div className="h-[1px] flex-1 bg-black opacity-10"></div>
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/60">{text}</span>
  </div>
)

const Card = ({ title, children, number, className = "" }: { title: string, children: React.ReactNode, number?: string, className?: string }) => (
  <div className={`group relative border-t border-black pt-8 pb-12 ${className}`}>
    <div className="flex justify-between items-start mb-6">
      {number && <span className="text-[10px] font-bold font-mono tracking-tighter">[{number}]</span>}
      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className="text-xl font-black uppercase mb-4 tracking-tighter leading-none">
      {title}
    </h3>
    <div className="text-sm text-gray-600 leading-relaxed">
      {children}
    </div>
  </div>
)

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#33bbc5] p-8 md:p-12 text-white">
    {children}
  </div>
)

export default function DuballoFullManual() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#33bbc5] selection:text-white pb-40">
      {/* 00. HERO SECTION */}
      <section className="relative pt-32 pb-40 px-6 lg:px-20 border-b border-black">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20"
          >
            <div>
              <div className="text-[12px] font-black uppercase tracking-[0.5em] mb-8 text-[#33bbc5]">
                Internal Operational Manual
              </div>
              <h1 className="text-8xl md:text-[140px] lg:text-[180px] font-black tracking-tighter leading-[0.8] uppercase">
                Blindingly<br />
                Bright <span className="text-[#33bbc5]">(+)</span>
              </h1>
            </div>
            <div className="md:text-right">
              <span className="font-serif italic text-4xl lg:text-6xl text-[#33bbc5] block mb-4">
                hello duballo
              </span>
              <div className="text-xs font-mono font-bold uppercase tracking-widest opacity-40">
                New Collection / Spring 2026
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-8">
              <div className="text-xs font-black uppercase tracking-widest border-l-4 border-black pl-4">
                두발로병원 인하우스<br />보험청구 창구 운영 매뉴얼
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-xs">
                본 매뉴얼은 압구정 두발로병원의 고품격 서비스를 정의하며, 
                보험금 청구 지원 프로세스의 표준을 제시합니다.
              </p>
            </div>
            <div className="lg:col-span-8">
               <div className="aspect-[16/7] bg-gray-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#33bbc5]/20 to-transparent mix-blend-overlay"></div>
                  <div className="absolute bottom-12 right-12 text-right">
                    <div className="text-6xl font-black text-black/10 tracking-tighter uppercase mb-2">FASHION MAGAZINE</div>
                    <div className="text-xs font-mono font-bold">DUBALLO ADMINISTRATION</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-32">
        
        {/* 01. Hospital Summary & 02. Positioning */}
        <section className="mb-40">
          <SectionLabel number="01-02" text="Foundation & Strategy" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-12">
                Hospital<br />Character
              </h2>
              <div className="space-y-4">
                {[
                  { label: '병원 성격', val: '압구정 소재 병원급 정형외과 (30병상 이상)' },
                  { label: '위치', val: '서울 강남구 압구정로30길 45, 2~4층' },
                  { label: '진료 시간', val: '평일 09-18시 / 토 09-13시 / 일 휴무' },
                  { label: '주요 진료', val: '족부·발목, 관절·척추, 소아정형, 내과' },
                  { label: '의료진', val: '전문의 9~10명 규모' },
                  { label: '실손청구', val: '실손24 연계 여부 및 EMR 연동 확인 필수' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <span className="text-[10px] font-black uppercase text-gray-400">{item.label}</span>
                    <span className="text-sm font-bold text-right">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <HighlightBox>
                <div className="text-xs font-mono mb-6 uppercase tracking-widest opacity-80">Positioning</div>
                <h3 className="text-3xl font-black uppercase mb-6 leading-tight">
                  "보험 판매가 아니라<br />보험금 청구 지원입니다"
                </h3>
                <p className="text-sm leading-relaxed mb-8 opacity-90">
                  권장 문구: “진료 후 보험금 청구에 필요한 서류와 절차를 안내드리는 창구입니다. 
                  실제 지급 여부와 금액은 보험사 심사에 따라 달라질 수 있습니다.”
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white/10 p-4 rounded border border-white/20">
                      <div className="text-[10px] font-black mb-2 uppercase text-white/60">Risk Management</div>
                      <p className="text-[11px] font-bold">특정 설계사 추천 또는 보험 가입 유도로 보이지 않게 주의</p>
                   </div>
                   <div className="bg-white/10 p-4 rounded border border-white/20">
                      <div className="text-[10px] font-black mb-2 uppercase text-white/60">Compliance</div>
                      <p className="text-[11px] font-bold">보험 모집 자격 미보유 시 가입 권유 엄격 금지</p>
                   </div>
                </div>
              </HighlightBox>
            </div>
          </div>
        </section>

        {/* 03. Checklist & 04. Setup */}
        <section className="mb-40">
          <SectionLabel number="03-04" text="Operational Setup" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">Pre-Check<br />List</h2>
              <div className="space-y-6">
                {[
                  '일평균 환자수 & 수납 동선 확인',
                  '서류 발급 부서 및 비용 파악',
                  '실손24 EMR 연동 여부',
                  '개인정보 동의서 양식 확인',
                  '병원 내 출력·스캔 가능 범위',
                  '홍보물 비치 가능 위치'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-tight">
                    <CheckCircle2 size={16} className="text-[#33bbc5]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card title="Optimal Location" number="04-1">
                 원무과·수납창구 근처이되 상담 내용이 들리지 않는 곳. 
                 수납 직후 동선에 위치해야 상담 전환율이 가장 높습니다.
               </Card>
               <Card title="Essential Tools" number="04-2">
                 노트북(보안), 휴대용 스캐너, 개인정보 동의서, 파쇄함, 
                 보험사별 앱 가이드, 미청구·보안서류 체크표.
               </Card>
               <Card title="Security Protocol" number="04-3">
                 화면보호필름 필수, 공용 와이파이 사용 금지, 
                 개인 카톡으로 진료기록 전송 절대 금지 원칙 준수.
               </Card>
               <Card title="Sensitive Data" number="04-4">
                 건강정보는 민감정보입니다. 동의받은 범위 안에서만 
                 확인하고, 상담 종료 후 즉시 안전하게 처리하십시오.
               </Card>
            </div>
          </div>
        </section>

        {/* 05. Standard Process */}
        <section className="mb-40">
          <SectionLabel number="05" text="Standard Process" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="vertical-label opacity-10 mb-8">PROCESS 2026</div>
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                6 Steps<br />Success
              </h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                "신뢰는 정확한 절차에서 시작됩니다."
              </p>
            </div>
            <div className="lg:col-span-8 space-y-2">
              {[
                { t: '첫 응대', d: '“보험 청구 예정이시면 서류 누락 없는지 확인 도와드릴까요?”' },
                { t: '청구 가능 확인', d: '질병/상해, 통원/입원, 검사·치료 항목 및 가입 보험 종류 파악' },
                { t: '개인정보 동의', d: '진료·보험 정보 확인 전 민감정보 사용 목적 고지 및 동의 수령' },
                { t: '서류 체크', d: '수술확인서, 진단서, 영상판독지 등 정형외과 필수 서류 누락 확인' },
                { t: '청구 접수', d: '실손24, 보험사 앱, 또는 설계사 지원 방식 중 최적 방식 제안' },
                { t: '사후 관리', d: '보완 요청 건 별도 기록 및 지급 완료 여부 최종 모니터링' }
              ].map((step, i) => (
                <div key={i} className="group flex items-center justify-between p-6 hover:bg-black hover:text-white transition-all cursor-default border-b border-gray-100">
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-mono opacity-30">0{i+1}</span>
                    <div>
                      <div className="text-sm font-black uppercase mb-1 tracking-tight">{step.t}</div>
                      <div className="text-[11px] font-medium opacity-60 uppercase">{step.d}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06. Document Guide */}
        <section className="mb-40">
          <SectionLabel number="06" text="Document Guide" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              { t: '단순 통원', b: '영수증, 세부내역서', e: '처방전(병명코드 필수)' },
              { t: 'MRI·초음파', b: '영수증, 세부내역서', e: '의사소견서, 영상판독지' },
              { t: '도수치료', b: '영수증, 세부내역서', e: '치료확인서, 의사소견서' },
              { t: '체외충격파·주사', b: '영수증, 세부내역서', e: '치료명 확인 가능한 내역서' },
              { t: '골절', b: '진단서, 영수증, 내역서', e: '초진차트, X-ray 판독지' },
              { t: '수술', b: '진단서, 수술확인서', e: '수술기록지, 입퇴원확인서' },
              { t: '입원', b: '입퇴원확인서, 영수증', e: '진단서, 수술확인서' },
              { t: '깁스·보조기', b: '영수증, 세부내역서', e: '보조기 처방 확인서' },
              { t: '소아골절', b: '진단서, 영수증', e: '가족관계서류, 사고내용서' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-8 hover:bg-[#33bbc5] hover:text-white transition-all border border-transparent">
                <div className="text-[9px] font-black uppercase opacity-50 mb-3">{item.t}</div>
                <div className="text-md font-black uppercase mb-2 leading-tight">{item.b}</div>
                <div className="text-[10px] font-medium opacity-60 uppercase">{item.e}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 07. Focus Points & 08. Scripts */}
        <section className="mb-40 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5">
            <SectionLabel number="07" text="Focus Points" />
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-12">
              Specific<br />Targets
            </h2>
            <div className="space-y-6">
              {[
                { l: '발목 염좌', v: '상해통원, 깁스, 상해수술비' },
                { l: '골절 환자', v: '골절진단비, 상해수술, 후유장해' },
                { l: '소아골절', v: '어린이보험 골절, 상해입원일당' },
                { l: '무지외반증', v: '질병수술비, 실손, 입원일당' },
                { l: '척추·관절', v: '도수치료, MRI, 주사치료' },
                { l: '수술 재활', v: '수술비, 입원일당, 통원치료비' }
              ].map((point, i) => (
                <div key={i} className="group">
                  <div className="text-[10px] font-black uppercase text-[#33bbc5] mb-1">{point.l}</div>
                  <div className="text-sm font-bold uppercase tracking-tight">{point.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-black text-white p-12 lg:p-20">
            <SectionLabel number="08" text="Scripts" />
            <div className="space-y-12">
              <div>
                <div className="text-[10px] font-mono text-white/40 mb-4">#01 첫 안내</div>
                <p className="text-lg font-bold leading-snug">
                  “안녕하세요. 보험금 청구하실 때 필요한 서류가 누락되지 않도록 확인 도와드리는 창구입니다. 간단히 확인해드릴까요?”
                </p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 mb-4">#02 개인정보 동의</div>
                <p className="text-md font-bold leading-snug text-white/80">
                  “진료비 내역은 민감정보라서 동의 없이 확인하지 않습니다. 청구 안내 목적에 한해서만 확인하겠습니다.”
                </p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 mb-4">#03 영업 전환 (안전)</div>
                <p className="text-md font-bold leading-snug text-[#33bbc5]">
                  “오늘은 보험금 청구를 먼저 도와드리고, 기존 보장 점검은 원하실 경우 진료와 별도로 시간을 잡아 설명드리겠습니다.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 09. Absolute Don'ts */}
        <section className="mb-40 border-2 border-black p-12 md:p-20">
           <SectionLabel number="09" text="Critical Bans" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Absolute<br />Don'ts</h2>
                <p className="text-xs text-gray-400 font-bold uppercase mb-8 tracking-[0.2em]">Zero Tolerance Policy</p>
              </div>
              <div className="space-y-8">
                {[
                  { t: '확정적 발언 금지', d: '“무조건 나온다”, “100% 보장된다” 등 확답 피하기' },
                  { t: '의료 개입 금지', d: '진료나 치료를 권유하는 행위 절대 금지' },
                  { t: '신분 혼동 금지', d: '병원 직원처럼 행동하거나 병원 명칭 오사용 금지' },
                  { t: '모집질서 위반 금지', d: '병원 직원에게 보험 가입 추천 부탁하기 금지' },
                  { t: '대리 인증 금지', d: '환자 휴대폰 인증 대행 및 전자서명 대리 금지' },
                  { t: '보안 위반 금지', d: '개인 카톡으로 서류 받기, 주민번호 전체 기록 금지' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <XCircle size={20} className="text-red-500 shrink-0" />
                    <div>
                      <div className="text-sm font-black uppercase mb-1">{item.t}</div>
                      <div className="text-[11px] font-medium text-gray-500 uppercase">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* 10. Routine, 11. KPI, 12. 30 Days Plan */}
        <section className="mb-40">
           <SectionLabel number="10-12" text="Management & Growth" />
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              <div className="bg-gray-50 p-12">
                 <div className="flex items-center gap-3 mb-8">
                   <Clock size={20} className="text-[#33bbc5]" />
                   <h4 className="text-xl font-black uppercase">Daily Routine</h4>
                 </div>
                 <ul className="space-y-4 text-xs font-bold uppercase">
                   <li className="pb-3 border-b border-black/5">오전: 보완서류 요청 건 & 일정 확인</li>
                   <li className="pb-3 border-b border-black/5">진료 중: 수납 환자 응대 & 접수</li>
                   <li className="pb-3 border-b border-black/5">마감: 상담 기록 & 개인정보 서류 파쇄</li>
                   <li>병원 담당자와 민원·요청사항 공유</li>
                 </ul>
              </div>
              <div className="bg-black text-white p-12">
                 <div className="flex items-center gap-3 mb-8">
                   <Target size={20} className="text-[#33bbc5]" />
                   <h4 className="text-xl font-black uppercase">KPI Indicators</h4>
                 </div>
                 <ul className="space-y-4 text-xs font-bold uppercase">
                   <li className="flex justify-between"><span>청구 접수율</span> <span className="text-[#33bbc5]">TARGET 80%</span></li>
                   <li className="flex justify-between"><span>보완서류 발생률</span> <span className="text-white/40">MINIMIZE</span></li>
                   <li className="flex justify-between"><span>병원 민원 발생</span> <span className="text-red-500">ZERO</span></li>
                   <li className="flex justify-between"><span>상담 예약 전환</span> <span className="text-[#33bbc5]">UPWARD</span></li>
                 </ul>
              </div>
              <div className="bg-gray-50 p-12">
                 <div className="flex items-center gap-3 mb-8">
                   <Calendar size={20} className="text-[#33bbc5]" />
                   <h4 className="text-xl font-black uppercase">30 Days Plan</h4>
                 </div>
                 <div className="space-y-4">
                    {[
                      { w: '1-2주차', p: '병원 동선 및 서류 절차 숙지' },
                      { w: '3주차', p: '청구 데이터 수집 및 안내문 개선' },
                      { w: '4주차', p: '운영 결과 리뷰 및 프로세스 고도화' }
                    ].map((plan, i) => (
                      <div key={i} className="text-xs font-bold">
                        <div className="text-[#33bbc5] mb-1">{plan.w}</div>
                        <div className="uppercase">{plan.p}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 13. Field Notice */}
        <section className="mb-40">
           <SectionLabel number="13" text="Field Asset" />
           <div className="max-w-2xl mx-auto border-4 border-black p-12 md:p-20 text-center">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-12">현장 안내문 예시</h4>
              <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter">
                보험금 청구 서류<br />안내 창구
              </h2>
              <p className="text-sm font-bold mb-12 text-gray-500">진료 후 보험금 청구에 필요한 서류를 확인해드립니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
                 <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase text-[#33bbc5]">Check Items</div>
                    <ul className="text-[11px] font-bold uppercase leading-relaxed">
                      <li>• 실손보험 청구 서류</li>
                      <li>• 골절·수술·입원 서류</li>
                      <li>• MRI·도수·주사치료 서류</li>
                    </ul>
                 </div>
                 <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase text-red-500">Notice</div>
                    <ul className="text-[11px] font-bold uppercase leading-relaxed">
                      <li>• 최종 지급은 보험사 심사 결과</li>
                      <li>• 동의 기반 민감정보 확인</li>
                      <li>• 병원 수납/진료와는 무관</li>
                    </ul>
                 </div>
              </div>
              <div className="h-[1px] w-full bg-black/10 mb-8"></div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-30">DU BALLO HOSPITAL OPS</div>
           </div>
        </section>

        {/* Footer Editorial Info */}
        <footer className="pt-20 border-t border-black flex flex-col md:flex-row justify-between gap-12 items-start md:items-end">
          <div className="max-w-xs">
            <div className="text-4xl font-black uppercase tracking-tighter mb-6">Duballo<br />Manual <span className="text-[#33bbc5]">(+)</span></div>
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
              본 매뉴얼은 2026년 두발로병원 현장 운영을 위해 제작되었습니다. 
              개인정보보호법 및 보험업법을 준수하여 운영해 주시기 바랍니다.
            </p>
          </div>
          <div className="flex gap-20">
            <div>
              <div className="text-[10px] font-black uppercase mb-4 opacity-30">Department</div>
              <div className="text-xs font-black uppercase underline decoration-2 underline-offset-4">Administration</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase mb-4 opacity-30">Published</div>
              <div className="text-xs font-black uppercase">MAY 2026 / VOL.01</div>
            </div>
          </div>
        </footer>
      </div>

      <div className="fixed top-1/2 right-0 -translate-y-1/2 rotate-90 origin-right translate-x-full pr-12 pointer-events-none hidden lg:block">
        <span className="text-[10px] font-black uppercase tracking-[1em] text-black/10">DUBALLO INSURANCE PLANNER</span>
      </div>
    </div>
  )
}
