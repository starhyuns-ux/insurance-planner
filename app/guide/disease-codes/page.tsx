import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import DiseaseCodeSearch from '@/components/DiseaseCodeSearch'
import ClientAccessGuard from '@/components/ClientAccessGuard'
import { Info, Search, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
    title: '암·질병코드 검색 | 인슈닷',
    description: '어려운 암 질병코드 및 진단코드를 쉽고 빠르게 검색해보세요. 내 진단서의 코드가 어떤 암을 의미하는지 한눈에 확인할 수 있습니다.',
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: '암·질병코드 검색 | 인슈닷',
        description: '어려운 암 질병코드 및 진단코드를 쉽게 검색하고 의미를 확인해보세요.',
        url: 'https://stroy.kr/guide/disease-codes',
    }
}

export default function DiseaseCodesPage() {
    return (
        <div className="bg-gray-50 flex flex-col">
            {/* Header Section */}
            <header className="bg-primary-900 text-white min-h-[420px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                    <div className="absolute top-20 left-20 w-80 h-80 bg-primary-400 rounded-full blur-[100px] opacity-10"></div>
                </div>

                <div className="container max-w-5xl mx-auto relative z-10 py-24 px-6 md:px-0">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-primary-200 text-xs font-black tracking-widest mb-8 border border-white/10 uppercase">
                        <Search className="w-3.5 h-3.5" />
                        Disease Code Search
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight break-keep">
                        내 진단서에 적힌 코드,<br className="hidden md:block" />
                        <span className="text-primary-200">어떤 질병을 의미할까요?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100/80 mb-4 max-w-2xl leading-relaxed break-keep font-medium">
                        어려운 의학 용어와 코드 대신 누구나 알기 쉬운 질병 정보와<br className="hidden md:block" />
                        <strong>실제 보험금 청구 시 매칭되는 특약 정보</strong>까지 한눈에 확인하세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-5xl mx-auto -mt-16 px-4 mb-32 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-primary-900/10 border border-gray-100 p-6 md:p-12 lg:p-16 mb-12">
                    <DiseaseCodeSearch />
                </div>

                {/* Info Text Bubble */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[2.5rem] p-8 md:p-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xl font-black text-blue-900">보험금 수령액이 달라질 수 있습니다</h4>
                        <p className="text-blue-800/80 leading-relaxed break-keep font-bold text-base md:text-lg">
                            동일한 종양이라도 질병코드 한 끝 차이에 따라 일반암, 유사암, 양성종양 등 <span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">보상 금액이 수천만 원씩 달라질 수 있습니다.</span> 보험금 청구 전, 반드시 전문가와 함께 코드를 점검해 보세요.
                        </p>
                    </div>
                    <button className="mt-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        전문가에게 보상 가능 여부 묻기
                    </button>
                </div>
            </div>

            <PlannerBranding />
        </div>
    )
}
