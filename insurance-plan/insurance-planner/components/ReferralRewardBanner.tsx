'use client'

import { useState } from 'react'
import { WalletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import RewardWalletModal from './RewardWalletModal'

export default function ReferralRewardBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!isVisible) return null

    return (
        <>
            <AnimatePresence>
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-lg"
                >
                    <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 bg-[length:200%_auto] animate-gradient-x text-white p-4 rounded-3xl shadow-2xl shadow-primary-200/50 flex items-center justify-between gap-4 border border-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <WalletIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm tracking-tight leading-tight">
                                    보험 초대하고 <span className="text-yellow-300">500P</span> 바로 받기!
                                </h4>
                                <p className="text-[11px] text-white/80 font-medium mt-0.5">
                                    지인이 상담 신청만 해도 지갑에 포인트 적립 🎁
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="px-5 py-2.5 bg-white text-primary-600 rounded-2xl text-[13px] font-black hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                            >
                                <WalletIcon className="w-4 h-4" />
                                리워드 지갑 열기
                            </button>
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 text-white/40 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <RewardWalletModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    )
}
