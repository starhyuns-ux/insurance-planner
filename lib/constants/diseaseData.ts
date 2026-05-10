
export type DiseaseItem = {
    name: string
    code: string
    desc?: string
    isImportant?: boolean
    riders?: string[]
    claimTips?: string // Professional insights from a loss adjuster
    deepAnalysis?: string // Graduate professor level deep analysis (Precedents, disputes)
    requiredDocs?: string[] // Essential documents for claims
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
            title: isKo ? '[C코드] 악성 신생물 (암 전문관)' : '[C-Code] Malignant Neoplasms',
            shortTitle: isKo ? 'C코드 (암)' : 'C-Code (Cancer)',
            desc: isKo ? '암 진단비의 핵심인 C코드 전 영역입니다. 일반암, 고액암, 소액암 분류와 실무 쟁점을 다룹니다.' : 'Full range of C-codes for cancer claims. Covers general, high-amount, and minor cancer disputes.',
            subCategories: [
                {
                    name: isKo ? '소화기계 악성 신생물 (식도/위/간/췌장)' : 'Digestive Cancers',
                    items: [
                        { 
                            name: isKo ? '식도암' : 'Esophageal Cancer', 
                            code: 'C15', 
                            riders: [...riders.CANCER, '5대고액암진단비'], 
                            requiredDocs: commonDocs.CANCER,
                            claimTips: isKo ? '고액암 진단비 대상이며, 식도 스텐트 삽입술 시 수술비 청구 가능합니다.' : 'High-amount cancer; stent insertion counts as surgery.',
                            deepAnalysis: isKo ? '식도암은 연하곤란으로 인한 영양 장애가 동반되므로 입원 치료의 정당성이 높습니다. 수술이 불가능한 경우 항암방사선 병용 요법이 일반암 진단의 확정적 근거가 됩니다.' : 'High justification for inpatient care due to dysphagia. Concurrent chemo-radiation is definitive for malignant claims.'
                        },
                        { 
                            name: isKo ? '위암' : 'Stomach Cancer', 
                            code: 'C16', 
                            riders: riders.CANCER, 
                            isImportant: true,
                            requiredDocs: commonDocs.CANCER,
                            claimTips: isKo ? '조직검사상 Adenocarcinoma 여부와 침윤 깊이가 핵심입니다.' : 'Check for Adenocarcinoma and invasion depth.',
                            deepAnalysis: isKo ? '위점막내암(EGC)의 경우 보험사는 D코드를 유도하지만, TNM 병기상 T1a 이상이면 반드시 C코드로 보상받아야 합니다. 특히 헬리코박터균 제균 치료와의 인과관계는 보험사에서 면책 근거로 삼을 수 없음을 명심하십시오.' : 'Insurers push D-code for EGC. If TNM stage is T1a+, insist on C-code. H.pylori treatment is not a ground for denial.'
                        },
                        { 
                            name: isKo ? '간암' : 'Liver Cancer', 
                            code: 'C22', 
                            riders: [...riders.CANCER, '고액암진단비'], 
                            isImportant: true,
                            requiredDocs: [...commonDocs.CANCER, 'AFP 수치 결과지'],
                            claimTips: isKo ? '간색전술(TACE)은 약관상 수술로 인정받기 위해 강력한 의학적 소견이 필요합니다.' : 'TACE needs medical backup to be counted as surgery.',
                            deepAnalysis: isKo ? '간암은 조직검사 없이 영상의학적 소견(CT/MRI)과 종양표지자(AFP) 상승만으로도 암 진단 확정이 가능합니다. 보험사가 조직검사 미비를 이유로 부지급 시, 암 확정 진단 기준(KCD)을 근거로 대응해야 합니다.' : 'Liver cancer can be diagnosed via CT/MRI and AFP without biopsy. Counter denials based on missing biopsy using KCD diagnostic standards.'
                        },
                        { 
                            name: isKo ? '췌장암' : 'Pancreatic Cancer', 
                            code: 'C25', 
                            riders: [...riders.CANCER, '10대고액암진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '췌장 미부/두부 절제술 시 발생하는 합병증(당뇨 등)은 별도의 질병후유장해로 청구 가능합니다. 진단 즉시 고액암 보상 대상임을 확인하십시오.' : 'Post-op complications like diabetes qualify for separate disability claims. Always check high-amount cancer eligibility.'
                        }
                    ]
                },
                {
                    name: isKo ? '호흡기 및 흉곽 (폐/후두/비강)' : 'Respiratory Cancers',
                    items: [
                        { 
                            name: isKo ? '폐암 (소세포/비소세포)' : 'Lung Cancer', 
                            code: 'C34', 
                            riders: [...riders.CANCER, '고액암진단비(특약)'], 
                            isImportant: true,
                            claimTips: isKo ? '흉강경 수술(VATS) 시 질병수술비와 암수술비 중복 수령 확인하세요.' : 'Check for both disease and cancer surgery benefits for VATS.',
                            deepAnalysis: isKo ? '폐암은 표적항암제(타그리소 등) 사용 빈도가 높습니다. 비급여 항암제 비용이 실손보험 한도를 초과할 수 있으므로, 암 주요 치료비 특약의 가입 유무가 경제적 보상의 핵심입니다.' : 'Lung cancer often involves expensive targeted therapies. Cancer treatment riders are crucial to cover costs exceeding Silbi limits.'
                        },
                        { 
                            name: isKo ? '후두암' : 'Laryngeal Cancer', 
                            code: 'C32', 
                            riders: riders.CANCER, 
                            deepAnalysis: isKo ? '후두 전절제술 시 언어 장애가 남게 됩니다. 이는 암 진단비와 별개로 80% 이상의 고도 후유장해에 해당하여 보험료 납입 면제 및 고액의 장해 보험금 청구 대상입니다.' : 'Total laryngectomy causes permanent speech loss. This triggers 80%+ disability, premium waivers, and major lump sum claims.'
                        }
                    ]
                },
                {
                    name: isKo ? '여성암 및 비뇨생식기 (유방/난소/자궁/방광)' : 'Female & Uro Cancers',
                    items: [
                        { 
                            name: isKo ? '유방암' : 'Breast Cancer', 
                            code: 'C50', 
                            riders: riders.CANCER, 
                            isImportant: true,
                            claimTips: isKo ? '유방재건술의 실손의료비 보상 여부는 치료 목적 입증이 관건입니다.' : 'Breast reconstruction Silbi depends on proving medical necessity.',
                            deepAnalysis: isKo ? '유방암은 상피내암(D05)과 악성암(C50)의 경계 분쟁이 많습니다. 미세 침윤(Microinvasion) 소견이 1mm만 있어도 일반암으로 인정받아야 하며, 호르몬 치료제(타목시펜 등) 처방 기록도 암 치료비 산정 기준에 포함됩니다.' : 'Dispute between D05 and C50 is common. Even 1mm micro-invasion qualifies for malignant benefits. Hormone therapy counts as cancer treatment.'
                        },
                        { 
                            name: isKo ? '난소암' : 'Ovarian Cancer', 
                            code: 'C56', 
                            riders: [...riders.CANCER, '여성특정암진단비'], 
                            deepAnalysis: isKo ? '난소의 경계성 종양(D39)이 나중에 악성으로 밝혀지는 경우가 많습니다. 초기 진단과 상관없이 최종 병리 결과에 따라 C코드를 소급 적용받을 수 있습니다.' : 'Borderline ovarian tumors (D39) often turn out to be malignant. C-code can be applied retroactively based on final pathology.'
                        },
                        { 
                            name: isKo ? '전립선암' : 'Prostate Cancer', 
                            code: 'C61', 
                            riders: [t('pseudoCancerDiag'), '전립선암진단비'], 
                            claimTips: isKo ? 'Gleason Score 7점 이상이면 일반암 승인이 수월합니다.' : 'Gleason Score 7+ makes malignant approval easier.',
                            deepAnalysis: isKo ? '최근 보험사는 전립선암을 소액암으로 분류하는 추세입니다. 하지만 과거 가입 상품의 경우 일반암으로 분류되어 있다면 고액의 진단비를 청구할 수 있으며, 로봇수술(다빈치) 비용의 실비 보존이 중요합니다.' : 'Newer policies classify prostate cancer as minor, but older ones pay 100%. Robot-assisted surgery costs are a key Silbi dispute point.'
                        }
                    ]
                },
                {
                    name: isKo ? '림프/혈액 및 내분비 (백혈병/림프종/갑상선)' : 'Hema & Lymph Cancers',
                    items: [
                        { 
                            name: isKo ? '갑상선암 (유두암/여포암)' : 'Thyroid Cancer', 
                            code: 'C73', 
                            riders: [t('pseudoCancerDiag'), '갑상선암진단비'], 
                            isImportant: true,
                            claimTips: isKo ? '림프절 전이(C77) 동반 시 일반암 수령 가능성을 검토하세요.' : 'Check for 100% payout if lymph node metastasis (C77) exists.',
                            deepAnalysis: isKo ? '갑상선암 자체는 소액암이지만, 전이암(C77) 코드를 받은 경우 "원발암 기준" 약관이 없다면 일반암 진단비를 청구할 수 있다는 대법원 판례가 있습니다. 2011년 이전 가입자는 필히 확인하십시오.' : 'Thyroid cancer is minor, but C77 metastasis may trigger 100% payout for pre-2011 policies due to "Primary Cancer Rule" disputes.'
                        },
                        { 
                            name: isKo ? '악성 림프종' : 'Malignant Lymphoma', 
                            code: 'C81-C85', 
                            riders: [...riders.CANCER, '고액암진단비'], 
                            deepAnalysis: isKo ? '호지킨 및 비호지킨 림프종 모두 고액암에 해당합니다. 전신 질환 특성상 입원 항암 치료가 필수적이므로 일당 청구를 누락하지 마십시오.' : 'Both Hodgkin and Non-Hodgkin count as high-amount cancer. Ensure inpatient daily benefits are claimed for systemic chemo.'
                        },
                        { 
                            name: isKo ? '골수성 백혈병' : 'Myeloid Leukemia', 
                            code: 'C92', 
                            riders: [...riders.CANCER, '조혈모세포이식수술비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '백혈병 진단 시 조혈모세포 이식은 가장 고가의 수술 중 하나입니다. 공여자와의 일치 여부 검사비 등 부대 비용의 실비 청구 범위를 전문가와 상의하십시오.' : 'BMT is one of the costliest procedures. Consult an expert on Silbi limits for ancillary costs like donor matching tests.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'D',
            title: isKo ? '[D코드] 경계성 종양 및 유사암' : '[D-Code] Borderline & Pseudo Cancers',
            shortTitle: isKo ? 'D코드 (유사암)' : 'D-Code (Pseudo)',
            desc: isKo ? '암으로 진행될 가능성이 있거나, 악성 여부가 모호한 종양입니다. 일반암 전환 가능성을 분석합니다.' : 'Tumors with malignant potential or ambiguous status. Analyzes general cancer upgrade possibilities.',
            subCategories: [
                {
                    name: isKo ? '소화기 및 혈액 경계성 종양' : 'Digestive & Blood Borderline',
                    items: [
                        { 
                            name: isKo ? '직장 유암종 (신경내분비종양)' : 'Rectal NET', 
                            code: 'D37.5', 
                            riders: ['유사암진단비', '일반암진단비(조정필요)'], 
                            isImportant: true,
                            claimTips: isKo ? '크기가 1cm 미만이라도 일반암으로 청구할 의학적 근거가 충분합니다.' : 'Under 1cm can still be claimed as malignant with proper evidence.',
                            deepAnalysis: isKo ? '보험사는 L-cell type임을 근거로 유사암을 고집하지만, 대법원 판례(2018다242724)는 직장 유암종의 악성 잠재력을 인정합니다. 병리 보고서의 WHO 분류 기준을 인용하여 대응하십시오.' : 'Insurers use L-cell type to deny. Cite Supreme Court 2018da242724 regarding malignant potential based on WHO standards.'
                        },
                        { 
                            name: isKo ? '진성 적혈구 과다증' : 'Polycythemia Vera', 
                            code: 'D45', 
                            riders: ['일반암진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? 'KCD-8차 개정 이후 명확한 악성 신생물로 분류됩니다. 과거 가입 상품의 약관에 D코드가 유사암으로 되어 있더라도, 진단 시점의 기준을 적용하여 일반암을 수령해야 합니다.' : 'Clearly malignant since KCD-8. Apply current standards for full payouts even on older policies.'
                        },
                        { 
                            name: isKo ? '갑상선의 경계성 종양 (NIFTP)' : 'NIFTP (Thyroid)', 
                            code: 'D34', 
                            riders: ['유사암진단비'], 
                            deepAnalysis: isKo ? '과거 갑상선암(C73)으로 분류되던 비침습 여포성 종양이 D코드로 변경되었습니다. 하지만 여포 변이형의 경우 여전히 일반암 분쟁의 여지가 있으므로 세포진 검사 결과를 재검토해야 합니다.' : 'Non-invasive follicular neoplasms are now D-code. However, follicular variants still trigger malignant disputes; re-examine cytology.'
                        }
                    ]
                },
                {
                    name: isKo ? '제자리암 (제자리 신생물)' : 'Carcinoma in situ',
                    items: [
                        { 
                            name: isKo ? '대장 제자리암' : 'Colon CIS', 
                            code: 'D01', 
                            riders: [t('pseudoCancerDiag')], 
                            deepAnalysis: isKo ? '점막내암(Intramucosal Carcinoma)은 D01로 부여되는 경우가 많으나, 침윤 깊이가 점막하층(Submucosa) 직전까지 도달했다면 일반암(C18)으로 인정받을 여지가 큽니다.' : 'Often assigned D01, but if invasion reaches just before the submucosa, argue for C18 malignant benefits.'
                        },
                        { 
                            name: isKo ? '유방 제자리암 (상피내암)' : 'Breast CIS', 
                            code: 'D05', 
                            riders: [t('pseudoCancerDiag')], 
                            claimTips: isKo ? '0기 암이라고 안심하지 말고, 미세 침윤 여부를 끝까지 확인하세요.' : 'Stage 0 cancer; check for micro-invasion until the end.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'I',
            title: isKo ? '[I코드] 뇌혈관 및 심장 질환' : '[I-Code] Cerebro & Cardiovascular',
            shortTitle: isKo ? 'I코드 (심뇌)' : 'I-Code (Brain/Heart)',
            desc: isKo ? '급성기 질환 및 만성 혈관 장애를 다룹니다. 진단비 지급의 가장 큰 분쟁 지역입니다.' : 'Covers acute and chronic vascular disorders. The biggest dispute area for diagnosis benefits.',
            subCategories: [
                {
                    name: isKo ? '뇌혈관 질환 (중풍/경색/출혈)' : 'Cerebrovascular Disease',
                    items: [
                        { 
                            name: isKo ? '뇌경색증' : 'Cerebral Infarction', 
                            code: 'I63', 
                            riders: ['뇌졸중진단비', '뇌혈관질환진단비'], 
                            isImportant: true,
                            requiredDocs: commonDocs.VASCULAR,
                            claimTips: isKo ? 'MRI상 고신호 강도(High Signal) 부위와 임상적 신경학적 결손이 일치해야 합니다.' : 'MRI high signal must match clinical neurological deficits.',
                            deepAnalysis: isKo ? '열공성 뇌경색(Lacunar Infarct)은 보험사가 I67(기타 뇌혈관)로 하향 조정을 시도합니다. 진단서상 I63이 부여되었더라도 판독지상 "Old" 또는 "Chronic" 문구가 있으면 지급을 거절하므로 주의가 필요합니다.' : 'Insurers try to downgrade Lacunar infarcts to I67. Watch for "Old" or "Chronic" phrases in MRI reports that trigger denials.'
                        },
                        { 
                            name: isKo ? '뇌동맥류 (비파열)' : 'Cerebral Aneurysm', 
                            code: 'I67.1', 
                            riders: ['뇌혈관질환진단비', '뇌혈관질환수술비'], 
                            isImportant: true,
                            claimTips: isKo ? '코일색전술 시 수술비 담보에서 고액 수령 가능합니다.' : 'Coil embolization triggers high surgical benefits.',
                            deepAnalysis: isKo ? '터지기 전의 뇌동맥류는 뇌졸중 진단비에는 해당하지 않으나 "뇌혈관질환 진단비"에는 해당합니다. 수술 대신 코일색전술을 시행해도 약관상 수술로 인정되므로 반드시 수술비를 청구하십시오.' : 'Unruptured aneurysms only count for "Cerebrovascular" (not Stroke) riders. Coil embolization is recognized as surgery.'
                        },
                        { 
                            name: isKo ? '뇌혈관의 죽상경화증 (경동맥 협착)' : 'Carotid Stenosis', 
                            code: 'I67.2', 
                            riders: ['뇌혈관질환진단비'], 
                            deepAnalysis: isKo ? '경동맥 초음파상 협착률이 50% 이상이거나 플라크가 불안정한 경우 I67.2 진단비를 수령할 수 있습니다. 건강검진 결과지에 "경동맥 협착" 문구가 있다면 즉시 전문가와 상담하십시오.' : 'Stenosis > 50% or unstable plaques trigger I67.2 benefits. Consult if "Carotid Stenosis" appears in checkup results.'
                        }
                    ]
                },
                {
                    name: isKo ? '심장 질환 (협심증/심근경색/부정맥)' : 'Heart Disease',
                    items: [
                        { 
                            name: isKo ? '급성 심근경색' : 'Acute MI', 
                            code: 'I21', 
                            riders: ['급성심근경색진단비', '허혈성심장질환진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '심근효소(Troponin) 수치 변화가 핵심입니다. 전형적인 흉통이 없더라도 효소 상승이 확인되면 I21로 인정받아야 하며, 보험사의 협심증(I20) 축소 안내에 주의하십시오.' : 'Cardiac enzyme (Troponin) changes are key. Even without chest pain, elevated enzymes qualify for I21 over I20.'
                        },
                        { 
                            name: isKo ? '심방세동 및 조동 (부정맥)' : 'AFib / AFlutter', 
                            code: 'I48', 
                            riders: ['심혈관질환진단비', '심장질환수술비'], 
                            isImportant: true,
                            claimTips: isKo ? '최신 "심혈관 1-5종" 담보가 있다면 고액 수령이 가능합니다.' : 'New "Cardiovascular 1-5" riders pay high amounts.',
                            deepAnalysis: isKo ? '부정맥은 진단 자체가 어렵습니다. 24시간 홀터 검사상 명확한 파형이 기록되어야 하며, 전극도자 절제술(Ablation) 시 수술비 지급을 두고 "절단/절제" 문구 논쟁이 발생하므로 판례를 준비해야 합니다.' : 'AFib diagnosis needs 24h Holter evidence. Ablation triggers "cutting/excision" disputes in surgery riders; prepare precedents.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'M/S',
            title: isKo ? '[M/S코드] 근골격계 및 상해' : '[M/S-Code] Musculoskeletal & Injury',
            shortTitle: isKo ? 'M/S코드 (정형)' : 'M/S-Code (Ortho)',
            desc: isKo ? '디스크, 골절, 인대 파열 등 외상 및 퇴행성 질환입니다. 기왕증 감액이 주된 쟁점입니다.' : 'Disc, fractures, and ligament tears. Degenerative vs. trauma contribution is the main dispute.',
            subCategories: [
                {
                    name: isKo ? '척추 및 관절 질환' : 'Spine & Joint',
                    items: [
                        { 
                            name: isKo ? '추간판 탈출증 (디스크)' : 'Disc Herniation', 
                            code: 'M50, M51', 
                            riders: ['질병수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '디스크는 사고 기여도(Contribution) 산정이 보상의 핵심입니다. 보험사는 100% 퇴행성(M)을 주장하지만, 외상 기전이 명확하다면 상해후유장해에서 기왕증을 제외한 나머지 금액을 수령해야 합니다.' : 'Claiming disc injury requires proving accident contribution. Insurers push 100% degenerative (M); fight for partial injury disability benefits.'
                        },
                        { 
                            name: isKo ? '무릎 반월상 연골 파열' : 'Meniscus Tear', 
                            code: 'M23, S83', 
                            riders: ['상해수술비', '질병수술비'], 
                            claimTips: isKo ? '수술 기록지상 "Degenerative" 문구가 있으면 상해 수술비가 거절될 수 있습니다.' : '"Degenerative" phrases in surgical reports can trigger injury benefit denials.'
                        }
                    ]
                },
                {
                    name: isKo ? '골절 및 외상성 손상' : 'Fractures & Trauma',
                    items: [
                        { 
                            name: isKo ? '척추 압박골절' : 'Compression Fracture', 
                            code: 'S22, S32', 
                            riders: ['상해후유장해', '골절진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '수술을 하지 않아도 척추의 기형(각도 변화)이 남으면 고액의 후유장해 보험금을 수령할 수 있습니다. 골밀도 검사(T-score) 수치에 따라 감액 비율이 결정되므로 주의하십시오.' : 'Deformity (spinal angle change) triggers high disability payouts even without surgery. Payouts depend on T-score based reductions.'
                        },
                        { 
                            name: isKo ? '대퇴경부 골절' : 'Femur Neck Fracture', 
                            code: 'S72.0', 
                            riders: ['상해수술비', '상해후유장해'], 
                            deepAnalysis: isKo ? '노인성 낙상 사고의 대표적 골절입니다. 인공관절 치환술을 시행하는 경우 장해 분류표상 "한 다리의 기능을 완전히 잃었을 때" 등에 해당하여 고액 보상이 가능합니다.' : 'Typical geriatric fall injury. Artificial joint replacement qualifies for "Total loss of limb function" under disability tables.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'H/N/K',
            title: isKo ? '[H/N/K코드] 실비 및 만성질환' : '[H/N/K-Code] Chronic',
            shortTitle: isKo ? '기타 (실비분쟁)' : 'Misc (Silbi)',
            desc: isKo ? '백내장, 신부전, 봉와직염 등 실생활 밀접 질환입니다.' : 'Common diseases like cataracts, CKD, and cellulitis.',
            subCategories: [
                {
                    name: isKo ? '입원 및 실비 분쟁' : 'Silbi & Inpatient',
                    items: [
                        { 
                            name: isKo ? '백내장' : 'Cataract', 
                            code: 'H25', 
                            riders: ['백내장수술비', '실손의료비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '다초점 렌즈 실비 부지급 사태에 대비해, 수술 전 검사 결과지(세극등현미경) 확보가 필수입니다. 단순 노안 교정이 아닌 질병 치료 목적임을 입증해야 합니다.' : 'Secure slit-lamp results to prove medical necessity over cosmetic presbyopia care for multifocal lens claims.'
                        },
                        { 
                            name: isKo ? '만성 신부전' : 'Chronic Kidney Disease', 
                            code: 'N18', 
                            riders: ['만성신부전진단비', '질병후유장해(75%)'], 
                            deepAnalysis: isKo ? '혈액 투석 시작은 곧 75% 이상의 고도 장해를 의미합니다. 가입금액의 대부분을 수령할 수 있는 강력한 코드이므로 장해 진단을 절대 놓치면 안 됩니다.' : 'Starting dialysis equals 75%+ high disability. Never miss the disability diagnosis for major payouts.'
                        },
                        { 
                            name: isKo ? '봉와직염' : 'Cellulitis', 
                            code: 'L03', 
                            riders: ['질병입원일당', '실손의료비'], 
                            deepAnalysis: isKo ? '보험사는 통원 치료를 주장하며 입원일당을 거부하곤 합니다. 하지만 정맥 항생제 투여의 필수성과 염증 수치(CRP) 상승을 근거로 입원의 정당성을 주장해야 합니다.' : 'Insurers deny inpatient benefits for cellulitis. Defend the necessity via IV antibiotic needs and high CRP levels.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'G/E/J',
            title: isKo ? '[G/E/J코드] 신경계 및 내분비' : '[G/E/J-Code] Nerve & Endocrine',
            shortTitle: isKo ? '치매/당뇨/폐렴' : 'Dementia/Diabetes',
            desc: isKo ? '치매, 당뇨 합병증, 만성 호흡기 질환 분류입니다.' : 'Dementia, diabetic complications, and respiratory diseases.',
            subCategories: [
                {
                    name: isKo ? '노인성 및 대사 질환' : 'Geriatric & Metabolic',
                    items: [
                        { 
                            name: isKo ? '알츠하이머 치매' : 'Alzheimer\'s', 
                            code: 'G30', 
                            riders: ['치매진단비(경증/중증)', '재가급여지원금', '장기요양진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '치매 보험금은 CDR 척도가 핵심입니다. CDR 1점은 경증, 3점 이상은 중증으로 분류되어 보상액이 수 배 차이납니다. 신경정신과 전문의의 정밀 검사 결과지와 함께 일상생활 수행 능력 평가를 꼼꼼히 준비해야 합니다.' : 'CDR scales determine dementia payouts. CDR 1 is mild, 3+ is severe. Prepare neuropsychiatric results and ADL evaluations carefully.'
                        },
                        { 
                            name: isKo ? '제2형 당뇨병' : 'Type 2 Diabetes', 
                            code: 'E11', 
                            riders: ['당뇨병진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '당뇨 그 자체보다 합병증이 무섭습니다. 당뇨망막병증으로 인한 시력 저하나 족부 궤양으로 인한 절단 발생 시, 질병후유장해 담보를 통해 고액의 보험금을 수령할 수 있음을 명심해야 합니다.' : 'Complications like retinopathy or foot ulcers can trigger high disability payouts. Monitor these for potential long-term claims.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Q/F/O',
            title: isKo ? '[Q/F/O코드] 선천성·정신·산과' : '[Q/F/O-Code] Fetal/Mental/Ob',
            shortTitle: isKo ? '태아/산모/심리' : 'Fetal/Ob/Mental',
            desc: isKo ? '선천성 기형, 우울증 및 산모 합병증 분류입니다.' : 'Congenital malformations, mental disorders, and pregnancy complications.',
            subCategories: [
                {
                    name: isKo ? '태아보험 및 고위험 산모' : 'Fetal & High-risk Mother',
                    items: [
                        { 
                            name: isKo ? '심방/심실 중격 결손' : 'ASD/VSD', 
                            code: 'Q21', 
                            riders: ['선천이상수술비', '실손의료비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? 'Q코드는 실손보험에서 면책인 경우가 많으나, 태아보험 특약 가입 시에는 보상이 가능합니다. 특히 구멍의 크기와 폐동맥 고혈압 합병증 여부에 따라 수술비 지급 규모가 결정되므로 심초음파 자료를 정밀 분석해야 합니다.' : 'Q-codes are often excluded in general Silbi but covered in fetal riders. Payouts depend on defect size and pulmonary hypertension status.'
                        },
                        { 
                            name: isKo ? '임신 중독증' : 'Pre-eclampsia', 
                            code: 'O14', 
                            riders: ['임신중독증진단비', '임산부동반입원비'], 
                            deepAnalysis: isKo ? '임신 중독증은 산모와 태아 모두에게 치명적일 수 있습니다. 단백뇨 수치와 혈압 변화를 근거로 진단비를 청구하며, 고위험 산모 집중치료실(OICU) 입원 시 별도의 입원 일당 수령 여부를 반드시 확인해야 합니다.' : 'Diagnosed via proteinuria and BP levels. Check for OICU inpatient benefits and specific pregnancy complication riders.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'N/C_Extra',
            title: isKo ? '[N/C코드] 비뇨기 및 특수암' : '[N/C-Code] Uro & Skin Cancer',
            shortTitle: isKo ? '전립선/자궁/피부암' : 'Uro/Skin',
            desc: isKo ? '전립선 비대증, 자궁내막증 및 피부암 분류입니다.' : 'Prostate hyperplasia, endometriosis, and skin cancers.',
            subCategories: [
                {
                    name: isKo ? '성인병 및 고난도 암' : 'Adult & Rare Cancers',
                    items: [
                        { 
                            name: isKo ? '전립선 비대증' : 'Prostate Hyperplasia', 
                            code: 'N40', 
                            riders: ['질병수술비', '실손의료비'], 
                            deepAnalysis: isKo ? '최근 홀렙(HoLEP)이나 결찰술(유로리프트) 시술이 많습니다. 보험사는 이를 "선택적 시술"로 보아 실비 지급을 삭감하려 하지만, 요류 역학 검사상 폐색이 확인된다면 필수적 치료임을 입증하여 전액 보상받아야 합니다.' : 'Insurers often cut HoLEP or Urolift claims as "elective". Prove medical necessity via urodynamic study results for full reimbursement.'
                        },
                        { 
                            name: isKo ? '악성 흑색종' : 'Malignant Melanoma', 
                            code: 'C43', 
                            riders: [...riders.CANCER, '고액암진단비(특약)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '피부암 중 가장 악성도가 높은 흑색종은 일반암으로 분류됩니다. 단순 피부 종양(D22-D23)으로 오인하여 소액 청구하는 실수를 범해서는 안 되며, Breslow 침윤 깊이에 따라 예후와 보상 전략이 달라집니다.' : 'Melanoma is highly malignant. Do not mistake it for D22-D23 benign lesions. Breslow thickness determines the prognosis and claim strategy.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Blood_Rare',
            title: isKo ? '[C/D코드] 혈액암 및 희귀종양' : '[C/D-Code] Blood & Rare',
            shortTitle: isKo ? '백혈병/희귀암' : 'Blood/Rare',
            desc: isKo ? '백혈병, 골수증식성 질환 등 희귀 혈액암 분류입니다.' : 'Classification for leukemia and rare blood neoplasms.',
            subCategories: [
                {
                    name: isKo ? '혈액 및 림프계 악성암' : 'Blood & Lymphatic',
                    items: [
                        { 
                            name: isKo ? '급성 골수성 백혈병' : 'Acute Myeloid Leukemia', 
                            code: 'C92.0', 
                            riders: [...riders.CANCER, '고액암진단비', '조혈모세포이식수술비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '백혈병은 고액암의 대표격입니다. 항암 치료 전 골수 이식 여부를 반드시 확인하여 조혈모세포 이식 수술비를 함께 청구해야 하며, 진단 확정 시점이 골수 검사일인지 최종 결과 보고일인지에 따라 보험 기간 편입 여부가 달라질 수 있습니다.' : 'AML qualifies for high-amount cancer and BMT benefits. Payouts depend on whether the diagnosis date is the biopsy date or the final report date.'
                        },
                        { 
                            name: isKo ? '본태성 고혈소판증' : 'Essential Thrombocythemia', 
                            code: 'D47.3', 
                            riders: ['유사암진단비', '일반암진단비(조정필요)'], 
                            deepAnalysis: isKo ? 'D47.3은 형태학적 분류상 악성(M9962/3)에 해당하지만 코드는 D로 부여됩니다. 보험사는 유사암 지급을 고수하지만, KCD 기준에 따라 일반암으로 청구하여 승인받은 사례가 많으므로 적극적인 대응이 필요합니다.' : 'D47.3 is pathologically malignant (M9962/3) despite its D-code. Insurers push for minor claims, but KCD standards allow for full malignant upgrades.'
                        }
                    ]
                },
                {
                    name: isKo ? '퇴행성 신경 질환' : 'Degenerative Nervous',
                    items: [
                        { 
                            name: isKo ? '파킨슨병' : 'Parkinson\'s Disease', 
                            code: 'G20', 
                            riders: ['파킨슨병진단비', '뇌질환수술비', '질병후유장해'], 
                            deepAnalysis: isKo ? '파킨슨병은 약물 조절이 핵심이나, 점진적인 보행 장애와 떨림으로 인해 높은 등급의 질병후유장해(ADLs)가 발생합니다. 치매와는 별개의 담보이므로 각각 중복 수령이 가능한지 증권을 정밀 분석해야 합니다.' : 'Parkinson\'s leads to high ADL-based disability. It is separate from dementia riders; analyze policies for potential double payouts.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Heart_Advanced',
            title: isKo ? '[I코드] 심장 합병증 및 부정맥' : '[I-Code] Heart Comps & AFib',
            shortTitle: isKo ? '부정맥/심부전' : 'AFib/HF',
            desc: isKo ? '부정맥, 심부전 등 고난도 심장 질환 분류입니다.' : 'Classification for complex heart diseases like AFib and HF.',
            subCategories: [
                {
                    name: isKo ? '심장 기능 장애' : 'Heart Function Disorders',
                    items: [
                        { 
                            name: isKo ? '심방세동 및 조동' : 'Atrial Fibrillation', 
                            code: 'I48', 
                            riders: ['심혈관질환진단비', '심장질환수술비'], 
                            deepAnalysis: isKo ? '부정맥 수술인 전극도자 절제술(Ablation)은 약관상 수술의 정의(절단, 절제)에 해당하지 않는다는 이유로 거절되곤 합니다. 하지만 대법원 판례와 최신 약관은 이를 수술로 인정하므로, 종 수술비 또는 심장 특정 수술비 청구를 놓치지 말아야 합니다.' : 'Ablation for AFib is often denied as "not a surgery". However, precedents and modern policies recognize it. Ensure claims for specific heart surgery benefits.'
                        },
                        { 
                            name: isKo ? '심부전' : 'Heart Failure', 
                            code: 'I50', 
                            riders: ['심혈관질환진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '심부전은 병기(NYHA Class)에 따라 보상 전략이 달라집니다. 특히 심장 초음파상 심박출률(EF)이 저하된 경우 "심장의 장해"로 보아 질병후유장해 보험금을 수령할 수 있는 중요한 항목입니다.' : 'HF claims depend on NYHA Class. If Ejection Fraction (EF) is low, it counts as heart disability for potential lump sum payouts.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Autoimmune_Urinary',
            title: isKo ? '[M/N코드] 자가면역 및 요로질환' : '[M/N-Code] Autoimmune & Uro',
            shortTitle: isKo ? '루푸스/요로결석' : 'Lupus/Stone',
            desc: isKo ? '루푸스, 쇼그렌 및 요로결석 분류입니다.' : 'Classification for Lupus, Sjogren, and kidney stones.',
            subCategories: [
                {
                    name: isKo ? '만성 염증 및 결석' : 'Chronic Inflammation & Stones',
                    items: [
                        { 
                            name: isKo ? '전신성 홍반성 루푸스' : 'SLE (Lupus)', 
                            code: 'M32', 
                            riders: ['희귀난치성질환진단비', '실손의료비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '루푸스는 산정특례 대상(V136)으로 실비 본인부담금 혜택이 큽니다. 진단 시 "희귀난치성 질환 진단비"를 수령할 수 있으며, 장기 스테로이드 치료 부작용인 대퇴골두 무혈성 괴사(M87) 발생 시 질병수술비 추가 청구가 가능합니다.' : 'SLE qualifies for rare disease benefits (V136). Watch for AVN (M87) as a side effect of long-term steroids for additional surgical claims.'
                        },
                        { 
                            name: isKo ? '요로결석' : 'Kidney Stones', 
                            code: 'N20', 
                            riders: ['질병수술비', '1-5종수술비'], 
                            claimTips: isKo ? '쇄석술(ESWL)은 반복 지급이 가능한지 확인해야 합니다.' : 'Check for repeated ESWL payouts.',
                            deepAnalysis: isKo ? '체외충격파 쇄석술(ESWL)은 수술 회당 지급되는 것이 원칙입니다. 보험사가 "60일 이내 1회 지급" 등의 제한 문구를 들이댈 경우, 과거 약관과 비교하여 정당한 수술 횟수만큼 보험금을 수령해야 합니다.' : 'ESWL should be paid per session. Counter "once per 60 days" limits by checking your specific policy period standards.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Lymphoma_Epilepsy',
            title: isKo ? '[C/D/G코드] 림프종 및 뇌전증' : '[C/D/G-Code] Lymphoma & Epilepsy',
            shortTitle: isKo ? '림프종/뇌전증' : 'Lymph/Epilepsy',
            desc: isKo ? '악성 림프종, 중증 빈혈 및 뇌전증 분류입니다.' : 'Classification for lymphoma, severe anemia, and epilepsy.',
            subCategories: [
                {
                    name: isKo ? '림프계 암 및 뇌기능 장애' : 'Lymphatic & Brain Function',
                    items: [
                        { 
                            name: isKo ? '악성 림프종' : 'Malignant Lymphoma', 
                            code: 'C81-C85', 
                            riders: [...riders.CANCER, '고액암진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '림프종은 전신 질환으로 간주되어 대부분 고액암 담보에 해당합니다. 호지킨병과 비호지킨 림프종을 구분하되, 최근 CAR-T 세포 치료 등 초고가 항암제 사용 시 실손보험의 비급여 한도를 초과할 수 있으므로 지자체 지원금이나 제약사 환급 프로그램을 병행 검토해야 합니다.' : 'Lymphomas are systemic and usually count as high-amount cancers. CAR-T cell therapy costs may exceed Silbi limits; check for patient assistance programs.'
                        },
                        { 
                            name: isKo ? '재생불량성 빈혈' : 'Aplastic Anemia', 
                            code: 'D61', 
                            riders: ['중증재생불량성빈혈진단비', '조혈모세포이식수술비'], 
                            deepAnalysis: isKo ? '골수 기능 저하로 혈구 세포가 생성되지 않는 중증 질환입니다. "중증" 판정을 위한 골수 검사 수치(세포 충실도 25% 이하 등)를 면밀히 분석하여 일반 암에 준하는 고액의 진단비를 수령해야 합니다.' : 'Severe AA claims depend on bone marrow cellularity (under 25%). Ensure diagnostic criteria meet "Severe" status for high payouts.'
                        },
                        { 
                            name: isKo ? '뇌전증 (간질)' : 'Epilepsy', 
                            code: 'G40', 
                            riders: ['뇌전증진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '뇌전증은 발작 빈도와 약물 저항성에 따라 질병후유장해 판정이 가능합니다. 특히 운전이나 직업 활동의 제한이 클 경우, 이를 정신적/신경계 장해로 평가하여 보험금을 청구하는 전략이 유효합니다.' : 'Epilepsy can be rated for disability based on seizure frequency and drug resistance. Career or driving restrictions count towards neurological disability ratings.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Digestive_Complex',
            title: isKo ? '[K/C코드] 고난도 소화기 질환' : '[K/C-Code] Complex Digestive',
            shortTitle: isKo ? '간경변/기스트' : 'Liver/GIST',
            desc: isKo ? '간경변, 고난도 위장관 종양 및 췌장 질환 분류입니다.' : 'Classification for liver cirrhosis, GIST, and pancreatic diseases.',
            subCategories: [
                {
                    name: isKo ? '간/췌장 및 희귀 종양' : 'Liver/Pancreas & Rare Tumors',
                    items: [
                        { 
                            name: isKo ? '간의 경변증 (간경화)' : 'Liver Cirrhosis', 
                            code: 'K74', 
                            riders: ['간경변증진단비', '질병후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '간경변증은 Child-Pugh Class B 또는 C 판정 시 진단비 수령이 가능합니다. 특히 식도 정맥류나 복수 동반 시 질병후유장해 75% 이상에 해당하여 고액의 보험금을 수령할 수 있으므로 전문의의 기능 평가가 매우 중요합니다.' : 'Liver cirrhosis (Child-Pugh Class B/C) triggers diagnosis and high disability benefits. Esophageal varices or ascites may lead to 75%+ disability claims.'
                        },
                        { 
                            name: isKo ? '위장관 기질종양 (GIST)' : 'GIST', 
                            code: 'C49', 
                            riders: [...riders.CANCER, '유사암진단비'], 
                            deepAnalysis: isKo ? '기스트는 종양의 크기와 핵분열 수에 따라 보험사가 경계성 종양으로 처리하려 합니다. 하지만 WHO 분류 및 최신 병리학적 소견에 따라 모든 기스트는 악성 잠재력이 있음을 입증하여 일반암으로 청구해야 합니다.' : 'Insurers often classify GIST as borderline. Use WHO standards and mitotic counts to argue for malignant potential and full cancer benefits.'
                        },
                        { 
                            name: isKo ? '건선 (중증)' : 'Psoriasis (Severe)', 
                            code: 'L40', 
                            riders: ['실손의료비', '피부질환수술비'], 
                            deepAnalysis: isKo ? '중증 건선은 생물학적 제제(스테라라, 코센틱스 등) 주사가 필수적이나 회당 수백만 원에 달합니다. 산정특례 등록을 통해 환자 부담을 10%로 낮추고, 실손보험 통원 한도 문제를 해결하기 위해 입원 하에 주사 처방을 받는 전략이 필요합니다.' : 'Severe psoriasis biologics are expensive. Use "Special Medical Support" (10% co-pay) and consider inpatient dosing to maximize Silbi coverage.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Respiratory_Vascular',
            title: isKo ? '[J/I코드] 호흡기 및 혈관 질환' : '[J/I-Code] Resp & Vascular',
            shortTitle: isKo ? 'COPD/하지정맥' : 'COPD/Vein',
            desc: isKo ? '만성 폐질환 및 정맥류 분류입니다.' : 'Classification for chronic lung diseases and varicose veins.',
            subCategories: [
                {
                    name: isKo ? '기능 저하 및 순환 장애' : 'Function & Circulation',
                    items: [
                        { 
                            name: isKo ? '만성 폐쇄성 폐질환 (COPD)' : 'COPD', 
                            code: 'J44', 
                            riders: ['만성폐쇄성폐질환진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? 'COPD는 폐기능 검사(PFT) 수치상 FEV1/FVC 비율이 중요합니다. 고령자의 경우 이를 단순 노화로 치부하기 쉬우나, 흉복부 장해 분류표에 따라 영구적인 장해 보험금을 수령할 수 있는 대표적 질환입니다.' : 'COPD payouts depend on FEV1/FVC ratios. Do not mistake it for simple aging; it qualifies for permanent respiratory disability benefits.'
                        },
                        { 
                            name: isKo ? '다발성 경화증' : 'Multiple Sclerosis', 
                            code: 'G35', 
                            riders: ['다발성경화증진단비', '희귀난치성질환진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '다발성 경화증은 증상의 호전과 악화가 반복되는 특성이 있습니다. 진단비 수령 후에도 신경학적 결손 정도를 평가하여 뇌신경 장해 보험금을 추가로 청구해야 하며, 산정특례 혜택을 잊지 말아야 합니다.' : 'MS has cycles of remission and relapse. Beyond diagnosis benefits, claim for neurological disability and utilize rare disease medical support.'
                        },
                        { 
                            name: isKo ? '하지정맥류' : 'Varicose Veins', 
                            code: 'I83', 
                            riders: ['질병수술비', '실손의료비'], 
                            claimTips: isKo ? '초음파상 역류 시간이 0.5초 이상인지 확인하세요.' : 'Check for reflux > 0.5s on Echo.',
                            deepAnalysis: isKo ? '보험사는 미용 목적의 수술이라며 실비를 거부하려 합니다. 이를 방지하려면 도플러 초음파상 혈류 역류가 0.5초 이상 지속됨을 증명하는 영상 캡처와 함께 통증, 부종 등 의학적 필요성을 기록한 소견서가 필수입니다.' : 'Defend Silbi claims for EVLT/RFA via Doppler Echo evidence of reflux > 0.5s. Prove medical necessity over cosmetic reasons.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Pediatric_Skin_Trauma',
            title: isKo ? '[A/F/L/T코드] 소아·피부·외상' : '[A/F/L/T-Code] Pedi/Skin/Trauma',
            shortTitle: isKo ? '아토피/발달/화상' : 'Atopy/Fetal/Burn',
            desc: isKo ? '아토피, 발달지연 및 화상 분류입니다.' : 'Classification for atopy, developmental delays, and burns.',
            subCategories: [
                {
                    name: isKo ? '성장기 질환 및 사고' : 'Pediatric Care & Accidents',
                    items: [
                        { 
                            name: isKo ? '아토피 피부염' : 'Atopic Dermatitis', 
                            code: 'L20', 
                            riders: ['실손의료비', '피부질환수술비'], 
                            deepAnalysis: isKo ? '중증 아토피에 사용되는 듀피젠트는 고가 약제입니다. 보험사는 통원 한도를 이유로 삭감하려 하지만, 중증도(EASI 점수 등)를 근거로 입원 치료의 필수성을 주장하여 실비 보전 범위를 넓혀야 합니다.' : 'Dupixent is expensive. Use EASI scores to justify inpatient treatment over outpatient limits for better Silbi reimbursement.'
                        },
                        { 
                            name: isKo ? '발달장애 (자폐증 등)' : 'Autism/Developmental', 
                            code: 'F84', 
                            riders: ['어린이생활질환진단비', '발달지연치료비(특약)'], 
                            deepAnalysis: isKo ? '발달 지연은 F코드 진단 시 실비 보상이 어려울 수 있으나, 진단 전 R62(성장지연) 단계에서 시행한 검사나 언어 치료는 보상이 가능할 수 있습니다. 코드 부여 시점과 약관의 소급 적용 여부를 정밀 분석해야 합니다.' : 'Developmental delays under F84 face Silbi exclusions. However, tests/therapy during the R62 stage can often be claimed. Analyze the timing of code assignment.'
                        },
                        { 
                            name: isKo ? '심재성 2도/3도 화상' : 'Severe Burns', 
                            code: 'T20-T32', 
                            riders: ['화상진단비', '상해흉터복원수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '단순 화상과 달리 "심재성" 또는 "3도" 화상은 피부 이식이나 흉터 복원 수술이 필수입니다. 진단비 수령은 물론, 수술 후 관절 구축 등으로 인한 상해후유장해 가능성을 반드시 열어두어야 합니다.' : 'Deep 2nd/3rd degree burns require skin grafts. Claim diagnosis benefits and evaluate for potential permanent disability from joint contractures.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Sensory_Sleep_Reflux',
            title: isKo ? '[H/G/K코드] 감각기·수면·식도' : '[H/G/K-Code] Sensory/Sleep/Reflux',
            shortTitle: isKo ? '난청/수면/식도염' : 'Ear/Sleep/GERD',
            desc: isKo ? '난청, 수면 장애 및 식도염 분류입니다.' : 'Classification for hearing loss, sleep apnea, and reflux.',
            subCategories: [
                {
                    name: isKo ? '일상 기능 및 생활 질환' : 'Functional & Lifestyle',
                    items: [
                        { 
                            name: isKo ? '감각신경성 난청' : 'Hearing Loss', 
                            code: 'H90', 
                            riders: ['청각장애진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '난청은 순음청력검사상 손실 정도(dB)가 중요합니다. 양쪽 귀의 손실 합계에 따라 질병후유장해 5~80%에 해당할 수 있으며, 직업적 소음 노출이 입증된다면 상해후유장해로의 전환도 검토해야 합니다.' : 'Hearing loss claims are based on decibel loss. It qualifies for 5-80% disability. If occupational noise is a factor, consider injury-based disability claims.'
                        },
                        { 
                            name: isKo ? '수면 무호흡증' : 'Sleep Apnea', 
                            code: 'G47.3', 
                            riders: ['실손의료비', '이비인후과수술비'], 
                            deepAnalysis: isKo ? '수면다원검사 결과 RDI 지수가 일정 수준 이상이면 양압기 대여비가 건강보험 적용을 받습니다. 보험사는 수술을 "단순 코골이 교정"으로 보려 하지만, 무호흡으로 인한 심혈관 위험을 근거로 치료 목적임을 강조해야 합니다.' : 'If the RDI index is high, C-PAP rentals are covered. Counter "simple snoring" denials by highlighting cardiovascular risks from apnea.'
                        },
                        { 
                            name: isKo ? '역류성 식도염' : 'GERD', 
                            code: 'K21', 
                            riders: ['실손의료비', '위십이지장궤양진단비'], 
                            deepAnalysis: isKo ? '내시경 검사상 식도 하부의 미란(Erosion)이나 궤양이 확인되어야 합니다. 바렛 식도(Barrett\'s esophagus)로 진행 시 식도암(C15)의 전구 질환으로 간주되어 정기적인 추적 관찰 비용의 실비 정당성이 확보됩니다.' : 'Endoscopic evidence of lower esophageal erosion is key. Progression to Barrett\'s esophagus justifies ongoing Silbi for follow-ups as a pre-cancerous state.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Chronic_Vision_Skin',
            title: isKo ? '[H/M/D/L코드] 만성·시각·피부' : '[H/M/D/L-Code] Chronic/Vision/Skin',
            shortTitle: isKo ? '녹내장/통풍/빈혈' : 'Eye/Gout/Anemia',
            desc: isKo ? '녹내장, 통풍, 빈혈 및 염증성 피부 질환입니다.' : 'Classification for glaucoma, gout, anemia, and skin inflammation.',
            subCategories: [
                {
                    name: isKo ? '장기 관리 및 면역 질환' : 'Long-term & Immune',
                    items: [
                        { 
                            name: isKo ? '녹내장' : 'Glaucoma', 
                            code: 'H40', 
                            riders: ['시각장애진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '녹내장은 시야 결손 정도에 따라 장해 등급이 결정됩니다. 안압 조절을 위한 장기적인 약물 처방 비용은 실비 보상의 핵심이며, 말기 녹내장으로 진행 시 시력 상실에 따른 고액의 후유장해 보험금을 놓치지 말아야 합니다.' : 'Glaucoma payouts are based on visual field loss. Long-term eye drop costs are covered by Silbi. Advanced cases leading to blindness qualify for major disability benefits.'
                        },
                        { 
                            name: isKo ? '통풍' : 'Gout', 
                            code: 'M10', 
                            riders: ['통풍진단비', '실손의료비'], 
                            deepAnalysis: isKo ? '통풍 발작 시 급성 통증으로 인한 응급실 내원 및 입원 치료는 실비 보상이 가능합니다. 요산 수치 조절 실패로 인한 만성 신부전(N18) 합병증 발생 시, 인과관계를 입증하여 추가적인 진단비를 확보해야 합니다.' : 'Acute gout attacks justify ER visits and inpatient Silbi. If it leads to chronic kidney failure (N18), link the two for additional diagnostic benefits.'
                        },
                        { 
                            name: isKo ? '철결핍성 빈혈' : 'Iron Deficiency Anemia', 
                            code: 'D50', 
                            riders: ['실손의료비'], 
                            deepAnalysis: isKo ? '철분 주사제(페린젝트)는 고가이므로 보험사가 심사 기준(Hb 10 이하 등)을 까다롭게 적용합니다. 수치가 기준보다 높더라도 임상적 증상(어지러움 등)이 심해 투여가 불가피했음을 의사 소견으로 증명해야 합니다.' : 'High-cost iron injections (Ferinject) face strict Hb level audits. Use clinical symptoms (vertigo) to justify treatment even if Hb levels are borderline.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Lifestyle_Preventive',
            title: isKo ? '[E/J/M코드] 생활 습관 및 예방' : '[E/J/M-Code] Lifestyle/Preventive',
            shortTitle: isKo ? '비염/고지혈증/골다공증' : 'Rhinitis/Lipid/Bone',
            desc: isKo ? '비염, 고지혈증 및 골다공증 분류입니다.' : 'Classification for rhinitis, dyslipidemia, and osteoporosis.',
            subCategories: [
                {
                    name: isKo ? '만성 질환 관리' : 'Chronic Care',
                    items: [
                        { 
                            name: isKo ? '알레르기성 비염' : 'Allergic Rhinitis', 
                            code: 'J30', 
                            riders: ['이비인후과수술비', '실손의료비'], 
                            deepAnalysis: isKo ? '비염 치료인 면역 요법(주사/설하정)은 장기적인 실비 청구가 가능합니다. 코블레이터 수술이나 비중격 교정술 동반 시, 수술의 목적이 "기능 개선"임을 명확히 하여 보험사의 면책 주장을 방어해야 합니다.' : 'Immunotherapy for rhinitis is covered by Silbi long-term. Ensure surgeries like septoplasty are documented as "functional improvement" to counter insurer denials.'
                        },
                        { 
                            name: isKo ? '이상지질혈증 (고지혈증)' : 'Dyslipidemia', 
                            code: 'E78', 
                            riders: ['심혈관질환진단비', '뇌혈관질환진단비'], 
                            deepAnalysis: isKo ? '고지혈증 자체는 진단비가 적으나, 이로 인한 경동맥 협착(I67.2)은 뇌혈관 진단비의 핵심입니다. 초음파상 혈관벽 두께와 플라크 형성 여부를 주기적으로 체크하여 진단비 청구 시점을 잡아야 합니다.' : 'Dyslipidemia leads to carotid stenosis (I67.2), a core for brain vascular claims. Monitor vessel thickness and plaques for timely diagnosis benefits.'
                        },
                        { 
                            name: isKo ? '골다공증' : 'Osteoporosis', 
                            code: 'M81', 
                            riders: ['골절진단비', '상해후유장해(감액쟁점)'], 
                            deepAnalysis: isKo ? '골다공증 환자가 골절(S코드)을 입으면 보험사는 기왕증을 이유로 보험금을 50% 이상 삭감하려 합니다. T-score 수치가 -2.5 이하인 경우 사고의 기여도를 논리적으로 입증하는 손해사정 전략이 필수입니다.' : 'Osteoporosis leads to heavy payout reductions in fracture claims. If T-score < -2.5, a logic-based strategy to prove accident contribution is mandatory.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Pain_Common_Digestive',
            title: isKo ? '[G/M/K/S코드] 통증 및 다빈도 소화기' : '[G/M/K/S-Code] Pain/Digestive/Trauma',
            shortTitle: isKo ? '편두통/어깨/위염' : 'Migraine/Shoulder',
            desc: isKo ? '편두통, 어깨 병변 및 위염 분류입니다.' : 'Classification for migraines, shoulder lesions, and gastritis.',
            subCategories: [
                {
                    name: isKo ? '통증 관리 및 소아 상해' : 'Pain & Pedi Trauma',
                    items: [
                        { 
                            name: isKo ? '편두통' : 'Migraine', 
                            code: 'G43', 
                            riders: ['실손의료비', '대상포진진단비(감별)'], 
                            deepAnalysis: isKo ? '만성 편두통 치료용 CGRP 주사제(앰겔러티 등)는 고가입니다. 보험사는 통원 한도를 이유로 삭감하려 하지만, 과거 약물 치료(트립탄 계열 등)에 실패했음을 증명하여 입원 하 투여의 정당성을 확보해야 합니다.' : 'Expensive CGRP injections (Emgality) are covered by Silbi. Prove past drug failures (Triptans) to justify inpatient dosing against outpatient limits.'
                        },
                        { 
                            name: isKo ? '회전근개 파열 / 오십견' : 'Rotator Cuff / Frozen Shoulder', 
                            code: 'M75', 
                            riders: ['질병수술비', '상해후유장해'], 
                            deepAnalysis: isKo ? '회전근개 봉합술 시 기왕증 감액이 빈번합니다. 사고로 인한 급성 파열임을 MRI상 부종이나 출혈 소견으로 입증해야 하며, 수술 후 관절 가동 범위 제한에 따른 후유장해 보험금을 반드시 체크해야 합니다.' : 'Suture of rotator cuffs often face degenerative reductions. Use MRI edema/bleeding evidence for acute trauma claims and check for range-of-motion disability benefits.'
                        },
                        { 
                            name: isKo ? '소아 팔뚝 골절' : 'Forearm Fracture (Pedi)', 
                            code: 'S52', 
                            riders: ['골절진단비', '성장판손상진단비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '소아 골절에서 가장 중요한 것은 성장판(Growth Plate) 침범 여부입니다. 단순 골절보다 높은 상해후유장해 지급률이 적용될 수 있으며, 추후 성장 비대칭 발생 시 추가적인 보상이 가능함을 인지해야 합니다.' : 'Growth plate involvement is key in pediatric fractures. It leads to higher disability rates and potential claims for future growth asymmetry.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Endocrine_Respiratory_Knee',
            title: isKo ? '[E/J/M/S코드] 내분비·호흡기·무릎' : '[E/J/M/S-Code] Endo/Resp/Knee',
            shortTitle: isKo ? '1형당뇨/천식/무릎' : 'Type1DM/Asthma/Knee',
            desc: isKo ? '1형 당뇨, 천식 및 무릎 손상 분류입니다.' : 'Classification for Type 1 DM, asthma, and knee injuries.',
            subCategories: [
                {
                    name: isKo ? '생활 관리 및 운동 상해' : 'Life Care & Sports Trauma',
                    items: [
                        { 
                            name: isKo ? '제1형 당뇨병' : 'Type 1 Diabetes', 
                            code: 'E10', 
                            riders: ['질병후유장해', '중증당뇨합병증진단비'], 
                            deepAnalysis: isKo ? '1형 당뇨 환자는 인슐린 펌프 및 연속혈당측정기 소모품 비용이 상당합니다. 건강보험 공단 환급 후 본인부담금에 대해 실손보험 청구가 가능하며, 합병증으로 인한 췌장 이식 수술 시 고액의 수술비 수령 여부를 확인해야 합니다.' : 'Type 1 DM requires insulin pumps/CGM. Silbi covers co-pays after NHIS refunds. Check for major surgical benefits if pancreatic transplant is needed due to complications.'
                        },
                        { 
                            name: isKo ? '천식' : 'Asthma', 
                            code: 'J45', 
                            riders: ['환경성질환입원일당', '실손의료비'], 
                            deepAnalysis: isKo ? '중증 천식 생물학적 제제(졸레어 등)는 고가입니다. 보험사는 통원 한도를 주장하나, 급성 발작(Exacerbation) 위험을 근거로 입원 투여의 필수성을 주장해야 합니다. 또한 환경성 질환 입원 일당 특약이 있다면 추가 수령이 가능합니다.' : 'Expensive biologics (Xolair) for severe asthma are covered. Justify inpatient dosing via acute exacerbation risks and check for environmental disease inpatient riders.'
                        },
                        { 
                            name: isKo ? '무릎 반월상 연골/인대 파열' : 'Meniscus/ACL Tear', 
                            code: 'M23/S83', 
                            riders: ['상해수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '무릎 부상은 수술 후에도 "동요(Instability)"가 남는 경우가 많습니다. KT-2000 검사 등을 통해 무릎이 밀리는 정도(5mm/10mm/15mm)를 측정하여 상해후유장해 5~20% 보험금을 수령하는 것이 고액 보상의 핵심입니다.' : 'Knee injuries often leave permanent instability. Measure laxity (5mm+) via KT-2000 tests to claim 5-20% injury disability benefits, which often exceed surgical payouts.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Rare_Facial_Metabolic',
            title: isKo ? '[K/S/E코드] 희귀장질환·안면외상·비만' : '[K/S/E-Code] Crohn/Face/Obesity',
            shortTitle: isKo ? '크론병/안면골절/비만' : 'Crohn/Face/Obesity',
            desc: isKo ? '크론병, 안면 골절 및 비만 대사 수술 분류입니다.' : 'Classification for Crohn\'s, facial fractures, and obesity surgery.',
            subCategories: [
                {
                    name: isKo ? '특수 질환 및 외상' : 'Special Diseases & Trauma',
                    items: [
                        { 
                            name: isKo ? '크론병' : 'Crohn\'s Disease', 
                            code: 'K50', 
                            riders: ['희귀난치성질환진단비', '질병후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '크론병은 평생 관리가 필요한 희귀난치성 질환(V131)으로 실비 본인부담금이 10%로 경감됩니다. 장기화로 인한 장 절제나 누공 발생 시 질병후유장해 수령이 가능하며, 가입 시 고지 의무 위반 쟁점이 없는지 전문가의 검토가 필수입니다.' : 'Crohn\'s is a rare disease (V131) with 10% co-pay benefits. Bowel resection or fistula can trigger disability claims. Check for pre-existing disclosure disputes.'
                        },
                        { 
                            name: isKo ? '코뼈 및 안면골 골절' : 'Nasal & Facial Fracture', 
                            code: 'S02', 
                            riders: ['골절진단비', '상해수술비', '상해후유장해(외모)'], 
                            deepAnalysis: isKo ? '안면 골절은 뼈의 결합보다 "외모의 흉터(추상장해)"가 더 큰 보상 항목이 될 수 있습니다. 여성의 경우 5cm 이상의 흉터 시 15% 이상의 상해후유장해 수령이 가능하며, 기능적 복원을 위한 성형 수술비의 상해 인정 여부가 핵심입니다.' : 'Facial fractures often lead to "Disfigurement Disability" claims. Scars > 5cm (especially for females) can trigger 15%+ disability benefits. Prove functional restoration for plastic surgery coverage.'
                        },
                        { 
                            name: isKo ? '비만 (비만 대사 수술)' : 'Obesity (Metabolic Surgery)', 
                            code: 'E66', 
                            riders: ['실손의료비', '질병수술비'], 
                            deepAnalysis: isKo ? '단순 비만은 실비 면책이나, 체질량지수(BMI) 35 이상이거나 30 이상이면서 동반 질환(당뇨, 고혈압 등)이 있는 경우 시행하는 위절제술 등은 건강보험 및 실비 보상이 가능합니다. "치료 목적"임을 입증하는 것이 핵심입니다.' : 'Simple obesity is excluded. However, BMI > 35 or > 30 with comorbidities allows for metabolic surgery coverage under NHIS and Silbi as "medical treatment".'
                        }
                    ]
                }
            ]
        },
        {
            id: 'DiabeticFoot_Vascular_Nerve',
            title: isKo ? '[E/I/G코드] 당뇨합병증·혈관·말초신경' : '[E/I/G-Code] Foot/Vascular/Nerve',
            shortTitle: isKo ? '당뇨발/말초동맥/손목터널' : 'Foot/PAD/Carpal',
            desc: isKo ? '당뇨발, 말초동맥 질환 및 손목터널 증후군 분류입니다.' : 'Classification for diabetic foot, PAD, and carpal tunnel syndrome.',
            subCategories: [
                {
                    name: isKo ? '말초 순환 및 신경 압박' : 'Peripheral & Nerve Compression',
                    items: [
                        { 
                            name: isKo ? '당뇨병성 족부 질환 (당뇨발)' : 'Diabetic Foot', 
                            code: 'E11.5', 
                            riders: ['질병후유장해(고액)', '중증당뇨합병증진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '당뇨발은 괴사 부위 절단 시 가입금액의 10~60%에 달하는 고액의 질병후유장해가 발생합니다. 단순 창상 치료가 아닌 혈관 폐쇄에 의한 불가피한 절단임을 입증해야 하며, 의족/보조기 비용에 대한 실비 지원 여부를 확인해야 합니다.' : 'Diabetic foot amputation triggers 10-60% disability benefits. Prove medical necessity via vascular occlusion evidence. Check for prosthetic support in policies.'
                        },
                        { 
                            name: isKo ? '말초동맥 죽상경화증' : 'Peripheral Artery Disease (PAD)', 
                            code: 'I70', 
                            riders: ['심혈관질환수술비', '실손의료비'], 
                            deepAnalysis: isKo ? '다리 혈관 협착 시 스텐트 삽입술은 심장질환 수술비 담보에서 보상되지 않는 경우가 많습니다. "기타 혈관 수술비"나 "질병수술비"에서 수령해야 하며, 보행 장애(파행) 수치를 근거로 치료의 시급성을 주장해야 합니다.' : 'PAD stent procedures are often excluded from heart-specific riders. Claim via "Other Vascular" or general "Disease Surgery" riders based on claudication severity.'
                        },
                        { 
                            name: isKo ? '손목터널 증후군' : 'Carpal Tunnel Syndrome', 
                            code: 'G56', 
                            riders: ['질병수술비', '1-5종수술비'], 
                            deepAnalysis: isKo ? '수근관 증후군은 근전도 검사(EMG) 수치가 핵심입니다. 직업성 질환으로 분류될 경우 실비에서 보상이 까다로울 수 있으나, 가사 노동이나 일상 활동 중 발생한 질병임을 강조하여 수술비와 실비를 전액 보상받아야 합니다.' : 'Carpal tunnel claims rely on EMG results. If insurers tag it as "occupational", emphasize daily life activities to secure full disease surgery and Silbi benefits.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Mental_Balance_BrainTrauma',
            title: isKo ? '[F/H/S코드] 정신건강·평형·뇌손상' : '[F/H/S-Code] Mental/Balance/TBI',
            shortTitle: isKo ? '공황장애/이석증/뇌후유증' : 'Panic/Vertigo/TBI',
            desc: isKo ? '공황장애, 어지럼증 및 뇌손상 후유증 분류입니다.' : 'Classification for panic disorder, vertigo, and TBI sequels.',
            subCategories: [
                {
                    name: isKo ? '심리 및 신경계 보상' : 'Psych & Neuro Claims',
                    items: [
                        { 
                            name: isKo ? '공황장애' : 'Panic Disorder', 
                            code: 'F41.0', 
                            riders: ['정신질환치료비', '실손의료비(조건부)'], 
                            deepAnalysis: isKo ? '공황 발작 시 응급실에서 시행한 심혈관계 검사비는 실비 보상이 가능합니다. 정신과 확진 이후의 상담료는 2016년 이후 실비에서 보장하되, 진단 전 신체 증상으로 인한 검사 기록을 잘 보존하여 보상 근거로 삼아야 합니다.' : 'ER costs for heart tests during panic attacks are covered by Silbi. Counseling is covered for post-2016 policies. Preserve early somatic symptom records for claim evidence.'
                        },
                        { 
                            name: isKo ? '이석증 및 어지럼증' : 'Vertigo / BPPV', 
                            code: 'H81', 
                            riders: ['질병후유장해(평형기능)', '실손의료비'], 
                            deepAnalysis: isKo ? '어지럼증이 6개월 이상 지속되어 일상생활에 지장이 있다면 귀의 "평형기능 장해"로 10% 이상의 질병후유장해 청구가 가능합니다. 안구 운동 검사(VNG) 등 객관적 수치를 확보하는 것이 관건입니다.' : 'Persistent vertigo for 6+ months qualifies for 10%+ balance disability. Secure objective data via VNG (Video Nystagmography) for successful claims.'
                        },
                        { 
                            name: isKo ? '외상성 뇌손상 (TBI) 후유증' : 'TBI Sequelae', 
                            code: 'S06', 
                            riders: ['상해후유장해(정신행동)', '간병인사용일당'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '뇌진탕 후 증후군이나 인지 장애는 사고와의 인과관계 입증이 어렵습니다. 하지만 신경심리검사(SNSB 등)를 통해 뇌기능 저하를 수치화하면 상해후유장해 5~100% 수령이 가능하므로 사고 초기부터 신경외과 협진이 필수입니다.' : 'Post-concussion cognitive issues require quantification via SNSB tests. Secure 5-100% injury disability via neurological mapping and early multi-specialty consults.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Hereditary_Bone_Thyroiditis',
            title: isKo ? '[G/M/E/Q코드] 유전질환·골절·갑상선염' : '[G/M/E/Q-Code] Rare/Bone/Thyroid',
            shortTitle: isKo ? 'CMT/병적골절/하시모토' : 'CMT/Bone/Hashimoto',
            desc: isKo ? '샤르코-마리-투스, 병적 골절 및 하시모토 갑상선염 분류입니다.' : 'Classification for CMT, pathological fractures, and Hashimoto\'s.',
            subCategories: [
                {
                    name: isKo ? '희귀 및 골대사 질환' : 'Rare & Bone Metabolism',
                    items: [
                        { 
                            name: isKo ? '샤르코-마리-투스 (CMT)' : 'Charcot-Marie-Tooth', 
                            code: 'G60.0', 
                            riders: ['희귀난치성질환진단비', '질병후유장해(사지)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? 'CMT는 사지 근육 위축으로 인한 보행 장애가 발생합니다. 유전성 질환이라도 성인기에 발현된 경우 가입 전 발병 여부를 보험사가 입증하지 못하면 진단비와 고액의 질병후유장해(50~100%) 수령이 가능합니다.' : 'CMT causes limb atrophy. Even if hereditary, insurers must prove pre-policy onset to deny claims. Payouts for 50-100% disability are possible if onset is post-coverage.'
                        },
                        { 
                            name: isKo ? '병적 골절을 동반한 골다공증' : 'Osteoporosis w/ Fracture', 
                            code: 'M80', 
                            riders: ['골절진단비', '질병수술비', '상해수술비'], 
                            deepAnalysis: isKo ? '작은 충격에도 발생하는 병적 골절은 상해와 질병의 성격을 동시에 갖습니다. 보험사가 기왕증 100%를 주장하며 상해 보험금을 거절할 때, 외부 충격의 기여도를 10%라도 입증하여 상해 담보를 일부라도 수령하는 전략이 유효합니다.' : 'Pathological fractures share disease and injury traits. Counter 100% degenerative denials by proving even minor external impact contribution for partial injury benefits.'
                        },
                        { 
                            name: isKo ? '하시모토 갑상선염' : 'Hashimoto\'s Thyroiditis', 
                            code: 'E06.3', 
                            riders: ['실손의료비', '특정질병수술비'], 
                            deepAnalysis: isKo ? '갑상선 기능 저하증의 가장 큰 원인입니다. 자가항체 검사(Anti-TPO 등)를 통해 확진하며, 만성적인 염증 상태로 인해 향후 갑상선 결절(D34)이나 암(C73) 발생 시 인과관계 면책 쟁점이 발생하지 않도록 관리해야 합니다.' : 'The leading cause of hypothyroidism. Confirm via anti-TPO tests. Manage chronic inflammation carefully to avoid "pre-existing" disputes if nodules or cancer develop later.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Fabry_Colitis_Spine',
            title: isKo ? '[E/K/S코드] 희귀대사·궤양성장염·경추' : '[E/K/S-Code] Fabry/Colitis/Spine',
            shortTitle: isKo ? '파브리병/궤양성대장염/목골절' : 'Fabry/UC/Neck',
            desc: isKo ? '파브리병, 궤양성 대장염 및 경추 골절 분류입니다.' : 'Classification for Fabry disease, ulcerative colitis, and cervical fractures.',
            subCategories: [
                {
                    name: isKo ? '중증 희귀 및 척추 손상' : 'Severe Rare & Spinal Trauma',
                    items: [
                        { 
                            name: isKo ? '파브리병' : 'Fabry Disease', 
                            code: 'E88.8', 
                            riders: ['희귀난치성질환진단비', '질병후유장해(심장/신장)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '파브리병은 효소 결핍으로 인해 전신 장기가 손상됩니다. 고가의 효소 대체 요법은 실비 보상의 핵심이며, 심비대나 단백뇨 발생 시 각각 심장과 신장의 장해로 평가하여 합산 50% 이상의 고액 장해 보험금 수령이 가능합니다.' : 'Fabry disease requires life-long enzyme therapy covered by Silbi. Heart/kidney complications can lead to 50%+ combined disability payouts.'
                        },
                        { 
                            name: isKo ? '궤양성 대장염' : 'Ulcerative Colitis', 
                            code: 'K51', 
                            riders: ['희귀난치성질환진단비', '질병수술비'], 
                            deepAnalysis: isKo ? '대장 전절제술 시행 시 질병후유장해 75~100%에 해당합니다. 생물학적 제제 사용 중 내성이 생겨 수술로 이행되는 과정을 의학적으로 증명하여 장해 보험금을 확보해야 하며, 산정특례 혜택을 반드시 유지해야 합니다.' : 'Total colectomy for UC triggers 75-100% disability. Document the failure of biologics to justify surgery and maximize claims while maintaining special medical support.'
                        },
                        { 
                            name: isKo ? '경추 골절 및 탈구' : 'Cervical Spine Fracture', 
                            code: 'S12', 
                            riders: ['상해후유장해(고액)', '간병인사용일당'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '목뼈 골절은 신경 손상(사지 마비) 위험이 매우 높습니다. 마비가 남을 경우 상해후유장해 100%와 함께 향후 개호비(간병비)를 일시금으로 청구하는 "L-M 방식"의 손해배상 산정이 보상의 핵심입니다.' : 'Neck fractures often cause paralysis. Claim 100% injury disability plus future care costs (Lump sum via L-M method) for successful high-value outcomes.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'NeuroPedi_Shoulder_Endo',
            title: isKo ? '[G/S/E코드] 뇌성마비·어깨골절·항진증' : '[G/S/E-Code] Palsy/Shoulder/Graves',
            shortTitle: isKo ? '뇌성마비/어깨골절/그레이브스' : 'Palsy/Shoulder/Graves',
            desc: isKo ? '뇌성마비, 어깨 골절 및 갑상선 기능 항진증 분류입니다.' : 'Classification for cerebral palsy, shoulder fractures, and hyperthyroidism.',
            subCategories: [
                {
                    name: isKo ? '소아 신경 및 성인 외상' : 'Pedi Neuro & Adult Trauma',
                    items: [
                        { 
                            name: isKo ? '뇌성마비' : 'Cerebral Palsy', 
                            code: 'G80', 
                            riders: ['뇌성마비진단비', '질병후유장해(뇌병변)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '뇌성마비는 진단 시점이 중요합니다. 보통 만 2세 이후 확진을 요구하는 경우가 많으나, 조기에 운동 지연이 명확할 경우 선제적으로 질병후유장해를 청구해야 합니다. 출산 시 저산소증 등 상해 기전이 있다면 상해후유장해로의 전환도 검토해야 합니다.' : 'Timing is key for CP. While insurers wait for age 2, claim early if motor delays are clear. If hypoxia during birth is documented, consider injury-based disability claims.'
                        },
                        { 
                            name: isKo ? '상완골(어깨) 골절' : 'Humeral Fracture', 
                            code: 'S42', 
                            riders: ['골절진단비', '상해수술비', '상해후유장해'], 
                            deepAnalysis: isKo ? '상완골 근위부 골절은 어깨 관절의 가동 범위를 크게 제한합니다. 수술 후 6개월 시점에 각도 측정을 통해 5~20%의 상해후유장해 수령이 가능하며, 상완신경총 손상 동반 시 마비 장해까지 합산하여 고액 보상이 가능합니다.' : 'Proximal humeral fractures limit shoulder mobility. Secure 5-20% disability via ROM tests at 6 months post-surgery. Check for brachial plexus injury for additional nerve palsy claims.'
                        },
                        { 
                            name: isKo ? '갑상선 기능 항진증' : 'Hyperthyroidism', 
                            code: 'E05', 
                            riders: ['실손의료비', '특정질병수술비'], 
                            deepAnalysis: isKo ? '바세도우병(그레이브스병)으로 인한 안구 돌출은 외모 변화뿐만 아니라 시력 저하를 유발합니다. 안와감압술 시행 시 이를 "치료 목적의 수술"로 입증하여 실비 및 수술비를 수령해야 하며, 약물 부작용인 무과립구증 발생 시 입원비 청구도 놓치지 말아야 합니다.' : 'Graves\' eye disease requires orbital decompression. Prove it as "medical treatment" for full benefits. Watch for agranulocytosis side effects for inpatient claims.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'ADHD_FacialPalsy_Hip',
            title: isKo ? '[F/G/S코드] ADHD·안면마비·고관절' : '[F/G/S-Code] ADHD/Bell/Hip',
            shortTitle: isKo ? 'ADHD/안면마비/고관절골절' : 'ADHD/Bell/Hip',
            desc: isKo ? 'ADHD, 안면 마비 및 고관절 골절 분류입니다.' : 'Classification for ADHD, Bell\'s palsy, and hip fractures.',
            subCategories: [
                {
                    name: isKo ? '소아 발달 및 노인 외상' : 'Pedi Development & Elderly Trauma',
                    items: [
                        { 
                            name: isKo ? 'ADHD (주의력 결핍)' : 'ADHD', 
                            code: 'F90', 
                            riders: ['실손의료비(2016년이후)', '소아정신질환특약'], 
                            deepAnalysis: isKo ? 'ADHD는 2016년 이후 실손보험 가입자라면 급여 항목에 한해 보상이 가능합니다. 단순 산만함이 아닌 임상적 진단 기준(DSM-5 등)을 충족했음을 증명해야 하며, 상담료와 약제비 청구를 체계적으로 관리해야 합니다.' : 'ADHD is covered under Silbi (post-2016) for NHIS co-pays. Prove medical necessity via DSM-5 criteria. Manage counseling and drug costs systematically.'
                        },
                        { 
                            name: isKo ? '안면신경 마비 (벨 마비)' : 'Bell\'s Palsy', 
                            code: 'G51', 
                            riders: ['질병후유장해(안면)', '실손의료비'], 
                            deepAnalysis: isKo ? '벨 마비는 초기 골든타임 내 스테로이드 투여가 핵심입니다. 6개월 후에도 완치되지 않고 입을 벌리거나 눈을 감는 데 지장이 있다면 "외모의 추상장해"가 아닌 "신경계 장해"로 보아 보험금을 청구할 수 있습니다.' : 'Bell\'s palsy needs early steroids. If symptoms persist for 6 months, claim via "Neurological Disability" instead of just "Disfigurement" for higher payouts.'
                        },
                        { 
                            name: isKo ? '대퇴골 (고관절) 골절' : 'Hip Fracture', 
                            code: 'S72', 
                            riders: ['상해후유장해(고액)', '골절진단비', '인공관절치환술수술비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '고관절 골절은 고관절 골절은 고령자에게 치명적입니다. 인공관절 수술 시 상해후유장해 30%가 확정되나, 보험사는 골다공증을 이유로 50% 이상 감액하려 합니다. 사고 기여도를 높여 삭감을 방어하고 장기 요양 등급 판정을 병행해야 합니다.' : 'Hip fractures often lead to 30% disability after replacement surgery. Counter 50%+ osteoporosis-based reductions by proving accident impact. Coordinate with Long-term Care Grade applications.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'SMA_Congenital_Chest',
            title: isKo ? '[G/E/S코드] SMA·선천갑상선·흉부외상' : '[G/E/S-Code] SMA/Hypo/Chest',
            shortTitle: isKo ? 'SMA/선천갑상선/갈비뼈골절' : 'SMA/Hypo/Rib',
            desc: isKo ? '척수성 근위축증, 선천성 갑상선 저하증 및 갈비뼈 골절 분류입니다.' : 'Classification for SMA, congenital hypothyroidism, and rib fractures.',
            subCategories: [
                {
                    name: isKo ? '희귀 유전 및 흉부 손상' : 'Rare Genetic & Chest Trauma',
                    items: [
                        { 
                            name: isKo ? '척수성 근위축증 (SMA)' : 'SMA', 
                            code: 'G12.1', 
                            riders: ['희귀난치성질환진단비', '질병후유장해(100%)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? 'SMA는 졸겐스마 등 초고가 치료제가 사용됩니다. 건강보험 급여 적용 후에도 남는 본인부담금 상한제 환급금과 실손보험의 관계를 정밀하게 따져야 하며, 신경계 퇴행으로 인한 전신 장해를 꼼꼼히 평가하여 보험금을 극대화해야 합니다.' : 'SMA involves ultra-expensive drugs like Zolgensma. Analyze the relationship between NHIS co-pay caps and Silbi. Evaluate systemic neurological decline for maximum disability payouts.'
                        },
                        { 
                            name: isKo ? '선천성 갑상선 저하증' : 'Congenital Hypothyroidism', 
                            code: 'E03.1', 
                            riders: ['어린이생활질환진단비', '실손의료비'], 
                            deepAnalysis: isKo ? '신생아 선별 검사에서 발견됩니다. Q코드(선천기형)가 아닌 E코드(내분비)로 분류되어 실비 보상이 수월한 편이나, 보험사가 선천성 요인을 이유로 거절할 경우 "질병의 확정 시점" 논리로 대응해야 합니다.' : 'Found in newborn screenings. E-code status makes Silbi easier than Q-codes. If denied due to "congenital nature", use the "Date of Definitive Diagnosis" logic to secure benefits.'
                        },
                        { 
                            name: isKo ? '갈비뼈 및 흉골 골절' : 'Rib & Sternum Fracture', 
                            code: 'S22', 
                            riders: ['골절진단비(다발성)', '상해수술비', '상해후유장해'], 
                            deepAnalysis: isKo ? '갈비뼈 골절은 갯수에 관계없이 사고 1회당 지급되는 골절 진단비 특성이 있습니다. 다만, 골절 파편이 폐를 찔러 기흉(S27)이 발생한 경우, 흉곽의 팽창 부전 등 폐 기능 장해로 인한 후유장해 청구를 반드시 검토해야 합니다.' : 'Rib fractures pay per accident regardless of count. However, if bone fragments cause pneumothorax (S27), claim for permanent lung function disability due to impaired chest expansion.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'GSD_Eosinophilic_Foot',
            title: isKo ? '[E/K/S코드] 당원병·호산구염·발골절' : '[E/K/S-Code] GSD/Eos/Foot',
            shortTitle: isKo ? '당원병/호산구위장염/발뒤꿈치골절' : 'GSD/Eos/Foot',
            desc: isKo ? '당원병, 호산구 위장염 및 발 골절 분류입니다.' : 'Classification for GSD, eosinophilic gastritis, and foot fractures.',
            subCategories: [
                {
                    name: isKo ? '희귀 대사 및 하지 상해' : 'Rare Metabolic & Lower Limb Trauma',
                    items: [
                        { 
                            name: isKo ? '당원병 (글리코겐 저장 질환)' : 'GSD', 
                            code: 'E74.0', 
                            riders: ['희귀난치성질환진단비', '질병수술비'], 
                            deepAnalysis: isKo ? '당원병은 저혈당 방지를 위한 옥수수 전분 구입비 등 생활 밀착형 비용이 큽니다. 비급여 약제나 소모품 실비 청구 시 "치료의 필수성"을 의사 소견으로 입증해야 하며, 성인기 간 종양 발생 시 간암(C22)과의 인과관계 보상을 준비해야 합니다.' : 'GSD requires constant starch/dietary management. Prove "medical necessity" for Silbi claims on non-covered items. Prepare for potential liver cancer (C22) link in adulthood.'
                        },
                        { 
                            name: isKo ? '호산구 위장염' : 'Eosinophilic Gastritis', 
                            code: 'K52.8', 
                            riders: ['실손의료비', '특정질환입원일당'], 
                            deepAnalysis: isKo ? '호산구 수치 상승을 동반한 원인 불명의 위장염입니다. 보험사가 "단순 식중독"으로 치부하려 할 때, 조직검사상 호산구 침윤을 근거로 희귀성 질환임을 강조하여 정밀 검사비 및 장기 치료비를 보전받아야 합니다.' : 'Insurers may tag it as "simple food poisoning". Use biopsy evidence of eosinophil infiltration to prove its rare disease status for full diagnostic and treatment Silbi.'
                        },
                        { 
                            name: isKo ? '발뒤꿈치 (종골) 골절' : 'Calcaneus Fracture', 
                            code: 'S92.0', 
                            riders: ['골절진단비', '상해수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '종골 골절은 "샌더스(Sanders) 분류"에 따라 수술 여부가 결정됩니다. 보행 시 가장 중요한 뼈이므로, 유합 후에도 남는 통증과 발목 각도 제한을 근거로 상해후유장해 10% 이상을 확보하는 것이 핵심입니다.' : 'Calcaneus fractures use Sanders classification. As a weight-bearing bone, ROM limits and chronic pain post-union should be used to claim 10%+ injury disability.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Pituitary_Dystonia_Pneumo',
            title: isKo ? '[E/G/S코드] 성장호르몬·사경·기흉' : '[E/G/S-Code] Growth/Dystonia/Pneumo',
            shortTitle: isKo ? '성장호르몬결핍/사경/기흉' : 'Growth/Dystonia/Pneumo',
            desc: isKo ? '뇌하수체 저하증, 사경 및 외상성 기흉 분류입니다.' : 'Classification for pituitary hypofunction, dystonia, and traumatic pneumothorax.',
            subCategories: [
                {
                    name: isKo ? '발육 및 흉부 긴급 질환' : 'Growth & Chest Emergencies',
                    items: [
                        { 
                            name: isKo ? '뇌하수체 기능 저하증' : 'Pituitary Hypofunction', 
                            code: 'E23.0', 
                            riders: ['어린이생활질환진단비', '실손의료비'], 
                            deepAnalysis: isKo ? '성장 호르몬 치료는 키성장 목적으로 오인되어 실비 거절이 잦습니다. 하지만 성장 호르몬 자극 검사상 수치가 낮고또래 대비 하위 3% 이내임을 입증하여 "질병 치료 목적"임을 명확히 해야 합니다. 호르몬 수치 변화를 근거로 실비를 사수해야 합니다.' : 'Growth hormone therapy is often denied as cosmetic. Use stimulation test results and the <3 percentile height stat to prove "medical treatment". Defend Silbi claims via documented hormone deficiency.'
                        },
                        { 
                            name: isKo ? '경부 긴장 이상 (사경)' : 'Dystonia (Torticollis)', 
                            code: 'G24.3', 
                            riders: ['질병후유장해(목)', '실손의료비'], 
                            deepAnalysis: isKo ? '사경은 목이 한쪽으로 기우는 질환입니다. 영유아 시기 도수 치료나 보톡스 주사의 실비 보상을 위해 근육의 비후 소견(초음파)을 확보해야 하며, 성인기까지 지속 시 목의 가동 범위 제한에 따른 후유장해 보험금을 검토해야 합니다.' : 'Torticollis Silbi for PT or Botox requires ultrasound evidence of muscle thickening. If it persists into adulthood, claim for neck ROM disability benefits.'
                        },
                        { 
                            name: isKo ? '외상성 기흉' : 'Traumatic Pneumothorax', 
                            code: 'S27.0', 
                            riders: ['상해수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '외상성 기흉은 흉관 삽입술(Chest tube) 시행 시 수술비 청구가 가능합니다. 폐의 재팽창이 완전하지 않아 호흡 기능에 영구적인 지장이 남을 경우, 폐 기능 검사(PFT)를 통해 상해후유장해를 청구하는 것이 핵심입니다.' : 'Chest tube insertion for traumatic pneumothorax qualifies for surgical benefits. If lung expansion is incomplete, claim injury disability via PFT results for permanent respiratory impairment.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'DiabetesNerve_Plexus_Wrist',
            title: isKo ? '[E/G/S코드] 당뇨신경·신경총·손목골절' : '[E/G/S-Code] Nerve/Plexus/Wrist',
            shortTitle: isKo ? '당뇨신경병증/상완신경총/주상골골절' : 'Nerve/Plexus/Wrist',
            desc: isKo ? '당뇨병성 신경병증, 상완신경총 손상 및 주상골 골절 분류입니다.' : 'Classification for diabetic neuropathy, brachial plexus injuries, and scaphoid fractures.',
            subCategories: [
                {
                    name: isKo ? '말초 신경 및 세부 골절' : 'Peripheral Nerve & Detailed Fractures',
                    items: [
                        { 
                            name: isKo ? '당뇨병성 신경병증' : 'Diabetic Neuropathy', 
                            code: 'E11.6', 
                            riders: ['질병후유장해', '실손의료비'], 
                            deepAnalysis: isKo ? '당뇨병 환자의 감각 저하는 낙상 사고의 원인이 됩니다. 신경 전도 검사(NCS)상 이상 소견을 근거로 신경계 장해를 청구해야 하며, 단순 통증 치료가 아닌 "합병증 예방" 목적임을 강조하여 실비 보상을 사수해야 합니다.' : 'Diabetic sensory loss leads to falls. Claim neurological disability via NCS results. Emphasize "complication prevention" for Silbi claims on chronic treatments.'
                        },
                        { 
                            name: isKo ? '상완신경총 손상' : 'Brachial Plexus Injury', 
                            code: 'G54.0', 
                            riders: ['상해후유장해(고액)', '재활치료비'], 
                            deepAnalysis: isKo ? '어깨와 팔의 신경 다발이 손상되는 중증 상해입니다. 팔 전체 마비 시 80% 이상의 상해후유장해 수령이 가능하며, 사고 초기부터 신경 이식 수술 및 장기 재활 치료의 실비 한도를 확보하는 것이 핵심입니다.' : 'Severe injury to the shoulder nerve bundle. Total arm palsy triggers 80%+ injury disability. Secure Silbi limits for nerve grafts and long-term rehab early on.'
                        },
                        { 
                            name: isKo ? '손목 주상골 골절' : 'Scaphoid Fracture', 
                            code: 'S62.0', 
                            riders: ['골절진단비', '상해수술비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '주상골은 혈액 공급이 취약하여 "무혈성 괴사" 위험이 높습니다. 뼈가 붙지 않는 불유합 발생 시 영구적인 손목 강직 장해(5~10%)가 인정되므로, 수술 후 6개월 뒤 반드시 장해 감정을 받아야 합니다.' : 'The scaphoid is prone to avascular necrosis. Non-union leads to permanent wrist stiffness disability (5-10%). Ensure a disability evaluation at 6 months post-surgery.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Final_Rare_MultipleTrauma',
            title: isKo ? '[E/G/S코드] 최종 연구: 희귀난치 및 다발상해' : '[E/G/S-Code] Final: Rare & Multiple',
            shortTitle: isKo ? '아밀로이드/운동실조/다발골절' : 'Final Research',
            desc: isKo ? '아밀로이드증, 운동실조증 및 다발성 골절 분류입니다.' : 'Classification for amyloidosis, ataxia, and multiple fractures.',
            subCategories: [
                {
                    name: isKo ? '전문가급 최종 분석' : 'Professor-level Final Analysis',
                    items: [
                        { 
                            name: isKo ? '아밀로이드증' : 'Amyloidosis', 
                            code: 'E85', 
                            riders: ['희귀난치성질환진단비', '질병후유장해(심장/신장)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '아밀로이드증은 진단이 매우 어렵습니다. 심근 생검이나 지방 조직 검사 결과를 근거로 확진하며, 고가의 약제비 실비 보상을 위해 산정특례 등록이 필수입니다. 심부전으로 이행 시 심장 이식에 준하는 보상 전략이 필요합니다.' : 'Amyloidosis requires biopsy for confirmation. Secure rare disease support for expensive drugs like Vyndaqel. If heart failure occurs, coordinate for major disability or transplant benefits.'
                        },
                        { 
                            name: isKo ? '유전성 운동실조증' : 'Hereditary Ataxia', 
                            code: 'G11', 
                            riders: ['질병후유장해(평형/언어)', '치매진단비(감별)'], 
                            deepAnalysis: isKo ? '운동실조증은 보행 장애와 언어 장애가 동반됩니다. 이를 단순 치매(G30)로 오인하지 말고, 소뇌 위축을 근거로 한 "신경계 장해"로 접근하여 각각의 장해율을 합산(100% 초과 가능) 청구해야 합니다.' : 'Ataxia causes gait and speech issues. Do not confuse it with dementia. Claim via combined neurological disability ratings based on cerebellar atrophy for maximum benefits.'
                        },
                        { 
                            name: isKo ? '척추의 다발성 골절' : 'Multiple Spine Fractures', 
                            code: 'S32.7', 
                            riders: ['상해후유장해(합산)', '골절진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '다발성 척추 골절은 각 분절의 기형 각도를 합산하여 평가할 수 있습니다. 보험사는 가장 심한 한 곳만 인정하려 하지만, 판례상 다수 분절의 장해를 합산 인정하는 경우가 많으므로 법리적 대응이 필수입니다.' : 'Multiple spine fractures allow for combined deformity ratings. Counter "single-highest-only" denials via legal precedents for aggregate disability payouts.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Clinical_Doc_Expert',
            title: isKo ? '[문서 세부코드] MRI·소견서 전용' : '[Doc-Code] MRI & Physician Statement',
            shortTitle: isKo ? 'MRI/소견서용 세부코드' : 'Clinical Docs',
            desc: isKo ? 'MRI 판독지 및 의사 소견서에 주로 기재되는 실무형 세부 코드입니다.' : 'Specific codes found in MRI reports and physician statements for clinical practice.',
            subCategories: [
                {
                    name: isKo ? '뇌혈관 및 척추 세부 판독' : 'Vascular & Spine Details',
                    items: [
                        { 
                            name: isKo ? '뇌혈관 질환의 후유증 (뇌출혈/뇌경색 후)' : 'Sequelae of Cerebrovascular Disease', 
                            code: 'I69.1/I69.3', 
                            riders: ['뇌혈관질환진단비', '질병후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '급성기(I60~I63)가 지나 진단서에 I69 코드가 기재되면 보험사는 "진단비 지급 대상이 아니다"라고 주장합니다. 하지만 발병 당시의 영상 자료와 의무기록을 소급 분석하여 원인 질환(I63 등)을 확정하면 진단비를 수령할 수 있습니다. 후유장해 판정 시 가장 기준이 되는 코드입니다.' : 'Insurers deny I69 as "non-diagnostic". Retrospectively analyze acute phase records (I63) to secure diagnosis benefits. This is the primary code for permanent disability ratings.'
                        },
                        { 
                            name: isKo ? '뇌죽상경화증 (뇌혈관 협착)' : 'Cerebral Atherosclerosis', 
                            code: 'I67.2', 
                            riders: ['뇌혈관질환진단비'], 
                            deepAnalysis: isKo ? 'MRA 판독지에 "Stenosis(협착)" 문구가 있다면 I67.2 코드를 강력히 요구해야 합니다. 뇌졸중(I63) 담보에는 해당하지 않으나 범위가 넓은 "뇌혈관 질환 진단비" 담보에서는 100% 보상이 가능한 핵심 실무 코드입니다.' : 'If MRA shows "Stenosis", request I67.2. It falls under broad "Cerebrovascular" riders even if I63 (Stroke) is not applicable.'
                        },
                        { 
                            name: isKo ? '기타 추간판 장애 (다발성 디스크)' : 'Other Specified Disc Disorders', 
                            code: 'M51.8', 
                            riders: ['질병수술비', '상해후유장해(감액쟁점)'], 
                            deepAnalysis: isKo ? 'MRI상 여러 마디에 퇴행성 변화가 있거나 특이적인 탈출 형태를 보일 때 기재됩니다. 상해 사고 후 이 코드가 기재되면 보험사는 기왕증 감액 100%를 주장하기 쉽습니다. 사고로 인한 급성 악화(Herniation)임을 입증하는 소견서 병행이 필수입니다.' : 'Found in multiple-level disc degeneration. Insurers use M51.8 to push 100% degenerative reductions. Pair with a physician statement proving acute exacerbation (Herniation) for injury claims.'
                        },
                        { 
                            name: isKo ? '신경뿌리병증을 동반한 디스크' : 'Disc w/ Radiculopathy', 
                            code: 'M51.1', 
                            riders: ['질병후유장해', '1-5종수술비'], 
                            deepAnalysis: isKo ? '단순 디스크(M51.2)보다 위중한 상태입니다. 근전도 검사(EMG)상 신경 손상이 확인될 때 부여되며, 이는 척추의 장해가 아닌 "신경계 장해"로 보아 더 높은 지급률을 적용받을 수 있는 근거가 됩니다.' : 'More severe than M51.2. Confirmed via EMG. Use this as evidence for "Neurological Disability" which often yields higher payouts than simple spinal deformity.'
                        }
                        ,
                        { 
                            name: isKo ? '뇌출혈의 후유증 (지주막하/기타 뇌내출혈 후)' : 'Sequelae of Intracranial Hemorrhage', 
                            code: 'I69.0/I69.2', 
                            riders: ['뇌출혈진단비', '질병후유장해'], 
                            deepAnalysis: isKo ? '출혈성 뇌졸중(I60~I62) 환자가 재활 요양 병원에서 진단서를 끊을 때 가장 많이 부여받는 코드입니다. 보험사는 "현재 출혈이 없다"는 이유로 진단비를 거절하지만, 발병 당시의 혈관 조영술(TFCA)이나 CT상 출혈 흔적을 근거로 원발 질환 코드를 확정하여 진단비를 전액 수령해야 합니다.' : 'Commonly assigned in rehab hospitals after the acute phase. Insurers deny claims because "no active bleeding" is present. Use original TFCA/CT scans to confirm the primary hemorrhagic code (I60-62) for full payouts.'
                        },
                        { 
                            name: isKo ? '경추 추간판 장애 (목 디스크 w/ 신경 손상)' : 'Cervical Disc w/ Radiculopathy', 
                            code: 'M50.1', 
                            riders: ['질병수술비', '상해후유장해'], 
                            deepAnalysis: isKo ? '목 디스크 MRI 판독지에 "C-spine root compression" 문구가 있다면 반드시 M50.1 코드를 확보해야 합니다. 상해로 인한 경추 손상은 요추보다 장해 판정 기준이 까다로우나, 팔의 근력 저하(Grade 3 이하)를 근거로 고도의 후유장해를 주장할 수 있습니다.' : 'If MRI shows "C-spine root compression", secure M50.1. Cervical injury claims are stricter than lumbar; use muscle weakness (Grade 3 or less) to argue for high disability benefits.'
                        },
                        { 
                            name: isKo ? '요추/천추의 골절 (압박골절)' : 'Lumbar/Sacral Fracture', 
                            code: 'S32.0/S32.1', 
                            riders: ['골절진단비', '상해후유장해'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '낙상 사고 후 시일이 지나 MRI를 찍으면 "Old fracture" 소견이 나올 수 있습니다. 이때 보험사는 사고와의 인과관계를 부정합니다. 하지만 T2 영상의 "Bone marrow edema(골부종)" 신호를 근거로 최근 발생한 급성 골절임을 입증하여 상해 담보를 수령해야 합니다.' : 'Delayed MRIs may show "Old fracture", leading to insurer denials. Use "Bone marrow edema" signals on T2 imaging to prove the fracture is acute/recent to secure injury-based benefits.'
                        },
                        { 
                            name: isKo ? '기타 척추증 (척추 퇴행성 변화)' : 'Other Spondylosis', 
                            code: 'M47.8', 
                            riders: ['질병수술비', '실손의료비'], 
                            deepAnalysis: isKo ? 'MRI상 뼈가 덧자라는 "Osteophyte(골극)"나 퇴행성 변화가 관찰될 때 기재됩니다. 상해후유장해 청구 시 기왕증 감액의 핵심 근거가 되므로, 사고 전 환부 치료 이력이 없음을 입증하여 기여도를 사수해야 합니다.' : 'Found when "Osteophytes" or degenerative changes are on MRI. Used as a primary reason for payout reductions; prove no pre-accident treatment history to defend accident contribution.'
                        },
                        { 
                            name: isKo ? '기타 명시된 뇌혈관 질환' : 'Other Specified Cerebrovascular Diseases', 
                            code: 'I67.8', 
                            riders: ['뇌혈관질환진단비'], 
                            deepAnalysis: isKo ? '뇌 MRI/MRA상 미세 혈관의 허혈성 변화(Small vessel disease)가 보일 때 주로 부여됩니다. I63(뇌경색)에는 해당하지 않으나 "뇌혈관 질환 진단비" 담보에서는 지급 대상이 되므로 놓치지 말고 청구해야 합니다.' : 'Commonly used for small vessel disease findings on brain MRI/MRA. It qualifies for "Cerebrovascular" diagnostic benefits even if it doesn\'t meet the I63 (Stroke) criteria.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'Strategic_Focus',
            title: isKo ? '[손해사정 전략] 분쟁 다발 및 중점 관리' : '[Strategic Focus] High Dispute Cases',
            shortTitle: isKo ? '손사 중점 관리' : 'Strategic Focus',
            desc: isKo ? '보험사와 보상 규모를 두고 가장 치열하게 다투는 핵심 질환들입니다. 중복 노출을 통해 보상 누락을 방지합니다.' : 'Core diseases with intense payout disputes. Duplicated here to ensure no compensation is missed.',
            subCategories: [
                {
                    name: isKo ? '암/유사암 상향 조정 및 전이암 분쟁' : 'Cancer Upgrade & Metastasis',
                    items: [
                        { 
                            name: isKo ? '갑상선암의 전이 (C73 -> C77)' : 'Thyroid Metastasis (C73 to C77)', 
                            code: 'C73/C77', 
                            riders: ['일반암진단비', '소액암진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '원발암(갑상선암)이 소액암이라도 림프절 전이(C77)가 있다면 일반암 진단비를 수령할 수 있는 "원발암 기준 전" 약관인지 확인하십시오. 대법원 판례에 따라 설명 의무 위반으로 100% 수령 가능한 핵심 분쟁 건입니다.' : 'Check if pre-2011 "Primary Cancer Rule" applies. Supreme Court allows 100% payout for C77 metastasis if the insurer failed their duty to explain exclusions.'
                        },
                        { 
                            name: isKo ? '직장 유암종 (D37.5 -> 일반암 전환)' : 'Rectal NET (D37.5 to Malignant)', 
                            code: 'D37.5', 
                            riders: ['일반암진단비', '유사암진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '코드는 D이지만, 형태학적 분류(M9249/3)를 근거로 일반암 100% 수령을 목표로 해야 합니다. 보험사의 유사암 10~20% 안내에 절대 서명하지 말고 손해사정사의 전문 검토를 받으십시오.' : 'Aim for 100% malignant payout based on morphology M9249/3. Do not accept 10-20% minor payouts; insist on pathological malignancy standards.'
                        },
                        { 
                            name: isKo ? '유방의 상피내암 (D05 -> 미세침윤 C50)' : 'Breast CIS to Micro-invasive', 
                            code: 'D05/C50', 
                            riders: ['일반암진단비', '유사암진단비'], 
                            deepAnalysis: isKo ? '단순 상피내암(D05) 진단을 받았더라도 수술 후 병리 결과지상 "Microinvasion" 문구가 있다면 반드시 C50 일반암으로 청구하여 수천만 원의 차이를 사수해야 합니다.' : 'If post-op pathology shows "Microinvasion", upgrade D05 to C50 immediately for full malignant benefits.'
                        }
                    ]
                },
                {
                    name: isKo ? '심뇌혈관 삭감 방어 및 진단비 수령' : 'Vascular Claim Defense',
                    items: [
                        { 
                            name: isKo ? '열공성 뇌경색 (I63 -> I67 삭감 방어)' : 'Lacunar Infarct Defense', 
                            code: 'I63/I67', 
                            riders: ['뇌졸중진단비', '뇌혈관질환진단비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '보험사는 "무증상 열공성 뇌경색"이라며 I67로 코드를 변경하여 진단비를 거절하려 합니다. 급성기 MRI 확산 강조 영상(DWI)의 병변을 근거로 I63을 고수하여 뇌졸중 진단비를 확보해야 합니다.' : 'Insurers push I67 for "asymptomatic" lacunar infarcts. Use acute DWI lesions to defend I63 and secure full stroke diagnosis benefits.'
                        },
                        { 
                            name: isKo ? '변이형 협심증 (I20.1)' : 'Prinzmetal\'s Angina', 
                            code: 'I20.1', 
                            riders: ['허혈성심장질환진단비'], 
                            deepAnalysis: isKo ? '일반적인 운동 시 통증이 아닌 안정 시 경련에 의해 발생합니다. 조영술상 협착이 없어도 에르고노빈 유발 검사상 양성이라면 허혈성 진단비 수령이 가능하므로 검사 결과지를 필히 분석하십시오.' : 'Occurs during rest. Even with zero stenosis on angiography, a positive Ergonovine test qualifies for ischemic heart disease benefits.'
                        }
                    ]
                },
                {
                    name: isKo ? '정형/상해 기왕증 감액 및 후유장해' : 'Ortho/Injury Disability',
                    items: [
                        { 
                            name: isKo ? '추간판 탈출증 (M51 -> 상해 기여도 분쟁)' : 'Disc Herniation Contribution', 
                            code: 'M51/S33', 
                            riders: ['상해후유장해', '상해수술비'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '보험사는 MRI상 검게 변한 디스크를 근거로 기왕증 100%를 주장합니다. 하지만 사고 전 치료 이력이 없고 급성 외상 소견(부종 등)이 있다면 기여도 30~50%를 인정받아 상해 보험금을 수령해야 합니다.' : 'Insurers push 100% degenerative reduction for black discs on MRI. Prove acute trauma (edema) and no prior history to secure 30-50% injury contribution.'
                        },
                        { 
                            name: isKo ? '척추 압박골절 (S32 -> 골다공증 감액 방어)' : 'Compression Fracture vs Osteoporosis', 
                            code: 'S32/M81', 
                            riders: ['상해후유장해(고액)'], 
                            isImportant: true,
                            deepAnalysis: isKo ? '골다공증(T-score -2.5 이하)이 있다는 이유로 보험금의 50%를 삭감하려 합니다. 사고의 강도가 충분히 컸음을 입증(추락 높이 등)하여 감액 비율을 20~30% 이내로 방어하는 것이 핵심입니다.' : 'Insurers cut 50% for osteoporosis (T < -2.5). Defend by proving significant accident impact (fall height) to limit reductions to 20-30%.'
                        }
                    ]
                }
            ]
        }
    ]
}
