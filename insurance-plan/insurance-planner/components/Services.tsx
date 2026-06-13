'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function Services() {
  const { t } = useLanguage()
  const steps = t('servicesSteps') as { title: string; desc: string }[]

  const icons = [
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  ]

  return (
    <section className="py-24 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-extrabold tracking-widest text-sm uppercase">{t('servicesTag')}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4 tracking-tight">
            {t('servicesTitle')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('servicesDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8 relative max-w-5xl mx-auto">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gray-200 border-t border-dashed border-gray-300 -z-10"></div>

          {steps.map((s, idx) => (
            <div key={idx} className="relative bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl hover:border-primary-100 hover:-translate-y-2 transition-all group z-10 w-full max-w-sm mx-auto">
              <div className="w-16 h-16 bg-white border-[6px] border-gray-50 group-hover:border-primary-50 rounded-full flex items-center justify-center -mt-16 mb-6 shadow-lg shadow-gray-200/50 transition-colors">
                <span className="text-xl font-black text-primary-600">{idx + 1}</span>
              </div>

              <div className="bg-primary-50 text-primary-600 p-5 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[idx]} />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
