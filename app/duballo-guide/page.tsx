'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpRight, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  XCircle,
  Calendar,
  Target,
  FileText,
  ShieldCheck,
  Smartphone,
  ClipboardList,
  Monitor,
  ExternalLink
} from 'lucide-react'

const SectionLabel = ({ text, number }: { text: string, number: string }) => (
  <div className="flex items-center gap-8 mb-16">
    <span className="text-base font-black font-mono tracking-tighter opacity-40">{number}</span>
    <div className="h-[2px] flex-1 bg-black opacity-10"></div>
    <span className="text-sm font-black uppercase tracking-[0.5em] text-black/80">{text}</span>
  </div>
)

const Card = ({ title, children, number, className = "" }: { title: string, children: React.ReactNode, number?: string, className?: string }) => (
  <div className={`group relative border-t-4 border-black pt-12 pb-16 ${className}`}>
    <div className="flex justify-between items-start mb-10">
      {number && <span className="text-sm font-bold font-mono tracking-tighter text-black/40">[{number}]</span>}
      <ArrowUpRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter leading-none">
      {title}
    </h3>
    <div className="text-xl text-gray-800 leading-relaxed font-bold">
      {children}
    </div>
  </div>
)

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#33bbc5] p-12 md:p-20 text-white shadow-2xl">
    {children}
  </div>
)

