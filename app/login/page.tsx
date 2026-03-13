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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Clean phone number
    const cleanPhone = email.replace(/-/g, '')
    const internalEmail = `${cleanPhone}@planner.stroy.kr`

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      })

      if (loginError) throw loginError

      router.push('/dashboard')
    } catch (err: any) {
      setError('휴대폰 번호 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2">설계사 로그인</h1>
            <p className="text-gray-500 text-sm">보험다이어트 대시보드에 접속합니다.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">휴대폰 번호</label>
              <input
                type="tel"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="010-1234-5678"
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

          <p className="mt-8 text-center text-sm text-gray-500">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="text-primary-600 font-bold hover:underline">
              지금 가입하기
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
