import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
    title: '5세대 실손보험 가이드 | 보험다이어트',
    description: '새롭게 개편된 5세대 실손의료보험의 중증, 비중증, 급여 의료비 보장 내용을 알기 쉽게 정리한 가이드입니다.',
}

export default function FifthGenGuidePage() {
    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-1 py-20 px-4 mt-16">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 text-white text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            5세대 실손의료보험<br className="md:hidden" /> 핵심 가이드
                        </h1>
                        <p className="mt-4 text-primary-100 font-medium text-lg">
                            중증부터 비중증, 급여까지 알기 쉽게 정리했습니다.
                        </p>
                    </div>

                    <div className="p-6 md:p-12 space-y-12">

                        {/* 1. 중증 비급여 */}
                        <section>
                            <h2 className="text-[1.15rem] sm:text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block tracking-tight whitespace-nowrap">
                                1. 중증 비급여 의료비(상해/질병)
                            </h2>
                            <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
                                산정특례 대상 질환(암, 심장/뇌혈관 질환, 희귀난치성 질환 등)으로 인한 비급여 치료에 해당합니다.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        연간 한도
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li>입원과 통원을 합산하여 상해 비급여 연간 5,000만 원, 질병 비급여 연간 5,000만 원 한도 내에서 보상합니다.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        입원 의료비
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li><strong>본인부담/공제:</strong> 본인이 부담한 비급여 의료비의 30% 본인 부담 (70% 보상).</li>
                                        <li><strong>상급병실료 차액:</strong> 50% 본인 부담 (1일 평균금액 10만 원 한도).</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        통원 의료비 (외래 및 처방조제)
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li><strong>연간 통원 한도:</strong> 매년 계약해당일로부터 연간 100회 한도.</li>
                                        <li><strong>1회당 공제금액:</strong> 3만 원과 보장대상 의료비의 30% 중 큰 금액을 공제.</li>
                                    </ul>
                                </div>

                                <div className="bg-primary-50 p-5 rounded-2xl border border-primary-100">
                                    <h3 className="text-lg font-bold text-primary-900 mb-4">중증 3대 비급여 (특약)</h3>
                                    <ul className="space-y-5 md:space-y-2 text-primary-800 text-sm md:text-base">
                                        <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                                            <span className="font-bold shrink-0 text-base md:text-sm">· 도수·체외충격파 치료:</span>
                                            <span className="pl-3 md:pl-0 leading-relaxed">
                                                <span className="bg-yellow-200 text-yellow-900 font-extrabold px-1.5 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:text-primary-800">연간 350만 원 이내</span><br className="md:hidden" />
                                                <span className="text-primary-700/80 md:text-primary-800 md:before:content-[',_']">최대 50회 한도 (1회 공제: 3만 원과 30% 중 큰 금액)</span>
                                            </span>
                                        </li>
                                        <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                                            <span className="font-bold shrink-0 text-base md:text-sm">· 주사료:</span>
                                            <span className="pl-3 md:pl-0 leading-relaxed">
                                                <span className="bg-yellow-200 text-yellow-900 font-extrabold px-1.5 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:text-primary-800">연간 250만 원 이내</span><br className="md:hidden" />
                                                <span className="text-primary-700/80 md:text-primary-800 md:before:content-[',_']">최대 50회 한도 (1회 공제: 3만 원과 30% 중 큰 금액)</span>
                                            </span>
                                        </li>
                                        <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                                            <span className="font-bold shrink-0 text-base md:text-sm">· 자기공명영상진단(MRI/MRA):</span>
                                            <span className="pl-3 md:pl-0 leading-relaxed">
                                                <span className="bg-yellow-200 text-yellow-900 font-extrabold px-1.5 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:text-primary-800">연간 300만 원 이내</span><br className="md:hidden" />
                                                <span className="text-primary-700/80 md:text-primary-800 md:before:content-['한도_']">(1회 공제: 3만 원과 30% 중 큰 금액)</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. 비중증 비급여 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block">
                                2. 비중증 비급여 의료비 (상해 / 질병)
                            </h2>
                            <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
                                산정특례 대상 질환이 아닌 일반적인 질환으로 인한 비급여 치료에 해당합니다.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        연간 한도
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li>입원과 통원을 합산하여 상해 비급여 연간 1,000만 원, 질병 비급여 연간 1,000만 원 한도로 중증 대비 한도가 대폭 축소되었습니다.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        입원 의료비
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li><strong>본인부담/공제:</strong> 본인이 부담한 비급여 의료비의 50% 본인 부담 (50% 보상).</li>
                                        <li><strong>1회(회당) 입원 한도:</strong> 단, 종합병원을 제외한 일반 의료기관 등에서 발생한 비급여 의료비는 회당 300만 원까지만 보상합니다.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-primary-400 rounded-full inline-block"></span>
                                        통원 의료비 (외래 및 처방조제)
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                                        <li><strong>연간 통원 한도:</strong> 매년 계약해당일로부터 연간 100일(회) 한도.</li>
                                        <li><strong>1회당 공제금액:</strong> 5만 원과 보장대상 의료비의 50% 중 큰 금액을 공제 (본인부담금 대폭 상향).</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-100 p-5 rounded-2xl border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">비중증 비급여 자기공명영상진단(MRI)</h3>
                                    <p className="text-gray-700 text-sm md:text-base">
                                        연간 200만 원 한도 (1회 공제: 5만 원과 50% 중 큰 금액)
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. 급여 의료비 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 mb-6 inline-block">
                                3. 급여 의료비 (참고사항)
                            </h2>
                            <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
                                국민건강보험이 적용되는 급여 부분 의료비입니다.
                            </p>

                            <div className="space-y-4 text-gray-600 ml-2">
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>입원:</strong> 요양급여 중 본인부담금의 20%를 제외하고 보상 (상세 공제 조건은 기존과 유사).</li>
                                    <li><strong>통원 1회당 공제금액:</strong> 병원 규모에 따라 1~2만 원과 보장대상 의료비의 20% 중 큰 금액을 공제합니다.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 핵심 요약표 */}
                        <section className="pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">핵심 요약 테이블 (중증 vs 비중증)</h2>

                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-100 text-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 font-bold border-b border-gray-200">구분</th>
                                            <th className="px-6 py-4 font-bold border-b border-gray-200 border-l">중증 비급여 (산정특례 대상)</th>
                                            <th className="px-6 py-4 font-bold border-b border-gray-200 border-l">비중증 비급여 (일반 질환)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">연간 한도</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">상해/질병 각각 5,000만 원</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">상해/질병 각각 1,000만 원</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">입원 본인부담금</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">30% 본인 부담</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">50% 본인 부담<br /><span className="text-xs text-gray-400">(종합병원 외 일반 병원은 회당 300만 원 한도)</span></td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">통원 한도</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">연간 100회</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">연간 100일(회)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">통원 1회당 공제</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">3만 원과 30% 중 큰 금액</td>
                                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100 border-l">5만 원과 50% 중 큰 금액</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">3대 비급여 특약</td>
                                            <td className="px-6 py-4 text-gray-600 border-l">도수(350만/50회), 주사(250만/50회),<br />MRI(300만)</td>
                                            <td className="px-6 py-4 text-gray-600 border-l">비중증 MRI(200만) 한도 제한</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 유의사항 (1번 테이블 바로 아래로 이동됨) */}
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mt-6">
                                <h4 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                                    유의사항 (비중증 3대 비급여 면책)
                                </h4>
                                <p className="text-red-700 text-sm md:text-base leading-relaxed">
                                    비중증의 경우 비급여 도수치료, 체외충격파 치료, 주사료(항암제 등 제외)에 수반되는 의료비는 아예 보상하지 않습니다(면책). 보상 여부는 보험약관 및 개별 진단 기준에 따라 다를 수 있습니다.
                                </p>
                            </div>
                        </section>

                        {/* 세대별 실손 비교표 */}
                        <section className="pt-8 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">세대별 실손의료보험 비교 (1세대 ~ 4세대)</h2>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-nowrap break-keep">
                                    <thead className="bg-primary-50 text-primary-900">
                                        <tr>
                                            <th className="px-5 py-4 font-bold border-b border-primary-100 text-center whitespace-nowrap bg-primary-100/30 sticky left-0 z-10 backdrop-blur-sm">구분</th>
                                            <th className="px-5 py-4 font-bold border-b border-primary-100 border-l border-primary-100/50 text-center">
                                                <div className="text-lg">1세대</div>
                                                <div className="text-xs font-normal text-primary-700 mt-1">~2009.09</div>
                                            </th>
                                            <th className="px-5 py-4 font-bold border-b border-primary-100 border-l border-primary-100/50 text-center">
                                                <div className="text-lg">2세대</div>
                                                <div className="text-xs font-normal text-primary-700 mt-1">2009.10~2017.03</div>
                                            </th>
                                            <th className="px-5 py-4 font-bold border-b border-primary-100 border-l border-primary-100/50 text-center">
                                                <div className="text-lg">3세대</div>
                                                <div className="text-xs font-normal text-primary-700 mt-1">2017.04~2021.06</div>
                                            </th>
                                            <th className="px-5 py-4 font-bold border-b border-primary-100 border-l border-primary-100/50 text-center">
                                                <div className="text-lg">4세대</div>
                                                <div className="text-xs font-normal text-primary-700 mt-1">2021.07~현재</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">보장 구조</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">상해·질병<br className="md:hidden" /> 입·통원 통합</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">급여+비급여 통합</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">급여 중심,<br className="md:hidden" /> 비급여 특약</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">급여/비급여<br className="md:hidden" /> 완전 분리(특약)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">비급여 범위</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">거의 전체 포함</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">대부분 포함</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">도수·주사 특약</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">특약 필수,<br className="md:hidden" /> 경증 제한</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">자기부담률</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">0~20%</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">급여 10~20%<br />비급여 20%</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">급여 10~20%<br />비급여 20%</td>
                                            <td className="px-5 py-3 text-primary-700 font-semibold border-b border-gray-100 border-l text-center">급여 20%<br />비급여 30%</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">도수치료 특약</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">본계약 포함</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">포함</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">특약 분리</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">특약 한정<br className="md:hidden" />(회수 제한)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">갱신 주기</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">3~5년</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">1~3년</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">1년</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">1년</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">재가입 조건</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">없음</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">15년</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">15년</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">5년 후 재가입<br className="md:hidden" />(전환 가능성)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">보험료 수준</td>
                                            <td className="px-5 py-3 text-red-600 font-semibold border-b border-gray-100 border-l text-center">높음</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">중간</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">중간</td>
                                            <td className="px-5 py-3 text-primary-600 font-semibold border-b border-gray-100 border-l text-center">낮음</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 border-b border-gray-100 bg-gray-50/80 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">할인/할증</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">없음</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">없음</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">2년 할인</td>
                                            <td className="px-5 py-3 text-gray-700 border-b border-gray-100 border-l text-center">할인/할증 있음</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-bold text-gray-900 bg-gray-50/80 text-center whitespace-nowrap rounded-bl-xl sticky left-0 z-10 backdrop-blur-sm">특징</td>
                                            <td className="px-5 py-3 text-gray-700 border-l text-center">보장 매우 넓음</td>
                                            <td className="px-5 py-3 text-gray-700 border-l text-center">표준화</td>
                                            <td className="px-5 py-3 text-gray-700 border-l text-center">특약 통제</td>
                                            <td className="px-5 py-3 text-gray-700 border-l text-center rounded-br-xl">이용량 따라<br className="md:hidden" /> 보험료 차등</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="text-center pt-8 mt-8">
                            <Link href="/#consultation" className="inline-block bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary-700 transition-colors">
                                내 보험 무료 진단 받기
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
