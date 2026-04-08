"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  WalletIcon, 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

import { shareToKakao } from '@/lib/kakao-share'

interface RewardWalletSuccessProps {
  referralCode: string;
  userName: string;
}

export default function RewardWalletSuccess({ referralCode, userName }: RewardWalletSuccessProps) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : ''

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = () => {
    shareToKakao({
        url: inviteUrl,
        title: '[인슈닷] 리워드 초대장 🎁',
        description: `${userName}님이 보험 전문가 상담을 추천합니다. 지금 신청하고 리워드 혜택도 받으세요!`,
        imageUrl: 'https://stroy.kr/og-image.png'
    })
  }

  return (
    <div className="flex flex-col items-center py-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </motion.div>

      <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">
        상담 신청 완료!
      </h3>
      <p className="text-gray-500 text-center mb-8 text-sm">
        {userName}님의 <span className="font-bold text-primary-600">리워드 지갑</span>이 생성되었습니다.
      </p>

      {/* Wallet Card Concept */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-primary-400" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Reward Wallet</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">{referralCode}</span>
        </div>

        <div className="mb-2">
          <span className="text-gray-400 text-xs font-medium">현재 포인트 잔액</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-white">0</span>
            <span className="text-xl font-bold text-primary-400">P</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-medium italic">누적 추천: 0회</span>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30"></div>
          </div>
        </div>
      </motion.div>

      {/* Invite Link Section */}
      <div className="w-full space-y-4">
        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">
          나의 초대 링크 (Share to earn 500P)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-gray-500 truncate flex items-center">
            {inviteUrl}
          </div>
          <button 
            onClick={handleCopy}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ClipboardIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
        >
          <ShareIcon className="w-5 h-5" />
          지인에게 링크 보내기 (500P 적립)
        </button>
      </div>

      <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed">
        위 링크를 통해 지인이 상담을 신청할 때마다<br />
        <span className="font-bold text-gray-600">500포인트</span>가 지갑에 즉시 쌓입니다.
      </p>
    </div>
  )
}
