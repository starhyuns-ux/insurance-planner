'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { 
  UserCircleIcon, 
  UsersIcon, 
  CreditCardIcon, 
  ArrowRightOnRectangleIcon,
  CloudArrowUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

type Planner = {
  id: string
  name: string
  phone: string
  profile_image_url: string | null
  business_card_url: string | null
  subscription_status: 'active' | 'inactive'
}

type Customer = {
  id: string
  name: string
  address: string
  riders: string[]
  created_at: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'customers' | 'subscription'>('profile')
  const [planner, setPlanner] = useState<Planner | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Profile Edit State
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  // New Customer State
  const [newCustName, setNewCustName] = useState('')
  const [newCustAddr, setNewCustAddr] = useState('')
  const [newCustRiders, setNewCustRiders] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('planners')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setPlanner(profile)
      setEditName(profile.name)
      setEditPhone(profile.phone || '')
    }

    const { data: custs } = await supabase
      .from('customers')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: false })

    if (custs) setCustomers(custs)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const updateProfile = async () => {
    if (!planner) return
    const { error } = await supabase
      .from('planners')
      .update({ name: editName, phone: editPhone })
      .eq('id', planner.id)

    if (!error) {
      alert('프로필이 수정되었습니다.')
      checkUser()
    }
  }

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) return

    const { error } = await supabase
      .from('customers')
      .insert({
        planner_id: planner.id,
        name: newCustName,
        address: newCustAddr,
        riders: newCustRiders.split(',').map(r => r.trim()).filter(r => r !== '')
      })

    if (!error) {
      alert('고객 정보가 등록되었습니다.')
      setNewCustName('')
      setNewCustAddr('')
      setNewCustRiders('')
      checkUser()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 pb-20">
      <NavBar />
      
      <div className="flex-1 container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <h2 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">설계사 메뉴</h2>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'profile' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <UserCircleIcon className="w-6 h-6" />
              내 프로필
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'customers' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <UsersIcon className="w-6 h-6" />
              고객 정보 관리
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'subscription' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <CreditCardIcon className="w-6 h-6" />
              구독 현황
            </button>
            
            <div className="pt-8 border-t border-gray-200 mt-8">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                로그아웃
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">내 프로필 관리</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이름</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">연락처</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                      </div>
                      <button
                        onClick={updateProfile}
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                      >
                        저장하기
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">프로필 이미지 / 명함</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="aspect-[4/5] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary-300 transition-all gap-2">
                            <CloudArrowUpIcon className="w-8 h-8" />
                            <span className="text-xs font-bold font-sans">프로필 업로드</span>
                          </button>
                          <button className="aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary-300 transition-all gap-2 my-auto">
                            <CloudArrowUpIcon className="w-8 h-8" />
                            <span className="text-xs font-bold font-sans">명함 업로드</span>
                          </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-400 font-medium">PNG, JPG 파일을 업로드해 주세요.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-primary-900">내 공개 페이지 미리보기</h4>
                    <p className="text-sm text-primary-700">설계사님의 정보가 반영된 고유 주소입니다.</p>
                  </div>
                  <Link 
                    href={`/p/${planner?.id}`} 
                    target="_blank"
                    className="bg-white text-primary-600 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    페이지 열기
                  </Link>
                </div>
              </div>
            )}

            {/* Tab: Customers */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900">고객 정보 등록</h3>
                  </div>
                  <form onSubmit={addCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">고객명</label>
                      <input
                        type="text"
                        required
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="이름"
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">주소</label>
                      <input
                        type="text"
                        value={newCustAddr}
                        onChange={(e) => setNewCustAddr(e.target.value)}
                        placeholder="주소"
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">특약 사항 (콤마로 구분)</label>
                      <input
                        type="text"
                        value={newCustRiders}
                        onChange={(e) => setNewCustRiders(e.target.value)}
                        placeholder="암, 뇌혈관..."
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white p-4 rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      등록
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">내 고객 리스트</h3>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{customers.length}명</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left">
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">고객명</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">주소</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">주요 특약</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">등록일</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                              등록된 고객 정보가 없습니다.
                            </td>
                          </tr>
                        ) : (
                          customers.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5 font-bold text-gray-900">{c.name}</td>
                              <td className="px-8 py-5 text-gray-600 text-sm">{c.address || '-'}</td>
                              <td className="px-8 py-5">
                                <div className="flex flex-wrap gap-1.5">
                                  {c.riders.map((r, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{r}</span>
                                  ))}
                                  {c.riders.length === 0 && <span className="text-gray-400">-</span>}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-gray-400 text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Subscription */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">구독 정보</h3>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                          planner?.subscription_status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {planner?.subscription_status === 'active' ? '구독 중' : '미구독'}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black mb-2">프리미엄 설계사 플랜</h4>
                      <p className="text-gray-400 mb-8 font-medium">나만의 랜딩 페이지와 고객 관리 도구를 모두 이용해 보세요.</p>
                      
                      <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-950/20 hover:bg-primary-500 transition-all">
                        {planner?.subscription_status === 'active' ? '구독 정보 확인' : '지금 구독 시작하기 (월 29,900원)'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
