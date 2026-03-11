import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '암 치료 통합 가이드 | 보험다이어트',
    description: '수술, 방사선, 약물 치료까지 - 현대 암 치료의 모든 단계를 알기 쉽게 정리한 통합 가이드입니다.',
    openGraph: {
        title: '암 치료 통합 가이드 | 보험다이어트',
        description: '최신 로봇 수술부터 중입자 치료, 면역 항암제까지. 내 보험은 이 고액 치료들을 감당할 수 있을까요?',
        url: 'https://insurance-planner-eosin.vercel.app/guide/cancer-treatment',
    }
}

export default function CancerTreatmentGuidePage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <NavBar />

            {/* Header Section */}
            <header className="bg-slate-900 text-white min-h-[350px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-5xl relative z-10 py-16 px-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-800/80 backdrop-blur-sm text-blue-100 text-sm font-bold tracking-wide mb-6 border border-blue-700/50">
                        암 치료 트렌드 리포트
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight break-keep">
                        암 치료 통합 가이드:<br className="hidden md:block" />
                        <span className="text-blue-400">수술, 방사선, 그리고 약물</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed break-keep">
                        전통적인 방식부터 최첨단 신의료기술까지,<br />
                        나의 암 보험이 어디까지 보장하는지 확인하기 전 필수 지식을 정리해 드립니다.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-5xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 md:p-12 space-y-20">

                        {/* 1. 수술 치료 */}
                        <section id="surgery">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600 text-white font-bold text-xl shadow-lg shadow-primary-200">1</span>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">수술 치료</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* 관혈적 수술 */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 transition-colors">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">관혈적 수술</h3>
                                    <p className="text-sm font-semibold text-primary-600 mb-3">(Open Surgery)</p>
                                    <ul className="space-y-3 text-gray-600 text-[15px] leading-relaxed">
                                        <li className="flex gap-2">
                                            <span className="text-primary-500">•</span>
                                            피부와 조직을 절개하여 암 조직을 직접 제거하는 전통적인 방식입니다.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary-500">•</span>
                                            시야 확보가 용이해 큰 종양이나 복잡한 부위의 암 제거에 유리합니다.
                                        </li>
                                        <li className="flex gap-2 text-gray-400 text-sm">
                                            <span className="text-gray-300">•</span>
                                            범위가 커 회복 기간이 상대적으로 길고 흉터가 남을 수 있습니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* 내시경 수술 */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 transition-colors">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">내시경 수술</h3>
                                    <p className="text-sm font-semibold text-primary-600 mb-3">(Minimally Invasive)</p>
                                    <ul className="space-y-3 text-gray-600 text-[15px] leading-relaxed">
                                        <li className="flex gap-2">
                                            <span className="text-primary-500">•</span>
                                            작은 절개를 통해 내시경과 기구를 삽입하는 최소 침습 수술입니다.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary-500">•</span>
                                            절개 부위가 작아 출혈이 적고 회복 속도가 매우 빠릅니다.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary-500">•</span>
                                            위암, 대장암, 담낭 질환 등 다양한 암 수술에 활용됩니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* 로봇 수술 */}
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-colors relative overflow-hidden">
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rotate-12 shadow-sm">고액 치료</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-blue-200">로봇 수술</h3>
                                    <p className="text-sm font-semibold text-blue-600 mb-3">(Robot-assisted)</p>
                                    <ul className="space-y-3 text-gray-700 text-[15px] leading-relaxed">
                                        <li className="flex gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            로봇 장비를 이용해 의사가 정밀하게 조작하여 진행하는 수술 방식입니다.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            사람 손보다 정교한 움직임과 확대 시야 확보가 가능합니다.
                                        </li>
                                        <li className="mt-4 p-3 bg-white/60 rounded-xl border border-blue-100">
                                            <p className="text-blue-800 font-bold text-sm">💰 비용 안내</p>
                                            <p className="text-blue-900 font-extrabold">평균 약 2,000만원 이상</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. 항암 방사선 치료 */}
                        <section id="radiation" className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-200">2</span>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">항암 방사선 치료</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* 1세대 */}
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-xs font-bold text-gray-400 mb-1">1세대</div>
                                        <h4 className="font-bold text-gray-900 mb-2">정위적 방사선</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">특정 종양 부위에 방사선을 집중 조사하여 정상 조직 손상을 최소화합니다.</p>
                                    </div>
                                    {/* 2세대 */}
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-xs font-bold text-gray-400 mb-1">2세대</div>
                                        <h4 className="font-bold text-gray-900 mb-2">세기조절(IMRT)</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">방사선 세기를 조절하여 종양 형태에 맞게 조사하고 주변 손상을 줄입니다.</p>
                                    </div>
                                    {/* 3세대 */}
                                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                                        <div className="text-xs font-bold text-indigo-400 mb-1">3세대</div>
                                        <h4 className="font-bold text-indigo-900 mb-2">양성자 치료</h4>
                                        <p className="text-xs text-indigo-700/80 leading-relaxed">에너지가 집중되는 브래그 피크를 이용해 소아암 및 정밀 치료에 활용됩니다.</p>
                                    </div>
                                    {/* 4세대 */}
                                    <div className="p-5 bg-indigo-600 rounded-2xl border border-indigo-700 text-white shadow-xl shadow-indigo-100">
                                        <div className="text-xs font-bold text-indigo-200 mb-1">4세대 (최신)</div>
                                        <h4 className="font-bold text-white mb-2">중입자 치료</h4>
                                        <p className="text-xs text-indigo-100 leading-relaxed">기존보다 강한 세포 파괴력과 높은 정확성으로 난치성 암을 치료합니다.</p>
                                        <div className="mt-3 pt-3 border-t border-indigo-500/50">
                                            <p className="text-[10px] text-indigo-200">평균 치료 비용</p>
                                            <p className="text-lg font-black text-indigo-100">약 6,000만원</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. 항암 약물 치료 */}
                        <section id="drug">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-lg shadow-emerald-200">3</span>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">항암 약물 치료</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 1세대: 세포독성 */}
                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 items-start">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                                        <span className="text-gray-400 font-bold">1G</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">세포독성 항암제</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            암세포의 빠른 분열을 억제하여 파괴하는 전통적 방식입니다. 탈모, 면역력 저하 등의 부작용이 동반될 수 있습니다.
                                        </p>
                                    </div>
                                </div>

                                {/* 2세대: 표적 */}
                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 items-start">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                                        <span className="text-emerald-500 font-bold">2G</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">표적 항암제</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            암세포의 특정 유전자를 선택적으로 공격하여 정상 세포 손상을 줄입니다. 폐암, 유방암 등에 널리 활용됩니다.
                                        </p>
                                    </div>
                                </div>

                                {/* 3세대: 면역 */}
                                <div className="flex gap-5 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 items-start">
                                    <div className="w-14 h-14 bg-emerald-600 rounded-xl shadow-md flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold">3G</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-emerald-900 mb-1">면역 항암제</h4>
                                        <p className="text-sm text-emerald-800/80 leading-relaxed">
                                            환자의 면역체계를 활성화하여 암세포를 스스로 공격하게 만듭니다. 기존 항암제에 반응이 없던 경우에도 효과가 나타납니다.
                                        </p>
                                    </div>
                                </div>

                                {/* 4세대: 대사 */}
                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 items-start gradient-border">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-indigo-100">
                                        <span className="text-indigo-400 font-bold">4G</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">대사 항암제</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            암세포의 에너지 대사 경로를 차단하여 성장을 억제하는 방식입니다. 현재 연구가 가장 활발한 차세대 치료법입니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Bottom Disclaimer */}
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-sm md:text-base text-red-900 leading-relaxed">
                            <p className="font-bold mb-2">⚠️ 확인하세요!</p>
                            위 치료법들은 의학계의 눈부신 발전으로 암 정복의 희망이 되고 있지만, 대부분 <strong>수천만 원에 달하는 고액 치료비</strong>가 발생합니다. 현재 내가 가입한 보험의 진단비와 수술비 한도가 이러한 신의료기술까지 충분히 뒷받침하고 있는지 반드시 사전에 점검해야 합니다.
                        </div>

                        {/* CTA Section */}
                        <div className="bg-slate-900 p-10 md:p-14 rounded-[2.5rem] text-center relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10 break-keep">
                                고액 암 치료비, 대비는 충분하신가요?
                            </h3>
                            <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed relative z-10 break-keep text-lg">
                                로봇 수술(2천만 원), 중입자 치료(6천만 원)...<br />
                                감당하기 어려운 고액 의료비를 내 보험이 보장하는지<br />
                                전문가가 꼼꼼하게 점검해 드립니다.
                            </p>
                            <Link href="/#consultation" className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:-translate-y-1 relative z-10 text-xl">
                                1:1 무료 보험 진단 신청
                                <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
