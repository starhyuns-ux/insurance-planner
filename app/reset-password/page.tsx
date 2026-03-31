'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inputPhone, setInputPhone] = useState('')
  const [registeredPhone, setRegisteredPhone] = useState<string | null>(null)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase 비밀번호 재설정 링크로 들어오면 세션이 자동으로 설정되어 있어야 함
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('유효하지 않거나 만료된 비밀번호 재설정 링크입니다. 다시 시도해 주세요.')
        return
      }
      
      // 1. planners 테이블에서 먼저 조회 시도
      const { data: planner, error: plannerError } = await supabase
        .from('planners')
        .select('phone')
        .eq('id', session.user.id)
        .single()
      
      let foundPhone = planner?.phone

      // 2. 만약 planners에 없거나 조회 실패 시 가입 시 생성된 user_metadata에서 조회
      if (!foundPhone && session.user.user_metadata?.phone) {
        foundPhone = session.user.user_metadata.phone
      }
      
      if (foundPhone) {
        setRegisteredPhone(foundPhone)
      } else {
        console.error('Failed to fetch planner info:', plannerError)
        setError('설계사 정보를 불러올 수 없어 본인 확인이 불가합니다. 이메일 링크를 다시 발급해 주세요.')
      }
    }
    checkSession()
  }, [])

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!registeredPhone) {
      setError('가입 정보를 불러올 수 없습니다. 고객센터에 문의해 주세요.')
      return
    }

    const cleanInput = inputPhone.replace(/-/g, '')
    const cleanRegistered = registeredPhone.replace(/-/g, '')

    if (cleanInput === cleanRegistered) {
      setIsPhoneVerified(true)
      setError(null)
    } else {
      setError('입력하신 휴대폰 번호가 가입 시 등록한 정보와 일치하지 않습니다.')
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2">비밀번호 재설정</h1>
            <p className="text-gray-500 text-sm">본인 확인을 위해 정보를 입력해 주세요.</p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <p className="text-green-700 font-bold mb-1">비밀번호가 변경되었습니다</p>
                <p className="text-green-600 text-sm">3초 후 로그인 페이지로 이동합니다.</p>
              </div>
            </div>
          ) : !isPhoneVerified ? (
            <form onSubmit={handleVerifyPhone} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">가입 시 등록한 휴대폰 번호</label>
                <input
                  type="tel"
                  required
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-gray-800 transition-all"
              >
                본인 확인하기
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="bg-primary-50 text-primary-700 px-4 py-3 rounded-2xl text-sm font-bold mb-4 text-center">
                본인 확인이 완료되었습니다. 새 비밀번호를 입력해 주세요.
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">새 비밀번호</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 입력"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">비밀번호 확인</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                {loading ? '변경 중...' : '비밀번호 변경하기'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
