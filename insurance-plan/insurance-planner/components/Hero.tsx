"use client"

import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAttribution } from '@/lib/attribution'
import { StarIcon } from '@heroicons/react/24/solid'

export default function Hero() {
  const { t } = useLanguage()
  const { planner } = useAttribution()

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white"></div>

      <div className="container mx-auto flex items-center justify-center">
        {/* Center Content */}
        <div className="max-w-3xl px-4 md:px-0 text-center">
          {planner ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-white shadow-xl shadow-primary-100 border border-primary-100 mb-6 md:mb-8 animate-in slide-in-from-top-4 duration-700">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-primary-200">
                {planner.profile_image_url ? (
                  <img src={planner.profile_image_url} alt={planner.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center text-[8px] md:text-[10px] text-white font-black">
                    {planner.name[0]}
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Verified Advisor</p>
                <p className="text-[10px] md:text-xs font-black text-gray-900">{planner.name} 설계사와 함께하는 인슈닷</p>
              </div>
              <StarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 ml-1" />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 backdrop-blur-sm text-primary-700 text-sm font-semibold mb-6 border border-primary-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
              </span>
              <div className="flex">
                {t('heroBadge').split("").map((char: string, index: number) => (
                  <span
                    key={index}
                    className={`${char === ' ' ? 'mr-1' : 'animate-drop-bounce'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-6 break-keep">
            {planner ? (
              <>
                <span className="text-primary-600">{planner.name} 전문가</span>가 제안하는<br className="md:hidden" />
                <span className="hidden md:inline"> </span>스마트한 보험 생활
              </>
            ) : (
              <>
                {t('heroTitlePrefix')}<br className="md:hidden" />
                <span className="hidden md:inline"> </span><span className="text-primary-600">{t('heroTitleHighlight')}</span>
              </>
            )}
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 break-keep">
            {planner?.advisor_message || t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#consultation"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
            >
              {t('heroBtnApply')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#reviews"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {t('heroBtnCases')}
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {t('heroNotice')}
          </p>
        </div>
      </div>
    </section>
  )
}
