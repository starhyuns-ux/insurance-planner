'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ShareIcon, 
  CheckCircleIcon, 
  ClipboardIcon, 
  WalletIcon,
  GiftIcon 
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { shareToKakao } from '@/lib/kakao-share'

interface ReferralInfo {
    name: string;
    referral_code: string;
    points_balance: number;
    total_referrals: number;
}

export default function RewardWalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<'JOIN' | 'DASHBOARD'>('JOIN')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)

    // Check if user is already registered (using phone in localStorage)
    useEffect(() => {
        if (typeof window !== 'undefined' && isOpen) {
            const savedPhone = localStorage.getItem('guest_phone')
            if (savedPhone) {
                fetchMyInfo(savedPhone)
            }
        }
    }, [isOpen])

    const fetchMyInfo = async (p: string) => {
        try {
            const res = await fetch(`/api/guest/referral/me?phone=${p}`)
            const data = await res.json()
            if (data.success) {
                setReferralInfo(data.data)
                setStep('DASHBOARD')

                // Supabase 실시간 소켓 연결을 통해 포인트가 오를 때 자동(모션) 업데이트
                if (data.data.id) {
                    const { supabase } = await import('@/lib/supabaseClient')
                    
                    const channel = supabase
                        .channel('schema-db-changes')
                        .on(
                            'postgres_changes',
                            {
                                event: 'UPDATE',
                                schema: 'public',
                                table: 'guest_referrers',
                                filter: `id=eq.${data.data.id}`
                            },
                            (payload) => {
                                const newData = payload.new as ReferralInfo
                                setReferralInfo(prev => prev ? { 
                                    ...prev, 
                                    points_balance: newData.points_balance,
                                    total_referrals: newData.total_referrals
                                } : null)
                            }
                        )
                        .subscribe()

                    return () => {
                        supabase.removeChannel(channel)
                    }
                }
            }
        } catch (e) {
            console.error('Fetch info error:', e)
        }
    }

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !phone) return toast.error('이름과 전화번호를 입력해주세요.')
        
        setIsLoading(true)
        try {
            const res = await fetch('/api/guest/referral/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone })
            })
            const data = await res.json()
            
            if (data.success) {
                localStorage.setItem('guest_phone', phone)
                toast.success('리워드 지갑 생성 완료! 🎁')
                fetchMyInfo(phone)
            } else {
                toast.error(data.error || '오류가 발생했습니다.')
            }
        } catch (e) {
            toast.error('등록에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    const copyLink = () => {
        if (!referralInfo) return
        const link = `${window.location.origin}/?ref=${referralInfo.referral_code}`
        navigator.clipboard.writeText(link)
        toast.success('초대 링크가 복사되었습니다! 🔗')
    }

    const shareContent = () => {
        if (!referralInfo) return
        const link = `${window.location.origin}/?ref=${referralInfo.referral_code}`
        
        shareToKakao({
            url: link,
            title: '[인슈닷] 리워드 초대장 🎁',
            description: `${referralInfo.name}님이 보험 전문가 상담을 추천합니다. 지금 신청하고 리워드 혜택도 받으세요!`,
            imageUrl: 'https://stroy.kr/og-image.png'
        })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl z-20"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors z-30">
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <div className="p-8">
                        {step === 'JOIN' ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl mb-4">
                                        <WalletIcon className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">나의 리워드 지갑 열기</h2>
                                    <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                                        상담 신청할 지인을 초대해 보세요.<br className="hidden sm:block" />
                                        초대받은 분이 상담 신청 시 <span className="text-primary-600 font-bold">500P</span>가 즉시 쌓입니다.
                                    </p>
                                </div>

                                <form onSubmit={handleJoin} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">성함</label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="홍길동"
                                            className="w-full h-14 bg-gray-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary-600 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">연락처</label>
                                        <input 
                                            type="tel" 
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="010-1234-5678"
                                            className="w-full h-14 bg-gray-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-primary-600 transition-all"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-base hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-200"
                                    >
                                        {isLoading ? '지갑 확인 중...' : '나의 초대 링크 발급받기'}
                                        <ShareIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                                <p className="text-[11px] text-center text-gray-400 leading-relaxed font-medium">
                                    휴대폰 번호를 입력하시면 기존에 적립된 리워드를 바로 확인할 수 있습니다.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center mb-2">
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">나의 리워드 지갑</h2>
                                    <p className="text-gray-500 text-[11px] sm:text-sm mt-1 font-medium italic">
                                        {referralInfo?.name}님의 소중한 리워드 자산
                                    </p>
                                </div>

                                {/* Premium Wallet Card Design */}
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                     
                                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 sm:mb-10">
                                         <div className="flex items-center gap-2">
                                             <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                                 <WalletIcon className="w-5 h-5 text-primary-400" />
                                             </div>
                                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">InsuDot Reward Card</span>
                                         </div>
                                         <span className="text-[10px] font-mono text-gray-400/50 uppercase bg-white/5 px-2 py-1 rounded-md">{referralInfo?.referral_code}</span>
                                     </div>

                                     <div className="mb-2">
                                         <span className="text-gray-400 text-[10px] sm:text-xs font-medium">현재 리워드 잔액</span>
                                         <div className="flex items-baseline gap-1 mt-1">
                                             <span className="text-3xl sm:text-4xl font-black text-white">{(referralInfo?.points_balance ?? 0).toLocaleString()}</span>
                                             <span className="text-lg sm:text-xl font-bold text-primary-400">P</span>
                                         </div>
                                     </div>

                                     <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between">
                                         <span className="text-[10px] text-gray-500 font-medium italic">누적 성공 초대: {referralInfo?.total_referrals ?? 0}회</span>
                                         <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30"></div>
                                         </div>
                                     </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-[24px] space-y-4">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">나의 고유 초대 링크</label>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <code className="flex-1 text-[13px] font-bold text-primary-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                            stroy.kr/?ref={referralInfo?.referral_code}
                                        </code>
                                        <button onClick={copyLink} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                            <ClipboardIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={shareContent}
                                        className="w-full h-14 bg-primary-600 text-white rounded-2xl font-black text-[15px] hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                                    >
                                        <ShareIcon className="w-5 h-5" />
                                        카카오톡으로 공유하기
                                    </button>
                                </div>

                                <button 
                                    onClick={() => {
                                        if (confirm('다른 번호로 지갑을 확인하시겠습니까?')) {
                                            localStorage.removeItem('guest_phone')
                                            setStep('JOIN')
                                            setReferralInfo(null)
                                        }
                                    }}
                                    className="w-full text-center text-[11px] font-bold text-gray-300 hover:text-gray-500 transition-colors"
                                >
                                    다른 번호로 지갑 열기
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
