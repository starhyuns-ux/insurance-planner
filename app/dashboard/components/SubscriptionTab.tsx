'use client'

import React, { useState, useEffect } from 'react'
import { 
  CreditCardIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'

interface SubscriptionTabProps {
  planner: { 
    id: string; 
    name: string; 
    subscription_status: string 
  } | null
}

export default function SubscriptionTab({ planner }: SubscriptionTabProps) {
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  const fetchPaymentHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/payment/history', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPayments(data.data || [])
      }
    } catch (e) {
      console.error('Failed to fetch payment history:', e)
    } finally {
      setLoadingPayments(false)
    }
  }

  const handlePayment = async () => {
    if (!planner || checkingOut) return
    setCheckingOut(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { alert('로그인이 필요합니다.'); return }

      const prepRes = await fetch('/api/payment/prepare', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const prepData = await prepRes.json()
      if (!prepRes.ok) throw new Error(prepData.error || '결제 준비 실패')

      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      const redirectUrl = isMobile ? prepData.mobileRedirectUrl : prepData.redirectUrl
      if (!redirectUrl) throw new Error('결제 URL을 받지 못했습니다.')

      window.location.href = redirectUrl
    } catch (err: any) {
      alert(err.message || '결제 중 오류가 발생했습니다.')
      setCheckingOut(false)
    }
  }

  const isActive = planner?.subscription_status === 'active'
  const latestPayment = payments.find(p => p.status === 'DONE')
  const periodEnd = latestPayment?.period_end
    ? new Date(latestPayment.period_end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const daysLeft = latestPayment?.period_end
    ? Math.max(0, Math.ceil((new Date(latestPayment.period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const FEATURES = [
    { icon: '🏢', label: '디지털 명함 & 랜딩페이지' },
    { icon: '👥', label: '고객 관리 (무제한)' },
    { icon: '📅', label: '일정 캘린더 & 할일 관리' },
    { icon: '📋', label: '보험청구 자동화 서비스' },
    { icon: '📊', label: '상담 신청 실시간 알림' },
    { icon: '🎁', label: '친구 추천 리워드 시스템' },
    { icon: '💬', label: '1:1 채팅 & 카카오톡 연동' },
    { icon: '📌', label: '자유게시판 & 공지사항' },
  ]

  return (
    <div className="space-y-6">
      {/* 현재 구독 상태 카드 */}
      <div className={`rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-500 shadow-2xl ${
        isActive
          ? 'bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-950 text-white'
          : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
      }`}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                {isActive ? (
                  <span className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-emerald-500/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Subscription Active
                  </span>
                ) : (
                  <span className="px-5 py-2 bg-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
                    Not Subscribed
                  </span>
                )}
                <span className="px-5 py-2 bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border border-white/10">
                  Premium Planner
                </span>
              </div>

              <h3 className="text-4xl font-black mb-2 tracking-tight">당신의 성공을 위한<br/>프리미엄 설계사 플랜</h3>
              <p className="text-white/50 font-medium text-lg mb-8 leading-relaxed">
                {isActive
                  ? '모든 핵심 기능을 제한 없이 사용하고 계십니다.'
                  : '매월 커피 한 잔 가격으로 스마트한 영업 시스템을 구축하세요.'}
              </p>

              {/* 구독 정보 (활성일 때) */}
              {isActive && (
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-4 bg-white/5 rounded-3xl backdrop-blur-3xl border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Renewal Date</p>
                    <p className="text-xl font-black text-white">{periodEnd || '—'}</p>
                  </div>
                  <div className="px-6 py-4 bg-white/5 rounded-3xl backdrop-blur-3xl border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Days Remaining</p>
                    <p className="text-xl font-black text-emerald-400">{daysLeft} Days</p>
                  </div>
                </div>
              )}
            </div>

            {/* 가격 + 결제 버튼 */}
            <div className="flex flex-col items-center gap-6 xl:items-end bg-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 shadow-2xl">
              <div className="text-center xl:text-right">
                <p className="text-white/30 text-sm font-black line-through mb-1 uppercase tracking-widest">Normal 29,900 KRW</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">5,900</span>
                  <span className="text-white/60 font-black text-xl uppercase tracking-widest">원/월</span>
                </div>
                <div className="mt-2 inline-block px-3 py-1 bg-primary-500 rounded-lg text-[10px] font-black text-white uppercase tracking-widest animate-pulse">
                  Early Bird Special
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={checkingOut}
                className={`w-full xl:w-72 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 whitespace-nowrap active:scale-95 ${
                  checkingOut
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FADA0A] hover:-translate-y-1 shadow-yellow-500/20'
                }`}
              >
                {checkingOut ? (
                  <div className="w-6 h-6 border-4 border-[#3C1E1E]/20 border-t-[#3C1E1E] rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.68 5.88 4.24 7.52L5.2 22l4.56-2.36c.72.16 1.48.24 2.24.24 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/>
                    </svg>
                    {isActive ? '플랜 연장하기' : '지금 바로 시작하기'}
                  </>
                )}
              </button>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Secure Payment by KakaoPay</p>
            </div>
          </div>
        </div>
      </div>

      {/* 플랜 포함 기능 */}
      <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-gray-100">
        <h4 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Premium Features Matrix</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 bg-gray-50 rounded-3xl border border-transparent hover:bg-white hover:border-primary-100 hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <span className="text-4xl group-hover:scale-125 transition-transform origin-left">{feat.icon}</span>
              <span className="text-sm font-black text-gray-800 group-hover:text-primary-700 leading-snug">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 내역 */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Billing History</h4>
          <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest">Transactions</span>
        </div>

        {loadingPayments ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Fetching payment data...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CreditCardIcon className="w-12 h-12 text-gray-200" />
            </div>
            <p className="text-gray-400 font-black text-lg">결제 내역이 존재하지 않습니다.</p>
            <p className="text-gray-300 text-sm mt-2 font-medium">구독을 시작하면 모든 결제 이력이 여기에 기록됩니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Billing Date</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Amount</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Service Period</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6 text-sm font-black text-gray-900">
                      {p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString('ko-KR')
                        : new Date(p.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-10 py-6">
                      <p className="font-black text-gray-900 text-sm">보험 플래너 프리미엄 정기 구독</p>
                      {p.card_company && (
                        <p className="text-[10px] text-primary-500 font-bold mt-1 uppercase tracking-widest">{p.card_company} 카드 결제 {p.card_number ? `(•••• ${p.card_number.slice(-4)})` : ''}</p>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right font-black text-gray-900 text-lg">
                      {(p.amount || 5900).toLocaleString()}원
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`inline-flex px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm ${
                        p.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        p.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-500 border border-rose-100'
                      }`}>
                        {p.status === 'DONE' ? 'Payment Done' : p.status === 'PENDING' ? 'Processing' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-gray-500">
                      {p.period_start && p.period_end
                        ? `${new Date(p.period_start).toLocaleDateString('ko-KR')} ~ ${new Date(p.period_end).toLocaleDateString('ko-KR')}`
                        : 'Lifetime Access'}
                    </td>
                    <td className="px-10 py-6 text-right">
                      {p.receipt_url && (
                        <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-primary-600 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 hover:bg-primary-100 transition-all shadow-sm">
                          Receipt
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
