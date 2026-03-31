
export type DiseaseItem = {
    name: string
    code: string
    desc?: string
    isImportant?: boolean
    riders?: string[]
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
        CANCER: [t('cancerDiag'), t('cancerSurgery'), t('chemo')],
        BRAIN: [t('brainDiag'), t('brainSurgery')],
        HEART: [t('heartDiag'), t('heartSurgery')],
        INJURY: [t('injurySurgery'), t('fractureDiag'), t('injuryAftermath')],
        DISEASE: [t('diseaseSurgery'), t('nDiseaseSurgery')]
    }
}

export const getGroupedDiseaseData = (t: any, locale: string): TopCategory[] => {
    const riders = getLocalizedRiders(t)
    
    // Helper to get translated string for disease-specific content if needed
    // In a real app we might have separate large JSON files for each language.
    // For now, we'll provide translations for the current data.

    return [
        {
            id: 'C',
            title: locale === 'ko' ? '[C코드] 암 (악성신생물)' : (locale === 'en' ? '[C-Code] Cancer (Malignant)' : '[C代码] 癌症 (恶性肿瘤)'),
            shortTitle: locale === 'ko' ? 'C코드 (암)' : (locale === 'en' ? 'C-Code (Cancer)' : 'C代码 (癌症)'),
            desc: locale === 'ko' ? '악성 종양(일반암) 분류 코드입니다.' : (locale === 'en' ? 'Classification codes for malignant tumors.' : '恶性肿瘤(一般癌症)分类代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '소화기계 암' : (locale === 'en' ? 'Digestive System Cancer' : '消化系统癌症'),
                    items: [
                        { name: locale === 'ko' ? '입술암' : (locale === 'en' ? 'Lip Cancer' : '唇癌'), code: 'C00', riders: riders.CANCER },
                        { name: locale === 'ko' ? '구강암' : (locale === 'en' ? 'Oral Cancer' : '口腔癌'), code: 'C02–C06', riders: riders.CANCER },
                        { name: locale === 'ko' ? '식도암' : (locale === 'en' ? 'Esophageal Cancer' : '食道癌'), code: 'C15', riders: riders.CANCER },
                        { name: locale === 'ko' ? '위암' : (locale === 'en' ? 'Stomach Cancer' : '胃癌'), code: 'C16', riders: riders.CANCER },
                        { name: locale === 'ko' ? '소장암' : (locale === 'en' ? 'Small Intestine Cancer' : '小肠癌'), code: 'C17', riders: riders.CANCER },
                        { name: locale === 'ko' ? '대장암' : (locale === 'en' ? 'Colon Cancer' : '结肠癌'), code: 'C18', riders: riders.CANCER },
                        { name: locale === 'ko' ? '직장암' : (locale === 'en' ? 'Rectal Cancer' : '直肠癌'), code: 'C19–C20', riders: riders.CANCER },
                        { name: locale === 'ko' ? '간암' : (locale === 'en' ? 'Liver Cancer' : '肝癌'), code: 'C22', riders: riders.CANCER },
                        { name: locale === 'ko' ? '담낭·담도암' : (locale === 'en' ? 'Gallbladder/Bile Duct Cancer' : '胆囊·胆道癌'), code: 'C23–C24', riders: riders.CANCER },
                        { name: locale === 'ko' ? '췌장암' : (locale === 'en' ? 'Pancreatic Cancer' : '胰腺癌'), code: 'C25', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '호흡기계 암' : (locale === 'en' ? 'Respiratory System Cancer' : '呼吸系统癌症'),
                    items: [
                        { name: locale === 'ko' ? '비강·부비동암' : (locale === 'en' ? 'Nasal/Paranasal Sinus Cancer' : '鼻腔·副鼻窦癌'), code: 'C30–C31', riders: riders.CANCER },
                        { name: locale === 'ko' ? '후두암' : (locale === 'en' ? 'Laryngeal Cancer' : '喉癌'), code: 'C32', riders: riders.CANCER },
                        { name: locale === 'ko' ? '기관·기관지·폐암' : (locale === 'en' ? 'Trachea/Bronchus/Lung Cancer' : '气管·支气管·肺癌'), code: 'C33–C34', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '여성 생식기 암' : (locale === 'en' ? 'Female Genital Cancer' : '女性生殖器癌症'),
                    items: [
                        { name: locale === 'ko' ? '자궁경부암' : (locale === 'en' ? 'Cervical Cancer' : '子宫颈癌'), code: 'C53', riders: riders.CANCER },
                        { name: locale === 'ko' ? '자궁체부암' : (locale === 'en' ? 'Endometrial Cancer' : '子宫体癌'), code: 'C54', riders: riders.CANCER },
                        { name: locale === 'ko' ? '난소암' : (locale === 'en' ? 'Ovarian Cancer' : '卵巢癌'), code: 'C56', riders: riders.CANCER },
                        { name: locale === 'ko' ? '기타 여성 생식기암' : (locale === 'en' ? 'Other Female Genital Cancer' : '其他女性生殖器癌'), code: 'C51–C57', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '남성 생식기 암' : (locale === 'en' ? 'Male Genital Cancer' : '男性生殖器癌症'),
                    items: [
                        { name: locale === 'ko' ? '전립선암' : (locale === 'en' ? 'Prostate Cancer' : '前列腺癌'), code: 'C61', riders: riders.CANCER },
                        { name: locale === 'ko' ? '고환암' : (locale === 'en' ? 'Testicular Cancer' : '睾丸癌'), code: 'C62', riders: riders.CANCER },
                        { name: locale === 'ko' ? '음경암' : (locale === 'en' ? 'Penile Cancer' : '阴茎癌'), code: 'C60', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '비뇨기계 암' : (locale === 'en' ? 'Urinary System Cancer' : '泌尿系统癌症'),
                    items: [
                        { name: locale === 'ko' ? '신장암' : (locale === 'en' ? 'Kidney Cancer' : '肾癌'), code: 'C64', riders: riders.CANCER },
                        { name: locale === 'ko' ? '신우암' : (locale === 'en' ? 'Renal Pelvis Cancer' : '肾盂癌'), code: 'C65', riders: riders.CANCER },
                        { name: locale === 'ko' ? '요관암' : (locale === 'en' ? 'Ureter Cancer' : '输尿管癌'), code: 'C66', riders: riders.CANCER },
                        { name: locale === 'ko' ? '방광암' : (locale === 'en' ? 'Bladder Cancer' : '膀胱癌'), code: 'C67', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '기타 주요 암' : (locale === 'en' ? 'Other Major Cancers' : '其他主要癌症'),
                    items: [
                        { name: locale === 'ko' ? '갑상선암' : (locale === 'en' ? 'Thyroid Cancer' : '甲状腺癌'), code: 'C73', riders: [t('pseudoCancerDiag'), t('cancerSurgery')] },
                        { name: locale === 'ko' ? '뇌암' : (locale === 'en' ? 'Brain Cancer' : '脑癌'), code: 'C71', riders: riders.CANCER },
                        { name: locale === 'ko' ? '림프종' : (locale === 'en' ? 'Lymphoma' : '淋巴瘤'), code: 'C81–C85', riders: riders.CANCER },
                        { name: locale === 'ko' ? '다발성 골수종' : (locale === 'en' ? 'Multiple Myeloma' : '多发性骨髓瘤'), code: 'C90', riders: riders.CANCER },
                        { name: locale === 'ko' ? '백혈병' : (locale === 'en' ? 'Leukemia' : '白血病'), code: 'C91–C95', riders: riders.CANCER },
                        { name: locale === 'ko' ? '피부암' : (locale === 'en' ? 'Skin Cancer' : '皮肤癌'), code: 'C43–C44', riders: [t('otherSkinCancerDiag'), t('cancerSurgery')] },
                        { name: locale === 'ko' ? '유방암' : (locale === 'en' ? 'Breast Cancer' : '乳腺癌'), code: 'C50', riders: riders.CANCER },
                    ]
                },
                {
                    name: locale === 'ko' ? '전이암 및 기타 악성신생물 (ICD-10)' : (locale === 'en' ? 'Metastatic & Other Cancers' : '转移癌及其他恶性肿瘤'),
                    items: [
                        { name: locale === 'ko' ? '림프절 전이' : (locale === 'en' ? 'Lymph Node Metastasis' : '淋巴结转移'), code: 'C77', desc: locale === 'ko' ? '림프절의 이차성 악성신생물' : (locale === 'en' ? 'Secondary malignant neoplasm of lymph nodes' : '淋巴结的继发性恶性肿瘤'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '폐 전이' : (locale === 'en' ? 'Lung Metastasis' : '肺转移'), code: 'C78.0', desc: locale === 'ko' ? '폐의 이차성 악성신생물' : (locale === 'en' ? 'Secondary malignant neoplasm of lung' : '肺的继发性恶性肿瘤'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '흉막 전이' : (locale === 'en' ? 'Pleural Metastasis' : '胸膜转移'), code: 'C78.2', desc: locale === 'ko' ? '흉막 전이' : (locale === 'en' ? 'Pleural metastasis' : '胸膜转移'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '기타 호흡기·소화기관 전이' : (locale === 'en' ? 'Other Respiratory/Digestive Metastasis' : '其他呼吸·消化器官转移'), code: 'C78', desc: locale === 'ko' ? '폐·흉막 등 포함' : (locale === 'en' ? 'Includes lung, pleura, etc.' : '包括肺、胸膜等'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '뼈 전이' : (locale === 'en' ? 'Bone Metastasis' : '骨转移'), code: 'C79.5', desc: locale === 'ko' ? '뼈 및 골수 전이' : (locale === 'en' ? 'Secondary malignant neoplasm of bone' : '骨及骨髓转移'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '뇌 전이' : (locale === 'en' ? 'Brain Metastasis' : '脑转移'), code: 'C79.3', desc: locale === 'ko' ? '뇌 전이' : (locale === 'en' ? 'Brain metastasis' : '脑转移'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '간 전이' : (locale === 'en' ? 'Liver Metastasis' : '肝转移'), code: 'C78.7', desc: locale === 'ko' ? '간 전이' : (locale === 'en' ? 'Liver metastasis' : '肝转移'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '부신 전이' : (locale === 'en' ? 'Adrenal Gland Metastasis' : '肾上腺转移'), code: 'C79.7', desc: locale === 'ko' ? '부신 전이' : (locale === 'en' ? 'Adrenal gland metastasis' : '肾上腺转移'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '기타 부위 전이' : (locale === 'en' ? 'Other Site Metastasis' : '其他部位转移'), code: 'C79', desc: locale === 'ko' ? '기타 이차성 악성신생물' : (locale === 'en' ? 'Other secondary malignant neoplasms' : '其他继发性恶性肿瘤'), riders: riders.CANCER },
                        { name: locale === 'ko' ? '원발부위 불명의 악성신생물' : (locale === 'en' ? 'Malignancy of Unknown Origin' : '原发部位不明的恶性肿瘤'), code: 'C80', desc: locale === 'ko' ? '암이 존재하지만 최초 발생 부위를 확인할 수 없는 경우' : (locale === 'en' ? 'Cancer present but primary site unknown' : '存在癌症但无法确认最初发生部位的情况'), riders: riders.CANCER },
                    ]
                }
            ]
        },
        {
            id: 'D',
            title: locale === 'ko' ? '[D코드] 양성종양 및 제자리암' : (locale === 'en' ? '[D-Code] Benign Tumor & CIS' : '[D代码] 良性肿瘤及原位癌'),
            shortTitle: locale === 'ko' ? 'D코드 (용종/제자리암)' : (locale === 'en' ? 'D-Code (Polyp/CIS)' : 'D代码 (息肉/原位癌)'),
            desc: locale === 'ko' ? '수술비 청구가 가장 빈번한 용종, 근종 및 초기암(유사암) 코드입니다.' : (locale === 'en' ? 'Frequent codes for polyps, fibroids, and early cancers.' : '理赔最频繁的息肉、肌瘤及早期癌(类似癌)代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '제자리암 및 흔한 양성종양' : (locale === 'en' ? 'CIS & Common Benign Tumors' : '原位癌及常见良性肿瘤'),
                    items: [
                        { name: locale === 'ko' ? '위의 제자리암' : (locale === 'en' ? 'CIS of Stomach' : '胃原位癌'), code: 'D00.2', desc: locale === 'ko' ? '위 점막에 국한된 초기암' : (locale === 'en' ? 'Early cancer limited to stomach mucosa' : '局限于胃粘膜的早期癌'), riders: [t('pseudoCancerDiag'), ...riders.DISEASE], isImportant: true },
                        { name: locale === 'ko' ? '대장의 제자리암' : (locale === 'en' ? 'CIS of Colon' : '大肠原位癌'), code: 'D01.0', desc: locale === 'ko' ? '대장 제자리암' : (locale === 'en' ? 'Carcinoma in situ of colon' : '大肠原位癌'), riders: [t('pseudoCancerDiag'), ...riders.DISEASE], isImportant: true },
                        { name: locale === 'ko' ? '피부의 제자리암' : (locale === 'en' ? 'CIS of Skin' : '皮肤原位癌'), code: 'D04', riders: [t('pseudoCancerDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '유방의 제자리암' : (locale === 'en' ? 'CIS of Breast' : '乳腺原位癌'), code: 'D05', riders: [t('pseudoCancerDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '자궁경부의 제자리암' : (locale === 'en' ? 'CIS of Cervix' : '子宫颈原位癌'), code: 'D06', riders: [t('pseudoCancerDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '위의 양성신생물' : (locale === 'en' ? 'Benign Neoplasm of Stomach' : '胃良性肿瘤'), code: 'D13.1', desc: locale === 'ko' ? '위 용종(폴립) 등' : (locale === 'en' ? 'Stomach polyps, etc.' : '胃息肉等'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '결장, 직장, 항문의 양성신생물' : (locale === 'en' ? 'Benign Neoplasm of Colon/Rectum/Anus' : '结肠、直肠、肛门良性肿瘤'), code: 'D12', desc: locale === 'ko' ? '대장 용종(폴립). 수술비 보상 빈도 1위' : (locale === 'en' ? 'Colon polyps. #1 in surgery claims' : '大肠息肉。手术费赔付频率第1位'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '자궁의 평활근종' : (locale === 'en' ? 'Leiomyoma of Uterus' : '子宫平滑肌瘤'), code: 'D25', desc: locale === 'ko' ? '자궁근종. 여성 다빈도 수술' : (locale === 'en' ? 'Uterine fibroids. Frequent female surgery' : '子宫肌瘤。女性高频手术'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '난소의 양성신생물' : (locale === 'en' ? 'Benign Neoplasm of Ovary' : '卵巢良性肿瘤'), code: 'D27', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '갑상선의 양성신생물' : (locale === 'en' ? 'Benign Neoplasm of Thyroid' : '甲状腺良性肿瘤'), code: 'D34', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '방광의 양성신생물' : (locale === 'en' ? 'Benign Neoplasm of Bladder' : '膀胱良性肿瘤'), code: 'D30.3', riders: riders.DISEASE },
                    ]
                }
            ]
        },
        {
            id: 'I',
            title: locale === 'ko' ? '[I코드] 뇌·심혈관 질환' : (locale === 'en' ? '[I-Code] Cerebrovascular & Cardiovascular' : '[I代码] 脑·心血管疾病'),
            shortTitle: locale === 'ko' ? 'I코드 (뇌·심장)' : (locale === 'en' ? 'I-Code (Brain/Heart)' : 'I代码 (脑·心脏)'),
            desc: locale === 'ko' ? '3대 주요 질환인 뇌혈관 질환 및 허혈성 심장 질환 코드입니다.' : (locale === 'en' ? 'Major codes for brain and heart diseases.' : '三大主要疾病：脑血管疾病及缺血性心脏病代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '허혈성 및 급성 심장 질환' : (locale === 'en' ? 'Ischemic & Acute Heart Disease' : '缺血性及急性心脏病'),
                    items: [
                        { name: locale === 'ko' ? '협심증' : (locale === 'en' ? 'Angina Pectoris' : '心绞痛'), code: 'I20', isImportant: true, riders: riders.HEART },
                        { name: locale === 'ko' ? '급성 심근경색' : (locale === 'en' ? 'Acute Myocardial Infarction' : '急性心肌梗死'), code: 'I21', isImportant: true, riders: riders.HEART },
                        { name: locale === 'ko' ? '재발된 심근경색' : (locale === 'en' ? 'Subsequent Myocardial Infarction' : '复发性心肌梗死'), code: 'I22', riders: riders.HEART },
                        { name: locale === 'ko' ? '심근경색 후 합병증' : (locale === 'en' ? 'Complications following Myocardial Infarction' : '心肌梗死后并发症'), code: 'I23', riders: riders.HEART },
                        { name: locale === 'ko' ? '기타 급성 허혈성 심장질환 (협심증 등)' : (locale === 'en' ? 'Other Acute Ischemic Heart Disease' : '其他急性缺血性心脏病'), code: 'I24', riders: riders.HEART },
                        { name: locale === 'ko' ? '만성 허혈성 심질환' : (locale === 'en' ? 'Chronic Ischemic Heart Disease' : '慢性缺血性心脏病'), code: 'I25', isImportant: true, riders: riders.HEART },
                        { name: locale === 'ko' ? '폐색전증' : (locale === 'en' ? 'Pulmonary Embolism' : '肺栓塞'), code: 'I26', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '급성 심낭염' : (locale === 'en' ? 'Acute Pericarditis' : '急性心包炎'), code: 'I30', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '비류마티스 승모판 질환' : (locale === 'en' ? 'Non-rheumatic Mitral Valve Disease' : '非风湿性二尖瓣疾病'), code: 'I34', riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '심근 및 부정맥, 심부전' : (locale === 'en' ? 'Myocardium, Arrhythmia, Heart Failure' : '心肌及心律失常、心力衰竭'),
                    items: [
                        { name: locale === 'ko' ? '방실 및 좌각 차단' : (locale === 'en' ? 'AV & Left Bundle Branch Block' : '房室及左束支传导阻滞'), code: 'I44', riders: [t('specificHeartDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '심정지' : (locale === 'en' ? 'Cardiac Arrest' : '心脏骤停'), code: 'I46' },
                        { name: locale === 'ko' ? '발작성 빈맥' : (locale === 'en' ? 'Paroxysmal Tachycardia' : '阵发性心动过速'), code: 'I47', riders: [t('specificHeartDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '심방세동' : (locale === 'en' ? 'Atrial Fibrillation' : '心房颤动'), code: 'I48', riders: [t('specificHeartDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '기타 부정맥' : (locale === 'en' ? 'Other Arrhythmias' : '其他心律失常'), code: 'I49', riders: [t('arrhythmiaDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '심부전' : (locale === 'en' ? 'Heart Failure' : '心力衰竭'), code: 'I50', isImportant: true, riders: [t('heartFailureDiag'), ...riders.DISEASE] },
                    ]
                },
                {
                    name: locale === 'ko' ? '뇌혈관 질환' : (locale === 'en' ? 'Cerebrovascular Disease' : '脑血管疾病'),
                    items: [
                        { name: locale === 'ko' ? '지주막하출혈' : (locale === 'en' ? 'Subarachnoid Hemorrhage' : '蛛网膜下腔出血'), code: 'I60', isImportant: true, riders: riders.BRAIN },
                        { name: locale === 'ko' ? '뇌내출혈' : (locale === 'en' ? 'Intracerebral Hemorrhage' : '脑内出血'), code: 'I61', isImportant: true, riders: riders.BRAIN },
                        { name: locale === 'ko' ? '기타 두개내출혈' : (locale === 'en' ? 'Other Intracranial Hemorrhage' : '其他颅内出血'), code: 'I62', riders: riders.BRAIN },
                        { name: locale === 'ko' ? '뇌경색' : (locale === 'en' ? 'Cerebral Infarction' : '脑梗死'), code: 'I63', isImportant: true, riders: riders.BRAIN },
                        { name: locale === 'ko' ? '상세불명 뇌졸중' : (locale === 'en' ? 'Stroke, Not Specified' : '未详述的中风'), code: 'I64', riders: [t('strokeDiag'), t('brainDiag')] },
                        { name: locale === 'ko' ? '뇌혈관 협착' : (locale === 'en' ? 'Cerebrovascular Stenosis' : '脑血管狭窄'), code: 'I65', riders: riders.BRAIN },
                        { name: locale === 'ko' ? '뇌동맥 폐색' : (locale === 'en' ? 'Cerebral Artery Occlusion' : '脑动脉闭塞'), code: 'I66', riders: riders.BRAIN },
                        { name: locale === 'ko' ? '기타 뇌혈관 질환' : (locale === 'en' ? 'Other Cerebrovascular Diseases' : '其他脑血管疾病'), code: 'I67', riders: riders.BRAIN },
                        { name: locale === 'ko' ? '기타 질환에서의 뇌혈관 장애' : (locale === 'en' ? 'Cerebrovascular Disorders in Other Diseases' : '其他疾病引起的脑血管障碍'), code: 'I68', riders: riders.BRAIN },
                        { name: locale === 'ko' ? '뇌혈관질환 후유증' : (locale === 'en' ? 'Sequelae of Cerebrovascular Disease' : '脑血管疾病后遗症'), code: 'I69', riders: riders.BRAIN },
                    ]
                },
                {
                    name: locale === 'ko' ? '동맥, 정맥 및 기타 순환계' : (locale === 'en' ? 'Arteries, Veins & Other Circulation' : '动脉、静脉及其他循环系统'),
                    items: [
                        { name: locale === 'ko' ? '고혈압성 심질환' : (locale === 'en' ? 'Hypertensive Heart Disease' : '高血压性心脏病'), code: 'I11', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '고혈압성 신질환' : (locale === 'en' ? 'Hypertensive Renal Disease' : '高血压性肾病'), code: 'I12', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '동맥경화증' : (locale === 'en' ? 'Atherosclerosis' : '动脉硬化'), code: 'I70', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '대동맥류' : (locale === 'en' ? 'Aortic Aneurysm' : '大动脉瘤'), code: 'I71', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '하지 정맥류' : (locale === 'en' ? 'Varicose Veins' : '下肢静脉曲张'), code: 'I83', riders: [t('varicoseSurgery'), t('diseaseSurgery')] },
                        { name: locale === 'ko' ? '치핵' : (locale === 'en' ? 'Hemorrhoids' : '痔疮'), code: 'I84', riders: [t('hemorrhoidSurgery'), t('nDiseaseSurgery')] },
                        { name: locale === 'ko' ? '저혈압' : (locale === 'en' ? 'Hypotension' : '低血压'), code: 'I95' },
                    ]
                }
            ]
        },
        {
            id: 'M',
            title: locale === 'ko' ? '[M코드] 뼈·관절·근골격계 질환' : (locale === 'en' ? '[M-Code] Bone, Joint & Musculoskeletal' : '[M代码] 骨·关节·肌肉骨骼系统疾病'),
            shortTitle: locale === 'ko' ? 'M코드 (근골격계)' : (locale === 'en' ? 'M-Code (Musculoskeletal)' : 'M代码 (肌肉骨骼)'),
            desc: locale === 'ko' ? '디스크, 관절염, 인대 파열, 회전근개 등 근골격계 질환 코드입니다.' : (locale === 'en' ? 'Musculoskeletal codes for discs, arthritis, rotator cuff, etc.' : '椎间盘、关节炎、韧带撕裂、旋转肌腱等肌肉骨骼系统疾病代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '관절염 및 류마티스 질환' : (locale === 'en' ? 'Arthritis & Rheumatic Diseases' : '关节炎及风湿性疾病'),
                    items: [
                        { name: locale === 'ko' ? '화농성 관절염' : (locale === 'en' ? 'Pyogenic Arthritis' : '化脓性关节炎'), code: 'M00', desc: locale === 'ko' ? '세균성 감염으로 인한 관절염' : (locale === 'en' ? 'Bacterial joint infection' : '细菌性感染引起的关节炎'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '반응성 관절염' : (locale === 'en' ? 'Reactive Arthritis' : '反应性关节炎'), code: 'M02', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '류마티스 관절염(혈청양성)' : (locale === 'en' ? 'Seropositive Rheumatoid Arthritis' : '血清阳性类风湿性关节炎'), code: 'M05', desc: locale === 'ko' ? '자가면역 관절 질환. 희귀난치성질환 적용 가능' : (locale === 'en' ? 'Autoimmune joint disease. May qualify for rare disease coverage' : '自身免疫性关节疾病。可能适用罕见疾病覆盖'), riders: [t('rareDiseaseDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '기타 류마티스 관절염' : (locale === 'en' ? 'Other Rheumatoid Arthritis' : '其他类风湿性关节炎'), code: 'M06', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '통풍' : (locale === 'en' ? 'Gout' : '痛风'), code: 'M10', desc: locale === 'ko' ? '요산 축적으로 인한 관절 통증. 엄지발가락 발작 빈번' : (locale === 'en' ? 'Uric acid accumulation causing joint pain. Big toe attacks common' : '尿酸积累引起的关节疼痛。大脚趾发作频繁'), isImportant: true },
                        { name: locale === 'ko' ? '건선성 관절병증' : (locale === 'en' ? 'Psoriatic Arthropathy' : '银屑病性关节病'), code: 'M07', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '전신성 결합조직 장애(루푸스 등)' : (locale === 'en' ? 'Systemic Connective Tissue Disorders (Lupus, etc.)' : '全身性结缔组织障碍（红斑狼疮等）'), code: 'M32', desc: locale === 'ko' ? '루푸스(전신홍반루푸스) 포함. 희귀난치성질환 해당' : (locale === 'en' ? 'Includes SLE (Lupus). Qualifies as rare disease' : '包括系统性红斑狼疮。属于罕见疾病'), riders: [t('rareDiseaseDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '섬유근통' : (locale === 'en' ? 'Fibromyalgia' : '纤维肌痛'), code: 'M79.1', desc: locale === 'ko' ? '전신 근육통 및 만성 피로' : (locale === 'en' ? 'Widespread muscle pain and chronic fatigue' : '全身肌肉疼痛及慢性疲劳') },
                    ]
                },
                {
                    name: locale === 'ko' ? '관절 내부 장애 (무릎·고관절)' : (locale === 'en' ? 'Internal Joint Derangement (Knee/Hip)' : '关节内部障碍（膝·髋关节）'),
                    items: [
                        { name: locale === 'ko' ? '무릎 반월상연골 파열' : (locale === 'en' ? 'Meniscus Tear of Knee' : '膝关节半月板损伤'), code: 'M23.2', desc: locale === 'ko' ? '반월상연골 손상. 관절경 수술 빈도 높음' : (locale === 'en' ? 'Meniscal damage. High frequency arthroscopic surgery' : '半月板损伤。关节镜手术频率高'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '무릎 내부 장애(기타)' : (locale === 'en' ? 'Internal Derangement of Knee (Other)' : '膝内部障碍（其他）'), code: 'M23', desc: locale === 'ko' ? '십자인대파열, 연골연화증 등 무릎 내부 문제 전반' : (locale === 'en' ? 'ACL tear, chondromalacia, and other knee internal issues' : '前交叉韧带撕裂、软骨软化症等膝内部问题'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '무릎 관절증(퇴행성)' : (locale === 'en' ? 'Gonarthrosis (Degenerative Knee)' : '膝关节病（退行性）'), code: 'M17', desc: locale === 'ko' ? '퇴행성 관절염. 인공관절 수술 다빈도' : (locale === 'en' ? 'Degenerative arthritis. Frequent total knee replacement' : '退行性关节炎。人工关节手术高频'), riders: [t('jointReplacementSurgery'), ...riders.DISEASE], isImportant: true },
                        { name: locale === 'ko' ? '고관절 관절증' : (locale === 'en' ? 'Coxarthrosis (Hip)' : '髋关节病'), code: 'M16', desc: locale === 'ko' ? '고관절 퇴행성 관절염. 인공관절치환술 적용' : (locale === 'en' ? 'Hip joint degeneration. Total hip replacement applicable' : '髋关节退行性变。适用髋关节置换术'), riders: [t('jointReplacementSurgery'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '기타 관절증' : (locale === 'en' ? 'Other Arthrosis' : '其他关节病'), code: 'M19', desc: locale === 'ko' ? '손가락·발가락 등 기타 관절 퇴행성 변화' : (locale === 'en' ? 'Degenerative changes in finger, toe joints, etc.' : '手指、脚趾等其他关节退行性变化'), riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '척추 추간판·협착증·측만증' : (locale === 'en' ? 'Disc, Stenosis & Scoliosis' : '椎间盘·狭窄症·侧弯症'),
                    items: [
                        { name: locale === 'ko' ? '경추 추간판 장애 (목디스크)' : (locale === 'en' ? 'Cervical Disc Disorder (Neck Disc)' : '颈椎间盘障碍（颈椎病）'), code: 'M50', desc: locale === 'ko' ? '목 디스크. 경추 신경 압박 증상. 수술비 청구 시 가입 시기 약관 확인 필요' : (locale === 'en' ? 'Cervical disc. Nerve compression. Check policy date for surgery coverage' : '颈椎间盘。颈椎神经压迫症状。手术费申请时需确认承保时期条款'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '흉추 추간판 장애' : (locale === 'en' ? 'Thoracic Disc Disorder' : '胸椎间盘障碍'), code: 'M51.0', desc: locale === 'ko' ? '등 디스크. 비교적 드물지만 증상 심할 수 있음' : (locale === 'en' ? 'Thoracic disc. Uncommon but can be severe' : '胸椎间盘。相对罕见但症状可能严重'), riders: [t('discSurgery'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '요추 추간판 탈출증 (허리디스크)' : (locale === 'en' ? 'Lumbar Disc Herniation (Lumbar Disc)' : '腰椎间盘突出症（腰椎病）'), code: 'M51.1', desc: locale === 'ko' ? '허리 디스크. 가장 흔한 수술 원인. 수술비 청구 다빈도' : (locale === 'en' ? 'Most common surgery cause. High frequency surgery claims' : '最常见手术原因。手术费申请高频'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '기타 추간판 장애' : (locale === 'en' ? 'Other Intervertebral Disc Disorders' : '其他椎间盘障碍'), code: 'M51', desc: locale === 'ko' ? '추간판 퇴행, 일반 디스크 질환' : (locale === 'en' ? 'Disc degeneration and general disc disorders' : '椎间盘退变及一般性椎间盘疾病'), riders: [t('discSurgery'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '척추관 협착증' : (locale === 'en' ? 'Spinal Stenosis' : '脊柱管狭窄症'), code: 'M48.0', desc: locale === 'ko' ? '척추관이 좁아져 신경 압박. 수술 시 수술비 청구 가능' : (locale === 'en' ? 'Narrowing of spinal canal compresses nerves. Surgery claim applicable' : '脊柱管变窄压迫神经。手术时可申请手术费'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '척추병증(기타)' : (locale === 'en' ? 'Other Spondylopathies' : '其他脊柱病变'), code: 'M48', desc: locale === 'ko' ? '척추관 협착증 포함 기타 척추 구조 이상' : (locale === 'en' ? 'Spinal stenosis and other structural spinal abnormalities' : '脊柱管狭窄症及其他脊柱结构异常'), riders: [t('discSurgery'), t('nDiseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '척추전방전위증' : (locale === 'en' ? 'Spondylolisthesis' : '脊柱滑脱症'), code: 'M43.1', desc: locale === 'ko' ? '척추뼈가 앞으로 밀려남. 수술 고려 시 다빈도' : (locale === 'en' ? 'Vertebra slips forward. Frequently requires surgery' : '椎骨向前滑脱。手术频率高'), riders: [t('discSurgery'), t('nDiseaseSurgery')] },
                        { name: locale === 'ko' ? '척추측만증' : (locale === 'en' ? 'Scoliosis' : '脊柱侧弯'), code: 'M41', desc: locale === 'ko' ? '척추의 측방 만곡. 심한 경우 수술 시행' : (locale === 'en' ? 'Lateral spinal curvature. Surgery for severe cases' : '脊柱侧向弯曲。严重时进行手术'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '강직성 척추염' : (locale === 'en' ? 'Ankylosing Spondylitis' : '强直性脊柱炎'), code: 'M45', desc: locale === 'ko' ? '척추 자가면역 염증. 희귀난치성질환 해당' : (locale === 'en' ? 'Autoimmune spinal inflammation. Qualifies as rare disease' : '脊柱自身免疫性炎症。属于罕见疾病'), riders: [t('rareDiseaseDiag'), ...riders.DISEASE] },
                    ]
                },
                {
                    name: locale === 'ko' ? '어깨 질환 (회전근개·오십견)' : (locale === 'en' ? 'Shoulder Diseases (Rotator Cuff / Frozen Shoulder)' : '肩部疾病（旋转肌腱·五十肩）'),
                    items: [
                        { name: locale === 'ko' ? '어깨의 병변 (전체)' : (locale === 'en' ? 'Shoulder Lesions (General)' : '肩部病变（总体）'), code: 'M75', desc: locale === 'ko' ? '회전근개파열, 오십견 포함 어깨 관련 질환 전반' : (locale === 'en' ? 'All shoulder conditions including rotator cuff tear, frozen shoulder' : '包括旋转肌腱损伤、五十肩的肩部相关疾病全体'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '회전근개 증후군' : (locale === 'en' ? 'Rotator Cuff Syndrome' : '旋转肌腱综合征'), code: 'M75.1', desc: locale === 'ko' ? '어깨 회전근개파열. 수술 시 수술비·실비 청구 빈도 높음' : (locale === 'en' ? 'Rotator cuff tear. High frequency surgery and insurance claims' : '肩旋转肌腱损伤。手术费·医疗费申请频率高'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '오십견(동결견)' : (locale === 'en' ? 'Adhesive Capsulitis (Frozen Shoulder)' : '五十肩（冻结肩）'), code: 'M75.0', desc: locale === 'ko' ? '어깨 관절 굳음증. 물리치료·주사·수술 다양한 치료' : (locale === 'en' ? 'Shoulder joint stiffness. Various treatments including PT, injection, surgery' : '肩关节僵硬症。物理治疗·注射·手术多种治疗方法'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '상완이두근 건염' : (locale === 'en' ? 'Bicipital Tendinitis' : '肱二头肌腱炎'), code: 'M75.2', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '충돌 증후군' : (locale === 'en' ? 'Shoulder Impingement Syndrome' : '肩撞击综合征'), code: 'M75.5', desc: locale === 'ko' ? '어깨뼈 충돌로 인한 통증' : (locale === 'en' ? 'Pain from shoulder bone impingement' : '肩骨撞击引起的疼痛'), riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '힘줄·건·인대 질환' : (locale === 'en' ? 'Tendon & Ligament Diseases' : '肌腱·肌腱·韧带疾病'),
                    items: [
                        { name: locale === 'ko' ? '활막염 및 건초염' : (locale === 'en' ? 'Synovitis & Tenosynovitis' : '滑膜炎及腱鞘炎'), code: 'M65', desc: locale === 'ko' ? '방아쇠수지(M65.3), 손목 드퀘르벵 건초염 포함' : (locale === 'en' ? 'Trigger finger (M65.3), De Quervain wrist tenosynovitis included' : '弹响指（M65.3）、腕部де克维恩腱鞘炎等'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '방아쇠수지' : (locale === 'en' ? 'Trigger Finger' : '弹响指'), code: 'M65.3', desc: locale === 'ko' ? '손가락 건초염. 수술 가능 여부 약관 확인 필요' : (locale === 'en' ? 'Finger tendon sheath inflammation. Verify surgery coverage in policy' : '手指腱鞘炎。需确认手术承保条款'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '건염 및 건부착부염' : (locale === 'en' ? 'Tendinitis & Enthesopathy' : '腱炎及附着点病'), code: 'M77', desc: locale === 'ko' ? '테니스엘보(M77.1), 골프엘보(M77.0), 발꿈치 가시 등 포함' : (locale === 'en' ? 'Tennis elbow (M77.1), Golfers elbow (M77.0), Heel spur included' : '网球肘（M77.1）、高尔夫肘（M77.0）、跟骨刺等'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '외측 상과염 (테니스엘보)' : (locale === 'en' ? 'Lateral Epicondylitis (Tennis Elbow)' : '外侧上髁炎（网球肘）'), code: 'M77.1', desc: locale === 'ko' ? '팔꿈치 바깥쪽 통증. 체외충격파·주사 치료 다빈도' : (locale === 'en' ? 'Outer elbow pain. Shock wave and injection therapy common' : '肘部外侧疼痛。体外冲击波·注射治疗频率高'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '내측 상과염 (골프엘보)' : (locale === 'en' ? 'Medial Epicondylitis (Golfers Elbow)' : '内侧上髁炎（高尔夫肘）'), code: 'M77.0', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '족저근막염' : (locale === 'en' ? 'Plantar Fasciitis' : '跖筋膜炎'), code: 'M72.2', desc: locale === 'ko' ? '발바닥 통증. 체외충격파 등 비급여 치료 다빈도' : (locale === 'en' ? 'Heel/foot pain. Frequent non-covered shockwave therapy' : '足底疼痛。体外冲击波等非医保治疗频率高'), isImportant: true },
                        { name: locale === 'ko' ? '아킬레스건 파열(자발성)' : (locale === 'en' ? 'Spontaneous Rupture of Achilles Tendon' : '自发性跟腱断裂'), code: 'M66.3', desc: locale === 'ko' ? '아킬레스건 끊어짐. 수술비 청구 가능' : (locale === 'en' ? 'Achilles tendon rupture. Surgery claim applicable' : '跟腱断裂。可申请手术费'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '어깨 힘줄 파열(자발성)' : (locale === 'en' ? 'Spontaneous Rupture of Shoulder Tendon' : '自发性肩部肌腱断裂'), code: 'M66.2', riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '손목·수근관·기타 상지' : (locale === 'en' ? 'Wrist, Carpal Tunnel & Upper Limb' : '腕部·腕管·其他上肢'),
                    items: [
                        { name: locale === 'ko' ? '손목 수근관 증후군' : (locale === 'en' ? 'Carpal Tunnel Syndrome' : '腕管综合征'), code: 'G54.2', desc: locale === 'ko' ? '손 저림, 야간통. 수술 시 5종 수술비 청구 가능. (G코드로도 분류)' : (locale === 'en' ? 'Hand numbness, night pain. Type 5 surgery claim applicable. (Also G-code)' : '手麻、夜间痛。手术时可申请5种手术费。（也属G代码）'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '드퀘르벵 건초염' : (locale === 'en' ? 'De Quervain Tenosynovitis' : '狄奎尔万腱鞘炎'), code: 'M65.4', desc: locale === 'ko' ? '엄지 손목 건초염. 산모, 주방 종사자 다빈도' : (locale === 'en' ? 'Thumb/wrist tenosynovitis. Common in new mothers, kitchen workers' : '拇指腕部腱鞘炎。产妇、厨房工作者高发'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '손목 관절증' : (locale === 'en' ? 'Wrist Arthrosis' : '腕关节病'), code: 'M19.0', riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '뼈·골밀도 질환 (골다공증·골절)' : (locale === 'en' ? 'Bone Density Diseases (Osteoporosis/Fracture)' : '骨·骨密度疾病（骨质疏松·骨折）'),
                    items: [
                        { name: locale === 'ko' ? '골다공증 (병적골절 없음)' : (locale === 'en' ? 'Osteoporosis without Fracture' : '骨质疏松（无病理性骨折）'), code: 'M81', desc: locale === 'ko' ? '폐경후·노령성 골다공증. 골절 발생 시 골절진단비 청구' : (locale === 'en' ? 'Postmenopausal/senile osteoporosis. Fracture diagnosis benefit when fracture occurs' : '绝经后·老龄性骨质疏松。发生骨折时可申请骨折诊断金'), riders: [t('fractureDiag')] },
                        { name: locale === 'ko' ? '병적 골절을 동반한 골다공증' : (locale === 'en' ? 'Osteoporosis with Pathological Fracture' : '伴病理性骨折的骨质疏松'), code: 'M80', desc: locale === 'ko' ? '골다공증으로 인한 골절. 척추·고관절 압박골절 포함' : (locale === 'en' ? 'Fractures due to osteoporosis. Includes spinal/hip compression fractures' : '骨质疏松引起的骨折。包括脊柱·髋关节压缩性骨折'), riders: [t('fractureDiag'), ...riders.DISEASE], isImportant: true },
                        { name: locale === 'ko' ? '골수염' : (locale === 'en' ? 'Osteomyelitis' : '骨髓炎'), code: 'M86', desc: locale === 'ko' ? '뼈 감염. 수술 치료 필요한 경우 수술비 청구 가능' : (locale === 'en' ? 'Bone infection. Surgery claim possible when surgical treatment needed' : '骨感染。需要手术治疗时可申请手术费'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '무혈성 골괴사 (대퇴골두)' : (locale === 'en' ? 'Avascular Necrosis (Femoral Head)' : '无血性骨坏死（股骨头）'), code: 'M87', desc: locale === 'ko' ? '혈액공급 차단으로 뼈 괴사. 인공관절수술 다빈도' : (locale === 'en' ? 'Bone death from blocked blood supply. Frequent joint replacement surgery' : '血液供应中断导致骨坏死。人工关节手术高频'), riders: [t('jointReplacementSurgery'), ...riders.DISEASE], isImportant: true },
                    ]
                },
                {
                    name: locale === 'ko' ? '연조직·기타 근골격계 질환' : (locale === 'en' ? 'Soft Tissue & Other Musculoskeletal' : '软组织及其他肌肉骨骼疾病'),
                    items: [
                        { name: locale === 'ko' ? '등통증 (기타)' : (locale === 'en' ? 'Back Pain (Other)' : '背部疼痛（其他）'), code: 'M54', desc: locale === 'ko' ? '좌골신경통(M54.3), 목·등·허리 통증 포함' : (locale === 'en' ? 'Includes sciatica (M54.3), neck/back/lumbar pain' : '包括坐骨神经痛（M54.3）、颈·背·腰痛'), isImportant: true },
                        { name: locale === 'ko' ? '좌골신경통' : (locale === 'en' ? 'Sciatica' : '坐骨神经痛'), code: 'M54.3', desc: locale === 'ko' ? '디스크·협착증으로 인한 좌골신경 압박. 실비 보상 빈도 높음' : (locale === 'en' ? 'Sciatic nerve compression from disc/stenosis. High frequency insurance claims' : '椎间盘·狭窄症引起的坐骨神经压迫。实费保险赔付频率高'), isImportant: true },
                        { name: locale === 'ko' ? '목 통증' : (locale === 'en' ? 'Neck Pain' : '颈部疼痛'), code: 'M54.2', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '근육염' : (locale === 'en' ? 'Myositis' : '肌肉炎'), code: 'M60', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '연조직 장애 (기타)' : (locale === 'en' ? 'Other Soft Tissue Disorders' : '其他软组织障碍'), code: 'M79', desc: locale === 'ko' ? '류마티즘(기타), 신경통, 근육통 등 포함' : (locale === 'en' ? 'Includes other rheumatism, neuralgia, myalgia, etc.' : '包括其他风湿病、神经痛、肌肉痛等') },
                        { name: locale === 'ko' ? '석회성 건염' : (locale === 'en' ? 'Calcific Tendinitis' : '钙化性腱炎'), code: 'M65.2', desc: locale === 'ko' ? '어깨 힘줄 석회 침착. 체외충격파·수술 치료' : (locale === 'en' ? 'Calcium deposits in shoulder tendon. Shock wave or surgery treatment' : '肩部肌腱钙质沉积。体外冲击波·手术治疗'), riders: riders.DISEASE },
                    ]
                }
            ]
        },
        {
            id: 'K',
            title: locale === 'ko' ? '[K코드] 소화기계 질환' : (locale === 'en' ? '[K-Code] Digestive System Diseases' : '[K代码] 消化系统疾病'),
            shortTitle: locale === 'ko' ? 'K코드 (소화기)' : (locale === 'en' ? 'K-Code (Digestive)' : 'K代码 (消化系统)'),
            desc: locale === 'ko' ? '위염, 궤양, 탈장, 충수염, 담석증 등 소화기관 질환 코드입니다.' : (locale === 'en' ? 'Digestive codes for gastritis, ulcers, stone, etc.' : '胃炎、溃疡、疝气、阑尾炎、胆结石等消化器官疾病代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '위장관 질환' : (locale === 'en' ? 'Gastrointestinal Diseases' : '胃肠道疾病'),
                    items: [
                        { name: locale === 'ko' ? '구내염' : (locale === 'en' ? 'Stomatitis' : '口内炎'), code: 'K12' },
                        { name: locale === 'ko' ? '위식도 역류질환' : (locale === 'en' ? 'GERD' : '胃食管反流病'), code: 'K21', isImportant: true },
                        { name: locale === 'ko' ? '위궤양' : (locale === 'en' ? 'Stomach Ulcer' : '胃溃疡'), code: 'K25', isImportant: true, riders: riders.DISEASE },
                        { name: locale === 'ko' ? '십이지장 궤양' : (locale === 'en' ? 'Duodenal Ulcer' : '十二指肠溃疡'), code: 'K26', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '위염 및 십이지장염' : (locale === 'en' ? 'Gastritis & Duodenitis' : '胃炎及十二指肠炎'), code: 'K29', isImportant: true },
                        { name: locale === 'ko' ? '급성 충수염' : (locale === 'en' ? 'Acute Appendicitis' : '急性阑尾炎'), code: 'K35', isImportant: true, riders: [t('appendicitisSurgery'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '서혜부 탈장' : (locale === 'en' ? 'Inguinal Hernia' : '腹股沟疝'), code: 'K40', isImportant: true, riders: riders.DISEASE },
                        { name: locale === 'ko' ? '배꼽 탈장' : (locale === 'en' ? 'Umbilical Hernia' : '脐疝'), code: 'K42', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '크론병' : (locale === 'en' ? 'Crohn Disease' : '克罗恩病'), code: 'K50', riders: [t('rareDiseaseDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '궤양성 대장염' : (locale === 'en' ? 'Ulcerative Colitis' : '溃疡性结肠炎'), code: 'K51', riders: [t('rareDiseaseDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '장폐색' : (locale === 'en' ? 'Intestinal Obstruction' : '肠梗阻'), code: 'K56', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '게실 질환' : (locale === 'en' ? 'Diverticular Disease' : '憩室病'), code: 'K57', isImportant: true, riders: riders.DISEASE },
                    ]
                },
                {
                    name: locale === 'ko' ? '간, 담낭, 췌장 질환' : (locale === 'en' ? 'Liver, Gallbladder & Pancreatic' : '肝、胆囊、胰腺疾病'),
                    items: [
                        { name: locale === 'ko' ? '간 섬유증 및 간경변' : (locale === 'en' ? 'Liver Fibrosis & Cirrhosis' : '肝纤维化及肝硬化'), code: 'K74', riders: [t('liverCirrhosisDiag'), ...riders.DISEASE] },
                        { name: locale === 'ko' ? '담석증' : (locale === 'en' ? 'Cholelithiasis' : '胆结石'), code: 'K80', isImportant: true, riders: riders.DISEASE },
                        { name: locale === 'ko' ? '담낭염' : (locale === 'en' ? 'Cholecystitis' : '胆囊炎'), code: 'K81', isImportant: true, riders: riders.DISEASE },
                        { name: locale === 'ko' ? '급성 췌장염' : (locale === 'en' ? 'Acute Pancreatitis' : '急性胰腺炎'), code: 'K85', isImportant: true, riders: riders.DISEASE },
                    ]
                }
            ]
        },
        {
            id: 'S',
            title: locale === 'ko' ? '[S코드] 외상 및 각종 상해' : (locale === 'en' ? '[S-Code] Trauma & Injuries' : '[S代码] 外伤及各种伤害'),
            shortTitle: locale === 'ko' ? 'S코드 (상해/외상)' : (locale === 'en' ? 'S-Code (Injuries)' : 'S代码 (伤害/外伤)'),
            desc: locale === 'ko' ? '외부 요인에 의한 상처, 골절, 인대손상 등 상해 코드입니다.' : (locale === 'en' ? 'Injury codes for wounds, fractures, ligament tears, etc.' : '由于外部因素导致的伤口、骨折、韧带损伤等伤害代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '머리, 목, 흉부, 복부 손상' : (locale === 'en' ? 'Head, Neck, Chest, Abdomen' : '头、颈、胸、腹部损伤'),
                    items: [
                        { name: locale === 'ko' ? '머리의 표재성 손상' : (locale === 'en' ? 'Superficial Injury of Head' : '头部的浅表损伤'), code: 'S00', riders: [t('injuryOutpatientSilbi')] },
                        { name: locale === 'ko' ? '머리의 열린 상처' : (locale === 'en' ? 'Open Wound of Head' : '头部的开放性伤口'), code: 'S01', riders: [t('woundSutureSurgery')] },
                        { name: locale === 'ko' ? '두개골 및 안면골 골절' : (locale === 'en' ? 'Skull & Facial Bone Fracture' : '颅骨及面骨骨折'), code: 'S02', riders: riders.INJURY },
                        { name: locale === 'ko' ? '경추 골절' : (locale === 'en' ? 'Cervical Spine Fracture' : '颈椎骨折'), code: 'S12', riders: riders.INJURY },
                        { name: locale === 'ko' ? '경부 척수 및 신경 손상' : (locale === 'en' ? 'Injury of Spinal Cord/Nerve at Neck' : '颈部脊髓及神经损伤'), code: 'S14', riders: riders.INJURY },
                        { name: locale === 'ko' ? '늑골·흉골·흉추 골절' : (locale === 'en' ? 'Rib/Sternum/Thoracic Spine Fracture' : '肋骨·胸骨·胸椎骨折'), code: 'S22', riders: riders.INJURY },
                        { name: locale === 'ko' ? '요추 및 골반 골절' : (locale === 'en' ? 'Lumbar/Pelvic Fracture' : '腰椎及骨盆骨折'), code: 'S32', riders: riders.INJURY },
                    ]
                },
                {
                    name: locale === 'ko' ? '팔, 다리 손상' : (locale === 'en' ? 'Arm & Leg Injuries' : '胳膊、腿部损伤'),
                    items: [
                        { name: locale === 'ko' ? '어깨 및 위팔 골절' : (locale === 'en' ? 'Shoulder/Upper Arm Fracture' : '肩及上臂骨折'), code: 'S42', riders: riders.INJURY },
                        { name: locale === 'ko' ? '요골·척골 골절' : (locale === 'en' ? 'Radius/Ulna Fracture' : '桡骨·尺骨骨折'), code: 'S52', riders: riders.INJURY },
                        { name: locale === 'ko' ? '손목 및 손 골절' : (locale === 'en' ? 'Wrist/Hand Fracture' : '腕及手骨折'), code: 'S62', riders: riders.INJURY },
                        { name: locale === 'ko' ? '대퇴골 골절' : (locale === 'en' ? 'Femur Fracture' : '大腿骨骨折'), code: 'S72', riders: riders.INJURY },
                        { name: locale === 'ko' ? '경골·비골 골절' : (locale === 'en' ? 'Tibia/Fibula Fracture' : '胫骨·腓骨骨折'), code: 'S82', riders: riders.INJURY },
                        { name: locale === 'ko' ? '무릎 탈구·염좌' : (locale === 'en' ? 'Knee Dislocation/Sprain' : '膝关节脱位·扭伤'), code: 'S83', riders: riders.INJURY },
                        { name: locale === 'ko' ? '발목 및 발 골절' : (locale === 'en' ? 'Ankle/Foot Fracture' : '足踝及足骨折'), code: 'S92', riders: riders.INJURY },
                    ]
                }
            ]
        }
    ]
}
