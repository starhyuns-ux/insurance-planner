
export type DiseaseItem = {
    name: string
    code: string
    desc?: string
    isImportant?: boolean
    riders?: string[]
    claimTips?: string // Professional insights from a loss adjuster
    deepAnalysis?: string // Graduate professor level deep analysis (Precedents, disputes)
    requiredDocs?: string[] // Essential documents for claims
    items?: DiseaseItem[] // For nested items if needed (but we'll keep it flat for now as per request)
}

export type SubCategory = {
    name: string
    items: DiseaseItem[]
}

export type TopCategory = {
    id: string
    title: string
    shortTitle: string
    desc: string
    subCategories: SubCategory[]
}

export const getLocalizedRiders = (t: any) => {
    return {
        CANCER: [t('cancerDiag'), t('cancerSurgery'), t('chemo'), '항암방사선약물치료', '표적항암약물허가치료'],
        BRAIN: [t('brainDiag'), t('brainSurgery'), '뇌혈관질환수술', '특정뇌혈관질환진단'],
        HEART: [t('heartDiag'), t('heartSurgery'), '허혈성심장질환수술', '심혈관질환진단(부정맥포함)'],
        INJURY: [t('injurySurgery'), t('fractureDiag'), t('injuryAftermath'), '골절수술비', '상해후유장해'],
        DISEASE: [t('diseaseSurgery'), t('nDiseaseSurgery'), '1-5종수술비', '질병수술비(대인/소인)', '조혈모세포이식수술']
    }
}

