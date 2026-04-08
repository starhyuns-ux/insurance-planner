import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

import { Dancing_Script } from 'next/font/google'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing-script',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://stroy.kr'),
  title: '보험 리모델링 | 5세대 실손보험 가이드',
  applicationName: '인슈닷',
  appleWebApp: {
    title: '인슈닷',
  },
  description: '전문가의 보험 리모델링으로 새는 보험료를 막아드립니다. 상담을 통해 합리적인 보장을 안내해 드립니다.',
  keywords: [
    '보험전문가', '보험리모델링', '보험료절약', '실손의료보험', '종신보험정리', '무료보험진단',
    '암보험', '수술비보험', '표적항암제', '질병코드', 'ICD', '인슈닷', '보험설계사', 
    '치매보험', '간병보험', '태아보험', '어린이보험', '종합보험', '보장분석', '보험가입'
  ],
  openGraph: {
    title: '보험 리모델링 | 5세대 실손보험 가이드',
    description: '전문가의 맞춤형 보험 리모델링으로 새는 보험료를 막아드립니다. 10분 투자로 평생 내는 보험료를 아끼세요.',
    url: 'https://stroy.kr',
    siteName: '인슈닷',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '인슈닷 - 보험 리모델링 전문가',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '보험 리모델링 | 5세대 실손보험 가이드',
    description: '전문가의 맞춤형 보험 리모델링으로 새는 보험료를 막아드립니다. 무료 상담 신청하세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'CQJ0QiCcforCB1Kbv7UXKnxjTKhkM1o-Fp95Kwg_1R4', // 구글 서치콘솔 소유권 확인 태그값 입력란
    other: {
      'naver-site-verification': ['147a7a383f70422b9e4f57a9f5ad1a291d8a51f7'], // 네이버 서치어드바이저 소유권 확인 태그값 입력란
    },
  },
}

import Script from 'next/script'
import QueryProvider from '@/lib/providers/QueryProvider'
import { PlannerProvider } from '@/lib/providers/PlannerProvider'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'
import ChatWidget from '@/components/ChatWidget'
import ReferralTracker from '@/components/ReferralTracker'
import VisitTracker from '@/components/VisitTracker'
import { Suspense } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} ${dancingScript.variable} font-sans antialiased bg-gray-50 text-gray-900 break-keep break-words w-full overflow-x-hidden`}>
        <Script 
          src="https://t2.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js" 
          strategy="afterInteractive"
          crossOrigin="anonymous" 
        />
        <QueryProvider>
          <PlannerProvider>
            <LanguageProvider>
              <VisitTracker />
              <Suspense fallback={null}>
                <ReferralTracker />
              </Suspense>
              {children}
              <Toaster position="top-center" richColors />
            </LanguageProvider>
          </PlannerProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
