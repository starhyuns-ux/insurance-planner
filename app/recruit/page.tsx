'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckBadgeIcon, 
  ChevronDownIcon, 
  CurrencyDollarIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  IdentificationIcon,
  CircleStackIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import NavBar from '@/components/NavBar'

export default function RecruitPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', exp: '신입', msg: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success('지원이 완료되었습니다. 담당자가 곧 연락드리겠습니다.')
      setIsSubmitting(false)
      setFormData({ name: '', phone: '', exp: '신입', msg: '' })
    }, 1500)
  }

  const jdItems = [
    { label: "담당업무", icon: DocumentTextIcon, items: ["개인 및 법인 보장 분석 컨설팅", "재무 설계 및 자산 관리 서비스", "고객 맞춤형 보험 상품 제안 및 사후 관리"] },
    { label: "자격요건", icon: CheckBadgeIcon, items: ["학력 및 전공 무관 (고졸 이상)", "금융 전문가로서의 성장 의지가 강한 분", "신용상 결격 사유가 없는 분"] },
    { label: "우대사항", icon: AcademicCapIcon, items: ["금융 관련 자격증 보유자 (AFPK, CFP 등)", "보험/카드/대출 영업 경력자 우대", "동영상 및 SNS 활용 능력이 우수한 분"] },
  ]

  const faqs = [
    { q: "보험 영업 경력이 전혀 없어도 지원 가능한가요?", a: "네, 가능합니다. 인슈닷은 체계적인 신입 교육 커리큘럼을 보유하고 있어, 금융 기초 지식부터 실전 상담 스킬까지 단계별로 교육해 드립니다." },
    { q: "DB(상담 신청 데이터)는 어떤 방식으로 제공되나요?", a: "방송, 대형 포털, SNS 광고를 통해 유입된 실시간 상담 신청 데이터를 설계사님의 활동량에 맞춰 매일 공정하게 배정해 드립니다." },
    { q: "초기 정착 지원금이 있나요?", a: "네, 경력 및 자격 요건에 따라 일정 기간 동안 안정적인 활동을 지원하기 위한 초기 정착 지원금 제도를 운영하고 있습니다." },
    { q: "근무 시간과 장소는 자율적인가요?", a: "기본적인 정기 교육 시간을 제외하고는 자율 출퇴근제로 운영됩니다. 디지털 영업 툴을 지원하기 때문에 장소에 구애받지 않고 유연하게 활동하실 수 있습니다." }
  ]

  const commissionTable = [
    { rank: "신입 (Standard)", work: "DB 상담 주 3회", result: "월 15~20건", income: "월 400 ~ 600만원" },
    { rank: "프로 (Pro)", work: "DB 상담 주 5회", result: "월 25~35건", income: "월 800 ~ 1,200만원" },
    { rank: "마스터 (Master)", work: "팀 빌딩 + 직접 상담", result: "월 40건 이상", income: "월 2,000만원 이상" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-primary-100 italic-none">
      <NavBar />

      {/* 1. Official Banner (JD Style) */}
      <section className="bg-gray-900 pt-20 pb-20 md:pt-32 md:pb-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>
        </div>
        <div className="container relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-400 text-xs font-black tracking-widest uppercase"
          >
            Employment Opportunity
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight px-4"
          >
            2024 상반기 신입/경력 <br />
            보장분석 전문가(FA) 상시 채용 공고
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl font-bold max-w-2xl mx-auto"
          >
            대한민국 보험 영업의 미래, 인슈닷(InsuDot)과 함께 <br className="hidden md:block"/>
            당신의 압도적인 수익 로드맵을 그려보세요.
          </motion.p>
        </div>
      </section>

      {/* 2. JD Content Grid */}
      <section className="py-24 container -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jdItems.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all h-full"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 mb-8 border border-gray-100">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-6">{item.label}</h3>
              <ul className="space-y-4">
                {item.items.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <CheckBadgeIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-gray-600 font-bold leading-relaxed transition-colors group-hover:text-gray-900">{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Income RoadMap Visualization */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">압도적인 수익 로드맵</h2>
            <p className="text-gray-500 font-bold">인슈닷의 DB 지원 시스템과 함께라면 고수익은 결과입니다.</p>
          </div>

          <div className="bg-gray-50 rounded-[3rem] p-4 md:p-12 overflow-hidden shadow-inner border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">Career Path</th>
                            <th className="px-6 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">활동량</th>
                            <th className="px-6 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">평균 실적</th>
                            <th className="px-6 py-8 text-xs font-black text-primary-600 uppercase tracking-widest">예상 소득 (월)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {commissionTable.map((row, i) => (
                            <tr key={i} className="hover:bg-white transition-colors group">
                                <td className="px-6 py-8">
                                    <span className="text-lg font-black text-gray-900 block">{row.rank}</span>
                                </td>
                                <td className="px-6 py-8 text-gray-600 font-bold">{row.work}</td>
                                <td className="px-6 py-8 text-gray-600 font-bold">{row.result}</td>
                                <td className="px-6 py-8">
                                    <span className="text-xl font-black text-primary-600 bg-primary-50 px-5 py-2 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                        {row.income}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-8 text-center text-xs text-gray-400 font-bold leading-relaxed px-6 italic">
                ※ 위 수익 데이터는 실제 활동 중인 설계사들의 평균치를 기반으로 구성되었으며, 개인별 역량과 조직 기여도에 따라 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Recruitment Process (5 Steps) */}
      <section className="py-32 container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {[
                { title: "지원접수", desc: "온라인/간편 지원", icon: UserPlusIcon },
                { title: "서류전형", desc: "기초 지원서 검토", icon: DocumentTextIcon },
                { title: "면접진행", desc: "실무진 인터뷰", icon: ChatBubbleLeftRightIcon },
                { title: "위촉교육", desc: "상품/시스템 교육", icon: AcademicCapIcon },
                { title: "위촉/활동", desc: "활동 개시 및 지원", icon: IdentificationIcon },
            ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-6 relative group flex-1">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary-600 border border-gray-50 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                        <step.icon className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-black text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{step.desc}</p>
                    </div>
                    {i < 4 && (
                        <div className="hidden md:block absolute top-10 left-[70%] w-full h-[2px] bg-gradient-to-r from-gray-200 to-transparent"></div>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* 5. FAQ Section (Accordion) */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container max-w-4xl relative z-10">
          <div className="mb-20 text-center">
             <h2 className="text-3xl md:text-5xl font-black mb-4">자주 묻는 질문 (FAQ)</h2>
             <p className="text-gray-400 font-bold">궁금하신 점을 빠르게 해결해 드립니다.</p>
          </div>

          <div className="space-y-4">
              {faqs.map((faq, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden transition-all hover:bg-white/10">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full px-8 py-8 flex items-center justify-between text-left focus:outline-none"
                      >
                          <span className="text-lg font-bold pr-10">{faq.q}</span>
                          <ChevronDownIcon className={`w-6 h-6 text-primary-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                          {openFaq === i && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                  <div className="px-8 pb-10 text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-6 flex items-start gap-4">
                                      <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center shrink-0 mt-1">
                                         <span className="text-xs font-black text-white">A</span>
                                      </div>
                                      <p>{faq.a}</p>
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* 6. Contact Form (Bottom) */}
      <section className="py-40 bg-white" id="apply-form">
          <div className="container max-w-6xl">
            <div className="bg-gray-900 rounded-[4rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                
                <div className="w-full lg:w-1/2 space-y-10 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            지금 바로 <br />
                            문의하세요.
                        </h2>
                        <p className="text-gray-400 text-lg font-bold">당신은 영업에만 집중하세요. 나머지는 인슈닷이 책임집니다.</p>
                    </div>
                    <div className="flex flex-col gap-6 items-center lg:items-start text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><CircleStackIcon className="w-6 h-6" /></div>
                            <span className="text-lg font-bold">실시간 신규 DB 전량 무상 지원</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><IdentificationIcon className="w-6 h-6" /></div>
                            <span className="text-lg font-bold">개별 맞춤형 디지털 명함 제공</span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">이름</label>
                                <input 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    type="text" placeholder="성함 입력" 
                                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-600 focus:bg-white transition-all font-bold placeholder:text-gray-400" 
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">연락처</label>
                                <input 
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    type="tel" placeholder="010-0000-0000" 
                                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-600 focus:bg-white transition-all font-bold placeholder:text-gray-400" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">경력 구분</label>
                            <div className="flex gap-4">
                                {['신입', '경력'].map(v => (
                                    <button 
                                        key={v}
                                        type="button"
                                        onClick={() => setFormData({...formData, exp: v})}
                                        className={`flex-1 py-5 rounded-2xl font-black transition-all border-2 ${formData.exp === v ? 'bg-primary-600 border-primary-600 text-white' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            disabled={isSubmitting}
                            className="w-full py-6 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-xl shadow-gray-400/20 hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? '전송 중...' : '상담 신청하기'}
                        </button>
                    </form>
                </div>
            </div>
          </div>
      </section>

      {/* Floating Application Button (Mobile Only) */}
      <div className="fixed bottom-8 right-8 left-8 z-50 md:hidden">
          <button 
            onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full py-5 bg-primary-600 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"
          >
              <UserPlusIcon className="w-6 h-6 border-2 border-white/30 rounded-full p-0.5" />
              지금 바로 지원하기
          </button>
      </div>

    </div>
  )
}
