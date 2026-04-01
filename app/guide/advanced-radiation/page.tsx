import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '첨단 방사선 치료 가이드 | 인슈닷',
    description: '수천만 원에 달하는 양성자, 중입자 등 첨단 방사선 치료비용. 든든하게 대비하는 방법을 알려드립니다.',
    openGraph: {
        title: '첨단 방사선 치료 가이드 | 인슈닷',
        description: '수천만 원대의 첨단 방사선 치료비, 내 보험으로 감당 가능할까? 전문가와 함께 미리 점검하세요.',
        url: 'https://insurance-planner-eosin.vercel.app/guide/advanced-radiation',
    }
}

export default function AdvancedRadiationGuidePage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <NavBar />

            {/* Header Section */}
            <header className="bg-primary-900 text-white min-h-[400px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-4xl relative z-10 py-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-800/80 backdrop-blur-sm text-primary-200 text-sm font-bold tracking-wide mb-6 border border-primary-700/50">
                        보험 리모델링 필수 체크
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight break-keep">
                        암 치료의 게임 체인저<br />
                        <span className="text-white">첨단 방사선 치료 가이드</span>
                    </h1>
                    <p className="text-xl text-primary-100 opacity-90 mb-8 max-w-2xl leading-relaxed break-keep">
                        꿈의 암 치료기라 불리는 중입자, 양성자 치료.<br />
                        효과는 탁월하지만 치료비가 감당이 안 된다면?<br />
                        내 보험을 미리 점검하고 든든하게 대비하세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-4xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">

                        {/* 1. 소개 및 종류 */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-8 inline-block">
                                대표적인 첨단 방사선 치료 3가지
                            </h2>

                            <div className="space-y-12">
                                {/* 1. 중입자 치료 */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm">1</span>
                                        중입자 치료 (Carbon Ion Therapy)
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed break-keep">
                                        중입자 치료는 탄소 이온(Carbon Ion)을 이용해 암세포를 정밀하게 파괴하는 첨단 방사선 치료입니다. 일반 방사선보다 에너지가 강하고 정확도가 높아 종양에 집중적으로 방사선을 전달할 수 있습니다.
                                    </p>
                                    {/* Image Box */}
                                    <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 mb-12 relative aspect-[16/9] bg-gray-100">
                                        <Image
                                            src="/images/joongibja.png"
                                            alt="최첨단 방사선 치료 (중입자 및 양성자) 원리 및 기기 이미지"
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                        />
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 특징</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                                                <li>암세포에 강력한 파괴력</li>
                                                <li>주변 정상 조직 손상 최소화</li>
                                                <li>깊은 위치의 종양 치료 가능</li>
                                                <li>치료 횟수가 상대적으로 적은 경우가 많음</li>
                                            </ul>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 적용 가능 암</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">췌장암, 간암, 폐암, 두경부암, 골육종 등</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3 ml-2">※ 모든 암에 적용되는 것은 아니며, 환자의 상태와 병원 판단에 따라 결정됩니다.</p>
                                </div>

                                {/* 2. 양성자 치료 */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm">2</span>
                                        양성자 치료 (Proton Therapy)
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed break-keep">
                                        양성자 치료는 수소 원자핵인 양성자를 이용해 암을 치료하는 방사선 치료 방법입니다. 양성자는 특정 깊이에서 에너지를 집중적으로 방출하는 브래그 피크(Bragg Peak) 특성을 가지고 있어 종양에 정확하게 방사선을 전달할 수 있습니다.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 특징</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                                                <li>정상 조직 손상 최소화</li>
                                                <li>소아암 치료에 활용 가능</li>
                                                <li>정밀한 방사선 치료</li>
                                                <li>재발암 치료에 활용 가능</li>
                                            </ul>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 적용 가능 암</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">뇌종양, 소아암, 전립선암, 간암, 폐암 등</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. 세기조절 방사선 치료 */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm">3</span>
                                        세기조절 방사선 치료 (IMRT)
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed break-keep">
                                        <strong>세기조절 방사선 치료(IMRT)</strong>는 방사선의 강도를 조절하여 종양의 형태에 맞게 방사선을 조사하는 치료법입니다. 컴퓨터 기반 치료 계획을 통해 종양에는 높은 방사선량, 주변 정상 조직에는 낮은 방사선량이 전달되도록 설계됩니다.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 특징</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                                                <li>종양 모양에 맞춘 정밀 치료</li>
                                                <li>정상 조직 보호</li>
                                                <li>다양한 암 치료에 활용</li>
                                                <li>기존 방사선 치료보다 부작용 감소 가능</li>
                                            </ul>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 적용 가능 암</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">두경부암, 전립선암, 유방암, 뇌종양, 폐암 등</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. 왜 문제인가 */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block">
                                비용의 압박, 건강보험 비급여
                            </h2>
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-6">
                                <ul className="space-y-4 text-red-800">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <p className="leading-relaxed"><strong>고액의 치료비:</strong> 중입자 치료의 경우 통상적으로 <strong>약 5,000만원 내외</strong>의 비용이 발생하는 것으로 알려져 있습니다.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <p className="leading-relaxed"><strong>건강보험 미적용(비급여):</strong> 대부분의 경우 건강보험이 적용되지 않아 환자가 전액 부담해야 합니다.</p>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                기존 실손의료보험이 있더라도, 통원/입원 한도 제한이나 비급여 자기부담금 등으로 인해 수천만 원의 비용을 오롯이 개인이 감당해야 하는 경우가 많습니다.
                            </p>
                        </section>

                        {/* 3. 해결책 */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block">
                                어떻게 대비해야 할까요?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg mb-4">1</div>
                                    <h3 className="font-bold text-gray-900 mb-2">기존 보험 점검</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">내가 가입한 암보험이나 실손보험에서 비급여 고액 치료비를 얼마나 커버할 수 있는지 한도를 확인합니다.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg mb-4">2</div>
                                    <h3 className="font-bold text-gray-900 mb-2">필수 특약 보완</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">표적항암약물허가치료, 양성자방사선치료 등 고액 치료에 대비할 수 있는 특약을 최소한의 비용으로 보완합니다.</p>
                                </div>
                            </div>
                        </section>

                        <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100 text-center mt-12">
                            <h3 className="text-2xl font-bold text-primary-900 mb-4">수천만 원의 치료비, 내 보험은 안전할까요?</h3>
                            <p className="text-primary-800 mb-8 max-w-lg mx-auto leading-relaxed">
                                고민만 하지 마시고, 지금 바로 전문가에게 <strong>10분 무료점검</strong>을 받아보세요.
                                중복된 특약은 빼고 부족한 고액 보장은 채워드립니다.
                            </p>
                            <Link href="/#consultation" className="inline-block bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary-700 transition-colors">
                                내 암보험 추가 안내 받기
                            </Link>
                        </div>

                    </div>
                </div>
            </div >

            <PlannerBranding />
            <Footer />
        </main >
    )
}