export const getGroupedDiseaseData = (t: any, locale: string): TopCategory[] => {
    const riders = getLocalizedRiders(t)
    const isKo = locale === 'ko'
    
    const commonDocs = {
        CANCER: ['진단서', '조직검사결과지', '수술기록지(수술 시)', '입퇴원확인서'],
        VASCULAR: ['진단서', '영상검사결과지(MRI/CT)', '수술기록지', '진료비세부내역서'],
        SURGERY: ['진단서(또는 수술확인서)', '수술기록지', '진료비세부내역서'],
        INJURY: ['진단서', '초진차트', '영상검사결과지(X-ray/CT)', '입퇴원확인서']
    }

    return [
        {
            id: 'C',
            title: isKo ? '[C코드] 모든 악성 신생물 (암)' : '[C-Code] All Malignant Neoplasms',
            shortTitle: 'C코드',
            desc: isKo ? 'C00-C97까지의 모든 악성 신생물 분류입니다.' : 'All C-codes from C00 to C97.',
            subCategories: [
                {
                    name: isKo ? '소화기계 암 (C15-C26)' : 'Digestive Cancers',
                    items: [
                        { name: isKo ? '식도암' : 'Esophagus', code: 'C15', riders: [...riders.CANCER, '5대고액암'], deepAnalysis: isKo ? '식도암은 수술 난이도가 높고 예후가 불량하여 진단 즉시 고액암 청구 검토가 필요합니다.' : 'High-amount cancer claim review needed.' },
                        { name: isKo ? '위암' : 'Stomach', code: 'C16', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '위점막내암(EGC)의 C코드 사수가 핵심입니다. 병리 보고서상 침윤 깊이를 확인하십시오.' : 'Defend C-code for EGC via invasion depth.' },
                        { name: isKo ? '결장암 (대장암)' : 'Colon', code: 'C18', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '대장 점막내암은 대법원 판례상 일반암으로 인정됩니다. 보험사의 소액 안내에 주의하십시오.' : 'Precedents recognize colon intramucosal carcinoma as malignant.' },
                        { name: isKo ? '직장암' : 'Rectum', code: 'C20', riders: riders.CANCER },
                        { name: isKo ? '간암' : 'Liver', code: 'C22', riders: [...riders.CANCER, '고액암'], deepAnalysis: isKo ? '영상의학적 소견(CT/MRI)만으로도 암 진단 확정이 가능한 특수 부위입니다.' : 'Can be diagnosed via imaging without biopsy.' },
                        { name: isKo ? '담낭암' : 'Gallbladder', code: 'C23', riders: riders.CANCER },
                        { name: isKo ? '췌장암' : 'Pancreas', code: 'C25', riders: [...riders.CANCER, '10대고액암'], isImportant: true }
                    ]
                },
                {
                    name: isKo ? '호흡기 및 흉곽 암 (C30-C39)' : 'Respiratory Cancers',
                    items: [
                        { name: isKo ? '후두암' : 'Larynx', code: 'C32', riders: riders.CANCER },
                        { name: isKo ? '폐암' : 'Lung', code: 'C34', riders: [...riders.CANCER, '고액암'], isImportant: true, deepAnalysis: isKo ? '표적항암제 사용 시 암 주요 치료비 담보의 가동 여부가 가장 중요합니다.' : 'Targeted therapy coverage is key.' }
                    ]
                },
                {
                    name: isKo ? '기타 주요 암 (C40-C75)' : 'Other Major Cancers',
                    items: [
                        { name: isKo ? '악성 흑색종 (피부암)' : 'Melanoma', code: 'C43', riders: riders.CANCER },
                        { name: isKo ? '유방암' : 'Breast', code: 'C50', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '미세 침윤(Microinvasion)이 1mm만 있어도 D05가 아닌 C50으로 보상받아야 합니다.' : '1mm micro-invasion qualifies for C50.' },
                        { name: isKo ? '자궁경부암' : 'Cervix', code: 'C53', riders: riders.CANCER },
                        { name: isKo ? '자궁체부암' : 'Corpus Uteri', code: 'C54', riders: riders.CANCER },
                        { name: isKo ? '난소암' : 'Ovary', code: 'C56', riders: riders.CANCER },
                        { name: isKo ? '전립선암' : 'Prostate', code: 'C61', riders: [t('pseudoCancerDiag')], deepAnalysis: isKo ? '과거 상품은 일반암, 최근 상품은 소액암으로 분류되니 가입 시기 확인이 필수입니다.' : 'Check policy date for general vs minor classification.' },
                        { name: isKo ? '신장암' : 'Kidney', code: 'C64', riders: riders.CANCER },
                        { name: isKo ? '방광암' : 'Bladder', code: 'C67', riders: riders.CANCER, deepAnalysis: isKo ? '비침윤성이라도 High-grade인 경우 일반암 승인 사례가 많습니다.' : 'High-grade non-invasive often approved as malignant.' },
                        { name: isKo ? '뇌암 (악성 뇌종양)' : 'Brain', code: 'C71', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '갑상선암' : 'Thyroid', code: 'C73', riders: [t('pseudoCancerDiag')], deepAnalysis: isKo ? '전이암(C77) 동반 시 일반암 수령 여부를 두고 대법원 설명의무 위반 판례가 존재합니다.' : 'Supreme Court precedents exist for C77 metastasis payouts.' }
                    ]
                },
                {
                    name: isKo ? '전이암 및 상세불명 (C76-C80)' : 'Metastasis & Unspecified',
                    items: [
                        { 
                            name: isKo ? '림프절의 이차성 및 상세불명의 악성 신생물' : 'Secondary Lymph Node Cancer', 
                            code: 'C77', 
                            riders: ['일반암진단비'], 
                            isImportant: true,
                            claimTips: isKo ? '원발암(예: 갑상선암)보다 전이암 코드를 우선하여 일반암을 청구하는 전략이 핵심입니다.' : 'Strategy to claim malignant based on metastasis code.',
                            deepAnalysis: isKo ? '보험사는 원발암 기준 분류(C73 등)를 주장하며 소액 지급하려 하지만, 전이암(C77) 자체를 악성암으로 보아야 한다는 법리가 유효합니다.' : 'Insurers push primary cancer rules, but C77 itself is malignant.'
                        },
                        { name: isKo ? '기타 및 상세불명의 전이암' : 'Other Metastasis', code: 'C78-C79', riders: ['일반암진단비'] },
                        { name: isKo ? '부위 명시되지 않은 악성 신생물' : 'Unspecified Cancer', code: 'C80', riders: ['일반암진단비'] }
                    ]
                },
                {
                    name: isKo ? '림프 및 혈액암 (C81-C96)' : 'Lymph & Blood Cancers',
                    items: [
                        { name: isKo ? '악성 림프종' : 'Lymphoma', code: 'C81-C85', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '다발성 골수종' : 'Multiple Myeloma', code: 'C90', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '림프구성 백혈병' : 'Lymphoid Leukemia', code: 'C91', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '골수성 백혈병' : 'Myeloid Leukemia', code: 'C92', riders: [...riders.CANCER, '고액암'] }
                    ]
                }
            ]
        },
        {
            id: 'D',
            title: isKo ? '[D코드] 제자리암 및 경계성 종양' : '[D-Code] CIS & Borderline',
            shortTitle: 'D코드',
            desc: isKo ? 'D00-D48까지의 제자리암 및 유사암 분류입니다.' : 'All D-codes from D00 to D48.',
            subCategories: [
                {
                    name: isKo ? '제자리 신생물 (상피내암) (D00-D09)' : 'Carcinoma in situ',
                    items: [
                        { name: isKo ? '구강/소화기 제자리암' : 'Digestive CIS', code: 'D00-D01', riders: [t('pseudoCancerDiag')] },
                        { name: isKo ? '유방 제자리암' : 'Breast CIS', code: 'D05', riders: [t('pseudoCancerDiag')] },
                        { name: isKo ? '자궁경부 제자리암' : 'Cervix CIS', code: 'D06', riders: [t('pseudoCancerDiag')], isImportant: true },
                        { name: isKo ? '기타 부위 제자리암' : 'Other CIS', code: 'D09', riders: [t('pseudoCancerDiag')] }
                    ]
                },
                {
                    name: isKo ? '행동양식 불명 및 미상의 신생물 (D37-D48)' : 'Borderline Tumors',
                    items: [
                        { 
                            name: isKo ? '직장의 행동양식 불명 신생물 (유암종)' : 'Rectal NET', 
                            code: 'D37.5', 
                            riders: ['유사암진단비', '일반암진단비(조정)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? 'D코드이지만 형태학적 분류상 악성(M9249/3)에 해당하여 일반암 청구가 가능한 대표적 질환입니다.' : 'D-code but pathologically malignant.'
                        },
                        { name: isKo ? '뇌 및 중추신경계 경계성 종양' : 'Brain Borderline', code: 'D43', riders: [t('pseudoCancerDiag')] },
                        { name: isKo ? '진성 적혈구 과다증' : 'Polycythemia Vera', code: 'D45', riders: ['일반암진단비'], isImportant: true },
                        { name: isKo ? '골수형성이상증후군' : 'MDS', code: 'D46', riders: ['일반암진단비'] },
                        { name: isKo ? '본태성 고혈소판증' : 'Essential Thrombocythemia', code: 'D47.3', riders: ['일반암진단비'], deepAnalysis: isKo ? '과거 경계성 종양이었으나 현재 악성 암으로 분류됩니다.' : 'Now classified as malignant.' }
                    ]
                }
            ]
        },
        {
            id: 'I',
            title: isKo ? '[I코드] 순환기계 질환 (심뇌혈관)' : '[I-Code] Circulatory System',
            shortTitle: 'I코드',
            desc: isKo ? 'I00-I99까지의 심장 및 뇌혈관 관련 질환 분류입니다.' : 'All I-codes from I00 to I99.',
            subCategories: [
                {
                    name: isKo ? '허혈성 심장 질환 (I20-I25)' : 'Ischemic Heart Disease',
                    items: [
                        { name: isKo ? '협심증' : 'Angina', code: 'I20', riders: ['허혈성심장질환진단비'] },
                        { name: isKo ? '급성 심근경색증' : 'Acute MI', code: 'I21', riders: ['급성심근경색진단비', '허혈성심장질환진단비'], isImportant: true }
                    ]
                },
                {
                    name: isKo ? '뇌혈관 질환 (I60-I69)' : 'Cerebrovascular Disease',
                    items: [
                        { name: isKo ? '지주막하 출혈' : 'SAH', code: 'I60', riders: ['뇌출혈진단비'], isImportant: true },
                        { name: isKo ? '뇌내 출혈' : 'ICH', code: 'I61', riders: ['뇌출혈진단비'], isImportant: true },
                        { name: isKo ? '뇌경색증' : 'Infarction', code: 'I63', riders: ['뇌졸중진단비'], isImportant: true, deepAnalysis: isKo ? '열공성 뇌경색(Lacunar)의 I63 코드 사수가 보상의 핵심입니다.' : 'Defending I63 for Lacunar is key.' },
                        { name: isKo ? '뇌경색을 유발하지 않은 협착 (경동맥)' : 'Stenosis', code: 'I67.2', riders: ['뇌혈관질환진단비'] },
                        { name: isKo ? '뇌혈관 질환의 후유증' : 'Sequelae', code: 'I69', riders: ['질병후유장해'] }
                    ]
                }
            ]
        },
        {
            id: 'M/S',
            title: isKo ? '[M/S코드] 근골격계 및 상해' : '[M/S-Code] Ortho & Injury',
            shortTitle: 'M/S코드',
            desc: isKo ? 'M(근골격계 질환) 및 S(상해/외상) 분류입니다.' : 'M-codes (Ortho) and S-codes (Injury).',
            subCategories: [
                {
                    name: isKo ? '근골격계 질환 (M코드)' : 'Musculoskeletal (M)',
                    items: [
                        { name: isKo ? '추간판 장애 (디스크)' : 'Disc', code: 'M50-M51', riders: ['질병수술비'], deepAnalysis: isKo ? '상해 사고와의 인과관계를 입증하여 상해후유장해로 청구하는 전략이 필요합니다.' : 'Trauma link needed for injury disability.' },
                        { name: isKo ? '척추 협착증' : 'Stenosis', code: 'M48', riders: ['질병수술비'] },
                        { name: isKo ? '무릎 관절염' : 'Arthritis', code: 'M17', riders: ['인공관절수술비'] },
                        { name: isKo ? '골다공증' : 'Osteoporosis', code: 'M81', riders: ['골절감액주의'] }
                    ]
                },
                {
                    name: isKo ? '상해 및 외상 (S코드)' : 'Injury & Trauma (S)',
                    items: [
                        { name: isKo ? '뇌진탕 및 뇌손상' : 'TBI', code: 'S06', riders: ['상해후유장해'] },
                        { name: isKo ? '척추의 골절 (압박골절)' : 'Spine Fracture', code: 'S22/S32', riders: ['상해후유장해'], isImportant: true },
                        { name: isKo ? '어깨/상완 골절' : 'Shoulder Fracture', code: 'S42', riders: ['골절진단비'] },
                        { name: isKo ? '손목/주상골 골절' : 'Wrist Fracture', code: 'S62', riders: ['상해후유장해'] },
                        { name: isKo ? '대퇴골/고관절 골절' : 'Hip Fracture', code: 'S72', riders: ['상해후유장해'], isImportant: true },
                        { name: isKo ? '무릎 인대 파열' : 'Knee Tear', code: 'S83', riders: ['상해수술비'] }
                    ]
                }
            ]
        },
        {
            id: 'G/F/Q/O',
            title: isKo ? '[기타] 신경·정신·선천·산과' : '[Misc] Nerve/Mental/Cong/Ob',
            shortTitle: '기타코드',
            desc: isKo ? 'G(신경), F(정신), Q(선천), O(산과) 등 기타 중요 분류입니다.' : 'Other major codes including G, F, Q, and O.',
            subCategories: [
                {
                    name: isKo ? '신경 및 정신 질환 (G/F)' : 'Nerve & Mental (G/F)',
                    items: [
                        { name: isKo ? '알츠하이머 치매' : 'Alzheimer\'s', code: 'G30', riders: ['치매진단비'], isImportant: true },
                        { name: isKo ? '파킨슨병' : 'Parkinson\'s', code: 'G20', riders: ['파킨슨진단비'] },
                        { name: isKo ? '뇌전증 (간질)' : 'Epilepsy', code: 'G40', riders: ['질병후유장해'] },
                        { name: isKo ? '우울증' : 'Depression', code: 'F32-F33', riders: ['정신질환치료비'] },
                        { name: isKo ? '공황장애' : 'Panic', code: 'F41', riders: ['실손의료비'] }
                    ]
                },
                {
                    name: isKo ? '선천 기형 및 산과 (Q/O)' : 'Congenital & OB (Q/O)',
                    items: [
                        { name: isKo ? '심장 중격 결손' : 'ASD/VSD', code: 'Q21', riders: ['선천이상수술비'], isImportant: true },
                        { name: isKo ? '임신 중독증' : 'Pre-eclampsia', code: 'O14', riders: ['임신중독증진단비'] }
                    ]
                }
            ]
        }
    ]
}
