import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import CancerTreatmentGuide from '@/components/CancerTreatmentGuide'
import TargetedAnticancerMatrix from '@/components/TargetedAnticancerMatrix'
import Link from 'next/link'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'

export const metadata: Metadata = {
    title: '암 치료 통합 가이드 | 인슈닷',
    description: '수술, 방사선, 약물 치료까지 - 현대 암 치료의 모든 단계를 알기 쉽게 정리한 통합 가이드입니다.',
    openGraph: {
        title: '암 치료 통합 가이드 | 인슈닷',
        description: '최신 로봇 수술부터 중입자 치료, 면역 항암제까지. 내 보험은 이 고액 치료들을 감당할 수 있을까요?',
        url: 'https://stroy.kr/guide/cancer-treatment',
    }
}

export default function CancerTreatmentGuidePage() {
    return (
        <LanguageProvider>
            <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
                <NavBar />

                <div className="container max-w-5xl px-4 py-20 mb-24">
                    <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 p-6 md:p-12">
                        <CancerTreatmentGuide />
                        
                        {/* 69 Targeted Anticancer Drug Matrix */}
                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <TargetedAnticancerMatrix />
                        </div>
                        
                        {/* CTA Section */}
                        <div className="bg-slate-900 p-10 md:p-14 rounded-[2.5rem] text-center relative overflow-hidden text-white mt-16">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10 break-keep">
                                고액 암 치료비, 대비는 충분하신가요?
                            </h3>
                            <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed relative z-10 break-keep text-lg">
                                로봇 수술, 중입자 치료... 감당하기 어려운 고액 의료비를 내 보험이 보장하는지 전문가가 꼼꼼하게 점검해 드립니다.
                            </p>
                            <Link href="/#consultation" className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:-translate-y-1 relative z-10 text-xl">
                                1:1 무료 보험 진단 신청
                            </Link>
                        </div>
                    </div>
                </div>

                <PlannerBranding />
                <Footer />
            </main>
        </LanguageProvider>
    )
}
