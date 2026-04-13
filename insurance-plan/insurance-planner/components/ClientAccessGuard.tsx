'use client'

import { useAttribution } from '@/lib/attribution'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/solid'

interface ClientAccessGuardProps {
  children: React.ReactNode
}

export default function ClientAccessGuard({ children }: ClientAccessGuardProps) {
  const { planner, loading: attrLoading } = useAttribution()
  const { planner: loggedInPlanner, loading: plannerLoading } = usePlanner()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || attrLoading || plannerLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Allow access if planner is attributed OR if a planner is logged in
  const hasAccess = !!planner || !!loggedInPlanner

  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center">
          <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <LockClosedIcon className="w-10 h-10 text-rose-500" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">접근 제한 안내</h2>
          
          <p className="text-gray-500 font-bold mb-10 leading-relaxed break-keep">
            이 페이지는 설계사가 공유한 <span className="text-primary-600">개인 명함 링크</span>를 통해서만 이용 가능합니다. 
            상담받으신 설계사님께 링크 요청을 부탁드립니다.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/" 
              className="bg-gray-900 text-white py-4 px-8 rounded-2xl font-black shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-1"
            >
              홈으로 이동하기
            </Link>
            <Link 
              href="/login" 
              className="text-gray-400 font-bold py-2 text-sm hover:text-gray-600 transition-colors"
            >
              설계사 로그인
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
