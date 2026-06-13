
export type DiseaseItem = {
    name: string
    code: string
    desc?: string
    isImportant?: boolean
    riders?: string[]
    claimTips?: string
    deepAnalysis?: string
    requiredDocs?: string[]
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
        PSEUDO: ['유사암진단비', '제자리암진단비', '경계성종양진단비', '소액암진단비'],
        BRAIN: [t('brainDiag'), t('brainSurgery'), '뇌혈관질환수술', '특정뇌혈관질환진단', '뇌졸중진단'],
        HEART: [t('heartDiag'), t('heartSurgery'), '허혈성심장질환수술', '심혈관질환진단(부정맥포함)', '급성심근경색진단'],
        INJURY: [t('injurySurgery'), t('fractureDiag'), t('injuryAftermath'), '골절수술비', '5대골절진단', '상해후유장해'],
        DISEASE: [t('diseaseSurgery'), t('nDiseaseSurgery'), '1-5종수술비', '질병수술비', '질병후유장해', '희귀난치성질환진단']
    }
}

export const getGroupedDiseaseData = (t: any, locale: string): TopCategory[] => {
    const riders = getLocalizedRiders(t)
    const isKo = locale === 'ko'
    
    return [
        {
            id: 'C',
            title: isKo ? '[C코드] 악성 신생물 (세부 암)' : '[C-Code] Malignancies (Detailed)',
            shortTitle: 'C코드',
            desc: isKo ? '소수점 단위 세부 암 코드까지 하나하나 분류했습니다.' : 'Detailed cancer codes including decimal sub-codes.',
            subCategories: [
                {
                    name: isKo ? '위의 악성 신생물 (C16)' : 'Stomach Cancer (C16)',
                    items: [
                        { name: isKo ? '위의 분문' : 'Cardia', code: 'C16.0', riders: riders.CANCER, deepAnalysis: isKo ? '분문부 암은 식도 역류 질환과 혼동될 수 있으나, 내시경 소견상 Z-line 침범 여부가 일반암 판정의 핵심입니다.' : 'Z-line invasion is key for malignant diagnosis.' },
                        { name: isKo ? '위의 위저' : 'Fundus of stomach', code: 'C16.1', riders: riders.CANCER, deepAnalysis: isKo ? '위저부 종양은 조직검사 시 점막하종양(SMT)으로 오인될 수 있으나, EUS(내시경 초음파)를 통해 침윤 깊이를 확정해야 합니다.' : 'EUS is essential for confirming invasion depth.' },
                        { name: isKo ? '위의 위체' : 'Body of stomach', code: 'C16.2', riders: riders.CANCER, deepAnalysis: isKo ? '가장 흔한 부위이며, 위점막내암(EGC)의 경우 병리 보고서상 "Lamina Propria" 침윤 여부에 따라 소액암과 일반암이 갈립니다.' : 'Invasion of Lamina Propria determines malignant vs minor payout.' },
                        { name: isKo ? '위의 전정부' : 'Pyloric antrum', code: 'C16.3', riders: riders.CANCER, deepAnalysis: isKo ? '전정부 암은 림프절 전이가 빠른 특성이 있어, 수술 기록지상 전이 여부를 확인하여 전이암 진단비를 추가 검토하십시오.' : 'Check lymph node metastasis for additional benefits.' },
                        { name: isKo ? '위의 유문' : 'Pylorus', code: 'C16.4', riders: riders.CANCER, claimTips: isKo ? '유문 협착으로 인한 영양 결핍 시 TPN(총정맥영양) 투여 기록을 확보하여 암 입원일당 및 수술 후 관리 비용 실비를 꼼꼼히 챙기십시오.' : 'Check TPN records for malnutrition due to pyloric stenosis.', deepAnalysis: isKo ? '유문부 암은 위 배출 지연을 유발하며, 이는 병리 보고서상 림프절 전이 비율(LNR)이 높게 나타나는 경향이 있어 항암 방사선 치료 담보를 우선 검토해야 합니다.' : 'Pyloric cancer often shows high LNR; prioritize radiotherapy coverage.' },
                        { name: isKo ? '위의 소만' : 'Lesser curvature', code: 'C16.5', riders: riders.CANCER, claimTips: isKo ? '소만 부위는 혈관이 풍부하여 수술 중 출혈 위험이 큽니다. 수술 기록지의 Blood loss 양을 확인하여 수혈 보험금 청구 가능성을 점검하십시오.' : 'Check surgery records for blood loss and transfusion benefits.', deepAnalysis: isKo ? '소만은 림프절 전이 경로의 핵심 통로입니다. No.1, No.3 림프절 절제 범위를 확인하여 병기 판정의 적정성을 재검토하십시오.' : 'Verify No.1/No.3 lymph node dissection for accurate staging.' },
                        { name: isKo ? '위의 대만' : 'Greater curvature', code: 'C16.6', riders: riders.CANCER, deepAnalysis: isKo ? '대만부 종양은 위장관 기질종양(GIST)과 혼동될 수 있습니다. 조직검사상 Mitosis(세포분열) 수치를 확인하여 악성 여부를 재판독하십시오.' : 'Check Mitosis count to distinguish from GIST.' },
                        { name: isKo ? '위의 상세불명' : 'Unspecified stomach', code: 'C16.9', riders: riders.CANCER, claimTips: isKo ? '검진 단계에서 발견 시 C16.9로 시작하나, 최종 병리 보고서에서 세부 부위가 확정되면 코드를 정정하여 부위별 암 진단비 누락을 방지하십시오.' : 'Correct code after pathology to avoid missing site-specific benefits.' }
                    ]
                },
                {
                    name: isKo ? '결장(대장)의 악성 신생물 (C18)' : 'Colon Cancer (C18)',
                    items: [
                        { name: isKo ? '맹장' : 'Cecum', code: 'C18.0', riders: riders.CANCER, deepAnalysis: isKo ? '맹장 부위 암은 증상이 늦게 나타나 고기기암(Advanced)으로 발견되는 경우가 많아 사망 보험금 연계 검토가 필요합니다.' : 'Often discovered at advanced stage; consider death benefit links.' },
                        { name: isKo ? '충수' : 'Appendix', code: 'C18.1', riders: riders.CANCER, deepAnalysis: isKo ? '충수암은 희귀암에 해당할 수 있으며, 복막 가성점액종 동반 시 암 치료비 한도가 크게 상승할 수 있습니다.' : 'Rare cancer; consider Pseudomyxoma Peritonei for higher limits.' },
                        { name: isKo ? '상행결장' : 'Ascending colon', code: 'C18.2', riders: riders.CANCER, claimTips: isKo ? '상행결장은 분변이 액체 상태인 구간이라 폐쇄 증상이 늦습니다. 빈혈로 처음 발견된 경우 건강검진 결과지의 빈혈 소견을 증거로 활용하십시오.' : 'Anemia is often the first sign; use health check records as evidence.', deepAnalysis: isKo ? '우측 대장암은 유전성 비폴립성 대장암(HNPCC)과 연관될 확률이 높으므로, 가족력이 있다면 유전자 검사비 실손 보상을 안내하십시오.' : 'High link with HNPCC; advise on genetic test reimbursement.' },
                        { name: isKo ? '횡행결장' : 'Transverse colon', code: 'C18.4', riders: riders.CANCER, claimTips: isKo ? '횡행결장은 인접 장기(위, 췌장)로의 침윤이 쉽습니다. 주변 장기 동시 절제 시 다중 수술비 지급 대상인지 확인하십시오.' : 'Check for multiple surgical benefits if adjacent organs were resected.', deepAnalysis: isKo ? '장간막 림프절 전이가 쉬운 부위입니다. CEA 수치 추이를 분석하여 재발 가능성에 따른 암 치료비 한도 증액을 제안하십시오.' : 'Monitor CEA levels for recurrence risk and coverage expansion.' },
                        { name: isKo ? '하행결장' : 'Descending colon', code: 'C18.6', riders: riders.CANCER, deepAnalysis: isKo ? '좌측 대장암은 폐 전이 위험이 상대적으로 높습니다. 흉부 CT 결과를 병행 검토하여 전이암 진단비 수령 가능성을 타진하십시오.' : 'Higher lung metastasis risk; review chest CT for secondary malignancy benefits.' },
                        { name: isKo ? 'S상결장' : 'Sigmoid colon', code: 'C18.7', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? 'S상결장암은 대장 점막내암 분쟁의 중심입니다. 대법원 판례상 "Tis"가 아닌 "C18"로 코딩되면 100% 지급 대상입니다.' : 'Core of intramucosal disputes. C18 coding ensures 100% payout per precedents.' },
                        { name: isKo ? '직장S상결장 이행부' : 'Rectosigmoid junction', code: 'C19', riders: riders.CANCER },
                        { name: isKo ? '직장' : 'Rectum', code: 'C20', riders: riders.CANCER, deepAnalysis: isKo ? '직장암은 수술 후 인공항문(장루) 조성 시 고액 후유장해(보험금의 50% 이상) 청구가 가능합니다.' : 'Post-op stoma qualifies for high-amount disability claims (50%+).' }
                    ]
                },
                {
                    name: isKo ? '간 및 담도 (C22-C24)' : 'Liver & Biliary (C22-C24)',
                    items: [
                        { name: isKo ? '간세포암종' : 'Hepatocellular carcinoma', code: 'C22.0', riders: riders.CANCER, deepAnalysis: isKo ? '간암은 조직검사 없이 MRI/CT 결과만으로도 암 진단 확정이 가능한 부위이므로, 영상 판독지 소견이 가장 중요합니다.' : 'Imaging (MRI/CT) can confirm diagnosis without biopsy.' },
                        { name: isKo ? '간내 담관암' : 'Intrahepatic bile duct carcinoma', code: 'C22.1', riders: riders.CANCER, deepAnalysis: isKo ? '담관암은 예후가 매우 불량하여 암 사망 및 말기 질환 담보 수령 가능성을 즉시 검토해야 합니다.' : 'Poor prognosis; review terminal illness benefits immediately.' },
                        { name: isKo ? '담낭' : 'Gallbladder', code: 'C23', riders: riders.CANCER },
                        { name: isKo ? '담도의 기타 부분' : 'Other parts of biliary tract', code: 'C24', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '기타 주요 소화기 암 (C25-C26)' : 'Other Digestive Cancers (C25-C26)',
                    items: [
                        { name: isKo ? '췌장의 머리' : 'Head of pancreas', code: 'C25.0', riders: riders.CANCER, deepAnalysis: isKo ? '췌장 머리 부분 암은 담관 폐쇄를 유발하여 황달이 조기에 나타나며, 수술(휘플 수술) 시 합병증 발생률이 높아 고액 수술비 청구가 빈번합니다.' : 'Pancreatic head cancer often causes jaundice; Whipple surgery has high complication rates and high surgical benefits.' },
                        { name: isKo ? '췌장의 몸통' : 'Body of pancreas', code: 'C25.1', riders: riders.CANCER },
                        { name: isKo ? '췌장의 꼬리' : 'Tail of pancreas', code: 'C25.2', riders: riders.CANCER },
                        { name: isKo ? '췌장관' : 'Pancreatic duct', code: 'C25.3', riders: riders.CANCER },
                        { name: isKo ? '췌장의 상세불명' : 'Unspecified pancreas', code: 'C25.9', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '췌장암은 5대 고액암 및 10대 고액암 진단비의 핵심 질환입니다. 진단서상 C25 코드를 반드시 확보하십시오.' : 'Pancreatic cancer is a core 5/10 high-amount malignancy. Ensure C25 code on the certificate.' }
                    ]
                },
                {
                    name: isKo ? '유방의 악성 신생물 (C50)' : 'Breast Cancer (C50)',
                    items: [
                        { name: isKo ? '유방의 유두 및 유륜' : 'Nipple & areola', code: 'C50.0', riders: riders.CANCER },
                        { name: isKo ? '유방의 중앙부' : 'Central portion', code: 'C50.1', riders: riders.CANCER },
                        { name: isKo ? '유방의 내상사분기' : 'Upper-inner quadrant', code: 'C50.2', riders: riders.CANCER },
                        { name: isKo ? '유방의 하내사분기' : 'Lower-inner quadrant', code: 'C50.3', riders: riders.CANCER },
                        { name: isKo ? '유방의 외상사분기' : 'Upper-outer quadrant', code: 'C50.4', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '침윤성 유관암(IDC) 진단 시 병리 보고서의 Nottingham score를 통해 예후 및 암 입원일당 필요성을 분석하십시오.' : 'IDC diagnosis: analyze Nottingham score for prognosis and inpatient days.' },
                        { name: isKo ? '유방의 하외사분기' : 'Lower-outer quadrant', code: 'C50.5', riders: riders.CANCER },
                        { name: isKo ? '유방의 상세불명' : 'Unspecified breast', code: 'C50.9', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '비뇨기관의 악성 신생물 (C64-C68)' : 'Urinary Tract Cancers (C64-C68)',
                    items: [
                        { name: isKo ? '신우를 제외한 신장암' : 'Kidney, except renal pelvis', code: 'C64', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '신장암(RCC)은 수술 후 한쪽 신장을 적출할 경우 질병후유장해 30% 확정 수령 가능합니다.' : 'Post-nephrectomy qualifies for 30% disease disability benefits.' },
                        { name: isKo ? '신우' : 'Renal pelvis', code: 'C65', riders: riders.CANCER },
                        { name: isKo ? '요관' : 'Ureter', code: 'C66', riders: riders.CANCER },
                        { name: isKo ? '방광의 삼각부' : 'Trigone of bladder', code: 'C67.0', riders: riders.CANCER },
                        { name: isKo ? '방광의 측벽' : 'Lateral wall of bladder', code: 'C67.2', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '비침윤성 방광암은 D09.0으로 청구되기 쉬우나, 종양의 재발률과 악성도가 높은 경우 일반암 주장이 가능합니다.' : 'Non-invasive bladder cancer may be D09.0; argue C67 for high recurrence/grade.' },
                        { name: isKo ? '요도' : 'Urethra', code: 'C68.0', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '뇌 및 중추신경계의 악성 신생물 (C71-C72)' : 'Brain & CNS Cancers (C71-C72)',
                    items: [
                        { name: isKo ? '대뇌' : 'Cerebrum', code: 'C71.0', riders: [...riders.CANCER, '고액암'], deepAnalysis: isKo ? '뇌종양은 조직검사가 불가능한 경우 "임상적 암"으로 인정받아야 합니다. 주치의의 소견서 문구가 보상의 전부입니다.' : 'If biopsy is impossible, claim "Clinical Malignancy" via physician statement.' },
                        { name: isKo ? '전두엽' : 'Frontal lobe', code: 'C71.1', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '측두엽' : 'Temporal lobe', code: 'C71.2', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '뇌실' : 'Cerebral ventricle', code: 'C71.5', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '뇌간' : 'Brain stem', code: 'C71.6', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '척수' : 'Spinal cord', code: 'C72.0', riders: [...riders.CANCER, '고액암'], deepAnalysis: isKo ? '척수 암은 수술 후 신경학적 마비가 남는 경우가 많아 장해 보험금과 암 진단비를 동시 수령하는 고액 보상 건입니다.' : 'Spinal cancer often results in paralysis; claim both disability and malignancy benefits.' }
                    ]
                },
                {
                    name: isKo ? '다발성 골수종 및 악성 혈액질환 (C90)' : 'Multiple Myeloma & Blood (C90)',
                    items: [
                        { name: isKo ? '다발성 골수종' : 'Multiple myeloma', code: 'C90.0', riders: [...riders.CANCER, '고액암'], deepAnalysis: isKo ? '뼈의 골절이 동반된 경우 골밀도 검사 결과와 상관없이 암으로 인한 골파괴 소견을 상해로 주장할 수 있는지 검토해야 합니다.' : 'If fractures occur, review if bone destruction can be linked to cancer vs trauma.' },
                        { name: isKo ? '혈장세포 백혈병' : 'Plasma cell leukemia', code: 'C90.1', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '골수외 혈장세포종' : 'Extramedullary plasmacytoma', code: 'C90.2', riders: [...riders.CANCER, '고액암'] }
                    ]
                },
                {
                    name: isKo ? '기관지 및 폐 (C34)' : 'Bronchus & Lung (C34)',
                    items: [
                        { name: isKo ? '주기관지' : 'Main bronchus', code: 'C34.0', riders: riders.CANCER, deepAnalysis: isKo ? '기관지 분기점(Carina) 침범 시 수술이 불가능한 경우가 많습니다. 이 경우 방사선 치료비와 항암 약물 치료비 담보의 집중도가 중요합니다.' : 'Carina involvement often means inoperable; focus on chemo/radio benefits.' },
                        { name: isKo ? '상엽' : 'Upper lobe', code: 'C34.1', riders: riders.CANCER, claimTips: isKo ? '상엽 암은 어깨 통증(Pancoast tumor)으로 오인되기 쉽습니다. 어깨 치료 이력이 암 진단과 인과관계가 있다면 통증 관리 실비를 소급 청구하십시오.' : 'Pancoast tumors mimic shoulder pain; retroactively claim pain management expenses.' },
                        { name: isKo ? '중엽' : 'Middle lobe', code: 'C34.2', riders: riders.CANCER },
                        { name: isKo ? '하엽' : 'Lower lobe', code: 'C34.3', riders: riders.CANCER, deepAnalysis: isKo ? '하엽 암은 횡격막 침윤 위험이 있습니다. 수술 기록지상 횡격막 절제 및 재건술 여부를 확인하여 1-5종 수술비를 극대화하십시오.' : 'Check for diaphragm resection/reconstruction to maximize Class 1-5 surgical benefits.' },
                        { name: isKo ? '상세불명' : 'Unspecified bronchus/lung', code: 'C34.9', riders: riders.CANCER, isImportant: true, claimTips: isKo ? '폐암은 표적항암제(타그리소 등) 사용 빈도가 가장 높은 암입니다. "표적항암약물허가치료비" 특약 가입 여부를 반드시 확인하십시오.' : 'High use of targeted therapy; verify "Targeted Chemo" rider.' }
                    ]
                },
                {
                    name: isKo ? '여성 생식기관의 악성 신생물 (C51-C58)' : 'Female Genital Cancers (C51-C58)',
                    items: [
                        { name: isKo ? '외음' : 'Vulva', code: 'C51', riders: riders.CANCER },
                        { name: isKo ? '질' : 'Vagina', code: 'C52', riders: riders.CANCER, deepAnalysis: isKo ? '질암은 DES 노출 등 희귀 원인이 많습니다. 암 치료비 중 "희귀암" 가산 지급 대상인지 약관을 재해석하십시오.' : 'Check if eligible for "Rare Cancer" bonus benefits.' },
                        { name: isKo ? '자궁경부' : 'Cervix uteri', code: 'C53.9', riders: riders.CANCER, isImportant: true, claimTips: isKo ? '자궁경부암은 CIS(D06)와의 경계가 모호합니다. Stromal invasion 깊이가 3mm 이상이면 일반암 100% 지급을 강력히 요구하십시오.' : 'If stromal invasion >= 3mm, demand 100% malignant payout.', deepAnalysis: isKo ? '선암(Adenocarcinoma) 세포형은 편평세포암보다 예후가 나쁩니다. 암 입원비 및 재진단암 보장 기간 연장을 반드시 제안하십시오.' : 'Adenocarcinoma has worse prognosis; suggest extended inpatient/re-diagnosis coverage.' },
                        { name: isKo ? '자궁체부' : 'Corpus uteri', code: 'C54.1', riders: riders.CANCER, claimTips: isKo ? '자궁내막암 수술 시 림프절 곽청술이 동반되었다면, 향후 발생할 림프부종 예방용 압박 스타킹 실비 보상을 안내하십시오.' : 'Advise on compression stocking reimbursement for lymphedema prevention.' },
                        { name: isKo ? '자궁의 상세불명 부분' : 'Uterus, unspecified', code: 'C55', riders: riders.CANCER },
                        { name: isKo ? '난소' : 'Ovary', code: 'C56', riders: riders.CANCER, isImportant: true, deepAnalysis: isKo ? '난소암은 BRCA 유전자 변이 여부에 따라 표적항암제(올라파립 등) 사용이 결정됩니다. 유전자 검사 결과지를 보상 근거로 활용하십시오.' : 'BRCA mutation determines targeted therapy; use genetic test results as claim evidence.' },
                        { name: isKo ? '태반' : 'Placenta', code: 'C58', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '남성 생식기관의 악성 신생물 (C60-C63)' : 'Male Genital Cancers (C60-C63)',
                    items: [
                        { name: isKo ? '음경' : 'Penis', code: 'C60', riders: riders.CANCER },
                        { name: isKo ? '전립선' : 'Prostate', code: 'C61', riders: riders.CANCER, isImportant: true },
                        { name: isKo ? '고환' : 'Testis', code: 'C62', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '이차성(전이성) 악성 신생물 (C77-C79)' : 'Secondary Malignancies (C77-C79)',
                    items: [
                        { name: isKo ? '머리/얼굴/목 림프절 전이' : 'Lymph nodes of head/neck', code: 'C77.0', riders: ['일반암진단비'] },
                        { name: isKo ? '흉내 림프절 전이' : 'Intrathoracic lymph nodes', code: 'C77.1', riders: ['일반암진단비'] },
                        { name: isKo ? '복내 림프절 전이' : 'Intra-abdominal lymph nodes', code: 'C77.2', riders: ['일반암진단비'] },
                        { name: isKo ? '액와/팔 림프절 전이' : 'Axilla/upper limb lymph nodes', code: 'C77.3', riders: ['일반암진단비'] },
                        { name: isKo ? '서혜부/다리 림프절 전이' : 'Inguinal/lower limb lymph nodes', code: 'C77.4', riders: ['일반암진단비'] },
                        { name: isKo ? '폐의 이차성 악성 신생물' : 'Secondary cancer of lung', code: 'C78.0', riders: ['일반암진단비'] },
                        { name: isKo ? '간의 이차성 악성 신생물' : 'Secondary cancer of liver', code: 'C78.7', riders: ['일반암진단비'] },
                        { name: isKo ? '뼈의 이차성 악성 신생물' : 'Secondary cancer of bone', code: 'C79.5', riders: ['일반암진단비'] }
                    ]
                }
            ]
        },
        {
            id: 'D',
            title: isKo ? '[D코드] 제자리암 및 경계성 종양 (상세)' : '[D-Code] CIS & Borderline (Detailed)',
            shortTitle: 'D코드',
            desc: isKo ? '부위별 제자리암 및 모든 행동양식 불명 종양입니다.' : 'Detailed CIS and borderline tumors.',
            subCategories: [
                {
                    name: isKo ? '제자리 신생물 (상피내암) (D00-D09)' : 'Carcinoma in situ (D00-D09)',
                    items: [
                        { name: isKo ? '입술, 구강 및 인두' : 'Lip, oral cavity & pharynx', code: 'D00.0', riders: riders.PSEUDO, deepAnalysis: isKo ? '구강 내 백반증(Leukoplakia)이 상피내암으로 진단된 경우, 향후 설암(C02)으로의 발전 가능성이 매우 높으므로 고액암 담보 증액이 시급합니다.' : 'Leukoplakia-driven CIS has high progression risk to tongue cancer; increase coverage.' },
                        { name: isKo ? '식도 제자리암' : 'Esophagus CIS', code: 'D00.1', riders: riders.PSEUDO, claimTips: isKo ? '식도 점막하 절제술(ESD) 시행 시 수술비 청구는 물론, 협착 예방을 위한 풍선 확장술 비용의 실비 인정 여부를 확인하십시오.' : 'Check for balloon dilation reimbursement post-ESD.' },
                        { name: isKo ? '위 제자리암' : 'Stomach CIS', code: 'D00.2', riders: riders.PSEUDO, deepAnalysis: isKo ? '점막하층(SM)까지 침윤된 경우 D00.2에서 C16으로 상향 조정하여 일반암 100% 수령을 시도해야 합니다.' : 'Upgrade to C16 if SM layer invasion is present for 100% payout.' },
                        { name: isKo ? '결장(대장) 제자리암' : 'Colon CIS', code: 'D01.0', riders: riders.PSEUDO, deepAnalysis: isKo ? 'Tis(상피내암) 판정을 받았더라도 대장 점막내암은 대법원 판례상 일반암 보상이 가능합니다.' : 'Precedents allow malignant payout for colon intramucosal Tis.' },
                        { name: isKo ? '직장 제자리암' : 'Rectum CIS', code: 'D01.2', riders: riders.PSEUDO, deepAnalysis: isKo ? '직장의 제자리암은 유암종(NET)과 혼동될 수 있으나, 조직검사상 "In situ" 명기 시 제자리암 진단비 지급 대상입니다.' : 'Ensure "In situ" is noted in biopsy for rectum CIS benefits.' },
                        { name: isKo ? '후두 제자리암' : 'Larynx CIS', code: 'D02.0', riders: riders.PSEUDO, claimTips: isKo ? '흡연력과 연관된 후두 상피내암은 음성 변화가 전조 증상입니다. 후두경 검사 비용의 실손 보상을 통해 조기 발견을 유도하십시오.' : 'Laryngeal CIS is linked to smoking; use laryngoscopy for early detection.' },
                        { name: isKo ? '기관/기관지 및 폐' : 'Trachea, bronchus & lung', code: 'D02.2', riders: riders.PSEUDO, deepAnalysis: isKo ? '폐의 ' : 'Ground-glass opacity (GGO) showing CIS features requires close monitoring; check for "Clinical CIS" possibilities.' },
                        { name: isKo ? '유방 제자리암' : 'Breast CIS', code: 'D05', riders: riders.PSEUDO, isImportant: true, deepAnalysis: isKo ? '수술 결과지상 "Microinvasion" 문구가 발견되면 즉시 C50으로 코드를 변경하여 보험금 차액을 청구하십시오.' : 'If "Microinvasion" is found, upgrade D05 to C50 immediately.' },
                        { name: isKo ? '자궁경부 제자리암' : 'Cervix CIS', code: 'D06', riders: riders.PSEUDO, isImportant: true, deepAnalysis: isKo ? 'CIN3 등급은 제자리암 지급 대상입니다. CIN1, 2와 명확히 구분하여 청구하십시오.' : 'CIN3 is eligible for CIS benefits; distinguish clearly from CIN1/2.' },
                        { name: isKo ? '방광의 제자리암' : 'Bladder CIS', code: 'D09.0', riders: riders.PSEUDO, deepAnalysis: isKo ? '방광암은 병기(Stage)와 상관없이 재발이 잦아 일반암 수준의 관리가 필요하며, 분쟁 시 C67로의 전환 가능성을 검토하십시오.' : 'High recurrence justifies close management; consider upgrading to C67 in disputes.' }
                    ]
                },
                {
                    name: isKo ? '양성 신생물 (D10-D36)' : 'Benign Neoplasms (D10-D36)',
                    items: [
                        { name: isKo ? '위의 양성 신생물 (위용종)' : 'Stomach benign', code: 'D13.1', riders: ['질병수술비'], deepAnalysis: isKo ? '선종성 용종(Adenoma)인 경우 향후 암 발생 위험이 높아 추적 관찰 비용 실비 보상이 중요합니다.' : 'Adenomas have high cancer risk; ensure follow-up cost coverage.' },
                        { name: isKo ? '대장 용종' : 'Colon polyp', code: 'D12.6', riders: ['질병수술비'], deepAnalysis: isKo ? '용종 제거 시 1-5종 수술비 중 2종(대장) 또는 3종(위) 여부를 수술 기록지에서 확인하십시오.' : 'Check surgery record for Class 2 (colon) or Class 3 (stomach) benefits.' },
                        { name: isKo ? '자궁의 평활근종 (자궁근종)' : 'Leiomyoma of uterus', code: 'D25', riders: ['하이푸/자궁근종수술비'], isImportant: true, deepAnalysis: isKo ? '하이푸(HIFU) 시술 시 치료 목적성 소견서가 없으면 실비 지급이 거절될 수 있으니 미리 준비하십시오.' : 'HIFU requires "treatment necessity" statement for expense reimbursement.' },
                        { name: isKo ? '뇌수막의 양성 신생물' : 'Meninges benign', code: 'D32.0', riders: ['뇌질환수술비'], deepAnalysis: isKo ? '위치에 따라 수술이 불가능하여 크기 증가만으로도 암 진단비에 준하는 "임상적 암" 주장이 가능합니다.' : 'Inoperable benign brain tumors can be claimed as "Clinical Malignancy" due to growth.' },
                        { name: isKo ? '갑상선의 양성 신생물 (갑상선결절)' : 'Thyroid nodule', code: 'D34', riders: ['질병수술비'], isImportant: true, claimTips: isKo ? '결절의 크기가 2cm 이상이거나 세포검사상 "Atypia(비정형)" 소견이 보이면 소액암(갑상선암) 전단계로 간주하고 관리하십시오.' : 'Monitor 2cm+ or Atypia nodules as pre-malignant stages.', deepAnalysis: isKo ? 'Bethesda system 등급에 따라 수술 여부가 결정됩니다. Category 4 이상 시 수술비 담보 활용 가능성을 즉시 검토하십시오.' : 'Check surgical benefits for Bethesda Category 4+.' }
                    ]
                },
                {
                    name: isKo ? '행동양식 불명/미상 종양 (D37-D48)' : 'Borderline Tumors (D37-D48)',
                    items: [
                        { name: isKo ? '직장 유암종(NET)' : 'Rectal NET', code: 'D37.5', riders: riders.PSEUDO, isImportant: true, deepAnalysis: isKo ? 'L-cell 타입 여부와 상관없이 1cm 미만이라도 악성 암으로 보아야 한다는 최신 판례를 적극 활용하십시오.' : 'Use latest precedents to claim malignancy even for <1cm L-cell NETs.' },
                        { name: isKo ? '난소 경계성 종양' : 'Ovary borderline', code: 'D39.1', riders: riders.PSEUDO, deepAnalysis: isKo ? '조직검사상 "Low malignant potential" 문구가 있다면 경계성 종양 보험금 100% 수령 대상입니다.' : '"Low malignant potential" qualifies for 100% borderline benefits.' },
                        { name: isKo ? '진성 적혈구 과다증' : 'Polycythemia vera', code: 'D45', riders: ['일반암진단비'], deepAnalysis: isKo ? '과거 경계성 종양이었으나, 현재 KCD상 혈액 암으로 분류되어 일반암 100% 지급이 당연합니다.' : 'Formerly borderline, now KCD classifies D45 as malignant; claim 100%.' },
                        { name: isKo ? '본태성 고혈소판증' : 'Essential thrombocythemia', code: 'D47.3', riders: ['일반암진단비'], deepAnalysis: isKo ? 'D47.3 코드는 보험사와의 분쟁이 가장 잦은 혈액암 중 하나로, 전문 손해사정사의 의견서가 필수입니다.' : 'D47.3 is a high-dispute blood cancer; expert adjuster statement is essential.' }
                    ]
                }
            ]
        },
        {
            id: 'I',
            title: isKo ? '[I코드] 순환기계 상세 (심뇌혈관)' : '[I-Code] Circulatory (Detailed)',
            shortTitle: 'I코드',
            desc: isKo ? '모든 뇌경색, 협심증 및 혈관 관련 세부 코드입니다.' : 'Detailed vascular and heart codes.',
            subCategories: [
                {
                    name: isKo ? '고혈압 및 심장 질환 (I10-I52)' : 'Heart Diseases (I10-I52)',
                    items: [
                        { name: isKo ? '본태성 고혈압' : 'Essential hypertension', code: 'I10', riders: ['고혈압약제비'] },
                        { name: isKo ? '안정형 협심증' : 'Stable angina', code: 'I20.8', riders: riders.HEART, deepAnalysis: isKo ? '운동부하검사 또는 심장초음파상 허혈성 소견이 명확해야 하며, 약물 복용 기록이 진단 확정의 근거가 됩니다.' : 'Ischemic findings on stress test or echo, along with medication history, confirm diagnosis.' },
                        { name: isKo ? '전벽의 급성 심근경색' : 'Acute MI, anterior', code: 'I21.0', riders: riders.HEART, deepAnalysis: isKo ? '심전도(ST분절 상승)와 트로포닌 수치 변화가 핵심입니다. 골든타임 내 시술 여부를 확인하십시오.' : 'ECG (ST elevation) and troponin levels are key. Verify timely intervention.' },
                        { name: isKo ? '비ST분절상승 심근경색(NSTEMI)' : 'NSTEMI', code: 'I21.4', riders: riders.HEART, deepAnalysis: isKo ? 'STEMI보다 발견이 늦어 예후가 나쁠 수 있습니다. 심초음파상 "Wall motion abnormality(벽운동 이상)" 소견을 핵심 보상 근거로 삼으십시오.' : 'Wall motion abnormality on echo is the key claim evidence for NSTEMI.' },
                        { name: isKo ? '심방세동 및 조동' : 'Atrial fibrillation', code: 'I48', riders: riders.HEART, isImportant: true, deepAnalysis: isKo ? '심방세동은 뇌졸중 위험을 5배 높입니다. 항응고제(NOAC) 처방 시 뇌혈관 질환 예방 담보를 추가 점검하십시오.' : 'AFib increases stroke risk 5x. Check cerebrovascular prevention benefits if NOAC is prescribed.' },
                        { name: isKo ? '심부전' : 'Heart failure', code: 'I50', riders: ['심혈관질환진단비'], claimTips: isKo ? '심부전은 증상(호흡곤란, 부종)과 NT-proBNP 수치로 진단합니다. 말기 심부전 시 질병후유장해 75% 이상 수령 가능성을 확인하십시오.' : 'Check for 75%+ disease disability for terminal heart failure.' }
                    ]
                },
                {
                    name: isKo ? '뇌혈관 질환 (I60-I69)' : 'Cerebrovascular (I60-I69)',
                    items: [
                        { name: isKo ? '지주막하 출혈' : 'SAH', code: 'I60', riders: riders.BRAIN, claimTips: isKo ? '뇌동맥류 파열로 인한 SAH는 외상성(S코드)인지 자발성(I코드)인지가 쟁점입니다. 사고 경위가 불분명하다면 I60 코드를 우선 확보하십시오.' : 'Dispute between S-code vs I-code; secure I60 if cause is unclear.' },
                        { name: isKo ? '뇌내 출혈' : 'ICH', code: 'I61', riders: riders.BRAIN, deepAnalysis: isKo ? '혈종 제거술(Hemicraniectomy) 시행 시 수술비는 물론, 두개골 결손으로 인한 장해 평가(외모의 추상장해 15% 이상)를 병행하십시오.' : 'Evaluate skull defect disability (15%+) along with surgical benefits post-hemicraniectomy.' },
                        { name: isKo ? '뇌경색 (혈전증/색전증)' : 'Infarction, cerebral', code: 'I63.0-5', riders: riders.BRAIN, deepAnalysis: isKo ? 'I63.0(전뇌혈관), I63.3(대뇌동맥) 등 세부 번호에 따라 증상 발현 부위가 다르며, 급성기 치료 여부가 보상의 핵심입니다.' : 'Specific I63 codes denote different sites; acute treatment history is key for benefits.' },
                        { name: isKo ? '열공성 뇌경색' : 'Lacunar infarction', code: 'I63.8', riders: riders.BRAIN, isImportant: true, deepAnalysis: isKo ? '영상 판독지상 "Old lacunar"는 보상 제외될 수 있으나, 급성 마비 증상이 동반된 경우 적극 청구하십시오.' : '"Old lacunar" on imaging may be excluded; claim actively if acute paralysis symptoms are present.' },
                        { name: isKo ? '뇌전동맥의 폐쇄 및 협착' : 'Occlusion of precerebral', code: 'I65', riders: ['뇌혈관질환진단비'], deepAnalysis: isKo ? '뇌경색(I63)으로 진행되지 않은 단계(I65/I66)에서도 뇌혈관질환 진단비는 지급 대상입니다. 협착률 50% 이상 소견을 확인하십시오.' : 'Diagnosis benefits are payable for I65/I66 before progression to infarction. Check for 50%+ stenosis.' },
                        { name: isKo ? '비파열 뇌동맥류' : 'Cerebral aneurysm', code: 'I67.1', riders: ['뇌혈관질환진단비'], isImportant: true, deepAnalysis: isKo ? '코일색전술이나 클립결찰술 없이 추적 관찰만 하는 경우에도 "뇌혈관질환 진단비"는 100% 지급 대상입니다.' : 'Diagnosis benefits are 100% payable even if only follow-up (no surgery) is performed.' },
                        { name: isKo ? '뇌혈관 질환의 후유증' : 'Sequelae of stroke', code: 'I69', riders: ['질병후유장해'], deepAnalysis: isKo ? '뇌경색 발병 6개월 후 일상생활동작(ADLs) 제한 정도에 따라 장해 보험금 수령 규모가 결정됩니다.' : 'Disability benefits depend on ADL limitations 6 months post-stroke.' }
                    ]
                },
                {
                    name: isKo ? '동맥 및 정맥 질환 (I70-I89)' : 'Arteries & Veins (I70-I89)',
                    items: [
                        { name: isKo ? '대동맥류 및 박리' : 'Aortic aneurysm', code: 'I71', riders: ['혈관수술비'], isImportant: true, deepAnalysis: isKo ? '박리형 대동맥류는 응급 수술이 필수적이며, 수술 기법(스텐트 그라프트 등)에 따라 수술비 담보 중복 수령이 가능합니다.' : 'Dissecting aneurysm requires emergency surgery; check for multiple surgical benefit payouts depending on technique.' },
                        { name: isKo ? '하지의 정맥류' : 'Varicose veins', code: 'I83', riders: ['질병수술비'] },
                        { name: isKo ? '치핵 (치질)' : 'Hemorrhoids', code: 'I84', riders: ['치질수술비'] }
                    ]
                }
            ]
        },
        {
            id: 'M',
            title: isKo ? '[M코드] 근골격계 및 결합조직 (상세)' : '[M-Code] Musculoskeletal (Detailed)',
            shortTitle: 'M코드',
            desc: isKo ? '척추, 관절, 연조직의 모든 질병 코드입니다.' : 'Detailed codes for bone, joint, and soft tissue diseases.',
            subCategories: [
                {
                    name: isKo ? '관절병증 (M00-M25)' : 'Arthropathies',
                    items: [
                        { name: isKo ? '화농성 관절염' : 'Pyogenic arthritis', code: 'M00', riders: ['질병수술비'], deepAnalysis: isKo ? '관절 내 감염에 의한 긴급 상황으로, 연골 파괴 정도에 따라 관절 기능 장해(질병후유장해) 청구가 가능합니다.' : 'Septic arthritis is an emergency; cartilage destruction may qualify for disease disability benefits.' },
                        { name: isKo ? '류마티스 관절염' : 'Seropositive RA', code: 'M05', riders: ['질병후유장해'], deepAnalysis: isKo ? '다발성 관절 침범 시 각 관절별 장해율을 합산하여 지급률 50% 이상의 고액 보험금 청구가 가능한 질환입니다.' : 'Multiple joint involvement allows for summing disability rates, often exceeding 50%.' },
                        { name: isKo ? '통풍' : 'Gout', code: 'M10', riders: ['통풍진단비'], deepAnalysis: isKo ? '요산 수치와 관절액 검사 결과가 진단비 지급의 핵심입니다. 급성 통풍 발작 기록을 확보하십시오.' : 'Uric acid levels and synovial fluid tests confirm diagnosis. Record acute gout flares.' },
                        { name: isKo ? '무릎의 골관절염' : 'Osteoarthritis of knee', code: 'M17.0', riders: ['인공관절수술비'], isImportant: true, deepAnalysis: isKo ? 'KL-grade 4단계 소견이 있으면 인공관절 치환술 시 보험금 분쟁 없이 100% 지급 대상입니다.' : 'KL-grade 4 guarantees 100% payout for knee replacement surgery.' }
                    ]
                },
                {
                    name: isKo ? '척추병증 및 디스크 (M40-M54)' : 'Spine & Disc (M40-M54)',
                    items: [
                        { name: isKo ? '척추관 협착증 (요추)' : 'Lumbar spinal stenosis', code: 'M48.06', riders: ['질병수술비'], isImportant: true, claimTips: isKo ? '협착증은 퇴행성 질환으로 간주되어 보상이 까다롭습니다. "간헐적 파행(걷다 쉬다 반복)" 증상이 MRI 소견과 일치함을 강조하여 수술의 필연성을 주장하십시오.' : 'Emphasize that "intermittent claudication" matches MRI for surgical necessity.', deepAnalysis: isKo ? '황색인대 비대(Ligamentum flavum hypertrophy)가 신경관을 50% 이상 압박할 경우, 보존적 치료 실패 후 시행한 수술비는 100% 지급 대상입니다.' : 'Surgery post-conservative failure for 50%+ compression is 100% payable.' },
                        { name: isKo ? '경추 디스크 (신경뿌리병증)' : 'Cervical disc w/ radiculopathy', code: 'M50.1', riders: ['질병수술비'], isImportant: true, claimTips: isKo ? '상지 방사통(팔 저림) 유무가 핵심입니다. 근전도 검사(EMG) 결과지에서 신경근 병증 소견을 확보하여 수술비 및 실비를 청구하십시오.' : 'Secure EMG evidence of radiculopathy for arm numbness claims.', deepAnalysis: isKo ? 'MRI상 Protrusion(돌출) 이상의 소견이 있고 신경학적 결손이 확인되면 기왕증 감액 없이 상해/질병 수술비 지급을 강력히 요구하십시오.' : 'Demand full payment if MRI shows protrusion+ with neurological deficits.' },
                        { name: isKo ? '요추 디스크 (신경뿌리병증)' : 'Lumbar disc w/ radiculopathy', code: 'M51.1', riders: ['질병수술비'], isImportant: true, claimTips: isKo ? '보험사가 "기왕증 감액"을 주장할 때, 사고 전 2년간 척추 치료력이 없음을 건강보험공단 기록으로 반박하는 전략이 효과적입니다.' : 'Counter "pre-existing" claims with 2-year clean NHI records.' }
                    ]
                },
                {
                    name: isKo ? '연조직 및 골다공증 (M60-M99)' : 'Soft Tissue & Osteoporosis',
                    items: [
                        { name: isKo ? '회전근개 증후군 (어깨 파열)' : 'Rotator cuff syndrome', code: 'M75.1', riders: ['질병수술비'], isImportant: true, deepAnalysis: isKo ? '완전 파열(Full thickness) 여부가 수술비 지급 규모를 결정합니다. 부분 파열 시 보존적 치료비 실비를 우선 청구하십시오.' : 'Full thickness tear determines surgical benefit amounts. For partial tears, claim conservative treatment expenses.' },
                        { name: isKo ? '골다공증 (T-score -2.5 이하)' : 'Osteoporosis', code: 'M81', riders: ['실손의료비'], isImportant: true, deepAnalysis: isKo ? 'BMD(골밀도) 결과지상 T-score를 확인하십시오. -2.5 이하 시 급여 처리가 가능하여 실비 보상 범위가 확대됩니다.' : 'Verify T-score <= -2.5 for NHI coverage and expanded reimbursement.' },
                        { name: isKo ? '대퇴골두 무혈성 괴사' : 'AVN of femur head', code: 'M87.0', riders: ['인공관절수술비'], isImportant: true, deepAnalysis: isKo ? '괴사 범위가 체중 부위(Weight bearing)를 포함하는지가 관절 치환술의 의학적 타당성 근거가 됩니다.' : 'Involvement of weight-bearing areas justifies hip replacement surgery.' }
                    ]
                }
            ]
        },
        {
            id: 'S',
            title: isKo ? '[S코드] 상해 및 외상 (전신 부위별)' : '[S-Code] Injury & Trauma (All Sites)',
            shortTitle: 'S코드',
            desc: isKo ? '머리부터 발끝까지 모든 골절, 탈구, 파열 코드입니다.' : 'Detailed injury codes for the entire body.',
            subCategories: [
                {
                    name: isKo ? '두부 및 안면 골절 (S02)' : 'Head & Face Fractures',
                    items: [
                        { name: isKo ? '코뼈 골절' : 'Nasal bone fracture', code: 'S02.2', riders: riders.INJURY, isImportant: true, deepAnalysis: isKo ? '단순 골절이라도 도수정복술 시행 시 "상해수술비" 지급 대상입니다. 비급여 재료대 실비를 정밀 확인하십시오.' : 'Nasal reduction surgery qualifies for injury surgical benefits. Check non-benefit material costs.' },
                        { name: isKo ? '안와저 골절' : 'Orbital floor fracture', code: 'S02.3', riders: riders.INJURY, deepAnalysis: isKo ? '복시(사물이 두 개로 보임) 증상 발생 시 안구 운동 장해로 인한 상해후유장해 청구가 가능합니다.' : 'Diplopia symptoms may qualify for eye-movement related disability benefits.' }
                    ]
                },
                {
                    name: isKo ? '척추 및 흉부 골절 (S12-S32)' : 'Spine & Chest Fractures',
                    items: [
                        { name: isKo ? '흉/요추 압박골절' : 'Compression fracture', code: 'S22/S32', riders: riders.INJURY, isImportant: true, deepAnalysis: isKo ? '압박률(Compression %)에 따라 기형장해 15~50% 확정 수령 가능합니다. 골시멘트 시술 여부와 상관없이 장해 청구가 가능합니다.' : 'Deformity disability (15-50%) is available based on compression percentage, regardless of kyphoplasty.' },
                        { name: isKo ? '늑골(갈비뼈) 골절' : 'Rib fracture', code: 'S22.3', riders: riders.INJURY, deepAnalysis: isKo ? '다발성 골절(여러 대 부러짐) 시 가슴 통증으로 인한 호흡 곤란을 상해입원일당 청구의 근거로 활용하십시오.' : 'Multiple rib fractures causing dyspnea justify injury inpatient benefits.' }
                    ]
                },
                {
                    name: isKo ? '사지(팔/다리) 골절 (S42-S92)' : 'Limb Fractures',
                    items: [
                        { name: isKo ? '손목(요골) 골절' : 'Distal radius fracture', code: 'S52.5', riders: riders.INJURY, isImportant: true, deepAnalysis: isKo ? '관절면 침범 여부가 핵심입니다. 수술 후 강직 발생 시 맥브라이드 장해 10~13% 수령이 가능합니다.' : 'Joint surface involvement is key. Post-op stiffness may qualify for 10-13% McBride disability.' },
                        { name: isKo ? '대퇴골 경부 골절' : 'Femur neck fracture', code: 'S72.0', riders: riders.INJURY, isImportant: true, deepAnalysis: isKo ? '노인성 낙상 시 기왕증 감액이 심한 부위이나, 직접적인 외상 기여도를 입증하여 100% 수령 전략이 필요합니다.' : 'Common in elderly falls; prove direct traumatic contribution to avoid pre-existing condition reductions.' },
                        { name: isKo ? '발목 골절' : 'Ankle fracture', code: 'S82.8', riders: riders.INJURY, isImportant: true, deepAnalysis: isKo ? '내과/외과/후과 동시 골절(삼복사 골절) 시 장해율이 매우 높으며, 금속판 제거술 시 추가 수술비 수령 여부를 확인하십시오.' : 'Trimalleolar fractures have high disability rates. Check for additional benefits during hardware removal.' }
                    ]
                },
                {
                    name: isKo ? '인대 파열 및 건 손상 (S-Code)' : 'Ligament & Tendon Injuries',
                    items: [
                        { name: isKo ? '무릎 전방십자인대 파열' : 'ACL tear', code: 'S83.5', riders: ['상해후유장해'], isImportant: true, claimTips: isKo ? '단순 파열보다 수술 후 "동요(흔들림)" 정도가 중요합니다. KT-2000 검사 등으로 5mm 이상의 동요를 입증하여 상해후유장해 보험금을 확보하십시오.' : 'Prove 5mm+ instability via KT-2000 for disability benefits.', deepAnalysis: isKo ? '동요 측정 결과 5mm/10mm/15mm 기준에 따라 지급률 5%/10%/20%가 결정되는 고액 장해 건입니다. 전문의의 ' : 'Instability measurements (5/10/15mm) determine 5/10/20% disability rates.' },
                        { name: isKo ? '아킬레스건 파열' : 'Achilles tendon rupture', code: 'S86.0', riders: ['상해수술비'], claimTips: isKo ? '아킬레스건 파열은 ' : 'Achilles rupture is often 100% traumatic; ensure full benefit payout.' }
                    ]
                }
            ]
        },
        {
            id: 'G/F/Q/O/H/N/L/K/J',
            title: isKo ? '[기타] 내과/소아/정신/피부' : '[Misc] Medical/Pedi/Mental',
            shortTitle: '기타코드',
            desc: isKo ? 'G, F, Q, O, H, N, L, K, J 등 KCD-8차의 나머지 주요 분류입니다.' : 'Comprehensive miscellaneous classification.',
            subCategories: [
                {
                    name: isKo ? '신경 및 정신 (G/F)' : 'Nerve & Mental',
                    items: [
                        { name: isKo ? '알츠하이머 치매' : 'Alzheimer\'s', code: 'G30', riders: ['치매진단비'], isImportant: true, deepAnalysis: isKo ? 'CDR 척도(1~5점)가 보상의 절대적 기준입니다. 90일 이상 증상 지속 여부를 주치의 기록으로 증명하십시오.' : 'CDR scale (1-5) is the absolute standard. Prove 90-day symptom persistence via physician records.' },
                        { name: isKo ? '뇌전증 (간질)' : 'Epilepsy', code: 'G40', riders: ['질병후유장해'], deepAnalysis: isKo ? '발작 빈도와 뇌파(EEG) 검사상 이상 소견 유무에 따라 장해 등급이 결정됩니다.' : 'Disability grade depends on seizure frequency and abnormal EEG findings.' }
                    ]
                },
                {
                    name: isKo ? '감각기 및 비뇨생식기 (H/N)' : 'Sensory & Urogenital',
                    items: [
                        { name: isKo ? '노년 백내장' : 'Senile cataract', code: 'H25.9', riders: ['질병수술비'], isImportant: true, deepAnalysis: isKo ? '다초점 인공수정체 삽입 시 실손보험 약관 시기에 따라 보상 여부가 크게 갈리므로 약관 확인이 선행되어야 합니다.' : 'Multifocal lens reimbursement depends heavily on the policy year; check terms first.' },
                        { name: isKo ? '만성 신부전' : 'CKD', code: 'N18.5', riders: ['질병후유장해'], isImportant: true, deepAnalysis: isKo ? '혈액투석 또는 복막투석 개시 시 질병후유장해 75%에 해당하는 매우 높은 지급률이 적용됩니다.' : 'Dialysis onset qualifies for a 75% disease disability rate.' }
                    ]
                },
                {
                    name: isKo ? '소화기 및 호흡기 (K/J)' : 'Digestive & Resp (K/J)',
                    items: [
                        { name: isKo ? '간의 경변증(간경화)' : 'Liver cirrhosis', code: 'K74.6', riders: ['질병후유장해'], isImportant: true, deepAnalysis: isKo ? 'Child-Pugh 점수에 따른 간 기능 저하 정도를 평가하여 장해 보험금을 청구하십시오.' : 'Claim disability benefits by evaluating liver function via Child-Pugh scores.' },
                        { name: isKo ? 'COPD (만성폐쇄성폐질환)' : 'COPD', code: 'J44', riders: ['질병후유장해'], deepAnalysis: isKo ? '폐활량(FEV1) 측정 수치에 따라 흉복부 장기로 분류되어 고액 장해 보험금 수령이 가능합니다.' : 'FEV1 levels categorize this as a thoracic/abdominal organ disability for high payouts.' }
                    ]
                }
            ]
        }
    ]
}
