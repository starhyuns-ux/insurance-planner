'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

type ReviewItem = {
  name: string
  age: string
  before: string
  after: string
  save: string
  text: string
  tags: string[]
}

export default function Reviews() {
  const { t } = useLanguage()
  const reviews = t('reviewsList') as ReviewItem[]
  const monthlySave = t('reviewsMonthlySave') as (amount: string) => string

  return (
    <section className="py-24 bg-white" id="reviews">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 font-extrabold text-sm mb-4">
            {t('reviewsTag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {t('reviewsTitle')}
          </h2>
          <p className="text-lg text-gray-500">
            {t('reviewsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-primary-100/50 hover:-translate-y-1 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors">{r.name}</div>
                  <div className="text-sm text-gray-500 font-medium">{r.age}</div>
                </div>
                <div className="flex gap-1 text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 mb-6 relative shadow-inner overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 -mt-10 -mr-10"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-sm border border-gray-50 z-10">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <div className="text-center w-5/12 bg-white/50 py-2 rounded-xl backdrop-blur-sm">
                    <div className="text-xs text-gray-500 font-bold mb-1">{t('reviewsBefore')}</div>
                    <div className="text-gray-400 font-bold line-through decoration-gray-400/50 decoration-2">{r.before}원</div>
                  </div>
                  <div className="text-center w-5/12 bg-primary-50 py-2 rounded-xl border border-primary-100/50">
                    <div className="text-xs text-primary-700 font-bold mb-1">{t('reviewsAfter')}</div>
                    <div className="text-primary-600 font-extrabold text-xl">{r.after}원</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-full mb-4 border border-green-100">
                  {monthlySave(r.save)}
                </span>
                <p className="text-gray-700 text-[15px] leading-relaxed relative">
                  <span className="text-2xl text-primary-200 font-serif absolute -top-2 -left-2">&quot;</span>
                  <span className="relative z-10">{r.text}</span>
                  <span className="text-2xl text-primary-200 font-serif absolute -bottom-4 mr-2">&quot;</span>
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {r.tags.map(tag => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#consultation"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_#111827] rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#111827] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            {t('reviewsCta')}
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
