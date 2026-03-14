'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { 
  UsersIcon, 
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Planner {
  id: string
  name: string
  phone: string
  affiliation: string
  region: string
  subscription_status: string
  created_at: string
}

export default function AdminPage() {
  const [planners, setPlanners] = useState<Planner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPlanners()
  }, [])

  const fetchPlanners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/planners')
      const result = await res.json()

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError(result.error || '관리자 권한이 없습니다.')
          // Remove auto-redirect for debugging
          // setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          throw new Error(result.error || '데이터를 불러오는데 실패했습니다.')
        }
        return
      }

      setPlanners(result.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const activeSubscribers = planners.filter(p => p.subscription_status === 'active').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-bold">관리자 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-500 font-medium mb-8">잠시 후 대시보드로 이동합니다.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Admin Console</h1>
              <p className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">System Management Tool</p>
            </div>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-sm font-black transition-all border border-gray-100"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            대시보드로 나가기
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">총 설계사</p>
              <h3 className="text-3xl font-black text-gray-900">{planners.length}명</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChartBarIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">유료 구독중</p>
              <h3 className="text-3xl font-black text-emerald-600">{activeSubscribers}명</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CurrencyDollarIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">예상 월 매출</p>
              <h3 className="text-3xl font-black text-gray-900">{(activeSubscribers * 29900).toLocaleString()}원</h3>
            </div>
          </div>
        </div>

        {/* User List Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">설계사 가입자 현황</h3>
            <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black rounded-full border border-gray-100">
              {new Date().toLocaleDateString('ko-KR')} 기준
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">이름 / 연락처</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">소속 / 지역</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">구독 상태</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">가입일</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {planners.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs font-medium text-gray-400 mt-0.5">{p.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-700 text-sm">{p.affiliation || '-'}</div>
                      <div className="text-xs font-medium text-gray-400 mt-0.5">{p.region || '-'}</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.subscription_status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {p.subscription_status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-xs font-bold text-gray-400 italic">
                        {new Date(p.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/p/${p.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-black hover:bg-primary-100 transition-all border border-primary-100 shadow-sm shadow-primary-100"
                      >
                        랜딩 페이지
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {planners.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-300 font-bold italic">가입된 설계사가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
