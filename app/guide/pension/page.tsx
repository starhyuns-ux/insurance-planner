import type { Metadata } from 'next'
import PlannerBranding from '@/components/PlannerBranding'
import PensionGuide from '@/components/PensionGuide'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '연금 준비 전략 | 40대·50대 노후 준비 가이드 | 인슈닷',
  description: '40대와 50대의 연금 전략이 왜 다른지 알아보세요. 시간을 활용한 자산 성장부터 안정적인 연금 소득 구조 설계까지 전문가가 정리했습니다.',
  openGraph: {
    title: '연금 준비 전략 | 40대·50대 노후 준비 가이드',
    description: '노후 준비는 시작 시점에 따라 전략이 다릅니다. 40대는 복리 성장, 50대는 현금 흐름 확보 전략을 확인하세요.',
    url: 'https://stroy.kr/guide/pension',
  }
}

export default function PensionGuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container max-w-5xl mx-auto px-4 mb-24">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 p-6 md:p-12">
          <PensionGuide />

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 md:p-14 rounded-[2.5rem] text-center relative overflow-hidden text-white mt-16">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10 break-keep">
              내 연금 준비, 전문가에게 점검받아 보세요
            </h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed relative z-10 break-keep text-lg">
              40대인지 50대인지에 따라 전략이 달라집니다. 지금 상황에 맞는 최적의 연금 플랜을 전문가와 함께 설계하세요.
            </p>
            <Link
              href="/#consultation"
              className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all hover:-translate-y-1 relative z-10 text-xl"
            >
              1:1 무료 연금 상담 신청
            </Link>
          </div>
        </div>
      </div>
      <PlannerBranding />
    </div>
  )
}
