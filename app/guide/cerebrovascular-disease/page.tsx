import type { Metadata } from 'next'
import PlannerBranding from '@/components/PlannerBranding'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '뇌혈관질환 스터디 | 뇌졸중 가이드',
    description: '허혈성 뇌졸중부터 출혈성 뇌졸중까지, 뇌혈관 질환의 모든 것과 대비 방법을 안내합니다.',
    openGraph: {
        title: '뇌혈관질환 스터디 | 뇌졸중 가이드',
        description: '뇌졸중(뇌경색, 뇌출혈)의 증상, 대처법, 예방 및 치료의 핵심을 전문가의 시선으로 정리했습니다.',
        url: 'https://stroy.kr/guide/cerebrovascular-disease',
    }
}

export default function CerebrovascularDiseaseStudyPage() {
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            {/* Header Section */}
            <header className="bg-indigo-900 text-white min-h-[400px] flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-4xl relative z-10 py-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-800/80 backdrop-blur-sm text-indigo-200 text-sm font-bold tracking-wide mb-6 border border-indigo-700/50">
                        질환 스터디 시리즈
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight break-keep">
                        골든타임이 생명,<br />
                        <span className="text-white">뇌혈관질환(뇌졸중) 가이드</span>
                    </h1>
                    <p className="text-xl text-indigo-100 opacity-90 mb-8 max-w-2xl leading-relaxed break-keep">
                        전체 뇌졸중의 80%를 차지하는 뇌경색부터 치명적인 뇌출혈까지.<br />
                        의학적 분류와 최신 치료 가이드라인을 쉽게 이해하고,<br />
                        나의 뇌혈관 질환 보험 대비가 탄탄한지 점검해보세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-4xl -mt-10 px-4 mb-24 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">

                        {/* 1. 뇌혈관질환의 큰 틀 */}
                        <section className="mb-14">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-8 inline-block">
                                1. 뇌혈관질환의 큰 틀과 핵심 분류
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed break-keep">
                                뇌혈관질환의 가장 핵심은 <strong>뇌졸중(Stroke)</strong>입니다. 크게 혈류가 막혀 발생하는 <strong>허혈성 뇌졸중(뇌경색)</strong>과 혈관이 터져 생기는 <strong>출혈성 뇌졸중(뇌출혈)</strong>으로 나뉘며, 비율은 약 80:20 수준입니다.
                            </p>
                            
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
                                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    꼭 기억해야 할 TIA (일과성 허혈발작)
                                </h3>
                                <p className="text-sm text-indigo-800 leading-relaxed break-keep">
                                    <strong>TIA</strong>는 뇌졸중 증상이 잠깐 나타났다가 사라지는 현상입니다. 증상이 저절로 좋아져도 절대 안심해선 안 되며, 큰 뇌졸중이 오기 전 보내는 <strong>&apos;경고성 뇌졸중&apos;</strong>이므로 즉시 응급으로 다뤄야 합니다.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">허혈성 뇌졸중 (뇌경색)</h4>
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">원인에 따라 <strong>TOAST 분류</strong>를 많이 사용하며, 원인별로 재발 예방 전략(항응고제 vs 항혈소판제)이 완전히 달라집니다.</p>
                                    <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                                        <li>대혈관 죽상경화 (동맥경화)</li>
                                        <li>심장색전 (심방세동 등 원인)</li>
                                        <li>소혈관 폐색 (열공성 뇌경색)</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">출혈성 뇌졸중 (뇌출혈)</h4>
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">발생 위치에 따라 크게 두 가지로 나뉘며, 급속한 뇌압 상승 등 예후가 매우 나쁠 수 있습니다.</p>
                                    <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                                        <li><strong>뇌내출혈(ICH):</strong> 뇌실질 안으로 출혈. 주요 위험인자는 조절 안 된 고혈압.</li>
                                        <li><strong>지주막하출혈(SAH):</strong> 주로 뇌동맥류 파열이 원인이며 응급 수술 필요.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. 증상과 응급 인지 F.A.S.T */}
                        <section className="mb-14">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-6 inline-block">
                                2. 응급 인지와 대처법 (F.A.S.T.)
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                갑작스러운 한쪽 마비, 말 어눌함, 시야/보행 장애, 원인 모를 심한 두통이 발생하면 즉시 응급실로 가야 합니다. <strong>F.A.S.T.</strong> 캠페인을 반드시 기억하세요.
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                                    <div className="text-3xl font-black text-indigo-600 mb-2">F</div>
                                    <h4 className="font-bold text-gray-900 mb-1">Face</h4>
                                    <p className="text-xs text-gray-500">얼굴 한쪽 입꼬리 처짐</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                                    <div className="text-3xl font-black text-indigo-600 mb-2">A</div>
                                    <h4 className="font-bold text-gray-900 mb-1">Arm</h4>
                                    <p className="text-xs text-gray-500">한쪽 팔다리 힘 빠짐</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                                    <div className="text-3xl font-black text-indigo-600 mb-2">S</div>
                                    <h4 className="font-bold text-gray-900 mb-1">Speech</h4>
                                    <p className="text-xs text-gray-500">말이 어눌해짐</p>
                                </div>
                                <div className="bg-red-50 rounded-2xl p-5 text-center border border-red-100">
                                    <div className="text-3xl font-black text-red-600 mb-2">T</div>
                                    <h4 className="font-bold text-gray-900 mb-1">Time</h4>
                                    <p className="text-xs text-red-700">지체 없이 응급 대처</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. 급성기 치료 핵심 */}
                        <section className="mb-14">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-6 inline-block">
                                3. 질환별 급성기 치료의 핵심
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-auto bg-indigo-500 rounded-full shrink-0"></div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">허혈성 뇌졸중 (뇌경색)</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                            시간이 지날수록 뇌 손상이 커지므로 <strong>최대한 빨리 재관류</strong>하는 것이 목표입니다.
                                        </p>
                                        <ul className="text-sm text-gray-500 list-inside list-disc">
                                            <li><strong>정맥혈전용해(IVT):</strong> 발병 4.5시간 이내 적절한 환자에게 Alteplase 등 투여</li>
                                            <li><strong>기계적 혈전제거술(EVT):</strong> 대혈관폐색의 표준 치료로, 24시간 이내라도 강하게 권고됨</li>
                                            <li>혈압·혈당을 수치 목표에 맞춰 지나치게 강하게 낮추지 않고 완만히 조절</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-auto bg-rose-500 rounded-full shrink-0"></div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">뇌내출혈 (ICH) & 지주막하출혈 (aSAH)</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                            매우 치명적(초기 사망률 30-40%)이며, 혈종의 확장과 뇌압 상승을 막는 것이 핵심입니다.
                                        </p>
                                        <ul className="text-sm text-gray-500 list-inside list-disc">
                                            <li><strong>뇌내출혈:</strong> 철저하고 지속적인 혈압 조절, 필요시 항응고제 역전 투여</li>
                                            <li><strong>지주막하출혈:</strong> 재출혈 위험이 높으므로 24시간 내 파열 동맥류 수술(클립/코일) 및 전문 치료가 필수</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. 예방 전략 */}
                        <section className="mb-14">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-6 inline-block">
                                4. 첫 발생 막기 vs 재발 막기 (예방 전략)
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                가장 중요한 위험인자는 <strong>고혈압</strong>이며 흡연, 당뇨, 심방세동도 주요 원인입니다. 첫 발생(1차)도 예방 가능합니다.
                            </p>
                            
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <h4 className="font-bold text-indigo-900 mb-3 text-lg flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        1차 예방 (첫 발생 막기)
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                        <li>지중해식 식사와 신체 활동(주 150분 이상)</li>
                                        <li>적극적인 혈압 및 비만/당뇨 관리</li>
                                        <li>당뇨+고위험군 시 GLP-1 사용 고려</li>
                                    </ul>
                                </div>
                                <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
                                    <h4 className="font-bold text-indigo-900 mb-3 text-lg flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        2차 예방 (재발 방지)
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                        <li><strong>혈압 목표:</strong> 대부분 130/80 mmHg 미만</li>
                                        <li><strong>지질 목표:</strong> LDL 콜레스테롤 70 mg/dL 미만</li>
                                        <li>환자 원인에 맞는 항혈전제 혹은 항응고제 사용 (일반적으로 장기 이중항혈소판 요법은 비권장)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 5. 스터디 요약표 */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-6 inline-block">
                                스터디용 핵심 숫자 암기장
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-800">
                                            <th className="py-3 px-4 font-bold border-b border-gray-200">핵심 숫자</th>
                                            <th className="py-3 px-4 font-bold border-b border-gray-200">의미와 적용</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-black text-indigo-700 text-lg w-1/4">4.5시간</td>
                                            <td className="py-4 px-4">정맥혈전용해술(IVT)을 시도할 수 있는 기본 골든타임 시간창</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-black text-indigo-700 text-lg">24시간</td>
                                            <td className="py-4 px-4">기저동맥 폐색 등 큰 혈관 막힘 시 기계적 혈전제거술(EVT)이 권고되는 최대 한계망</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-black text-indigo-700 text-lg">&lt;130/80</td>
                                            <td className="py-4 px-4">뇌졸중 발생 후 재발 방지(2차 예방)를 위한 적극적인 혈압 조절 목표치</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-black text-indigo-700 text-lg">LDL &lt;70</td>
                                            <td className="py-4 px-4">재발 방지를 위한 악성 콜레스테롤 조절 목표 수치</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors bg-white">
                                            <td className="py-4 px-4 font-black text-indigo-700 text-lg">21-90일</td>
                                            <td className="py-4 px-4">가벼운 뇌졸중이나 고위험 TIA 직후 단기적으로 두 가지 항혈소판제(DAPT)를 병합해 먹는 기간</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 text-center mt-12">
                            <h3 className="text-2xl font-bold text-indigo-900 mb-4">내 뇌혈관 질환 진단비, &apos;뇌경색&apos;도 보장되나요?</h3>
                            <p className="text-indigo-800 mb-8 max-w-lg mx-auto leading-relaxed">
                                오래전 가입한 보험이라면 뇌졸중 전체의 20%에 불과한 <strong>&apos;뇌출혈&apos;</strong>만 보장될 확률이 높습니다.<br />
                                뇌졸중의 대부분인 <strong>&apos;뇌경색(허혈성 뇌졸중)&apos;</strong>과 가벼운 초기 증상까지 폭폭게 대비했는지 꼭 확인하세요.
                            </p>
                            <Link href="/#consultation" className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                                내 뇌혈관 보험 무료 점검하기
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <PlannerBranding />
        </div>
    )
}
