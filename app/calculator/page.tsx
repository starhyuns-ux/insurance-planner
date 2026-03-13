import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import SilbiCalculator from '@/components/SilbiCalculator'

export const metadata = {
    title: '실손보험 세대별 계산기 | 보험다이어트',
    description: '1세대부터 4세대까지 내 보험금을 즉시 계산하고 비교해보세요.'
}

export default function CalculatorPage() {
    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-1 py-16 md:py-24 px-4 mt-16">
                
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="inline-block bg-primary-100 text-primary-800 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
                        원클릭 보험금 비교
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        세대별 <span className="text-primary-600">실손보험 계산기</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto break-keep leading-relaxed">
                        복잡한 약관은 빼고 핵심만 담았습니다.<br className="hidden md:block"/>
                        병원비를 입력하면 1세대부터 4세대까지 내야 할 <strong className="text-rose-500">본인부담금</strong>과 돌려받을 <strong className="text-primary-600">보상금액</strong>을 직관적으로 비교해 드립니다.
                    </p>
                </div>

                {/* Calculator Component */}
                <SilbiCalculator />

            </div>

            <PlannerBranding />
            <Footer />
        </main>
    )
}
