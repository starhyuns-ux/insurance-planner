'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Forgot password
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if input is a phone number (contains digits only or dashes)
    const isPhone = /^[0-9-]+$/.test(email)
    let loginEmail = email

    try {
      if (isPhone) {
        const cleanPhone = email.replace(/-/g, '')
        const withDashes = cleanPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
        
        console.log(`Attempting phone lookup for: ${cleanPhone}`)
        
        // 휴대폰 번호로 이메일 조회 시도 (실패하더라도 전체 로직이 멈추지 않도록 함)
        const { data: planners, error: lookupError } = await supabase
          .from('planners')
          .select('email')
          .or(`phone.eq.${cleanPhone},phone.eq.${withDashes}`)
        
        if (!lookupError && planners && planners.length > 0) {
          const foundEmail = planners.find(p => p.email)?.email
          if (foundEmail) {
            loginEmail = foundEmail
            console.log('Found email for phone:', loginEmail)
          }
        } else if (lookupError) {
          console.warn('Phone lookup skipped due to DB error or missing column:', lookupError.message)
          // DB 오류(컬럼 누락 등)가 있어도 입력값을 이메일로 간주하여 다음 단계 진행
        }
      }

      // 최종 로그인 시도
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      })
      
      if (loginError) {
        console.error('Final login error:', loginError)
        const msg = loginError.message
        if (msg.includes('Invalid login credentials')) {
          throw new Error('이메일(또는 번호)이나 비밀번호가 맞지 않습니다.')
        } else if (msg.includes('Email not confirmed')) {
          throw new Error('이메일 인증이 아직 완료되지 않았습니다.')
        } else if (msg.includes('User not found')) {
          throw new Error('가입되지 않은 계정입니다. 회원가입을 먼저 진행해 주세요.')
        }
        throw loginError
      }
      
      router.push('/dashboard')
    } catch (err: any) {
      console.error('LoginPage Catch Error:', err)
      setError(err.message || '로그인 중 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)

    if (!resetEmail) { setResetError('이메일 주소를 입력해주세요.'); setResetLoading(false); return }

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setResetLoading(false)
    if (error) {
      setResetError('비밀번호 재설정 이메일 발송에 실패했습니다. 올바른 이메일인지 확인해주세요.')
    } else {
      setResetSent(true)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {/* ── LOGIN MODE ── */}
          {mode === 'login' && (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">설계사 로그인</h1>
                <p className="text-gray-500 text-sm">보험다이어트 대시보드에 접속합니다.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">휴대폰 번호 또는 이메일</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="번호(010-...) 또는 이메일 입력"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">비밀번호</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
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
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {loading ? '로그인 중...' : '로그인하기'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  onClick={() => { setMode('forgot'); setResetError(null); setResetSent(false) }}
                  className="text-gray-400 hover:text-primary-600 font-medium transition-colors"
                >
                  비밀번호를 잊으셨나요?
                </button>
                <Link href="/signup" className="text-primary-600 font-bold hover:underline">
                  신규 가입
                </Link>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD MODE ── */}
          {mode === 'forgot' && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">비밀번호 재설정</h1>
                <p className="text-gray-500 text-sm">가입 시 사용한 이메일 주소를 입력하세요.</p>
              </div>

              {resetSent ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                    <p className="text-green-700 font-bold mb-1">이메일을 확인해주세요</p>
                    <p className="text-green-600 text-sm">비밀번호 재설정 링크가 이메일로 발송되었습니다.<br />받은 편지함(또는 스팸함)을 확인해 주세요.</p>
                  </div>
                  <button
                    onClick={() => setMode('login')}
                    className="text-sm text-primary-600 font-bold hover:underline"
                  >
                    ← 로그인으로 돌아가기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">가입 시 이메일 주소</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                    />
                  </div>

                  {resetError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-sm font-medium">
                      {resetError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-base shadow-lg hover:bg-primary-700 transition-all disabled:opacity-50"
                  >
                    {resetLoading ? '처리 중...' : '비밀번호 재설정 요청'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium py-2 transition-colors"
                  >
                    ← 로그인으로 돌아가기
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
