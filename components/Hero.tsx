"use client"

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white"></div>

      <div className="container flex items-center justify-center">
        {/* Center Content */}
        <div className="max-w-3xl px-4 md:px-0 text-center">
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

          <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-6 break-keep">
            {t('heroTitlePrefix')}<br />
            <span className="text-primary-600">{t('heroTitleHighlight')}</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            {t('heroDesc')}
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
