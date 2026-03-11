import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
    title: '하이푸(HIFU) 시술 안내 | 보험다이어트',
    description: '수술의 부담은 낮추고 치료 효과는 높이는 하이푸(HIFU) 시술. 나의 수술 전 종양 크기 감소 시술 대비책을 점검하세요.',
    openGraph: {
        title: '하이푸(HIFU) 시술 안내 | 보험다이어트',
        description: '칼을 대지 않고 종양을 태우는 차세대 암 치료, 하이푸. 암 수술 전 필수가 된 이 시술에 내 보험은 준비되어 있을까요?',
        url: 'https://insurance-planner-eosin.vercel.app/guide/hifu-therapy',
    }
}

export default function HifuTherapyGuidePage() {
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
                        떠오르는 차세대 시술
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight break-keep">
                        수술 없이 종양을 태우는<br />
                        <span className="text-white">하이푸(HIFU) 시술</span>
                    </h1>
                    <p className="text-xl text-primary-100 opacity-90 mb-8 max-w-2xl leading-relaxed break-keep">
                        칼을 대지 않고 초음파로만 종양을 제거하는 비침습적 치료.<br />
                        수술 전 종양 크기를 줄이는 목적으로 각광받는 이 시술에<br />
                        내 보험이 제대로 준비되어 있는지 확인해보세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-4xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">

                        {/* Highlight Banner (Cancer Surgery Prep) */}
                        <div className="mb-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                                <svg className="w-32 h-32 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                            </div>
                            <h3 className="text-red-800 text-xl font-extrabold mb-3 flex items-center gap-2 relative z-10">
                                💡 주목해야 할 핵심 포인트
                            </h3>
                            <p className="text-red-900 text-lg leading-relaxed font-medium relative z-10 break-keep">
                                하이푸(HIFU) 시술은 단독 치료로도 쓰이지만, 최근에는 <strong className="text-red-700 bg-red-100 px-1 rounded">암 수술을 진행하기 전에 종양의 크기를 효과적으로 줄이기 위해</strong> 사전 시술로 매우 적극적으로 활용되고 있습니다.
                            </p>
                        </div>

                        {/* 1. 소개 */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block">
                                하이푸 시술(HIFU)이란?
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed break-keep">
                                하이푸(HIFU, High Intensity Focused Ultrasound)는 <strong>고강도 초음파 에너지를 한 점에 집중시켜 종양이나 병변 조직을 열로 괴사시키는 비침습적 치료 방법</strong>입니다. 수술처럼 절개를 하지 않고 초음파를 이용해 병변을 치료하는 것이 큰 특징입니다.
                            </p>

                            {/* Image Placeholder */}
                            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 mb-8 relative aspect-[16/9] bg-gray-100">
                                <Image
                                    src="/images/hifu-image-v2.jpg"
                                    alt="하이푸(HIFU) 치료 원리: 고강도 초음파 에너지를 집중시켜 종양을 태우는 시술"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                            </div>
                        </section>

                        {/* 2. 상세 정보 영역 (그리드) */}
                        <div className="grid lg:grid-cols-2 gap-10 mb-16">

                            {/* 원리 */}
                            <section>
                                <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm">1</span>
                                    하이푸 시술의 원리
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-full">
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        초음파 에너지를 특정 위치에 집중시키면 70~100℃ 이상의 열이 발생하여 해당 조직을 선택적으로 파괴하는 원리를 이용합니다.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-500 font-bold shrink-0">1</div>
                                            초음파 영상으로 병변 위치 확인
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-500 font-bold shrink-0">2</div>
                                            치료 계획 수립
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-500 font-bold shrink-0">3</div>
                                            초음파 에너지 집중 조사
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-500 font-bold shrink-0">4</div>
                                            병변 조직 열괴사 유도
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* 특징 */}
                            <section>
                                <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm">2</span>
                                    하이푸 시술의 특징
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-full flex flex-col justify-center">
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span className="font-medium">절개 없는 비수술 치료</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span className="font-medium">출혈이 거의 없음</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span className="font-medium">회복기간이 짧은 편</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span className="font-medium">주변 정상 조직 손상 최소화</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span className="font-medium">비교적 짧은 시술 시간</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* 3. 적용 질환 및 고려사항 */}
                        <div className="grid md:grid-cols-2 gap-8 mb-10 border-t border-gray-200 pt-10">
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">적용 가능한 질환</h3>
                                <p className="text-sm text-gray-500 mb-4">병원 및 환자 상태에 따라 다르지만 일반적으로 다음 질환에 활용됩니다.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">자궁근종</span>
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">자궁선근증</span>
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">전립선 질환</span>
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">일부 간종양</span>
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">일부 췌장 종양</span>
                                </div>
                                <p className="text-xs text-gray-400">※ 모든 환자에게 적용 가능한 것은 아니며 의료진 판단에 따라 결정됩니다.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">치료 시 고려할 점</h3>
                                <p className="text-sm text-gray-500 mb-4">하이푸는 장점이 많은 치료이지만 다음 사항을 꼭 확인하는 것이 중요합니다.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        <span className="text-gray-700">병변의 위치와 크기</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        <span className="text-gray-700">치료 목적 (근치 치료 / 증상 완화 / <strong>수술 전 크기 감소</strong>)</span>
                                    </li>
                                </ul>
                            </section>
                        </div>

                        {/* CTA */}
                        <div className="bg-primary-900 p-8 sm:p-10 rounded-2xl border border-primary-800 text-center mt-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 relative z-10 break-keep">이런 신의료기술 시술, 내 보험은 안전할까요?</h3>
                            <p className="text-primary-100 mb-8 max-w-lg mx-auto leading-relaxed relative z-10 break-keep">
                                좋은 치료법이 나와도 보험 처리가 안 된다면 무용지물입니다. 지금 바로 전문가에게 <strong>10분 무료점검</strong>을 받아보세요.
                            </p>
                            <Link href="/#consultation" className="inline-block bg-white text-primary-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-colors relative z-10 text-lg">
                                내 수술비/진단비 점검하기
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
