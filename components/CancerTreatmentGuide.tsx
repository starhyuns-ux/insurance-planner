'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function CancerTreatmentGuide() {
  const { t } = useLanguage()

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-800/80 backdrop-blur-sm text-blue-100 text-sm font-bold mb-6">
            암 치료 트렌드 리포트
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            암 치료 통합 가이드:<br />
            <span className="text-blue-400">수술, 방사선, 그리고 약물</span>
          </h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed">
            전통적인 방식부터 최첨단 신의료기술까지, 고액 암 치료비에 대비하기 위한 필수 지식입니다.
          </p>
        </div>
      </div>

      {/* 1. 수술 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-lg">1</span>
          <h2 className="text-2xl font-extrabold text-gray-900">수술 치료</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">내시경 및 복강경 수술</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              최소 침습으로 절개 부위가 작아 회복이 빠르며, 현재 대부분의 소화기계 암 수술에 표준으로 활용됩니다.
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-1">로봇 수술 (Robot-assisted)</h4>
            <p className="text-sm text-blue-800 leading-relaxed mb-3">
              사람 손보다 정교한 조작으로 정밀한 암 제거가 가능하며, 평균 치료비는 2,000만원 이상입니다.
            </p>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">고액 치료</span>
          </div>
        </div>
      </section>

      {/* 2. 방사선 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold shadow-lg">2</span>
          <h2 className="text-2xl font-extrabold text-gray-900">항암 방사선 치료</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">세기조절 방사선 (IMRT)</h4>
            <p className="text-xs text-gray-500 leading-relaxed">방사선 세기를 조절하여 종양 형태에 맞게 조사하고 주변 손상을 줄입니다.</p>
          </div>
          <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <h4 className="font-bold mb-2 text-white">중입자 치료 (Dream Therapy)</h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-3">암세포만 정밀 타격하는 꿈의 치료기입니다. 평균 치료비는 약 6,000만원입니다.</p>
            <div className="text-right font-black text-indigo-200">6,000만 원~</div>
          </div>
        </div>
      </section>

      {/* 3. 항암 약물 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold shadow-lg">3</span>
          <h2 className="text-2xl font-extrabold text-gray-900">항암 약물 치료</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-100 text-gray-400 font-bold">2G</div>
            <div>
              <h4 className="font-bold text-gray-900">표적 항암제</h4>
              <p className="text-xs text-gray-600">암세포의 특정 유전자를 공격하여 정상 세포 손상을 최소화합니다.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold shadow-sm">3G</div>
            <div>
              <h4 className="font-bold text-emerald-900">면역 항암제</h4>
              <p className="text-xs text-emerald-800">환자의 면역체계를 활성화하여 암세포를 스스로 공격하게 만듭니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Note */}
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <p className="text-red-900 text-sm leading-relaxed">
          <span className="font-bold">⚠️ 확인하세요!</span><br />
          최신 고액 암 치료비는 수천만 원에 달합니다. 현재 보험의 진단비 한도가 충분한지 반드시 전문가와 점검해야 합니다.
        </p>
      </div>
    </div>
  )
}
