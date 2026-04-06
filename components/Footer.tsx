'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 text-sm">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-12">
          <div className="max-w-md">
            <Link href="/" className="inline-block font-black text-3xl tracking-tighter text-gray-900 mb-4 flex items-baseline">
              <span>인슈</span>
              <span className="text-primary-600 ml-px">닷</span>
            </Link>
            <p className="text-gray-500 mb-6 leading-relaxed text-[15px]">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="https://open.kakao.com/o/sdWFlvYh" target="_blank" rel="noopener noreferrer" aria-label="KaKao Channel" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-yellow-900 hover:bg-[#FEE500] hover:border-[#FEE500] transition-colors font-bold shadow-sm">K</a>
            </div>
          </div>

          <div className="shrink-0">
            <h4 className="font-bold text-gray-900 mb-5">{t('footerCustomerCenter')}</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="font-extrabold text-2xl text-gray-900 tracking-tight">010-6303-5561</li>
              <li className="text-xs text-gray-400 mt-1 mb-4">{t('footerHours')}</li>
              <li className="pt-2">
                <a href="https://open.kakao.com/o/sdWFlvYh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FEE500] text-[#371D1E] px-4 py-2 rounded-xl font-bold hover:bg-[#FEE500]/90 transition-colors shadow-sm w-full justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-5.523 0-10 3.51-10 7.842 0 2.766 1.838 5.176 4.542 6.551-.25.867-.905 3.128-.94 3.266-.044.175.056.173.12.13.082-.055 3.444-2.288 4.02-2.694A10.887 10.887 0 0012 18.685c5.523 0 10-3.51 10-7.843C22 6.51 17.523 3 12 3z" /></svg>
                  {t('footerKakaoConsult')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-6 text-xs text-gray-400 leading-relaxed">
          <div>
            <p className="opacity-70">{t('footerCopyright')(year)} <br className="md:hidden" />{t('footerCopyrightNotice')}</p>
          </div>
          <div className="flex gap-4 md:self-end">
            <a href="#" className="hover:text-gray-600 transition-colors">{t('footerTerms')}</a>
            <div className="w-px h-3 bg-gray-300 rounded self-center"></div>
            <Link href="/privacy" className="font-bold text-gray-600 hover:text-gray-800 transition-colors">{t('footerPrivacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
