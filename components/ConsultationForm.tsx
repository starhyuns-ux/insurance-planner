"use client"

import { useState } from 'react'

interface ConsultationFormProps {
  id?: string;
}

export default function ConsultationForm({ id = "consultation" }: ConsultationFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name.trim()) {
      setError('이름을 입력해주세요.')
      return
    }
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/
    if (!phone.replace(/-/g, '').match(phoneRegex)) {
      setError('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)')
      return
    }
    if (!agree) {
      setError('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phone.replace(/-/g, ''), // Save without dashes
          meta: { source: 'landing_page_bottom_form' }
        })
      })

      const data = await res.json()

      if (data.success) {
        // 성공 시 클립보드 복사(선택적) 또는 카카오톡 안내 후 이동
        alert('상담 신청이 접수되었습니다! ✅\n\n조금 더 빠른 상담 진행을 위해\n[카카오톡 1:1 채팅방]으로 바로 이동합니다.')

        // Form reset
        setName('')
        setPhone('')
        setAgree(false)

        // 이동 (오픈채팅 채널 링크로 리다이렉트)
        window.location.href = 'https://open.kakao.com/o/sdWFlvYh'
      } else {
        setError(data.error || '접수 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      console.error(err)
      setError('서버와 통신 중 문제가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto hyphen for phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '')
    if (val.length > 3 && val.length <= 7) {
      val = val.replace(/(\d{3})(\d+)/, '$1-$2')
    } else if (val.length > 7) {
      val = val.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3')
    }
    if (val.length <= 13) setPhone(val)
  }

  return (
    <section id={id} className="py-20 bg-gray-50 scroll-mt-10">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Left info side */}
          <div className="bg-gray-900 p-10 md:w-5/12 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-600 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>

            <h3 className="text-3xl font-extrabold mb-4 relative z-10">
              지금 바로<br />무료 진단 받으세요
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
              매달 빠져나가는 아까운 보험료,<br />전문가와 함께 10분만 투자하면<br />평생 내는 보험료를 아낄 수 있습니다.
            </p>

            <div className="space-y-5 text-sm font-medium relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">1</span>
                </div>
                <span>전문가 1:1 맞춤 분석</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">2</span>
                </div>
                <span>중복/불필요 특약 제거</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">3</span>
                </div>
                <span>필수 핵심 보장 보완</span>
              </div>
            </div>
          </div>

          {/* Right form side */}
          <div className="p-10 md:w-7/12">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-primary-500 rounded-full mr-3"></div>
              상담 신청하기
            </h4>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5 relative">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="w-5 h-5 border-gray-300 rounded text-primary-600 focus:ring-primary-500 transition-colors"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">개인정보 수집 및 이용 동의 (필수)</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                      수집목적: 보험 리모델링 상담<br />
                      수집항목: 이름, 연락처<br />
                      보유기간: 상담 완료 후 3개월 내 파기
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 text-lg font-bold text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/50 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? '접수 중...' : '맞춤 진단 신청하기'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                상담 신청 시 스팸 문자나 가입 강요는 절대 없습니다.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
