'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function CriticalIllnessRelief() {
  const { locale } = useLanguage()

  const content = {
    ko: {
      title: '산정특례 제도 안내',
      intro: '중증질환 의료비 부담을 낮추는 건강보험 제도',
      definitionTitle: '■ 산정특례란?',
      definitionDesc: '산정특례는 국민건강보험공단에서 운영하는 제도로, 중증질환 환자의 치료 시 건강보험 급여 항목의 본인부담률을 낮춰주는 제도입니다.',
      keyPointTitle: '■ 핵심 이해',
      keyPointQuote: '산정특례는 “의료비 전체”가 아닌 건강보험 급여 항목에만 적용됩니다.',
      keyPointItems: [
        { label: '✔ 급여', value: '본인부담 감소', type: 'success' },
        { label: '❌ 비급여', value: '적용 없음', type: 'danger' }
      ],
      diseaseTitle: '■ 질환별 적용 기준',
      diseases: [
        {
          name: '암',
          ratio: '5%',
          period: '5년',
          desc: '장기간 치료비 부담 감소, 수술·항암·방사선 치료 등 급여 적용',
          note: '※ 단, 비급여 항암제·로봇수술 등은 제외'
        },
        {
          name: '희귀질환',
          ratio: '10%',
          period: '5년 (연장 가능)',
          desc: '고가 치료 지속, 장기 관리 필요'
        },
        {
          name: '중증난치질환',
          ratio: '10%',
          period: '5년',
          desc: '외래 진료 및 약물치료 중심, 지속적인 의료비 발생'
        },
        {
          name: '혈관질환 (뇌·심장질환)',
          ratio: '약 5%',
          period: '최대 30일',
          desc: '심근경색, 뇌출혈 등 입원 및 수술·시술 시 적용',
          note: '⚠️ 퇴원 후 외래치료 및 재활치료는 일반 본인부담 적용'
        },
        {
          name: '결핵',
          ratio: '0~10%',
          period: '치료기간',
          desc: '국가관리 질환, 환자 부담 매우 낮음'
        },
        {
          name: '중증화상',
          ratio: '5~10%',
          period: '약 1년',
          desc: '초기 치료비 감소, 이후 재건·흉터 치료는 비급여 발생 가능'
        },
        {
          name: '치매',
          ratio: '10~20%',
          period: '장기',
          desc: '장기 치료 및 관리 필요, 간병비 등 비급여 비용 발생'
        }
      ],
      summaryTitle: '■ 질환별 비교 요약',
      tableHeaders: ['구분', '적용 여부', '적용 기간', '특징'],
      tableRows: [
        { name: '암', applied: 'O', period: '5년', feature: '장기 치료 지원' },
        { name: '희귀질환', applied: 'O', period: '5년', feature: '고액 치료' },
        { name: '난치질환', applied: 'O', period: '5년', feature: '지속 관리' },
        { name: '혈관질환', applied: 'O', period: '30일', feature: '급성기만 적용' },
        { name: '결핵', applied: 'O', period: '치료기간', feature: '국가관리' },
        { name: '화상', applied: 'O', period: '1년', feature: '초기 치료 중심' },
        { name: '치매', applied: 'O', period: '장기', feature: '간병 중심' }
      ],
      notesTitle: '■ 꼭 알아야 할 사항',
      notes: [
        '산정특례는 급여 항목에만 적용됩니다',
        '비급여 치료비는 별도 부담됩니다',
        '질환 및 치료 방식에 따라 적용 여부가 달라질 수 있습니다'
      ],
      finalSummary: '산정특례는 “중증질환 치료 시 급여 의료비 부담을 낮춰주는 제도”이며, 특히 혈관질환은 급성기(약 30일)에 한해 제한적으로 적용됩니다.',
      contactTitle: '■ 문의 및 안내',
      contactDesc: '보다 자세한 내용은 국민건강보험공단 또는 의료기관을 통해 확인하실 수 있습니다.'
    },
    en: {
      title: 'Critical Illness Relief Guide',
      intro: 'Health insurance system that reduces medical costs for serious illnesses',
      definitionTitle: '■ What is Critical Illness Relief?',
      definitionDesc: 'A system operated by the National Health Insurance Service (NHIS) to lower the self-payment ratio for covered (National Health) medical items during treatment for serious illnesses.',
      keyPointTitle: '■ Key Understanding',
      keyPointQuote: 'Critical Illness Relief applies ONLY to "National Health Covered" items, not all medical expenses.',
      keyPointItems: [
        { label: '✔ Covered', value: 'Reduced self-pay', type: 'success' },
        { label: '❌ Non-covered', value: 'No application', type: 'danger' }
      ],
      diseaseTitle: '■ Application Criteria by Disease',
      diseases: [
        {
          name: 'Cancer',
          ratio: '5%',
          period: '5 Years',
          desc: 'Reduces long-term treatment costs; applies to surgery, chemotherapy, radiation (covered).',
          note: '* Note: Non-covered chemotherapy or robotic surgery are excluded.'
        },
        {
          name: 'Rare Diseases',
          ratio: '10%',
          period: '5 Yrs (Extensible)',
          desc: 'Continuous high-cost treatment, requires long-term management.'
        },
        {
          name: 'Severe Intractable',
          ratio: '10%',
          period: '5 Years',
          desc: 'Focused on outpatient care and drug treatment; ongoing medical costs.'
        },
        {
          name: 'Vascular (Heart/Brain)',
          ratio: '~5%',
          period: 'Max 30 Days',
          desc: 'Applies to hospitalization and surgery/procedure for Myocardial infarction, Cerebral hemorrhage, etc.',
          note: '⚠️ Note: General self-pay applies to outpatient/rehab care after discharge.'
        },
        {
          name: 'Tuberculosis',
          ratio: '0~10%',
          period: 'Treatment Period',
          desc: 'State-managed disease, very low patient burden.'
        },
        {
          name: 'Severe Burns',
          ratio: '5~10%',
          period: 'Approx. 1 Year',
          desc: 'Reduces initial treatment costs; reconstruction/scar treatment may be non-covered.'
        },
        {
          name: 'Dementia',
          ratio: '10~20%',
          period: 'Long-term',
          desc: 'Long-term care and management required; non-covered costs like nursing fees may occur.'
        }
      ],
      summaryTitle: '■ Summary Comparison',
      tableHeaders: ['Category', 'Applied', 'Period', 'Features'],
      tableRows: [
        { name: 'Cancer', applied: 'O', period: '5 Yrs', feature: 'Long-term support' },
        { name: 'Rare', applied: 'O', period: '5 Yrs', feature: 'High-cost treatment' },
        { name: 'Intractable', applied: 'O', period: '5 Yrs', feature: 'Ongoing management' },
        { name: 'Vascular', applied: 'O', period: '30 Days', feature: 'Acute phase only' },
        { name: 'TB', applied: 'O', period: 'Treatment', feature: 'State-managed' },
        { name: 'Burns', applied: 'O', period: '1 Year', feature: 'Initial phase focus' },
        { name: 'Dementia', applied: 'O', period: 'Long', feature: 'Care focused' }
      ],
      notesTitle: '■ Important Notes',
      notes: [
        'Applies ONLY to items covered by National Health Insurance',
        'Non-covered medical expenses are paid separately',
        'Application status varies by disease and treatment method'
      ],
      finalSummary: 'Critical Illness Relief lowers the burden of covered medical expenses for serious illnesses, especially limited to the acute phase (~30 days) for vascular diseases.',
      contactTitle: '■ Contacts & Inquiry',
      contactDesc: 'For more details, please contact NHIS or your medical institution.'
    },
    cn: {
      title: '重疾特例制度指南',
      intro: '降低重症疾病医疗费负担的健康保险制度',
      definitionTitle: '■ 什么是重疾特例？',
      definitionDesc: '重疾特例是由国民健康保险公团运营的一项制度，旨在降低重症疾病患者在治疗期间健康保险给付项目的自付比例。',
      keyPointTitle: '■ 核心点',
      keyPointQuote: '重疾特例仅适用于“医保给付”项目，而非所有医疗费用。',
      keyPointItems: [
        { label: '✔ 给付', value: '自付额降低', type: 'success' },
        { label: '❌ 非给付', value: '不适用', type: 'danger' }
      ],
      diseaseTitle: '■ 各类疾病适用标准',
      diseases: [
        {
          name: '癌症',
          ratio: '5%',
          period: '5年',
          desc: '降低长期治疗费负担，手术、化疗、放疗等给付项目适用',
          note: '* 注意：非给付抗癌剂、机器人手术等除外'
        },
        {
          name: '罕见病',
          ratio: '10%',
          period: '5年 (可延长)',
          desc: '长期高额治疗，需要长期管理'
        },
        {
          name: '重症难治病',
          ratio: '10%',
          period: '5年',
          desc: '以门诊及药物治疗为主，持续产生医疗费'
        },
        {
          name: '血管病 (脑/心)',
          ratio: '约 5%',
          period: '最多 30天',
          desc: '适用于心肌梗塞、脑出血等住院及手术/处置',
          note: '⚠️ 注意：出院后的门诊及康复治疗按一般自付比例计算'
        },
        {
          name: '结核',
          ratio: '0~10%',
          period: '治疗期',
          desc: '国家管理疾病，患者负担极低'
        },
        {
          name: '重症烧伤',
          ratio: '5~10%',
          period: '约 1年',
          desc: '初期治疗费降低，后续重建/疤痕治疗可能产生非给付费用'
        },
        {
          name: '痴呆',
          ratio: '10~20%',
          period: '长期',
          desc: '需要长期治疗和管理，可能产生看护费等非给付费用'
        }
      ],
      summaryTitle: '■ 各类疾病对比摘要',
      tableHeaders: ['项目', '是否适用', '适用期间', '特点'],
      tableRows: [
        { name: '癌症', applied: 'O', period: '5年', feature: '长期治疗支援' },
        { name: '罕见病', applied: 'O', period: '5年', feature: '高额治疗' },
        { name: '难治病', applied: 'O', period: '5年', feature: '持续管理' },
        { name: '血管病', applied: 'O', period: '30天', feature: '仅限急性期' },
        { name: '结核', applied: 'O', period: '治疗期', feature: '国家管理' },
        { name: '烧伤', applied: 'O', period: '1年', feature: '侧重初期治疗' },
        { name: '痴呆', applied: 'O', period: '长期', feature: '侧重看护' }
      ],
      notesTitle: '■ 必读事项',
      notes: [
        '重疾特例仅适用于健康保险给付项目',
        '非给付医疗费用需视情况自行承担',
        '适用情况因疾病及治疗方式而异'
      ],
      finalSummary: '重疾特例是降低重症疾病给付医疗费负担的制度，特别是血管病仅限急性期(约30天)适用。',
      contactTitle: '■ 咨询与引导',
      contactDesc: '详情请咨询国民健康保险公团或医疗机构。'
    }
  }

  const t_curr = content[locale as keyof typeof content] || content.ko

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Introduction */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white text-center rounded-3xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          {t_curr.title}
        </h1>
        <p className="text-indigo-100 font-medium text-lg md:text-xl">
          {t_curr.intro}
        </p>
      </div>

      {/* definition */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t_curr.definitionTitle}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {t_curr.definitionDesc}
        </p>
      </section>

      {/* Key Understanding */}
      <section className="bg-indigo-50 p-6 md:p-8 rounded-3xl border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-900 mb-6">{t_curr.keyPointTitle}</h2>
        <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 mb-6 italic text-indigo-800 text-lg font-medium">
          {t_curr.keyPointQuote}
        </blockquote>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t_curr.keyPointItems.map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl ${item.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="font-bold">{item.label}</span>
              <span className="font-black text-lg">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Diseases */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">
          {t_curr.diseaseTitle}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {t_curr.diseases.map((disease, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                  {disease.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">{disease.ratio}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold">{disease.period}</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-3">{disease.desc}</p>
              {disease.note && (
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                  {disease.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Summary Table */}
      <section className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-200 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t_curr.summaryTitle}</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                {t_curr.tableHeaders.map((header, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold border-b border-gray-700 text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {t_curr.tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100 border-b border-gray-100">
                  <td className="px-6 py-4 font-black text-gray-900 text-center">{row.name}</td>
                  <td className="px-6 py-4 font-black text-green-600 text-center">{row.applied}</td>
                  <td className="px-6 py-4 font-bold text-gray-700 text-center">{row.period}</td>
                  <td className="px-6 py-4 text-gray-600 text-center font-medium">{row.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notes */}
      <section className="bg-amber-50 p-6 md:p-8 rounded-3xl border border-amber-100">
        <h2 className="text-xl font-bold text-amber-900 mb-4">{t_curr.notesTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-amber-800 font-medium">
          {t_curr.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </section>

      {/* Final Summary Quote */}
      <div className="bg-indigo-900 p-8 rounded-3xl text-white text-center shadow-lg">
        <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">Core Summary</h2>
        <p className="text-xl md:text-2xl font-black leading-snug">
          “{t_curr.finalSummary}”
        </p>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 p-8 rounded-3xl text-center border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{t_curr.contactTitle}</h2>
        <p className="text-gray-600 font-medium">
          {t_curr.contactDesc}
        </p>
      </div>
    </div>
  )
}
