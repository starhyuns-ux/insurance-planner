'use client'

import { useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import ReferralGuideView from '@/components/ReferralGuideView'
import RewardWalletModal from '@/components/RewardWalletModal'
import { motion } from 'framer-motion'
import { WalletIcon } from '@heroicons/react/24/outline'

export default function ReferralGuidePage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <main className="min-h-screen bg-white">
            <NavBar />
            
            <div className="pt-20">
                <ReferralGuideView onStart={() => setIsModalOpen(true)} />
            </div>

            {/* Sticky Bottom Call to Action for Mobile */}
            <div className="fixed bottom-0 left-0 w-full p-4 md:hidden z-[110]">
                <motion.button 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-gray-400/20"
                >
                    <WalletIcon className="w-6 h-6 text-primary-400" />
                    나의 리워드 지갑 열기
                </motion.button>
            </div>

            <Footer />

            <RewardWalletModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </main>
    )
}
