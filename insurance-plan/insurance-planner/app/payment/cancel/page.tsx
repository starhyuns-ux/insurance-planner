'use client'

import Link from 'next/link'

// 사용자가 카카오페이 결제창에서 "취소" 버튼을 눌렀을 때 리다이렉트되는 페이지
export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">결제가 취소되었습니다</h2>
        <p className="text-gray-500 mb-8">결제창에서 취소하셨습니다. 언제든지 다시 구독을 시작하실 수 있습니다.</p>
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
