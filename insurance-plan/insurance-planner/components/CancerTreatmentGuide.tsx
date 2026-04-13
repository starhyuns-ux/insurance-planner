'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function CancerTreatmentGuide() {
  const { locale } = useLanguage()

  const content = {
    ko: {
      badge: '암 치료 트렌드 리포트',
      title: '암 치료 통합 가이드:',
      subtitle: '수술, 방사선, 그리고 약물',
      intro: '전통적인 방식부터 최첨단 신의료기술까지, 고액 암 치료비에 대비하기 위한 필수 지식입니다.',
      sec1Title: '수술 치료',
      sec1Items: [
        { title: '내시경 및 복강경 수술', desc: '최소 침습으로 절개 부위가 작아 회복이 빠르며, 현재 대부분의 소화기계 암 수술에 표준으로 활용됩니다.', type: 'normal' },
        { title: '로봇 수술 (Robot-assisted)', desc: '사람 손보다 정교한 조작으로 정밀한 암 제거가 가능하며, 평균 치료비는 2,000만원 이상입니다.', type: 'high', badge: '고액 치료' }
      ],
      sec2Title: '항암 방사선 치료',
      sec2Items: [
        { title: '세기조절 방사선 (IMRT)', desc: '방사선 세기를 조절하여 종양 형태에 맞게 조사하고 주변 손상을 줄입니다.' },
        { title: '중입자 치료 (Dream Therapy)', desc: '암세포만 정밀 타격하는 꿈의 치료기입니다. 평균 치료비는 약 6,000만원입니다.', price: '6,000만 원~' }
      ],
      sec3Title: '항암 약물 치료',
      sec3Items: [
        { gen: '2G', title: '표적 항암제', desc: '암세포의 특정 유전자를 공격하여 정상 세포 손상을 최소화합니다.' },
        { gen: '3G', title: '면역 항암제', desc: '환자의 면역체계를 활성화하여 암세포를 스스로 공격하게 만듭니다.' }
      ],
      footerWarning: '⚠️ 확인하세요!',
      footerDesc: '최신 고액 암 치료비는 수천만 원에 달합니다. 현재 보험의 진단비 한도가 충분한지 반드시 전문가와 점검해야 합니다.'
    },
    en: {
      badge: 'Cancer Treatment Trend Report',
      title: 'Integrated Cancer Treatment Guide:',
      subtitle: 'Surgery, Radiation, and Drugs',
      intro: 'Essential knowledge to prepare for high cancer treatment costs, from traditional methods to cutting-edge technologies.',
      sec1Title: 'Surgical Treatment',
      sec1Items: [
        { title: 'Endoscopic & Laparoscopic', desc: 'Minimally invasive with small incisions and fast recovery. Standard for most digestive cancers.', type: 'normal' },
        { title: 'Robot-assisted Surgery', desc: 'More precise removal than human hands. Average cost exceeds 20M KRW.', type: 'high', badge: 'High Cost' }
      ],
      sec2Title: 'Radiation Therapy',
      sec2Items: [
        { title: 'Intensity Modulated (IMRT)', desc: 'Adjusts radiation intensity to match tumor shape and reduce surrounding damage.' },
        { title: 'Heavy Ion Therapy', desc: 'Precision strike on cancer cells. Average cost is around 60M KRW.', price: 'From 60M KRW' }
      ],
      sec3Title: 'Drug Treatment',
      sec3Items: [
        { gen: '2G', title: 'Targeted Therapy', desc: 'Attacks specific genes in cancer cells to minimize damage to healthy cells.' },
        { gen: '3G', title: 'Immunotherapy', desc: 'Activates the patient\'s immune system to attack cancer cells naturally.' }
      ],
      footerWarning: '⚠️ Please Check!',
      footerDesc: 'Latest high-end cancer treatments cost tens of millions of KRW. You must check with an expert if your current diagnosis limit is sufficient.'
    },
    cn: {
      badge: '癌症治疗趋势报告',
      title: '癌症治疗综合指南：',
      subtitle: '手术、放疗及药物治疗',
      intro: '从传统疗法到尖端新医疗技术，为您普及高额癌症治疗费用的必备知识。',
      sec1Title: '手术治疗',
      sec1Items: [
        { title: '内镜及腹腔镜手术', desc: '微创切口小、恢复快，是目前大多数消化系统癌症的标准手术方式。', type: 'normal' },
        { title: '机器人辅助手术', desc: '比人手更精准的操作，可精密切除癌细胞。平均治疗费用在 2,000万 韩元以上。', type: 'high', badge: '高额治疗' }
      ],
      sec2Title: '癌症放射治疗',
      sec2Items: [
        { title: '调强放射治疗 (IMRT)', desc: '通过调节放射强度，针对肿瘤形状进行精准照射，减少周围组织损伤。' },
        { title: '重离子治疗 (Dream Therapy)', desc: '精准打击癌细胞的“梦想疗法”。平均治疗费用约为 6,000万 韩元。', price: '6,000万 韩元起' }
      ],
      sec3Title: '抗癌药物治疗',
      sec3Items: [
        { gen: '2代', title: '靶向药物', desc: '攻击癌细胞的特定基因，最大限度减少对正常细胞的损伤。' },
        { gen: '3代', title: '免疫药物', desc: '激活患者自身的免疫系统，使免疫细胞主动攻击癌细胞。' }
      ],
      footerWarning: '⚠️ 请确认！',
      footerDesc: '最新的高额癌症治疗费用动辄数千万韩元。请务必咨询专家，确认您目前的保险诊断金限额是否充足。'
    }
  }

  const t_curr = content[locale as keyof typeof content] || content.ko

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-800/80 backdrop-blur-sm text-blue-100 text-sm font-bold mb-6">
            {t_curr.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {t_curr.title}<br />
            <span className="text-blue-400">{t_curr.subtitle}</span>
          </h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed">
            {t_curr.intro}
          </p>
        </div>
      </div>

      {/* 1. 수술 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-lg">1</span>
          <h2 className="text-2xl font-extrabold text-gray-900">{t_curr.sec1Title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {t_curr.sec1Items.map((item, idx) => (
            <div key={idx} className={`rounded-2xl p-6 border ${item.type === 'high' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-bold mb-2 ${item.type === 'high' ? 'text-blue-900' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${item.type === 'high' ? 'text-blue-800 mb-3' : 'text-gray-600'}`}>
                {item.desc}
              </p>
              {item.badge && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. 방사선 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold shadow-lg">2</span>
          <h2 className="text-2xl font-extrabold text-gray-900">{t_curr.sec2Title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">{t_curr.sec2Items[0].title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{t_curr.sec2Items[0].desc}</p>
          </div>
          <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <h4 className="font-bold mb-2 text-white">{t_curr.sec2Items[1].title}</h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-3">{t_curr.sec2Items[1].desc}</p>
            <div className="text-right font-black text-indigo-200">{t_curr.sec2Items[1].price}</div>
          </div>
        </div>
      </section>

      {/* 3. 항암 약물 치료 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold shadow-lg">3</span>
          <h2 className="text-2xl font-extrabold text-gray-900">{t_curr.sec3Title}</h2>
        </div>

        <div className="space-y-4">
          {t_curr.sec3Items.map((item, idx) => (
            <div key={idx} className={`flex gap-4 p-5 rounded-2xl border ${idx === 1 ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 font-bold ${idx === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-400'}`}>
                {item.gen}
              </div>
              <div>
                <h4 className={`font-bold ${idx === 1 ? 'text-emerald-900' : 'text-gray-900'}`}>{item.title}</h4>
                <p className={`text-xs ${idx === 1 ? 'text-emerald-800' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Note */}
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <p className="text-red-900 text-sm leading-relaxed">
          <span className="font-bold">{t_curr.footerWarning}</span><br />
          {t_curr.footerDesc}
        </p>
      </div>
    </div>
  )
}
