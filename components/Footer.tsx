'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 text-sm">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 pr-4">
            <Link href="/" className="inline-block font-black text-3xl tracking-tighter text-gray-900 mb-4 flex items-baseline">
              <span>인슈</span>
              <span className="text-primary-600 ml-px">닷</span>
            </Link>
            <p className="text-gray-500 mb-6 leading-relaxed max-w-sm text-[15px]">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="https://open.kakao.com/o/sdWFlvYh" target="_blank" rel="noopener noreferrer" aria-label="KaKao Channel" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-yellow-900 hover:bg-[#FEE500] hover:border-[#FEE500] transition-colors font-bold shadow-sm">K</a>
              <a href="https://blog.naver.com/starhyuns" target="_blank" rel="noopener noreferrer" aria-label="Naver Blog" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#03C75A] hover:bg-[#03C75A] hover:text-white hover:border-[#03C75A] transition-colors font-bold shadow-sm">N</a>
              <a href="https://www.instagram.com/stroy__neis/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#C13584] hover:text-white hover:border-transparent transition-all shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-5">{t('footerQuickMenu')}</h4>
            <ul className="space-y-3.5 text-gray-500 font-medium">
              <li><Link href="/#about" className="hover:text-primary-600 transition-colors">{t('footerMenuAbout')}</Link></li>
              <li><Link href="/#services" className="hover:text-primary-600 transition-colors">{t('footerMenuProcess')}</Link></li>
              <li><Link href="/#reviews" className="hover:text-primary-600 transition-colors">{t('footerMenuCases')}</Link></li>
              <li><Link href="/#faq" className="hover:text-primary-600 transition-colors">{t('footerMenuFaq')}</Link></li>
              <li><Link href="/guide/5th-gen" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('footerMenuSilbi5')}</Link></li>
              <li><Link href="/guide/critical-illness-relief" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('footerMenuCriticalIllness')}</Link></li>
              <li><Link href="/guide/advanced-radiation" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('footerMenuRadiation')}</Link></li>
              <li><Link href="/guide/hifu-therapy" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">{t('footerMenuHifu')}</Link></li>
            </ul>
          </div>

          <div>
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
            <p className="mb-1"><span className="text-gray-500 font-medium">{t('footerCompany')}</span> | {t('footerCEO').includes('대표') ? t('footerCEO') : `대표: ${t('footerCEO')}`} | {t('footerBusinessNum').includes('등록번호') ? t('footerBusinessNum') : `사업자등록번호: ${t('footerBusinessNum')}`}</p>
            <p className="mb-3">{t('footerAddress')} | {t('footerPrivacyOfficer').includes('책임자') ? t('footerPrivacyOfficer') : `개인정보보호책임자: ${t('footerPrivacyOfficer')}`}</p>
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
