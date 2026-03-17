'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function FifthGenGuide() {
  const { t } = useLanguage()

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-8 md:p-12 text-white text-center rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          5세대 실손의료보험<br className="md:hidden" /> 핵심 가이드
        </h1>
        <p className="mt-4 text-blue-100 font-medium text-lg">
          중증부터 비중증, 급여까지 알기 쉽게 정리했습니다.
        </p>
      </div>

      {/* 1. 중증 비급여 */}
      <section>
        <h2 className="text-[1.15rem] sm:text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-6 inline-block tracking-tight whitespace-nowrap">
          1. 중증 비급여 의료비(상해/질병)
        </h2>
        <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
          산정특례 대상 질환(암, 심장/뇌혈관 질환, 희귀난치성 질환 등)으로 인한 비급여 치료에 해당합니다.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-400 rounded-full inline-block"></span>
              연간 한도
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>입원과 통원을 합산하여 상해 비급여 연간 5,000만 원, 질병 비급여 연간 5,000만 원 한도 내에서 보상합니다.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4">중증 3대 비급여 (특약)</h3>
            <ul className="space-y-5 md:space-y-2 text-blue-800 text-sm md:text-base">
              <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                <span className="font-bold shrink-0">· 도수·체외충격파 치료:</span>
                <span className="pl-3 md:pl-0 leading-relaxed font-semibold">연간 350만 원 / 최대 50회 한도</span>
              </li>
              <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                <span className="font-bold shrink-0">· 주사료:</span>
                <span className="pl-3 md:pl-0 leading-relaxed font-semibold">연간 250만 원 / 최대 50회 한도</span>
              </li>
              <li className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-2">
                <span className="font-bold shrink-0">· MRI/MRA:</span>
                <span className="pl-3 md:pl-0 leading-relaxed font-semibold">연간 300만 원 이내</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. 비중증 비급여 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-6 inline-block">
          2. 비중증 비급여 의료비 (상해/질병)
        </h2>
        <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-[15px]">
          일반적인 질환으로 인한 비급여 치료로, 중증 대비 한도가 대폭 축소되었습니다.
        </p>

        <div className="space-y-4">
          <div className="p-5 bg-gray-100 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">연간 한도 축소</h3>
            <p className="text-gray-700">상해/질병 각각 연간 1,000만 원 한도 (중증의 1/5 수준)</p>
          </div>
          <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="text-lg font-bold text-red-800 mb-2">자기부담금 상향</h3>
            <p className="text-red-700">비급여 의료비의 50% 본인 부담 (통원 공제 최소 5만 원)</p>
          </div>
        </div>
      </section>

      {/* 핵심 요약표 */}
      <section className="pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">핵심 요약 (중증 vs 비중증)</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-gray-200">구분</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200">중증 비급여</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200">비중증 비급여</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium border-b border-gray-100 text-gray-900">연간 한도</td>
                <td className="px-6 py-4 border-b border-gray-100 text-blue-600 font-bold">5,000만 원</td>
                <td className="px-6 py-4 border-b border-gray-100 text-gray-500">1,000만 원</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium border-b border-gray-100 text-gray-900">본인부담률</td>
                <td className="px-6 py-4 border-b border-gray-100 text-blue-600 font-bold">30%</td>
                <td className="px-6 py-4 border-b border-gray-100 text-red-500 font-bold">50%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Warning */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900">
        <p className="font-bold flex items-center gap-2 mb-2">
          <span className="text-lg">⚠️</span> 비중증 3대 비급여 면책 주의
        </p>
        <p className="text-sm leading-relaxed">
          비중증의 경우 비급여 도수치료, 체외충격파, 주사료는 보상하지 않습니다. (면책)
        </p>
      </div>
    </div>
  )
}