export default function DuballoStandaloneManual() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#33bbc5] selection:text-white pb-80">
      {/* 00. HERO SECTION */}
      <section className="relative pt-32 pb-48 px-6 lg:px-20 border-b-4 border-black">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-24"
          >
            <div>
              <div className="text-base font-black uppercase tracking-[0.6em] mb-8 text-[#33bbc5]">
                Internal Operational Manual
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.85] uppercase">
                Blindingly<br />
                Bright <span className="text-[#33bbc5]">(+)</span>
              </h1>
            </div>
            <div className="md:text-right">
              <a 
                href="https://lifree1.com/app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#33bbc5] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-black transition-all mb-8 shadow-xl hover:-translate-y-1"
              >
                Launch Kiosk App <ExternalLink size={18} />
              </a>
              <span className="font-serif italic text-4xl lg:text-6xl text-[#33bbc5] block mb-6">
                hello duballo
              </span>
              <div className="text-sm font-mono font-bold uppercase tracking-widest opacity-40">
                New Collection / Spring 2026
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-5 space-y-12">
              <div className="text-base font-black uppercase tracking-widest border-l-8 border-black pl-8">
                두발로병원 인하우스<br />보험청구 창구 운영 매뉴얼
              </div>
              <p className="text-2xl text-gray-600 leading-relaxed font-black max-w-xl">
                본 매뉴얼은 압구정 두발로병원의 고품격 서비스를 정의하며, 
                보험금 청구 지원 프로세스의 표준을 제시합니다.
              </p>
            </div>
            <div className="lg:col-span-7">
               <div className="aspect-[16/8] bg-gray-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#33bbc5]/20 to-transparent mix-blend-overlay"></div>
                  <div className="absolute bottom-12 right-12 text-right">
                    <div className="text-7xl font-black text-black/10 tracking-tighter uppercase mb-2">DUBALLO OPS</div>
                    <div className="text-sm font-mono font-bold">DUBALLO ADMINISTRATION</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-52">
        
        {/* 01. Hospital Summary & 02. Positioning */}
        <section className="mb-64">
          <SectionLabel number="01-02" text="Foundation & Strategy" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            <div className="lg:col-span-5">
              <h2 className="text-8xl font-black uppercase tracking-tighter leading-none mb-20">
                Hospital<br />Character
              </h2>
              <div className="space-y-8">
                {[
                  { label: '병원 성격', val: '압구정 소재 병원급 정형외과 (30병상 이상)' },
                  { label: '위치', val: '서울 강남구 압구정로30길 45, 2~4층' },
                  { label: '진료 시간', val: '평일 09-18시 / 토 09-13시 / 일 휴무' },
                  { label: '주요 진료', val: '족부·발목, 관절·척추, 소아정형, 내과' },
                  { label: '의료진', val: '전문의 9~10명 규모' },
                  { label: '실손청구', val: '실손24 연계 여부 및 EMR 연동 확인 필수' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b-4 border-gray-100 pb-6">
                    <span className="text-sm font-black uppercase text-gray-400">{item.label}</span>
                    <span className="text-xl font-bold text-right">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <HighlightBox>
                <div className="text-sm font-mono mb-10 uppercase tracking-widest opacity-80 border-b border-white/30 pb-4 inline-block">Positioning</div>
                <h3 className="text-5xl font-black uppercase mb-10 leading-tight">
                  "보험 판매가 아니라<br />보험금 청구 지원입니다"
                </h3>
                <p className="text-2xl leading-relaxed mb-16 font-black opacity-90">
                  권장 문구: “진료 후 보험금 청구에 필요한 서류와 절차를 안내드리는 창구입니다. 
                  실제 지급 여부와 금액은 보험사 심사에 따라 달라질 수 있습니다.”
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white/10 p-8 rounded-xl border border-white/20 shadow-xl">
                      <div className="text-xs font-black mb-4 uppercase text-white/60 tracking-widest">Risk Management</div>
                      <p className="text-base font-black">특정 설계사 추천 또는 보험 가입 유도로 보이지 않게 주의</p>
                   </div>
                   <div className="bg-white/10 p-8 rounded-xl border border-white/20 shadow-xl">
                      <div className="text-xs font-black mb-4 uppercase text-white/60 tracking-widest">Compliance</div>
                      <p className="text-base font-black">보험 모집 자격 미보유 시 가입 권유 엄격 금지</p>
                   </div>
                </div>
              </HighlightBox>
            </div>
          </div>
        </section>

        {/* 03. Checklist & 04. Setup */}
        <section className="mb-64">
          <SectionLabel number="03-04" text="Operational Setup" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div>
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-16 leading-none">Pre-Check<br />List</h2>
              <div className="space-y-10">
                {[
                  '일평균 환자수 & 수납 동선 확인',
                  '서류 발급 부서 및 비용 파악',
                  '실손24 EMR 연동 여부',
                  '개인정보 동의서 양식 확인',
                  '키오스크 설치 위치 및 전원 확인',
                  '홍보물 비치 가능 위치'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-8 text-base font-black uppercase tracking-tight">
                    <CheckCircle2 size={24} className="text-[#33bbc5]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
               <Card title="Optimal Location" number="04-1">
                 원무과·수납창구 근처이되 상담 내용이 들리지 않는 곳. 
                 수납 직후 동선에 위치해야 키오스크 전환율이 가장 높습니다.
               </Card>
               <Card title="Essential Tools" number="04-2">
                 키오스크(Kiosk) 기기, 노트북(보안), 휴대용 스캐너, 
                 개인정보 동의서, 파쇄함, 보험사별 앱 가이드.
               </Card>
               <Card title="Kiosk Maintenance" number="04-3">
                 키오스크 상시 전원 확인, 화면 터치 반응 체크, 
                 프린터 용지(필요 시) 잔량 확인 및 센서 청소.
               </Card>
               <Card title="System Access" number="04-4">
                 <a href="https://lifree1.com/app" target="_blank" rel="noopener noreferrer" className="text-[#33bbc5] underline flex items-center gap-2 hover:text-black">
                   lifree1.com/app <ExternalLink size={16} />
                 </a>
                 <p className="mt-4 text-gray-500 text-sm italic">키오스크 프로그램 자동 로그인 및 세션 유지 상태 확인 필수.</p>
               </Card>
            </div>
          </div>
        </section>

        {/* 05. Standard Process */}
        <section className="mb-72 bg-black text-white p-12 md:p-24 rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Monitor size={300} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <SectionLabel number="05" text="The Method" />
            <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div>
                <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
                  6 Steps<br />Success Flow
                </h2>
                <p className="text-xl md:text-2xl text-[#33bbc5] font-black leading-relaxed italic max-w-2xl">
                  "키오스크 기반의 효율적인 보험 청구 프로세스"
                </p>
              </div>
              <a 
                href="https://lifree1.com/app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#33bbc5] hover:text-white transition-all shadow-xl"
              >
                Open System <ExternalLink size={18} className="inline ml-2" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  n: '01', 
                  t: '첫 응대', 
                  d: '“보험 청구 예정이시면 서류 누락 없는지 확인 도와드릴까요?” (키오스크 옆 대기)',
                  icon: <Target className="text-[#33bbc5]" size={28} />
                },
                { 
                  n: '02', 
                  t: '청구 가능 확인', 
                  d: '질병/상해, 통원/입원 파악 후 키오스크 초기 화면 안내',
                  icon: <Clock className="text-[#33bbc5]" size={28} />
                },
                { 
                  n: '03', 
                  t: '개인정보 동의', 
                  d: '키오스크 내 전자동의서 수령 전 민감정보 사용 목적 고지',
                  icon: <ShieldCheck className="text-[#33bbc5]" size={28} />
                },
                { 
                  n: '04', 
                  t: '서류 체크', 
                  d: '스캔 전 수술확인서, 진단서 등 정형외과 필수 서류 최종 확인',
                  icon: <FileText className="text-[#33bbc5]" size={28} />
                },
                { 
                  n: '05', 
                  t: '키오스크 접수', 
                  d: '키오스크 스캐너를 이용한 서류 업로드 및 전송 완료 확인',
                  icon: <Monitor className="text-[#33bbc5]" size={28} />
                },
                { 
                  n: '06', 
                  t: '사후 관리', 
                  d: '접수증 전달 및 보완 요청 시 안내받으실 연락처 확인',
                  icon: <ClipboardList className="text-[#33bbc5]" size={28} />
                }
              ].map((step, i) => (
                <div key={i} className="group relative bg-white/5 hover:bg-white/10 p-8 transition-all border-l-4 border-[#33bbc5] flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="text-2xl font-black font-mono text-[#33bbc5] opacity-50 shrink-0">{step.n}</div>
                  <div className="p-3 bg-white/10 rounded-xl shrink-0">{step.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase mb-2 tracking-tight">{step.t}</h4>
                    <p className="text-lg font-bold text-white/60 leading-relaxed">{step.d}</p>
                  </div>
                  <ChevronRight size={28} className="opacity-10 group-hover:opacity-100 transition-opacity hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06. Document Guide */}
        <section className="mb-64">
          <SectionLabel number="06" text="Document Guide" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
              <div key={i} className="bg-gray-50 p-12 hover:bg-[#33bbc5] hover:text-white transition-all border border-transparent">
                <div className="text-sm font-black uppercase opacity-50 mb-6">{item.t}</div>
                <div className="text-2xl font-black uppercase mb-4 leading-tight">{item.b}</div>
                <div className="text-base font-bold opacity-60 uppercase">{item.e}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 07. Focus Points & 08. Scripts */}
        <section className="mb-64 grid grid-cols-1 lg:grid-cols-12 gap-32">
          <div className="lg:col-span-5">
            <SectionLabel number="07" text="Focus Points" />
            <h2 className="text-7xl font-black uppercase tracking-tighter leading-none mb-20">
              Specific<br />Targets
            </h2>
            <div className="space-y-10">
              {[
                { l: '발목 염좌', v: '상해통원, 깁스, 상해수술비' },
                { l: '골절 환자', v: '골절진단비, 상해수술, 후유장해' },
                { l: '소아골절', v: '어린이보험 골절, 상해입원일당' },
                { l: '무지외반증', v: '질병수술비, 실손, 입원일당' },
                { l: '척추·관절', v: '도수치료, MRI, 주사치료' },
                { l: '수술 재활', v: '수술비, 입원일당, 통원치료비' }
              ].map((point, i) => (
                <div key={i} className="group">
                  <div className="text-sm font-black uppercase text-[#33bbc5] mb-3">{point.l}</div>
                  <div className="text-xl font-black uppercase tracking-tight">{point.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-black text-white p-20 lg:p-32 shadow-2xl rounded-[40px]">
            <SectionLabel number="08" text="Scripts" />
            <div className="space-y-20">
              <div>
                <div className="text-sm font-mono text-white/40 mb-10">#01 첫 안내</div>
                <p className="text-4xl font-bold leading-snug">
                  “안녕하세요. 키오스크로 보험금을 간편하게 청구하실 수 있도록 도와드리고 있습니다. 확인해드릴까요?”
                </p>
              </div>
              <div>
                <div className="text-sm font-mono text-white/40 mb-10">#02 키오스크 안내</div>
                <p className="text-2xl font-bold leading-snug text-white/80">
                  “준비하신 서류를 여기 스캐너에 놓아주시면 자동으로 보험사에 전송됩니다.”
                </p>
              </div>
              <div>
                <div className="text-sm font-mono text-white/40 mb-10">#03 상담 연계 안내</div>
                <p className="text-2xl font-bold leading-snug text-[#33bbc5]">
                  “접수는 완료되었습니다. 상세한 보장 내역 분석은 추후 안내드리겠습니다.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 09. Absolute Don'ts */}
        <section className="mb-64 border-8 border-black p-20 md:p-32 rounded-[60px]">
           <SectionLabel number="09" text="Critical Bans" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-20">
              <div>
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-20">Absolute<br />Don'ts</h2>
                <p className="text-base text-gray-400 font-black uppercase mb-12 tracking-[0.4em]">Zero Tolerance Policy</p>
              </div>
              <div className="space-y-16">
                {[
                  { t: '키오스크 조작 강요 금지', d: '환자가 직접 하기 어려워할 경우 친절히 대행 설명' },
                  { t: '의료 개입 금지', d: '진료나 치료를 권유하는 행위 절대 금지' },
                  { t: '신분 혼동 금지', d: '병원 직원처럼 행동하거나 병원 명칭 오사용 금지' },
                  { t: '모집질서 위반 금지', d: '병원 직원에게 보험 가입 추천 부탁하기 금지' },
                  { t: '대리 인증 금지', d: '환자 휴대폰 인증 대행 및 전자서명 대리 금지' },
                  { t: '보안 위반 금지', d: '키오스크 화면에 환자 정보 방치 금지' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-12">
                    <XCircle size={36} className="text-red-500 shrink-0" />
                    <div>
                      <div className="text-xl font-black uppercase mb-3">{item.t}</div>
                      <div className="text-base font-bold text-gray-500 uppercase">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* 10. Routine, 11. KPI, 12. 30 Days Plan */}
        <section className="mb-64">
           <SectionLabel number="10-12" text="Management & Growth" />
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="bg-gray-50 p-20">
                 <div className="flex items-center gap-6 mb-16">
                   <Clock size={32} className="text-[#33bbc5]" />
                   <h4 className="text-3xl font-black uppercase">Daily Routine</h4>
                 </div>
                 <ul className="space-y-10 text-base font-black uppercase">
                   <li className="pb-6 border-b-4 border-black/5">오전: 키오스크 전원 및 네트워크 점검</li>
                   <li className="pb-6 border-b-4 border-black/5">진료 중: 키오스크 사용 안내 및 서류 체크</li>
                   <li className="pb-6 border-b-4 border-black/5">마감: 키오스크 로그 확인 및 센서 청소</li>
                   <li>병원 담당자와 운영 현황 공유</li>
                 </ul>
              </div>
              <div className="bg-black text-white p-20">
                 <div className="flex items-center gap-6 mb-16">
                   <Target size={32} className="text-[#33bbc5]" />
                   <h4 className="text-3xl font-black uppercase">KPI Indicators</h4>
                 </div>
                 <ul className="space-y-10 text-base font-black uppercase">
                   <li className="flex justify-between items-center pb-6 border-b-2 border-white/10"><span>키오스크 가동률</span> <span className="text-[#33bbc5]">TARGET 99%</span></li>
                   <li className="flex justify-between items-center pb-6 border-b-2 border-white/10"><span>접수 성공률</span> <span className="text-white/40">HIGH</span></li>
                   <li className="flex justify-between items-center pb-6 border-b-2 border-white/10"><span>병원 민원</span> <span className="text-red-500">ZERO</span></li>
                   <li className="flex justify-between items-center"><span>상담 예약</span> <span className="text-[#33bbc5]">UPWARD</span></li>
                 </ul>
              </div>
              <div className="bg-gray-50 p-20">
                 <div className="flex items-center gap-6 mb-16">
                   <Calendar size={32} className="text-[#33bbc5]" />
                   <h4 className="text-3xl font-black uppercase">30 Days Plan</h4>
                 </div>
                 <div className="space-y-12">
                    {[
                      { w: '1-2주차', p: '키오스크 조작 숙달 및 서류 분류' },
                      { w: '3주차', p: '키오스크 오류 대응 매뉴얼 확립' },
                      { w: '4주차', p: '사용 데이터 분석 및 동선 최적화' }
                    ].map((plan, i) => (
                      <div key={i} className="text-base font-black">
                        <div className="text-[#33bbc5] mb-4 uppercase tracking-widest text-sm">Phase 0{i+1} / {plan.w}</div>
                        <div className="uppercase text-xl leading-tight">{plan.p}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 13. Field Notice */}
        <section className="mb-80">
           <SectionLabel number="13" text="Field Asset" />
           <div className="max-w-4xl mx-auto border-[12px] border-black p-20 md:p-32 text-center shadow-2xl rounded-2xl">
              <h4 className="text-base font-black uppercase tracking-[0.6em] mb-20">현장 안내문 예시</h4>
              <h2 className="text-7xl md:text-8xl font-black uppercase mb-20 tracking-tighter">
                보험금 청구<br />키오스크 안내
              </h2>
              <p className="text-2xl font-bold mb-20 text-gray-500">진료 후 키오스크로 간편하게 보험금을 청구하세요.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-left mb-20">
                 <div className="space-y-8">
                    <div className="text-sm font-black uppercase text-[#33bbc5] tracking-widest">Kiosk Guide</div>
                    <ul className="text-base font-bold uppercase leading-relaxed space-y-4">
                      <li>• 준비한 서류 스캔</li>
                      <li>• 간단한 본인 인증</li>
                      <li>• 실시간 전송 완료</li>
                    </ul>
                 </div>
                 <div className="space-y-8">
                    <div className="text-sm font-black uppercase text-red-500 tracking-widest">Notice</div>
                    <ul className="text-base font-bold uppercase leading-relaxed space-y-4">
                      <li>• 24시간 간편 접수</li>
                      <li>• 보안 인증 기술 적용</li>
                      <li>• 병원 수납과는 별개</li>
                    </ul>
                 </div>
              </div>
              <div className="h-[4px] w-full bg-black/10 mb-12"></div>
              <div className="text-sm font-black uppercase tracking-widest opacity-40">DU BALLO HOSPITAL KIOSK OPS</div>
           </div>
        </section>

        {/* Footer Editorial Info */}
        <footer className="pt-40 border-t-4 border-black flex flex-col md:flex-row justify-between gap-24 items-start md:items-end">
          <div className="max-w-lg">
            <div className="text-6xl font-black uppercase tracking-tighter mb-12">Duballo<br />Manual <span className="text-[#33bbc5]">(+)</span></div>
            <p className="text-sm text-gray-500 font-black uppercase leading-relaxed tracking-wider">
              본 매뉴얼은 2026년 두발로병원 키오스크 운영을 위해 제작되었습니다. 
              개인정보보호법 및 보험업법을 준수하여 운영해 주시기 바랍니다.
            </p>
          </div>
          <div className="flex gap-32">
            <div>
              <div className="text-sm font-black uppercase mb-8 opacity-30 tracking-widest">Department</div>
              <div className="text-base font-black uppercase underline decoration-8 underline-offset-[12px]">Administration</div>
            </div>
            <div>
              <div className="text-sm font-black uppercase mb-8 opacity-30 tracking-widest">Published</div>
              <div className="text-base font-black uppercase">MAY 2026 / VOL.01</div>
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative vertical label */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 rotate-90 origin-right translate-x-full pr-24 pointer-events-none hidden lg:block">
        <span className="text-sm font-black uppercase tracking-[1em] text-black/10">DUBALLO KIOSK OPERATIONS MANUAL</span>
      </div>
    </div>
  )
}
