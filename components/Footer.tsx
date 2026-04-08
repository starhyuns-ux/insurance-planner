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
