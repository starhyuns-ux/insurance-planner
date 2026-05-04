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
  CurrencyDollarIcon,
  GiftIcon,
  GlobeAltIcon,
  CursorArrowRaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Planner {
  id: string
  name: string
  phone: string
  affiliation: string
  region: string
  subscription_status: string
  visit_count: number
  created_at: string
}

interface Referral {
  id: string
  referrer_id: string
  referee_name: string
  referee_phone: string
  referee_type: 'CONSULTATION' | 'SIGNUP'
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'
  reward_amount: number
  created_at: string
  planners?: {
    id: string
    name: string
    phone: string
    affiliation: string
  }
  guest_referrers?: {
    id: string
    name: string
    phone: string
    bank_name: string
    bank_account: string
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'planners' | 'referrals' | 'fax'>('planners')
  const [planners, setPlanners] = useState<Planner[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [siteVisits, setSiteVisits] = useState({ today: 0, total: 0 })

  // Fax Form State
  const [faxForm, setFaxForm] = useState({
    receiverNum: '',
    receiverName: '',
    senderName: '인슈닷 관리자',
    senderNum: '010-6303-5561',
    file: null as File | null
  })
  const [faxSending, setFaxSending] = useState(false)
  const [faxResult, setFaxResult] = useState<string | null>(null)
  const [faxHistory, setFaxHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPlanners()
    fetchReferrals()
    fetchSiteVisits()
  }, [])

  useEffect(() => {
    if (activeTab === 'fax') fetchFaxHistory()
  }, [activeTab])

  const fetchFaxHistory = async () => {
    try {
      setLoadingHistory(true)
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/fax/history', {
        headers: { 'Authorization': session ? `Bearer ${session.access_token}` : '' }
      })
      const result = await res.json()
      if (res.ok) setFaxHistory(result.data || [])
    } catch (err) {
      console.error('Failed to fetch fax history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchSiteVisits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/site-visits', {
        headers: { 'Authorization': session ? `Bearer ${session.access_token}` : '' }
      })
      const result = await res.json()
      if (res.ok && result.data) {
        setSiteVisits(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch site visits:', err)
    }
  }

  const fetchReferrals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/referrals', {
        headers: { 'Authorization': session ? `Bearer ${session.access_token}` : '' }
      })
      const result = await res.json()
      if (res.ok) setReferrals(result.data || [])
    } catch (err) {
      console.error('Failed to fetch referrals:', err)
    }
  }

  const fetchPlanners = async () => {
    try {
      setLoading(true)
      
      // Get session for token
      const { data: { session } } = await supabase.auth.getSession()
      
      const res = await fetch('/api/admin/planners', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        }
      })
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

  const updateReferralStatus = async (id: string, newStatus: string, amount: number) => {
    if (!confirm(`이 추천 내역의 상태를 '${newStatus}'(으)로 변경하시겠습니까? (적립 예정금액: ${amount.toLocaleString()}원)`)) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/admin/referrals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ status: newStatus, reward_amount: amount })
      })
      const result = await res.json()
      
      if (!res.ok) throw new Error(result.error || '상태 변경 중 오류가 발생했습니다.')
      
      alert('상태가 성공적으로 변경되었습니다.')
      fetchReferrals() // Refresh list
    } catch (err: any) {
      alert(err.message)
    }
  }

  const updatePlannerStatus = async (plannerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'Inactive' : 'active'
    if (!confirm(`이 설계사의 상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/planners', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ planner_id: plannerId, status: newStatus })
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || '상태 변경 중 오류가 발생했습니다.')
      }

      alert('상태가 성공적으로 변경되었습니다.')
      fetchPlanners() // Refresh list
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSendFax = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faxForm.receiverNum || !faxForm.file) {
      alert('팩스 번호와 PDF 파일을 선택해주세요.')
      return
    }

    try {
      setFaxSending(true)
      setFaxResult(null)
      const { data: { session } } = await supabase.auth.getSession()
      
      const formData = new FormData()
      formData.append('receiverNum', faxForm.receiverNum)
      formData.append('receiverName', faxForm.receiverName)
      formData.append('senderName', faxForm.senderName)
      formData.append('senderNum', faxForm.senderNum)
      formData.append('file', faxForm.file)

      const res = await fetch('/api/admin/fax/transmit', {
        method: 'POST',
        headers: { 'Authorization': session ? `Bearer ${session.access_token}` : '' },
        body: formData
      })
      const result = await res.json()
      
      if (!res.ok) throw new Error(result.error || '팩스 전송 실패')
      
      setFaxResult(`전송 성공! 접수번호: ${result.receiptId}`)
      setFaxForm({ ...faxForm, receiverNum: '', receiverName: '', file: null })
      alert('팩스 전송 요청이 완료되었습니다.')
      fetchFaxHistory() // Refresh history
    } catch (err: any) {
      alert(err.message)
    } finally {
      setFaxSending(false)
    }
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
              <h3 className="text-3xl font-black text-gray-900">{(activeSubscribers * 5900).toLocaleString()}원</h3>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-lg shadow-indigo-100 flex items-center gap-6 group hover:scale-[1.02] transition-all text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">총 명함 조회수</p>
              <h3 className="text-3xl font-black">{planners.reduce((acc, p) => acc + (p.visit_count || 0), 0).toLocaleString()}회</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CursorArrowRaysIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">오늘 홈페이지 방문 (유입)</p>
              <h3 className="text-3xl font-black text-rose-600">{siteVisits.today.toLocaleString()}명</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <GlobeAltIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">총 홈페이지 누적 유입</p>
              <h3 className="text-3xl font-black text-purple-600">{siteVisits.total.toLocaleString()}명</h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('planners')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'planners' 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            설계사 가입자 현황
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'referrals' 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <GiftIcon className="w-5 h-5" />
            친구추천 리워드 관리
            {referrals.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[10px] ml-1">
                {referrals.filter(r => r.status === 'PENDING').length}건 대기
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fax')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              activeTab === 'fax' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            수동 팩스 전송
          </button>
        </div>

        {/* User List Table */}
        {activeTab === 'planners' && (
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
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">조회수</th>
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
                      <button 
                        onClick={() => updatePlannerStatus(p.id, p.subscription_status)}
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
                        p.subscription_status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-gray-100 text-gray-400 border border-transparent'
                      }`}>
                        {p.subscription_status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-xs font-bold text-gray-400 italic">
                        {new Date(p.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-[14px] font-black text-primary-600">
                        {(p.visit_count || 0).toLocaleString()}
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
        )}

        {/* Referrals List Table */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">친구추천 리워드 내역</h3>
              <div className="flex gap-3 text-xs font-bold">
                <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg">심사대기: {referrals.filter(r => r.status === 'PENDING').length}건</span>
                <span className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg">지급완료: {referrals.filter(r => r.status === 'PAID').length}건</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">신청일 / 추천인(설계사)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">추천 대상 (이름/연락처)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">유형</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">상태</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">상태 변경 (적립/지급)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="text-xs font-bold text-gray-400 mb-1">{new Date(r.created_at).toLocaleDateString()}</div>
                        <div className="font-black text-gray-900">
                          {r.planners ? (
                            <>{r.planners.name} <span className="text-xs font-medium text-gray-400 ml-1">설계사</span></>
                          ) : r.guest_referrers ? (
                            <>{r.guest_referrers.name} <span className="text-xs font-medium text-amber-500 ml-1">비회원</span></>
                          ) : (
                            '알 수 없음'
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900">{r.referee_name}</div>
                        <div className="text-xs font-mono text-gray-500 mt-0.5">{r.referee_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          r.referee_type === 'SIGNUP' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {r.referee_type === 'SIGNUP' ? '플래너 가입' : '무료 상담'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {r.status === 'PENDING' && <span className="text-amber-500 font-black text-[11px] bg-amber-50 px-3 py-1.5 rounded-full">심사중 (대기)</span>}
                        {r.status === 'APPROVED' && <span className="text-emerald-500 font-black text-[11px] bg-emerald-50 px-3 py-1.5 rounded-full">적립완료 (지급대기)</span>}
                        {r.status === 'PAID' && <span className="text-primary-600 font-black text-[11px] bg-primary-50 px-3 py-1.5 rounded-full">지급/발송완료</span>}
                        {r.status === 'REJECTED' && <span className="text-gray-400 font-black text-[11px] bg-gray-100 px-3 py-1.5 rounded-full">반려됨</span>}
                        
                        {r.reward_amount > 0 && <div className="text-[10px] font-bold text-rose-500 mt-1">+{r.reward_amount.toLocaleString()}원</div>}
                      </td>
                      <td className="px-8 py-5 text-right space-x-2">
                        {r.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateReferralStatus(r.id, 'APPROVED', r.referee_type === 'SIGNUP' ? 50000 : 5000)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-black hover:bg-emerald-600 transition-colors">
                              승인 (적립)
                            </button>
                            <button onClick={() => updateReferralStatus(r.id, 'REJECTED', 0)} className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-black hover:bg-gray-300 transition-colors">
                              반려
                            </button>
                          </>
                        )}
                        {r.status === 'APPROVED' && (
                          <>
                            <button onClick={() => updateReferralStatus(r.id, 'PAID', r.reward_amount)} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-black hover:bg-primary-700 transition-colors">
                              지급 완료
                            </button>
                            <button onClick={() => updateReferralStatus(r.id, 'PENDING', 0)} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">
                              대기 취소
                            </button>
                          </>
                        )}
                        {(r.status === 'PAID' || r.status === 'REJECTED') && (
                          <button onClick={() => updateReferralStatus(r.id, 'PENDING', 0)} className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">
                            상태 초기화
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {referrals.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-gray-300 font-bold italic">추천 이력이 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Manual Fax Tab */}
        {activeTab === 'fax' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-10 border-b border-gray-50 bg-indigo-50/30">
                <h3 className="text-2xl font-black text-gray-900 mb-2">수동 팩스 전송</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  임의의 수신번호로 PDF 문서를 전송할 수 있습니다.<br />
                  전송된 결과는 팝빌 관리자 페이지에서 확인 가능합니다.
                </p>
              </div>

              <form onSubmit={handleSendFax} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">수신 번호 (필수)</label>
                    <input 
                      type="tel"
                      placeholder="02-1234-5678"
                      required
                      value={faxForm.receiverNum}
                      onChange={(e) => setFaxForm({...faxForm, receiverNum: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">수신자 성함</label>
                    <input 
                      type="text"
                      placeholder="보상팀 담당자"
                      value={faxForm.receiverName}
                      onChange={(e) => setFaxForm({...faxForm, receiverName: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">발신자 명칭</label>
                    <input 
                      type="text"
                      value={faxForm.senderName}
                      onChange={(e) => setFaxForm({...faxForm, senderName: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">발신 번호</label>
                    <input 
                      type="tel"
                      value={faxForm.senderNum}
                      onChange={(e) => setFaxForm({...faxForm, senderNum: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">파일 선택 (PDF, JPG, PNG)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf,image/jpeg,image/png,image/jpg"
                      required
                      onChange={(e) => setFaxForm({...faxForm, file: e.target.files?.[0] || null})}
                      className="w-full px-5 py-10 bg-indigo-50/50 border-2 border-dashed border-indigo-100 rounded-[2rem] text-sm font-bold text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:border-indigo-300 transition-all"
                    />
                  </div>
                </div>

                {faxResult && (
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-center text-sm font-black border border-emerald-100">
                    {faxResult}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={faxSending}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {faxSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                      팩스 전송하기
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Fax History Table */}
            <div className="mt-12 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">최근 전송 내역</h3>
                <button 
                  onClick={fetchFaxHistory}
                  disabled={loadingHistory}
                  className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <ClockIcon className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">전송일시</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">수신처</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">상태</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">접수번호</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {faxHistory.map((fax) => (
                      <tr key={fax.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="text-xs font-bold text-gray-900">{new Date(fax.created_at).toLocaleString('ko-KR')}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-black text-gray-900">{fax.receiver_num}</div>
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5">{fax.receiver_name || '-'}</div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          {fax.status === 'SUCCESS' && <span className="text-emerald-500 font-black text-[11px] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">수신완료</span>}
                          {fax.status === 'FAIL' && <span className="text-rose-500 font-black text-[11px] bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100" title={fax.error_message}>전송실패</span>}
                          {fax.status === 'SENT' && <span className="text-indigo-500 font-black text-[11px] bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 animate-pulse">전송중</span>}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <code className="text-[10px] font-mono bg-gray-50 px-2 py-1 rounded text-gray-400">{fax.receipt_id}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {faxHistory.length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-gray-300 font-bold italic">전송 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
