import Link from 'next/link'
import PlannerBranding from '@/components/PlannerBranding'
import FifthGenGuide from '@/components/FifthGenGuide'

export const metadata = {
    title: '5세대 실손보험 가이드 | 인슈닷',
    description: '새롭게 개편된 5세대 실손의료보험의 중증, 비중증, 급여 의료비 보장 내용을 알기 쉽게 정리한 가이드입니다.',
}

export default function FifthGenGuidePage() {
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <div className="flex-1 py-20 px-4 mt-8">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-12">
                        <FifthGenGuide />
                        
                        <div className="text-center pt-8 mt-12 border-t border-gray-100">
                            <Link href="/#consultation" className="inline-block bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary-700 transition-all hover:-translate-y-1">
                                내 보험 추가 안내 받기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <PlannerBranding />
        </div>
    )
}
