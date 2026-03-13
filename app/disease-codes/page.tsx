import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import DiseaseCodeSearch from '@/components/DiseaseCodeSearch'

export const metadata: Metadata = {
    title: '암·질병코드 검색 | 보험다이어트',
    description: '어려운 암 질병코드 및 진단코드를 쉽고 빠르게 검색해보세요. 내 진단서의 코드가 어떤 암을 의미하는지 한눈에 확인할 수 있습니다.',
    openGraph: {
        title: '암·질병코드 검색 | 보험다이어트',
        description: '어려운 암 질병코드 및 진단코드를 쉽게 검색하고 의미를 확인해보세요.',
        url: 'https://insurance-planner-eosin.vercel.app/disease-codes',
    }
}

export default function DiseaseCodesPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <NavBar />

            {/* Header Section */}
            <header className="bg-primary-900 text-white min-h-[350px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-5xl relative z-10 py-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-800/80 backdrop-blur-sm text-primary-200 text-sm font-bold tracking-wide mb-6 border border-primary-700/50">
                        질병코드 검색
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight break-keep">
                        내 진단서에 적힌 코드,<br className="hidden md:block" />
                        <span className="text-primary-200">무슨 질병일까요?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 opacity-90 mb-4 max-w-2xl leading-relaxed break-keep">
                        진단서나 조직검사결과지에 적힌 어려운 질병코드나 질병명을 검색하여 정확한 의미를 확인하세요. 올바른 보상을 받기 위한 첫걸음입니다.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-5xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 lg:p-12 mb-12">
                    <DiseaseCodeSearch />
                </div>

                {/* Info Text Bubble */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-blue-900 leading-relaxed break-keep font-medium">
                        동일한 종양이라도 질병코드에 따라 일반암, 유사암, 양성종양 등 <strong>보상 금액이 크게 달라질 수 있습니다.</strong> 보험금 청구 전, 전문가와 함께 코드를 점검하는 것을 권장합니다.
                    </p>
                </div>
            </div>

            <PlannerBranding />
            <Footer />
        </main>
    )
}
