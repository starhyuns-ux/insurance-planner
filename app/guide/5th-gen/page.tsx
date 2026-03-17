import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import PlannerBranding from '@/components/PlannerBranding'
import FifthGenGuide from '@/components/FifthGenGuide'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'

export const metadata = {
    title: '5세대 실손보험 가이드 | 보험다이어트',
    description: '새롭게 개편된 5세대 실손의료보험의 중증, 비중증, 급여 의료비 보장 내용을 알기 쉽게 정리한 가이드입니다.',
}

export default function FifthGenGuidePage() {
    return (
        <LanguageProvider>
            <main className="min-h-screen flex flex-col bg-gray-50">
                <NavBar />

                <div className="flex-1 py-20 px-4 mt-16">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 md:p-12">
                            <FifthGenGuide />
                            
                            <div className="text-center pt-8 mt-12 border-t border-gray-100">
                                <Link href="/#consultation" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                                    내 보험 무료 진단 받기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <PlannerBranding />
                <Footer />
            </main>
        </LanguageProvider>
    )
}
