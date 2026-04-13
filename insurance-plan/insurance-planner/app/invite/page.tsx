'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, WalletCards, Users, Copy, CheckCircle2, ChevronRight, Phone, ShieldCheck, Landmark } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function InvitePage() {
  const { t } = useLanguage()
  const [step, setStep] = useState<'loading' | 'auth_request' | 'auth_verify' | 'dashboard'>('loading')
  
  // Auth Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [authError, setAuthError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Dashboard Data
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ totalPoints: 0, completedCount: 0, pendingCount: 0 })
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  // Bank Form
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [savingBank, setSavingBank] = useState(false)
  const [bankSuccess, setBankSuccess] = useState('')

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/guest/referrals/me')
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setStats(data.stats)
        setReferrals(data.referrals)
        setBankName(data.profile.bank_name || '')
        setBankAccount(data.profile.bank_account || '')
        setStep('dashboard')
      } else {
        setStep('auth_request')
      }
    } catch (err) {
      setStep('auth_request')
    }
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setSuccessMsg('')
    if (!name.trim() || !phone.trim()) {
      setAuthError('이름과 휴대폰 번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/guest/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(data.message)
        setStep('auth_verify')
      } else {
        setAuthError(data.error || '발송 실패')
      }
    } catch (err) {
      setAuthError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/guest/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, code })
      })
      const data = await res.json()
      if (res.ok) {
        // Successfully verified, fetch dashboard data
        await checkSession()
      } else {
        setAuthError(data.error || '인증 실패')
      }
    } catch (err) {
      setAuthError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const saveBankInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setBankSuccess('')
    if (!bankName || !bankAccount) return
    setSavingBank(true)
    try {
      const res = await fetch('/api/guest/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_name: bankName, bank_account: bankAccount })
      })
      if (res.ok) {
        setBankSuccess('계좌 정보가 안전하게 저장되었습니다.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingBank(false)
    }
  }

  const handleCopy = () => {
    const link = `${window.location.origin}/?ref=${profile?.referral_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-primary-600 pb-20 pt-16 px-6 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute top-40 -left-20 w-60 h-60 bg-white rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-xl mx-auto relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-black mb-3">
            지인 추천 리워드 프로그램
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-primary-100 font-medium whitespace-pre-line">
            {'추천 링크로 지인이 상담이나 가입을 완료하면\n현금처럼 쓸 수 있는 리워드를 드립니다.'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-12 relative z-20 space-y-6">
        <AnimatePresence mode="wait">
          {(step === 'auth_request' || step === 'auth_verify') && (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">간편 본인 인증</h2>
                <p className="text-sm text-gray-500">리워드 적립 및 링크 발급을 위해<br/>휴대폰 본인 인증을 진행해 주세요.</p>
              </div>

              {step === 'auth_request' ? (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">이름</label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="홍길동" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">휴대폰 번호 (- 없이)</label>
                    <input type="tel" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="01012345678" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all" />
                  </div>
                  {authError && <p className="text-red-500 text-xs font-medium ml-1">{authError}</p>}
                  <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4">
                    {loading ? '처리중...' : '인증번호 받기'}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-4">
                    * 테스트용 인증: 임의의 정보를 입력하고 인증번호로 '123456'을 입력하세요.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium text-center border border-green-100">{successMsg}</div>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">인증번호</label>
                    <input type="text" value={code} onChange={e=>setCode(e.target.value)} placeholder="인증번호 6자리" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all font-mono tracking-widest text-center text-lg" maxLength={6} />
                  </div>
                  {authError && <p className="text-red-500 text-xs font-medium ml-1 text-center">{authError}</p>}
                  <button type="submit" disabled={loading || code.length < 6} className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-colors disabled:opacity-50 mt-4">
                    {loading ? '확인중...' : '인증 완료'}
                  </button>
                  <button type="button" onClick={() => setStep('auth_request')} className="w-full py-3 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors">
                    이름/번호 다시 입력하기
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {step === 'dashboard' && profile && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">나의 누적 리워드</p>
                    <h2 className="text-3xl font-black text-gray-900 flex items-end gap-1">
                      {stats.totalPoints.toLocaleString()}<span className="text-lg text-primary-600 mb-1">원</span>
                    </h2>
                  </div>
                  <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <WalletCards className="w-7 h-7" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 py-3 px-4 rounded-2xl">
                    <p className="text-xs font-bold text-gray-500 mb-1">심사 진행중</p>
                    <p className="text-lg font-black text-gray-900">{stats.pendingCount}건</p>
                  </div>
                  <div className="bg-primary-50 py-3 px-4 rounded-2xl">
                    <p className="text-xs font-bold text-primary-600 mb-1">지급 완료</p>
                    <p className="text-lg font-black text-primary-900">{stats.completedCount}건</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 relative z-10">
                  <p className="text-xs font-bold text-gray-500 mb-3">내 고유 추천 링크</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium truncate">
                      {typeof window !== 'undefined' ? `${window.location.origin}/?ref=${profile.referral_code}` : ''}
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="bg-gray-900 text-white px-5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bank Account Settings */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="w-5 h-5 text-gray-900" />
                  <h3 className="font-bold text-gray-900">리워드 입금 계좌</h3>
                </div>
                <form onSubmit={saveBankInfo} className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" value={bankName} onChange={e=>setBankName(e.target.value)} placeholder="은행명 (예: 국민)" className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none" />
                    <input type="text" value={bankAccount} onChange={e=>setBankAccount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="계좌번호 (- 제외)" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none" />
                  </div>
                  {bankSuccess && <p className="text-xs text-green-600 font-medium ml-1">{bankSuccess}</p>}
                  <button type="submit" disabled={savingBank || !bankName || !bankAccount} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm">
                    {savingBank ? '저장중...' : '계좌 정보 저장'}
                  </button>
                </form>
              </div>

              {/* Referral History */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-gray-900" />
                  <h3 className="font-bold text-gray-900">초대 내역</h3>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full ml-auto">{referrals.length}명</span>
                </div>

                <div className="space-y-3">
                  {referrals.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium text-sm">아직 초대한 지인이 없습니다.</p>
                      <p className="text-gray-400 text-xs mt-1">링크를 공유하고 리워드를 받아보세요!</p>
                    </div>
                  ) : (
                    referrals.map(ref => (
                      <div key={ref.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">{ref.referee_name.substring(0,1)}O{ref.referee_name.length > 2 ? ref.referee_name.substring(2) : ''}</span>
                            <span className="text-xs text-gray-400 font-medium">{new Date(ref.created_at).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <span className="text-xs font-black bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full inline-block">
                            {ref.referee_type === 'SIGNUP' ? '설계사 가입' : '상담 신청'}
                          </span>
                        </div>
                        <div className="text-right">
                          {ref.status === 'PENDING' && <span className="text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full inline-block mb-1">심사중</span>}
                          {ref.status === 'APPROVED' && <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full inline-block mb-1">승인완료</span>}
                          {ref.status === 'PAID' && <span className="text-primary-600 font-bold text-sm bg-primary-50 px-3 py-1 rounded-full inline-block mb-1">지급완료</span>}
                          {ref.status === 'REJECTED' && <span className="text-gray-500 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full inline-block mb-1">반려</span>}
                          {ref.reward_amount > 0 && <p className="text-xs font-bold text-gray-900">+{ref.reward_amount.toLocaleString()}원</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="text-center pt-4">
                <button onClick={() => {
                  document.cookie = 'guest_session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
                  setStep('auth_request')
                  setProfile(null)
                }} className="text-xs font-bold text-gray-400 underline">로그아웃</button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
