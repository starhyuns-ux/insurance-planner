'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSocialLogin = async (provider: any) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(`${provider} 로그인 중 오류가 발생했습니다.`)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Clean phone number: remove dashes
    const cleanPhone = phone.replace(/-/g, '')
    // Internally use phone@planner.stroy.kr as the email for Supabase Auth
    const internalEmail = `${cleanPhone}@planner.stroy.kr`

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: {
          data: {
            name,
            phone: cleanPhone,
            affiliation,
            region,
            referrer_code: typeof window !== 'undefined' ? localStorage.getItem('referral_code') : null
          }
        }
      })

      if (signUpError) throw signUpError

      if (user) {
        alert('회원가입이 완료되었습니다! 휴대폰 번호로 로그인해 주세요.')
        router.push('/login')
      }
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.')
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">설계사 전용 가입</h1>
            <p className="text-gray-500 text-sm">보험다이어트 플래너로 등록하고 나만의 페이지를 만드세요.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">휴대폰 번호 (로그인 ID)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">소속</label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="예: 삼성생명"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">지역</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="예: 서울 강남구"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">비밀번호</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력"
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
              {loading ? '가입 중...' : '회원가입 완료하기'}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-bold">또는 소셜 계정으로 시작하기</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-600"
            >
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="flex items-center justify-center py-3.5 bg-[#FEE500] rounded-2xl hover:opacity-90 transition-all font-bold text-sm text-[#000000]"
            >
              Kakao
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary-600 font-bold hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
