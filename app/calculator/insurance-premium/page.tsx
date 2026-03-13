import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import InsurancePremiumCalculator from '@/components/InsurancePremiumCalculator'
import PlannerBranding from '@/components/PlannerBranding'

export const metadata = {
    title: '보험료 계산기 | 보험다이어트',
    description: '성별, 생년월일만 입력하면 암, 뇌, 심장 진단비부터 수술비까지 내 보험료를 즉시 확인해보세요.',
}

export default function InsurancePremiumPage() {
    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-1 py-16 md:py-24 px-4 mt-16">
                
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="inline-block bg-primary-100 text-primary-800 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
                        내 보험료 즉시 확인
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        보험료 계산기
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto break-keep leading-relaxed">
                        복잡한 가입 절차 없이 내 보험료를 미리 확인해 보세요.<br className="hidden md:block"/>
                        성별과 생년월일만으로 <strong className="text-primary-600">주요 3대 질병</strong>과 <strong className="text-primary-600">1~5종 수술비</strong>를 즉시 산출해 드립니다.
                    </p>
                </div>


                {/* Calculator Component */}
                <InsurancePremiumCalculator />

            </div>

            <PlannerBranding />
            <Footer />
        </main>
    )
}
