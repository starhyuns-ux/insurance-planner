'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function AdvisorTrust() {
  const { t } = useLanguage()

  return (
    <div className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-12">{t('trustTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('regStatus')}</p>
            <p className="text-sm font-bold text-gray-900">{t('regStatusVal')}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('consultation')}</p>
            <p className="text-sm font-bold text-gray-900">{t('consultationVal')}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('mainField')}</p>
            <p className="text-sm font-bold text-gray-900">{t('mainFieldVal')}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('experience')}</p>
            <p className="text-sm font-bold text-gray-900">{t('experienceVal')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
