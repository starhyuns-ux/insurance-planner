'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || '결제에 실패했습니다.'
  const code = searchParams.get('code')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border border-rose-100">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">결제 실패</h2>
        <p className="text-gray-500 mb-2">{message}</p>
        {code && <p className="text-xs text-gray-300 mb-8 font-mono">코드: {code}</p>}
        <Link
          href="/dashboard"
          className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  )
}
