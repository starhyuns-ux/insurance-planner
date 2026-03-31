import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '혈관질환 스터디 | 허혈성 심장질환 가이드',
    description: '협심증, 심근경색 등 허혈성 심장질환의 범위와 특징을 정확히 알고 든든하게 대비하는 방법을 안내합니다.',
    openGraph: {
        title: '혈관질환 스터디 | 허혈성 심장질환 가이드',
        description: '협심증부터 심근경색까지, 허혈성 심장질환의 모든 것을 정리했습니다. 내 보험과 대비 상황을 점검하세요.',
        url: 'https://insurance-planner-eosin.vercel.app/guide/vascular-disease',
    }
}

export default function VascularDiseaseStudyPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <NavBar />

            {/* Header Section */}
            <header className="bg-rose-900 text-white min-h-[400px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-rose-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-700 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-4xl relative z-10 py-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-rose-800/80 backdrop-blur-sm text-rose-200 text-sm font-bold tracking-wide mb-6 border border-rose-700/50">
                        보험 리모델링 심화 스터디
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight break-keep">
                        침묵의 살인자<br />
                        <span className="text-white">허혈성 심장질환의 모든 것</span>
                    </h1>
                    <p className="text-xl text-rose-100 opacity-90 mb-8 max-w-2xl leading-relaxed break-keep">
                        협심증부터 급성 심근경색, 그리고 심장돌연사까지.<br />
                        가장 흔하면서도 치명적인 심혈관 질환의 범위를 정확히 이해하고,<br />
                        가족력과 내 보험 상태를 든든하게 점검해 보세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-4xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">

                        {/* 1. 심장질환 범위 */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-rose-500 pb-2 mb-8 inline-block">
                                허혈성 심장질환의 4가지 범위
                            </h2>

                            <div className="space-y-12">
                                {/* 1. 협심증 */}
                                <div>
                                    <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white text-sm">1</span>
                                        협심증 (Angina Pectoris)
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed break-keep">
                                        심장 근육에 산소와 영양을 공급하는 관상동맥이 좁아져 발생하는 흉통입니다. 양상에 따라 크게 세 가지로 구분됩니다.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">안정형 협심증</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">계단을 오르거나 무거운 것을 들 때 등 일정한 활동 시 반복적으로 발생하는 흉통입니다. 휴식을 취하면 호전되는 특징이 있습니다.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">불안정형 협심증</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">이전보다 더 자주, 더 심하게 혹은 휴식 중에도 흉통이 발생합니다. 급성 심근경색으로 진행될 위험이 매우 높은 상태입니다.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">이형 협심증 (Prinzmetal angina)</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">관상동맥의 일시적인 경련(Spasm)으로 인해 발생하며, 운동과 무관하게 주로 밤이나 이른 아침 휴식 중에 흉통이 나타납니다.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. 심근경색 */}
                                <div>
                                    <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white text-sm">2</span>
                                        심근경색 (Myocardial Infarction, MI)
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed break-keep">
                                        관상동맥이 혈전 등에 의해 <strong>완전히 막혀 심장 근육(심근)이 괴사</strong>하는 치명적인 질환입니다. 심전도 결과에 따라 중증도가 나뉩니다.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">초응급</span> STEMI
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <strong>ST분절 상승 심근경색:</strong> 심전도에서 ST 분절의 뚜렷한 상승이 보이며, 혈관이 완전히 막혀 광범위한 심근 괴사가 진행 중인 매우 응급한 상태입니다. 즉각적인 재개통 시술이 필요합니다.
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">응급</span> NSTEMI
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <strong>비 ST분절 상승 심근경색:</strong> 심전도상 ST 분절 상승은 명확하지 않으나, 혈액 검사상 심근 손상을 의미하는 표지자(markers) 수치가 상승한 상태입니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3/4. 무증상 허혈 / 심장돌연사 */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white text-sm">3</span>
                                            무증상 허혈
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed break-keep">
                                            <strong>Silent Ischemia:</strong> 흉통 등 뚜렷한 증상이 전혀 없음에도 불구하고, 심전도나 운동부하 검사 등에서 심장으로 가는 혈류가 부족한(허혈) 소견이 관찰되는 상태입니다.<br /><br />
                                            오랜 기간 당뇨를 앓고 계신 분이나 고혈압 환자, 고령자에게서 흔히 발생하며 심장마비로 직결될 위험이 있습니다.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white text-sm">4</span>
                                            심장돌연사
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed break-keep">
                                            <strong>Sudden Cardiac Death:</strong> 관상동맥 질환이 원인이 되어 심실세동, 심실빈맥 등 치명적인 부정맥이 발생해 1시간 이내에 사망에 이르는 불의의 급사를 의미합니다.<br /><br />
                                            평소 뚜렷한 징후 없이 발생할 수 있어 철저한 예방과 관리가 중요합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. 분류 기준 요약 */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-rose-500 pb-2 mb-6 inline-block">
                                허혈성 심장질환 요약표
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-800">
                                            <th className="py-3 px-4 font-bold border-b border-gray-200">분류 기준</th>
                                            <th className="py-3 px-4 font-bold border-b border-gray-200">세부 내용 및 상태</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-semibold text-rose-900 w-1/4">증상의 유무</td>
                                            <td className="py-4 px-4">
                                                <strong>증상성:</strong> 협심증, 심근경색 등 흉통 발생<br />
                                                <strong>무증상:</strong> 무증상 허혈 (당뇨, 고령자 주의)
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-semibold text-rose-900">시간적 경과</td>
                                            <td className="py-4 px-4">
                                                <strong>급성 관상동맥 증후군(ACS):</strong> 불안정형 협심증, NSTEMI, STEMI 등 초응급 상태<br />
                                                <strong>만성 관상동맥 증후군:</strong> 안정형 협심증 등
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-semibold text-rose-900">혈관의 상태</td>
                                            <td className="py-4 px-4">
                                                <strong>죽상경화증 (atherosclerosis):</strong> 찌꺼기로 혈관이 좁아진 상태<br />
                                                <strong>혈전 (thrombus):</strong> 피떡이 혈관을 완전히 틀어막은 상태<br />
                                                <strong>혈관 경련 (spasm):</strong> 혈관이 일시적으로 수축하여 막히는 상태 (이형 협심증)
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 text-center mt-12">
                            <h3 className="text-2xl font-bold text-rose-900 mb-4">내 심혈관 질환 진단비, 어디까지 보장될까요?</h3>
                            <p className="text-rose-800 mb-8 max-w-lg mx-auto leading-relaxed">
                                &apos;급성심근경색증&apos; 진단비만 있다면, 전체 심혈관 질환의 10%도 보장받지 못합니다.<br />
                                빈도가 훨씬 높은 <strong>&apos;협심증&apos;</strong>까지 보장되는 <strong>&apos;허혈성 심장질환 진단비&apos;</strong>를 갖추었는지 꼭 확인하세요.
                            </p>
                            <Link href="/#consultation" className="inline-block bg-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-rose-700 transition-colors">
                                내 심혈관 보험 무료 점검하기
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
