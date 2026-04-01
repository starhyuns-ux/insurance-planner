import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import PlannerBranding from '@/components/PlannerBranding'
import CriticalIllnessRelief from '@/components/CriticalIllnessRelief'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'

export const metadata = {
    title: '산정특례 제도 가이드 | 인슈닷',
    description: '중증질환 환자의 치료비 본인부담을 낮춰주는 산정특례 제도의 질환별 기준(암, 심장, 뇌혈관 등)과 기간을 정리한 안내서입니다.',
}

export default function CriticalIllnessReliefPage() {
    return (
        <LanguageProvider>
            <main className="min-h-screen flex flex-col bg-gray-50">
                <NavBar />

                <div className="flex-1 py-12 md:py-20 px-4 mt-16 md:mt-24">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 md:p-12">
                            <CriticalIllnessRelief />
                            
                            <div className="text-center pt-8 mt-12 border-t border-gray-100">
                                <Link href="/#consultation" className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-105">
                                    내 보험 추가 안내 받기
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
