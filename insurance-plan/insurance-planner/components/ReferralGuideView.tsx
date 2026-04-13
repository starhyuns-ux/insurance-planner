'use client'

import { motion } from 'framer-motion'
import { GiftIcon, ShareIcon, SparklesIcon, TrophyIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

const steps = [
    {
        title: "상담 신청 및 지갑 생성",
        description: "전문가 상담 신청 후 본인만의 리워드 지갑을 확인하세요.",
        icon: RocketLaunchIcon,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "초대 링크 공유",
        description: "지갑에 있는 나의 고유 초대 링크를 지인에게 보냅니다.",
        icon: ShareIcon,
        color: "bg-indigo-50 text-indigo-600"
    },
    {
        title: "지인 상담 신청",
        description: "공유받은 지인이 본인의 정보를 입력해 상담을 신청하면 끝!",
        icon: TrophyIcon,
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "리워드 즉시 적립",
        description: "지인 신청 즉시 500P가 내 지갑에 차곡차곡 쌓입니다.",
        icon: GiftIcon,
        color: "bg-rose-50 text-rose-600"
    }
]

export default function ReferralGuideView({ onStart }: { onStart?: () => void }) {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 font-black text-xs uppercase tracking-widest mb-6"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        인슈닷 추천 리워드 프로그램
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight"
                    >
                        보험 고민 나누고<br />
                        <span className="text-primary-600">포인트 혜택</span>까지 챙기세요
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-gray-500 font-medium text-lg"
                    >
                        주변 분들에게 검증된 보험 전문가를 소개해 보세요.<br className="hidden md:block" />
                        감사의 마음을 담아 실질적인 보상을 드립니다.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-[28%] left-0 w-full h-px border-t-2 border-dashed border-gray-100 -z-10" />
                    
                    {steps.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className={`w-20 h-20 ${step.color} rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-gray-50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
                                <step.icon className="w-10 h-10" />
                            </div>
                            <div className="absolute top-0 right-[20%] w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center font-black text-xs text-gray-300 shadow-sm">
                                {idx + 1}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{step.title}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px]">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 p-8 md:p-12 bg-gray-900 rounded-[48px] text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <UserGroupIcon className="w-64 h-64" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-lg">
                            <h3 className="text-3xl font-black tracking-tight mb-4 leading-tight">
                                소중한 지인을 위한 보험 초대장,<br />
                                <span className="text-primary-400">나의 리워드 지갑과 함께 하세요</span>
                            </h3>
                            <p className="text-white/60 font-medium leading-relaxed">
                                보험 고민이 있는 지인에게 검증된 전문가를 초대해 보세요.<br />
                                초대받은 지인이 상담을 신청할 때마다 감사의 마음을 담아 포인트를 드립니다.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="px-4 py-2 bg-white/10 rounded-2xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                                    <span className="text-sm font-bold">누구나 상시 참여 가능</span>
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-2xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                    <span className="text-sm font-bold">상담 신청 즉시 500P 적립</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0">
                            <button 
                                onClick={onStart}
                                className="px-10 py-5 bg-white text-gray-900 rounded-[28px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-2"
                            >
                                <GiftIcon className="w-6 h-6 text-primary-600" />
                                지금 바로 시작하기
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
