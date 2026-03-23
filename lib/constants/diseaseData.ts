
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
            desc: locale === 'ko' ? '디스크, 관절염, 인대 파열 등 근골격계 질환 코드입니다.' : (locale === 'en' ? 'Musculoskeletal codes for discs, arthritis, etc.' : '椎间盘、关节炎、韧带撕裂等肌肉骨骼系统疾病代码。'),
            subCategories: [
                {
                    name: locale === 'ko' ? '관절 및 척추 질환' : (locale === 'en' ? 'Joint & Spinal Diseases' : '关节及脊柱疾病'),
                    items: [
                        { name: locale === 'ko' ? '화농성 관절염' : (locale === 'en' ? 'Pyogenic Arthritis' : '化脓性关节炎'), code: 'M00', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '류마티스 관절염(혈청양성)' : (locale === 'en' ? 'Rheumatoid Arthritis' : '类风湿性关节炎'), code: 'M05', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '고관절 관절증' : (locale === 'en' ? 'Coxarthrosis' : '髋关节病'), code: 'M16', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '무릎 관절증' : (locale === 'en' ? 'Gonarthrosis' : '膝关节病'), code: 'M17', desc: locale === 'ko' ? '퇴행성 관절염 (인공관절수술 다빈도)' : (locale === 'en' ? 'Degenerative arthritis (Frequent total joint replacement)' : '退行性关节炎 (人工关节手术高频)'), riders: [t('jointReplacementSurgery'), ...riders.DISEASE], isImportant: true },
                        { name: locale === 'ko' ? '무릎 내부 장애' : (locale === 'en' ? 'Internal Derangement of Knee' : '膝内部障碍'), code: 'M23', desc: locale === 'ko' ? '반월상연골파열 등' : (locale === 'en' ? 'Meniscus tear, etc.' : '半月板损伤等'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '척추측만증' : (locale === 'en' ? 'Scoliosis' : '脊柱侧弯'), code: 'M41', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '강직성 척추염' : (locale === 'en' ? 'Ankylosing Spondylitis' : '强直性脊柱炎'), code: 'M45', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '기타 척추병증' : (locale === 'en' ? 'Other Spondylopathies' : '其他脊柱病变'), code: 'M48', desc: locale === 'ko' ? '척추관 협착증 등' : (locale === 'en' ? 'Spinal stenosis, etc.' : '脊柱管狭窄等'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '경추 추간판 장애' : (locale === 'en' ? 'Cervical Disc Disorder' : '颈椎间盘障碍'), code: 'M50', desc: locale === 'ko' ? '목 디스크 (구형 수술비 면책 주의)' : (locale === 'en' ? 'Cervical disc (Caution for old policy exclusions)' : '颈椎间盘 (注意旧版手术费免责)'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                        { name: locale === 'ko' ? '기타 추간판 장애' : (locale === 'en' ? 'Other Disc Disorders' : '其他椎间盘障碍'), code: 'M51', desc: locale === 'ko' ? '허리 디스크 (구형 수술비 면책 주의)' : (locale === 'en' ? 'Lumbar disc (Caution for old policy exclusions)' : '腰椎间盘 (注意旧版手术费免责)'), riders: [t('discSurgery'), t('nDiseaseSurgery'), t('diseaseSurgery')], isImportant: true },
                    ]
                },
                {
                    name: locale === 'ko' ? '근육, 힘줄 및 뼈 질환' : (locale === 'en' ? 'Muscle, Tendon & Bone Diseases' : '肌肉、肌腱及骨骼疾病'),
                    items: [
                        { name: locale === 'ko' ? '활막염 및 건초염' : (locale === 'en' ? 'Synovitis & Tenosynovitis' : '滑膜炎及腱鞘炎'), code: 'M65', desc: locale === 'ko' ? '방아쇠수지, 손목건초염 등' : (locale === 'en' ? 'Trigger finger, De Quervain syndrome, etc.' : '弹响指、腕腱鞘炎等'), riders: riders.DISEASE },
                        { name: locale === 'ko' ? '어깨 병변' : (locale === 'en' ? 'Shoulder Lesions' : '肩部病变'), code: 'M75', desc: locale === 'ko' ? '회전근개파열, 오십견 등' : (locale === 'en' ? 'Rotator cuff tear, frozen shoulder, etc.' : '旋转肌腱损伤、五十肩等'), riders: riders.DISEASE, isImportant: true },
                        { name: locale === 'ko' ? '골수염' : (locale === 'en' ? 'Osteomyelitis' : '骨髓炎'), code: 'M86', riders: riders.DISEASE },
                        { name: locale === 'ko' ? '무혈성 골괴사' : (locale === 'en' ? 'Avascular Necrosis' : '无血性骨坏死'), code: 'M87', desc: locale === 'ko' ? '대퇴골두무혈성괴사 (인공관절 수술 등)' : (locale === 'en' ? 'AVN of femoral head (Joint replacement, etc.)' : '股骨头无血性坏死 (人工关节手术等)'), riders: [t('jointReplacementSurgery'), ...riders.DISEASE] },
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
