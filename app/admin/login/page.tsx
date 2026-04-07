'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function AdminLoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Clean phone number
    const cleanPhone = phone.replace(/-/g, '')
    const internalEmail = `${cleanPhone}@planner.stroy.kr`

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      })

      if (loginError) throw loginError

      // Upon successful login, the /admin page will handle the phone/admin check
      router.push('/admin')
    } catch (err: any) {
      setError('휴대폰 번호 또는 비밀번호가 올바르지 않거나 관리자 계정이 아닙니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Logo / Title Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-600 shadow-2xl shadow-primary-500/20 mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Admin Console</h1>
          <p className="text-slate-400 font-medium">시스템 관리자 로그인이 필요합니다.</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-slate-700/50">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Account (Phone)</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary-600/20 hover:bg-primary-500 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LockClosedIcon className="w-5 h-5" />
                  Access Console
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest transition-colors">
              Back to main site
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 text-center text-slate-600 space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.2em]">인터커스텀</p>
          <p className="text-[10px] font-bold opacity-60">사업자 등록번호: 207-30-62021</p>
        </div>
      </div>
    </main>
  )
}
