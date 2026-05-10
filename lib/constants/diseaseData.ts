
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
                        { name: isKo ? '위의 분문' : 'Cardia', code: 'C16.0', riders: riders.CANCER },
                        { name: isKo ? '위의 위저' : 'Fundus of stomach', code: 'C16.1', riders: riders.CANCER },
                        { name: isKo ? '위의 위체' : 'Body of stomach', code: 'C16.2', riders: riders.CANCER },
                        { name: isKo ? '위의 전정부' : 'Pyloric antrum', code: 'C16.3', riders: riders.CANCER },
                        { name: isKo ? '위의 유문' : 'Pylorus', code: 'C16.4', riders: riders.CANCER },
                        { name: isKo ? '위의 소만' : 'Lesser curvature', code: 'C16.5', riders: riders.CANCER },
                        { name: isKo ? '위의 대만' : 'Greater curvature', code: 'C16.6', riders: riders.CANCER },
                        { name: isKo ? '위의 상세불명' : 'Unspecified stomach', code: 'C16.9', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '결장(대장)의 악성 신생물 (C18)' : 'Colon Cancer (C18)',
                    items: [
                        { name: isKo ? '맹장' : 'Cecum', code: 'C18.0', riders: riders.CANCER },
                        { name: isKo ? '충수' : 'Appendix', code: 'C18.1', riders: riders.CANCER },
                        { name: isKo ? '상행결장' : 'Ascending colon', code: 'C18.2', riders: riders.CANCER },
                        { name: isKo ? '횡행결장' : 'Transverse colon', code: 'C18.4', riders: riders.CANCER },
                        { name: isKo ? '하행결장' : 'Descending colon', code: 'C18.6', riders: riders.CANCER },
                        { name: isKo ? 'S상결장' : 'Sigmoid colon', code: 'C18.7', riders: riders.CANCER },
                        { name: isKo ? '직장S상결장 이행부' : 'Rectosigmoid junction', code: 'C19', riders: riders.CANCER },
                        { name: isKo ? '직장' : 'Rectum', code: 'C20', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '간 및 담도 (C22-C24)' : 'Liver & Biliary (C22-C24)',
                    items: [
                        { name: isKo ? '간세포암종' : 'Hepatocellular carcinoma', code: 'C22.0', riders: riders.CANCER },
                        { name: isKo ? '간내 담관암' : 'Intrahepatic bile duct carcinoma', code: 'C22.1', riders: riders.CANCER },
                        { name: isKo ? '간모세포종' : 'Hepatoblastoma', code: 'C22.2', riders: riders.CANCER },
                        { name: isKo ? '담낭' : 'Gallbladder', code: 'C23', riders: riders.CANCER },
                        { name: isKo ? '담도의 기타 부분' : 'Other parts of biliary tract', code: 'C24', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '기타 주요 소화기 암 (C25-C26)' : 'Other Digestive Cancers (C25-C26)',
                    items: [
                        { name: isKo ? '췌장의 머리' : 'Head of pancreas', code: 'C25.0', riders: riders.CANCER },
                        { name: isKo ? '췌장의 몸통' : 'Body of pancreas', code: 'C25.1', riders: riders.CANCER },
                        { name: isKo ? '췌장의 꼬리' : 'Tail of pancreas', code: 'C25.2', riders: riders.CANCER },
                        { name: isKo ? '췌장관' : 'Pancreatic duct', code: 'C25.3', riders: riders.CANCER },
                        { name: isKo ? '췌장의 상세불명' : 'Unspecified pancreas', code: 'C25.9', riders: riders.CANCER, isImportant: true }
                    ]
                },
                {
                    name: isKo ? '유방의 악성 신생물 (C50)' : 'Breast Cancer (C50)',
                    items: [
                        { name: isKo ? '유방의 유두 및 유륜' : 'Nipple & areola', code: 'C50.0', riders: riders.CANCER },
                        { name: isKo ? '유방의 중앙부' : 'Central portion', code: 'C50.1', riders: riders.CANCER },
                        { name: isKo ? '유방의 내상사분기' : 'Upper-inner quadrant', code: 'C50.2', riders: riders.CANCER },
                        { name: isKo ? '유방의 하내사분기' : 'Lower-inner quadrant', code: 'C50.3', riders: riders.CANCER },
                        { name: isKo ? '유방의 외상사분기' : 'Upper-outer quadrant', code: 'C50.4', riders: riders.CANCER, isImportant: true },
                        { name: isKo ? '유방의 하외사분기' : 'Lower-outer quadrant', code: 'C50.5', riders: riders.CANCER },
                        { name: isKo ? '유방의 상세불명' : 'Unspecified breast', code: 'C50.9', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '비뇨기관의 악성 신생물 (C64-C68)' : 'Urinary Tract Cancers (C64-C68)',
                    items: [
                        { name: isKo ? '신우를 제외한 신장암' : 'Kidney, except renal pelvis', code: 'C64', riders: riders.CANCER, isImportant: true },
                        { name: isKo ? '신우' : 'Renal pelvis', code: 'C65', riders: riders.CANCER },
                        { name: isKo ? '요관' : 'Ureter', code: 'C66', riders: riders.CANCER },
                        { name: isKo ? '방광의 삼각부' : 'Trigone of bladder', code: 'C67.0', riders: riders.CANCER },
                        { name: isKo ? '방광의 측벽' : 'Lateral wall of bladder', code: 'C67.2', riders: riders.CANCER, isImportant: true },
                        { name: isKo ? '요도' : 'Urethra', code: 'C68.0', riders: riders.CANCER }
                    ]
                },
                {
                    name: isKo ? '뇌 및 중추신경계의 악성 신생물 (C71-C72)' : 'Brain & CNS Cancers (C71-C72)',
                    items: [
                        { name: isKo ? '대뇌' : 'Cerebrum', code: 'C71.0', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '전두엽' : 'Frontal lobe', code: 'C71.1', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '측두엽' : 'Temporal lobe', code: 'C71.2', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '뇌실' : 'Cerebral ventricle', code: 'C71.5', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '뇌간' : 'Brain stem', code: 'C71.6', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '척수' : 'Spinal cord', code: 'C72.0', riders: [...riders.CANCER, '고액암'] }
                    ]
                },
                {
                    name: isKo ? '다발성 골수종 및 악성 혈액질환 (C90)' : 'Multiple Myeloma & Blood (C90)',
                    items: [
                        { name: isKo ? '다발성 골수종' : 'Multiple myeloma', code: 'C90.0', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '혈장세포 백혈병' : 'Plasma cell leukemia', code: 'C90.1', riders: [...riders.CANCER, '고액암'] },
                        { name: isKo ? '골수외 혈장세포종' : 'Extramedullary plasmacytoma', code: 'C90.2', riders: [...riders.CANCER, '고액암'] }
                    ]
                },
                {
                    name: isKo ? '기관지 및 폐 (C34)' : 'Bronchus & Lung (C34)',
                    items: [
                        { name: isKo ? '주기관지' : 'Main bronchus', code: 'C34.0', riders: riders.CANCER },
                        { name: isKo ? '상엽' : 'Upper lobe', code: 'C34.1', riders: riders.CANCER },
                        { name: isKo ? '중엽' : 'Middle lobe', code: 'C34.2', riders: riders.CANCER },
                        { name: isKo ? '하엽' : 'Lower lobe', code: 'C34.3', riders: riders.CANCER },
                        { name: isKo ? '상세불명' : 'Unspecified bronchus/lung', code: 'C34.9', riders: riders.CANCER, isImportant: true }
                    ]
                },
                {
                    name: isKo ? '여성 생식기관의 악성 신생물 (C51-C58)' : 'Female Genital Cancers (C51-C58)',
                    items: [
                        { name: isKo ? '외음' : 'Vulva', code: 'C51', riders: riders.CANCER },
                        { name: isKo ? '질' : 'Vagina', code: 'C52', riders: riders.CANCER },
                        { name: isKo ? '자궁경부' : 'Cervix uteri', code: 'C53.9', riders: riders.CANCER, isImportant: true },
                        { name: isKo ? '자궁체부' : 'Corpus uteri', code: 'C54.1', riders: riders.CANCER },
                        { name: isKo ? '자궁의 상세불명 부분' : 'Uterus, unspecified', code: 'C55', riders: riders.CANCER },
                        { name: isKo ? '난소' : 'Ovary', code: 'C56', riders: riders.CANCER, isImportant: true },
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
                    name: isKo ? '양성 신생물 (D10-D36)' : 'Benign Neoplasms',
                    items: [
                        { name: isKo ? '입술의 양성 신생물' : 'Benign neoplasm of lip', code: 'D10.0', riders: ['질병수술비'] },
                        { name: isKo ? '혀의 양성 신생물' : 'Benign neoplasm of tongue', code: 'D10.1', riders: ['질병수술비'] },
                        { name: isKo ? '구강저의 양성 신생물' : 'Benign neoplasm of floor of mouth', code: 'D10.2', riders: ['질병수술비'] },
                        { name: isKo ? '잇몸의 양성 신생물' : 'Benign neoplasm of gum', code: 'D10.3', riders: ['질병수술비'] },
                        { name: isKo ? '식도의 양성 신생물' : 'Benign neoplasm of esophagus', code: 'D13.0', riders: ['질병수술비'] },
                        { name: isKo ? '위의 양성 신생물 (위용종)' : 'Benign neoplasm of stomach', code: 'D13.1', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '십이지장의 양성 신생물' : 'Benign neoplasm of duodenum', code: 'D13.2', riders: ['질병수술비'] },
                        { name: isKo ? '결장(대장)의 양성 신생물 (대장용종)' : 'Benign neoplasm of colon', code: 'D12.6', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '직장의 양성 신생물' : 'Benign neoplasm of rectum', code: 'D12.8', riders: ['질병수술비'] },
                        { name: isKo ? '간의 양성 신생물 (간혈관종 등)' : 'Benign neoplasm of liver', code: 'D13.4', riders: ['질병수술비'] },
                        { name: isKo ? '췌장의 양성 신생물' : 'Benign neoplasm of pancreas', code: 'D13.6', riders: ['질병수술비'] },
                        { name: isKo ? '후두의 양성 신생물 (성대폴립 등)' : 'Benign neoplasm of larynx', code: 'D14.1', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '기관의 양성 신생물' : 'Benign neoplasm of trachea', code: 'D14.2', riders: ['질병수술비'] },
                        { name: isKo ? '기관지 및 폐의 양성 신생물' : 'Benign neoplasm of lung', code: 'D14.3', riders: ['질병수술비'] },
                        { name: isKo ? '가슴샘(흉선)의 양성 신생물' : 'Benign neoplasm of thymus', code: 'D15.0', riders: ['질병수술비'] },
                        { name: isKo ? '심장의 양성 신생물' : 'Benign neoplasm of heart', code: 'D15.1', riders: ['질병수술비'] },
                        { name: isKo ? '멜라닌세포 모반 (점)' : 'Melanocytic nevi', code: 'D22', riders: ['피부질환수술비'] },
                        { name: isKo ? '기타 피부의 양성 신생물' : 'Other benign neoplasms of skin', code: 'D23', riders: ['피부질환수술비'] },
                        { name: isKo ? '자궁의 평활근종 (자궁근종)' : 'Leiomyoma of uterus', code: 'D25', riders: ['하이푸/자궁근종수술비'], isImportant: true },
                        { name: isKo ? '난소의 양성 신생물' : 'Benign neoplasm of ovary', code: 'D27', riders: ['질병수술비'] },
                        { name: isKo ? '신장의 양성 신생물' : 'Benign neoplasm of kidney', code: 'D30.0', riders: ['질병수술비'] },
                        { name: isKo ? '방광의 양성 신생물' : 'Benign neoplasm of bladder', code: 'D30.3', riders: ['질병수술비'] },
                        { name: isKo ? '안구의 양성 신생물' : 'Benign neoplasm of eye', code: 'D31', riders: ['질병수술비'] },
                        { name: isKo ? '뇌수막의 양성 신생물' : 'Benign neoplasm of cerebral meninges', code: 'D32.0', riders: ['뇌질환수술비'] },
                        { name: isKo ? '뇌의 양성 신생물' : 'Benign neoplasm of brain', code: 'D33', riders: ['뇌질환수술비'], isImportant: true },
                        { name: isKo ? '갑상선의 양성 신생물 (갑상선결절)' : 'Benign neoplasm of thyroid', code: 'D34', riders: ['질병수술비'], isImportant: true }
                    ]
                },
                {
                    name: isKo ? '행동양식 불명/미상 종양 (D37-D48)' : 'Neoplasms of Uncertain Behavior',
                    items: [
                        { name: isKo ? '입술/구강 경계성 종양' : 'Oral borderline', code: 'D37.0', riders: riders.PSEUDO },
                        { name: isKo ? '위 경계성 종양' : 'Stomach borderline', code: 'D37.1', riders: riders.PSEUDO },
                        { name: isKo ? '소장 경계성 종양' : 'Small intestine borderline', code: 'D37.2', riders: riders.PSEUDO },
                        { name: isKo ? '충수 경계성 종양' : 'Appendix borderline', code: 'D37.3', riders: riders.PSEUDO },
                        { name: isKo ? '결장 경계성 종양' : 'Colon borderline', code: 'D37.4', riders: riders.PSEUDO },
                        { name: isKo ? '직장 유암종(NET)' : 'Rectal NET', code: 'D37.5', riders: riders.PSEUDO, isImportant: true },
                        { name: isKo ? '간/담낭 경계성 종양' : 'Liver/Biliary borderline', code: 'D37.6', riders: riders.PSEUDO },
                        { name: isKo ? '췌장 경계성 종양' : 'Pancreas borderline', code: 'D37.7', riders: riders.PSEUDO },
                        { name: isKo ? '후두 경계성 종양' : 'Larynx borderline', code: 'D38.0', riders: riders.PSEUDO },
                        { name: isKo ? '기관지/폐 경계성 종양' : 'Lung borderline', code: 'D38.1', riders: riders.PSEUDO },
                        { name: isKo ? '흉막 경계성 종양' : 'Pleura borderline', code: 'D38.2', riders: riders.PSEUDO },
                        { name: isKo ? '자궁 경계성 종양' : 'Uterus borderline', code: 'D39.0', riders: riders.PSEUDO },
                        { name: isKo ? '난소 경계성 종양' : 'Ovary borderline', code: 'D39.1', riders: riders.PSEUDO },
                        { name: isKo ? '태반 경계성 종양' : 'Placenta borderline', code: 'D39.2', riders: riders.PSEUDO },
                        { name: isKo ? '전립선 경계성 종양' : 'Prostate borderline', code: 'D40.0', riders: riders.PSEUDO },
                        { name: isKo ? '고환 경계성 종양' : 'Testis borderline', code: 'D40.1', riders: riders.PSEUDO },
                        { name: isKo ? '신장 경계성 종양' : 'Kidney borderline', code: 'D41.0', riders: riders.PSEUDO },
                        { name: isKo ? '방광 경계성 종양' : 'Bladder borderline', code: 'D41.4', riders: riders.PSEUDO },
                        { name: isKo ? '뇌수막 경계성 종양' : 'Meninges borderline', code: 'D42', riders: riders.PSEUDO },
                        { name: isKo ? '뇌 경계성 종양' : 'Brain borderline', code: 'D43.0', riders: riders.PSEUDO },
                        { name: isKo ? '진성 적혈구 과다증' : 'Polycythemia vera', code: 'D45', riders: ['일반암진단비'] },
                        { name: isKo ? '골수형성이상증후군(MDS)' : 'MDS', code: 'D46.0', riders: ['일반암진단비'] },
                        { name: isKo ? '본태성 고혈소판증' : 'Essential thrombocythemia', code: 'D47.3', riders: ['일반암진단비'] }
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
                        { name: isKo ? '고혈압성 심장질환' : 'Hypertensive heart disease', code: 'I11', riders: ['질병후유장해'] },
                        { name: isKo ? '안정형 협심증' : 'Stable angina', code: 'I20.8', riders: riders.HEART },
                        { name: isKo ? '변이형 협심증' : 'Variant angina', code: 'I20.1', riders: riders.HEART },
                        { name: isKo ? '전벽의 급성 심근경색' : 'Acute MI, anterior', code: 'I21.0', riders: riders.HEART },
                        { name: isKo ? '하벽의 급성 심근경색' : 'Acute MI, inferior', code: 'I21.1', riders: riders.HEART },
                        { name: isKo ? '비ST분절상승 심근경색(NSTEMI)' : 'NSTEMI', code: 'I21.4', riders: riders.HEART },
                        { name: isKo ? '만성 허혈성 심장병' : 'Chronic ischemic heart disease', code: 'I25', riders: riders.HEART },
                        { name: isKo ? '승모판 폐쇄부전' : 'Mitral insufficiency', code: 'I34.0', riders: ['심장판막수술비'] },
                        { name: isKo ? '대동맥판 협착' : 'Aortic stenosis', code: 'I35.0', riders: ['심장판막수술비'] },
                        { name: isKo ? '심방세동 및 조동' : 'Atrial fibrillation', code: 'I48', riders: riders.HEART, isImportant: true },
                        { name: isKo ? '발작성 빈맥' : 'Paroxysmal tachycardia', code: 'I47', riders: riders.HEART },
                        { name: isKo ? '심부전' : 'Heart failure', code: 'I50', riders: ['심혈관질환진단비'] }
                    ]
                },
                {
                    name: isKo ? '뇌혈관 질환 (I60-I69)' : 'Cerebrovascular (I60-I69)',
                    items: [
                        { name: isKo ? '지주막하 출혈 (비파열 뇌동맥류 파열)' : 'SAH', code: 'I60', riders: riders.BRAIN },
                        { name: isKo ? '뇌내 출혈' : 'ICH', code: 'I61', riders: riders.BRAIN },
                        { name: isKo ? '뇌전동맥의 폐쇄에 의한 뇌경색' : 'Infarction, precerebral', code: 'I63.0', riders: riders.BRAIN },
                        { name: isKo ? '대뇌전동맥의 폐쇄에 의한 뇌경색' : 'Infarction, cerebral artery', code: 'I63.3', riders: riders.BRAIN },
                        { name: isKo ? '뇌정맥 혈전증에 의한 뇌경색' : 'Infarction, cerebral venous', code: 'I63.6', riders: riders.BRAIN },
                        { name: isKo ? '열공성 뇌경색' : 'Lacunar infarction', code: 'I63.8', riders: riders.BRAIN, isImportant: true },
                        { name: isKo ? '상세불명의 뇌경색' : 'Infarction, unspecified', code: 'I63.9', riders: riders.BRAIN },
                        { name: isKo ? '비파열 뇌동맥류' : 'Cerebral aneurysm', code: 'I67.1', riders: ['뇌혈관질환진단비'], isImportant: true },
                        { name: isKo ? '경동맥의 협착' : 'Carotid stenosis', code: 'I67.2', riders: ['뇌혈관질환진단비'] },
                        { name: isKo ? '모야모야병' : 'Moyamoya disease', code: 'I67.5', riders: ['뇌혈관질환진단비'] },
                        { name: isKo ? '뇌혈관 질환의 후유증' : 'Sequelae of stroke', code: 'I69', riders: ['질병후유장해'] }
                    ]
                },
                {
                    name: isKo ? '동맥 및 정맥 질환 (I70-I89)' : 'Arteries & Veins (I70-I89)',
                    items: [
                        { name: isKo ? '죽상경화증' : 'Atherosclerosis', code: 'I70', riders: ['혈관수술비'] },
                        { name: isKo ? '대동맥류 및 박리' : 'Aortic aneurysm', code: 'I71', riders: ['혈관수술비'], isImportant: true },
                        { name: isKo ? '기타 말초혈관 질환' : 'Other peripheral vascular', code: 'I73', riders: ['혈관수술비'] },
                        { name: isKo ? '동맥의 색전증 및 혈전증' : 'Arterial embolism', code: 'I74', riders: ['혈관수술비'] },
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
                        { name: isKo ? '화농성 관절염' : 'Pyogenic arthritis', code: 'M00', riders: ['질병수술비'] },
                        { name: isKo ? '직접 감염된 관절병증' : 'Direct infection of joint', code: 'M01', riders: ['질병수술비'] },
                        { name: isKo ? '혈청양성 류마티스 관절염' : 'Seropositive RA', code: 'M05', riders: ['질병후유장해'] },
                        { name: isKo ? '기타 류마티스 관절염' : 'Other RA', code: 'M06', riders: ['질병후유장해'] },
                        { name: isKo ? '청소년기 류마티스 관절염' : 'Juvenile RA', code: 'M08', riders: ['질병후유장해'] },
                        { name: isKo ? '통풍' : 'Gout', code: 'M10', riders: ['통풍진단비'] },
                        { name: isKo ? '무릎의 이지성 골관절염' : 'Osteoarthritis of knee', code: 'M17.0', riders: ['인공관절수술비'], isImportant: true },
                        { name: isKo ? '고관절의 골관절염' : 'Osteoarthritis of hip', code: 'M16', riders: ['인공관절수술비'] },
                        { name: isKo ? '무릎의 반월상 연골 장애' : 'Meniscus derangement', code: 'M23', riders: ['질병수술비'] }
                    ]
                },
                {
                    name: isKo ? '척추병증 및 디스크 (M40-M54)' : 'Spine & Disc (M40-M54)',
                    items: [
                        { name: isKo ? '강직성 척추염' : 'Ankylosing spondylitis', code: 'M45', riders: ['질병수술비'] },
                        { name: isKo ? '척추관 협착증 (경추)' : 'Cervical spinal stenosis', code: 'M48.02', riders: ['질병수술비'] },
                        { name: isKo ? '척추관 협착증 (요추)' : 'Lumbar spinal stenosis', code: 'M48.06', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '척추전방전위증' : 'Spondylolisthesis', code: 'M43.1', riders: ['질병수술비'] },
                        { name: isKo ? '경추 디스크 (신경뿌리병증 동반)' : 'Cervical disc w/ radiculopathy', code: 'M50.1', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '요추 디스크 (신경뿌리병증 동반)' : 'Lumbar disc w/ radiculopathy', code: 'M51.1', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '척추증 (요추)' : 'Spondylosis, lumbar', code: 'M47.8', riders: ['질병수술비'] }
                    ]
                },
                {
                    name: isKo ? '연조직 및 골다공증 (M60-M99)' : 'Soft Tissue & Osteoporosis',
                    items: [
                        { name: isKo ? '회전근개 증후군 (어깨 파열)' : 'Rotator cuff syndrome', code: 'M75.1', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '오십견 (유착성 관절낭염)' : 'Frozen shoulder', code: 'M75.0', riders: ['질병수술비'] },
                        { name: isKo ? '테니스 엘보' : 'Tennis elbow', code: 'M77.1', riders: ['실손의료비'] },
                        { name: isKo ? '방아쇠 손가락' : 'Trigger finger', code: 'M65.3', riders: ['질병수술비'] },
                        { name: isKo ? '병적 골절을 동반한 골다공증' : 'Osteoporosis w/ fracture', code: 'M80', riders: ['질병수술비'] },
                        { name: isKo ? '골다공증 (T-score -2.5 이하)' : 'Osteoporosis', code: 'M81', riders: ['실손의료비'], isImportant: true },
                        { name: isKo ? '대퇴골두 무혈성 괴사' : 'AVN of femur head', code: 'M87.0', riders: ['인공관절수술비'], isImportant: true }
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
                        { name: isKo ? '두개골 둥근천장 골절' : 'Skull vault fracture', code: 'S02.0', riders: riders.INJURY },
                        { name: isKo ? '두개저 골절' : 'Skull base fracture', code: 'S02.1', riders: riders.INJURY },
                        { name: isKo ? '코뼈 골절' : 'Nasal bone fracture', code: 'S02.2', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '안와저 골절' : 'Orbital floor fracture', code: 'S02.3', riders: riders.INJURY },
                        { name: isKo ? '광대뼈 골절' : 'Malar/maxillary fracture', code: 'S02.4', riders: riders.INJURY },
                        { name: isKo ? '치조골 골절' : 'Alveolar process fracture', code: 'S02.8', riders: ['상해수술비'] }
                    ]
                },
                {
                    name: isKo ? '척추 및 흉부 골절 (S12-S32)' : 'Spine & Chest Fractures',
                    items: [
                        { name: isKo ? '경추(목) 제1추골 골절' : 'C1 fracture', code: 'S12.0', riders: riders.INJURY },
                        { name: isKo ? '경추(목) 제2추골 골절' : 'C2 fracture', code: 'S12.1', riders: riders.INJURY },
                        { name: isKo ? '경추(목) 제7추골 골절' : 'C7 fracture', code: 'S12.2', riders: riders.INJURY },
                        { name: isKo ? '흉추 골절 (압박골절)' : 'Thoracic compression fracture', code: 'S22.0', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '늑골(갈비뼈) 골절' : 'Rib fracture', code: 'S22.3', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '요추 골절 (압박골절)' : 'Lumbar compression fracture', code: 'S32.0', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '천추 골절' : 'Sacrum fracture', code: 'S32.1', riders: riders.INJURY },
                        { name: isKo ? '골반 골절' : 'Pelvic fracture', code: 'S32.8', riders: riders.INJURY }
                    ]
                },
                {
                    name: isKo ? '상지(어깨/팔/손) 골절 (S42-S62)' : 'Upper Limb Fractures',
                    items: [
                        { name: isKo ? '쇄골 골절' : 'Clavicle fracture', code: 'S42.0', riders: riders.INJURY },
                        { name: isKo ? '상완골 경부 골절' : 'Humerus neck fracture', code: 'S42.2', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '상완골 간부 골절' : 'Humerus shaft fracture', code: 'S42.3', riders: riders.INJURY },
                        { name: isKo ? '요골 하단 골절 (손목)' : 'Distal radius fracture', code: 'S52.5', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '척골 하단 골절' : 'Distal ulna fracture', code: 'S52.6', riders: riders.INJURY },
                        { name: isKo ? '손목 주상골 골절' : 'Scaphoid fracture', code: 'S62.0', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '손목 반월상 골절' : 'Lunate fracture', code: 'S62.1', riders: riders.INJURY },
                        { name: isKo ? '손가락 골절' : 'Finger fracture', code: 'S62.6', riders: riders.INJURY }
                    ]
                },
                {
                    name: isKo ? '하지(고관절/다리/발) 골절 (S72-S92)' : 'Lower Limb Fractures',
                    items: [
                        { name: isKo ? '대퇴골 경부 골절' : 'Femur neck fracture', code: 'S72.0', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '대퇴골 전자간 골절' : 'Intertrochanteric fracture', code: 'S72.1', riders: riders.INJURY },
                        { name: isKo ? '대퇴골 간부 골절' : 'Femur shaft fracture', code: 'S72.3', riders: riders.INJURY },
                        { name: isKo ? '슬개골(무릎) 골절' : 'Patella fracture', code: 'S82.0', riders: riders.INJURY },
                        { name: isKo ? '경골(정강이) 상단 골절' : 'Proximal tibia fracture', code: 'S82.1', riders: riders.INJURY },
                        { name: isKo ? '비골(종아리) 골절' : 'Fibula fracture', code: 'S82.4', riders: riders.INJURY },
                        { name: isKo ? '발목(복사뼈) 골절' : 'Ankle fracture', code: 'S82.8', riders: riders.INJURY, isImportant: true },
                        { name: isKo ? '발뒤꿈치(종골) 골절' : 'Calcaneus fracture', code: 'S92.0', riders: riders.INJURY },
                        { name: isKo ? '발가락 골절' : 'Toe fracture', code: 'S92.4', riders: riders.INJURY }
                    ]
                },
                {
                    name: isKo ? '관절 탈구 및 인대 파열 (S-Code)' : 'Dislocation & Ligament (S-Code)',
                    items: [
                        { name: isKo ? '어깨 관절 탈구' : 'Dislocation of shoulder', code: 'S43.0', riders: ['상해수술비'] },
                        { name: isKo ? '무릎 전방십자인대 파열' : 'ACL tear', code: 'S83.5', riders: ['상해후유장해'], isImportant: true },
                        { name: isKo ? '무릎 후방십자인대 파열' : 'PCL tear', code: 'S83.5', riders: ['상해후유장해'], isImportant: true },
                        { name: isKo ? '내측 부인대 파열' : 'MCL tear', code: 'S83.4', riders: ['상해수술비'] },
                        { name: isKo ? '발목 인대 파열 (염좌)' : 'Ankle ligament tear', code: 'S93.4', riders: ['상해수술비'] },
                        { name: isKo ? '아킬레스건 파열' : 'Achilles tendon rupture', code: 'S86.0', riders: ['상해수술비'] }
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
                        { name: isKo ? '알츠하이머 치매' : 'Alzheimer\'s', code: 'G30', riders: ['치매진단비'], isImportant: true },
                        { name: isKo ? '파킨슨병' : 'Parkinson\'s', code: 'G20', riders: ['파킨슨진단비'] },
                        { name: isKo ? '뇌전증 (간질)' : 'Epilepsy', code: 'G40', riders: ['질병후유장해'] },
                        { name: isKo ? '수면 무호흡증' : 'Sleep apnea', code: 'G47.3', riders: ['실손의료비'] },
                        { name: isKo ? '우울증' : 'Depression', code: 'F32', riders: ['정신질환치료비'] },
                        { name: isKo ? '공황장애' : 'Panic disorder', code: 'F41.0', riders: ['실손의료비'] },
                        { name: isKo ? 'ADHD' : 'ADHD', code: 'F90', riders: ['실손의료비'] }
                    ]
                },
                {
                    name: isKo ? '선천기형 및 산과 (Q/O)' : 'Congenital & OB',
                    items: [
                        { name: isKo ? '심실 중격 결손' : 'VSD', code: 'Q21.0', riders: ['선천이상수술비'], isImportant: true },
                        { name: isKo ? '심방 중격 결손' : 'ASD', code: 'Q21.1', riders: ['선천이상수술비'] },
                        { name: isKo ? '임신 중독증' : 'Pre-eclampsia', code: 'O14', riders: ['임신중독증진단비'] },
                        { name: isKo ? '임신성 당뇨' : 'Gestational diabetes', code: 'O24.4', riders: ['실손의료비'] }
                    ]
                },
                {
                    name: isKo ? '감각기(눈/귀) (H)' : 'Sense Organs (H)',
                    items: [
                        { name: isKo ? '노년 백내장' : 'Senile cataract', code: 'H25.9', riders: ['질병수술비'], isImportant: true },
                        { name: isKo ? '녹내장' : 'Glaucoma', code: 'H40', riders: ['질병후유장해'] },
                        { name: isKo ? '황반변성' : 'Macular degeneration', code: 'H35.3', riders: ['실손의료비'] },
                        { name: isKo ? '감각신경성 난청' : 'Hearing loss', code: 'H90', riders: ['질병후유장해'] }
                    ]
                },
                {
                    name: isKo ? '비뇨생식기 및 피부 (N/L)' : 'Uro & Skin (N/L)',
                    items: [
                        { name: isKo ? '만성 신부전' : 'CKD', code: 'N18.5', riders: ['질병후유장해'], isImportant: true },
                        { name: isKo ? '전립선 비대증' : 'BPH', code: 'N40', riders: ['질병수술비'] },
                        { name: isKo ? '요로결석' : 'Urinary stone', code: 'N20', riders: ['질병수술비'] },
                        { name: isKo ? '방광염' : 'Cystitis', code: 'N30', riders: ['실손의료비'] },
                        { name: isKo ? '아토피 피부염' : 'Atopic dermatitis', code: 'L20', riders: ['실손의료비'] },
                        { name: isKo ? '건선' : 'Psoriasis', code: 'L40', riders: ['실손의료비'] }
                    ]
                },
                {
                    name: isKo ? '소화기 및 호흡기 (K/J)' : 'Digestive & Resp (K/J)',
                    items: [
                        { name: isKo ? '역류성 식도염' : 'GERD', code: 'K21.0', riders: ['실손의료비'] },
                        { name: isKo ? '위궤양/십이지장궤양' : 'Gastric ulcer', code: 'K25-K26', riders: ['실손의료비'] },
                        { name: isKo ? '간의 경변증(간경화)' : 'Liver cirrhosis', code: 'K74.6', riders: ['질병후유장해'], isImportant: true },
                        { name: isKo ? '급성 충수염' : 'Appendicitis', code: 'K35', riders: ['질병수술비'] },
                        { name: isKo ? '천식' : 'Asthma', code: 'J45', riders: ['실손의료비'] },
                        { name: isKo ? 'COPD (만성폐쇄성폐질환)' : 'COPD', code: 'J44', riders: ['질병후유장해'] },
                        { name: isKo ? '알레르기성 비염' : 'Rhinitis', code: 'J30', riders: ['실손의료비'] }
                    ]
                }
            ]
        }
    ]
}
