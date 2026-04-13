'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function AdvisorTrust() {
  const { t } = useLanguage()

  return (
    <div className="bg-white py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 className="text-3xl font-black text-gray-900 mb-16 tracking-tight">
          <span className="text-primary-600 block text-xs uppercase tracking-[0.3em] mb-4">{t('brandName')} Trust Profile</span>
          {t('trustTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-blue-50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('regStatus')}</p>
            <p className="text-sm md:text-base font-black text-gray-900 leading-tight">{t('regStatusVal')}</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-indigo-50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('consultation')}</p>
            <p className="text-sm md:text-base font-black text-gray-900 leading-tight">{t('consultationVal')}</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-purple-900/5 border border-purple-50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('mainField')}</p>
            <p className="text-sm md:text-base font-black text-gray-900 leading-tight">{t('mainFieldVal')}</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-amber-900/5 border border-amber-50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('experience')}</p>
            <p className="text-sm md:text-base font-black text-gray-900 leading-tight">{t('experienceVal')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
