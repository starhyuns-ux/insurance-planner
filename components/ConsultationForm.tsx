"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAttribution } from '@/lib/attribution'
import { useLanguage } from '@/lib/contexts/LanguageContext'

interface ConsultationFormProps {
  id?: string;
  plannerId?: string;
  plannerInfo?: {
    name: string;
    phone: string;
  };
}

export default function ConsultationForm({ id = "consultation", plannerId, plannerInfo }: ConsultationFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { planner: sessionPlanner } = useAttribution()
  const { t } = useLanguage()

  // Determine final planner info
  const finalPlannerId = plannerId || sessionPlanner?.id
  const finalPlannerName = plannerInfo?.name || sessionPlanner?.name
  const finalKakaoUrl = sessionPlanner?.kakao_url || 'https://open.kakao.com/o/sdWFlvYh'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name.trim()) {
      setError(t('formAlertName'))
      return
    }
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/
    if (!phone.replace(/-/g, '').match(phoneRegex)) {
      setError(t('formAlertPhone'))
      return
    }
    if (!agree) {
      setError(t('formAlertAgree'))
      return
    }

    setIsSubmitting(true)

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const urlSource = searchParams.get('source')

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phone.replace(/-/g, ''), // Save without dashes
          planner_id: finalPlannerId || null,
          meta: { 
            source: urlSource || (finalPlannerId ? `planner_page_${finalPlannerId}` : 'landing_page_bottom_form'),
            planner_name: finalPlannerName,
            referrer_code: typeof window !== 'undefined' ? localStorage.getItem('referral_code') : null
          }
        })
      })

      const data = await res.json()

      if (data.success) {
        // 성공 시 클립보드 복사(선택적) 또는 카카오톡 안내 후 이동
        alert(t('formSuccessMessage'))

        // Form reset
        setName('')
        setPhone('')
        setAgree(false)

        // 이동 (오픈채팅 채널 링크로 리다이렉트)
        window.location.href = finalKakaoUrl
      } else {
        setError(data.error || t('formErrorMessage'))
      }
    } catch (err) {
      console.error(err)
      setError(t('formNetworkError'))
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
              {finalPlannerName ? t('formTitleWithPlanner')(finalPlannerName) : t('formTitle')}
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
              {finalPlannerName ? t('formDescWithPlanner') : t('formDesc')}
            </p>

            <div className="space-y-5 text-sm font-medium relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">1</span>
                </div>
                <span>{t('formStep1')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">2</span>
                </div>
                <span>{t('formStep2')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-primary-400 text-lg">3</span>
                </div>
                <span>{t('formStep3')}</span>
              </div>
            </div>
          </div>

          {/* Right form side */}
          <div className="p-10 md:w-7/12">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-primary-500 rounded-full mr-3"></div>
              {t('formSubmitTitle')}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('formName')}</label>
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('formPhone')}</label>
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
                    <Link href="/privacy" className="font-semibold text-gray-800 hover:text-primary-600 underline underline-offset-4 decoration-gray-300 hover:decoration-primary-300 transition-all cursor-pointer">
                      {t('formAgree')}
                    </Link>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                      {t('formPrivacyPurpose')}<br />
                      {t('formPrivacyItems')}<br />
                      {t('formPrivacyPeriod')}
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
                {isSubmitting ? t('formBtnSubmitting') : t('formBtnApply')}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('formSpamNotice')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
