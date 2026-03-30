'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [paymentInfo, setPaymentInfo] = useState<any>(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const pgToken = searchParams.get('pg_token')

    if (!orderId || !pgToken) {
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      setStatus('error')
      return
    }

    confirmPayment(orderId, pgToken)
  }, [searchParams])

  const confirmPayment = async (orderId: string, pgToken: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ orderId, pgToken })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || '결제 승인에 실패했습니다.')
        setStatus('error')
        return
      }

      setPaymentInfo(data)
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || '오류가 발생했습니다.')
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#FEE500] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-200 animate-pulse">
            <svg className="w-10 h-10 text-[#3C1E1E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.68 5.88 4.24 7.52L5.2 22l4.56-2.36c.72.16 1.48.24 2.24.24 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/>
            </svg>
          </div>
          <p className="text-gray-700 font-bold text-lg">결제를 처리하고 있습니다...</p>
          <p className="text-gray-400 text-sm mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border border-rose-100">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">결제 실패</h2>
          <p className="text-gray-500 mb-8">{errorMsg}</p>
          <Link href="/dashboard" className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const periodEnd = paymentInfo?.periodEnd
    ? new Date(paymentInfo.periodEnd).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border border-yellow-100">
        {/* 카카오페이 성공 아이콘 */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          <div className="w-24 h-24 bg-[#FEE500] rounded-full flex items-center justify-center shadow-xl shadow-yellow-200">
            <svg className="w-12 h-12 text-[#3C1E1E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.68 5.88 4.24 7.52L5.2 22l4.56-2.36c.72.16 1.48.24 2.24.24 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/>
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white shadow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-yellow-200">
          ✅ 카카오페이 결제 완료
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">구독이 시작되었습니다!</h2>
        <p className="text-gray-500 font-medium mb-8">프리미엄 서비스를 이용하실 수 있습니다.</p>

        {/* 결제 요약 */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">결제 금액</span>
            <span className="font-black text-gray-900 text-lg">{(paymentInfo?.amount || 5900).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">결제 수단</span>
            <span className="font-bold text-gray-700 text-sm">{paymentInfo?.cardInfo || '카카오페이'}</span>
          </div>
          {periodEnd && (
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-500 font-medium">다음 갱신일</span>
              <span className="font-black text-emerald-600">{periodEnd}</span>
            </div>
          )}
        </div>

        <Link
          href="/dashboard"
          className="block w-full bg-[#FEE500] text-[#3C1E1E] py-4 rounded-2xl font-black hover:bg-[#FADA0A] transition-all shadow-lg shadow-yellow-200 text-lg"
        >
          대시보드로 이동하기
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
