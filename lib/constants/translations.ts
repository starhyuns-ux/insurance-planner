export type Locale = 'ko' | 'en' | 'cn';

export const translations = {
  ko: {
    // Common
    back: '돌아가기',
    backToCard: '명함으로 돌아가기',
    execute: '실행하기',
    customerCenter: '보험사 고객센터',
    premiumCalculator: '보장성 보험료 계산기',
    silbiCalculator: '실손 의료비 계산기',
    calculatorDesc: '나의 예상 보험료를 간편하게 확인하세요.',
    silbiDesc: '가입 시기별로 달라지는 실손 보장 한도를 확인하세요.',
    
    // Digital Business Card
    toolKitTitle: '전문가 보험 솔루션 메뉴',
    toolKitDesc: (name: string) => `보험 전문가 ${name} 설계사가 제공하는 핵심 보험 도구 모음입니다.`,
    trustTitle: '정직과 신뢰의 약속',
    trustDesc: '보험 설계사는 고객님의 자산을 지키는 든든한 파트너입니다.',
    
    premiumCalc: '보험료 계산기',
    premiumCalcDesc: '3대 진단비(암, 뇌, 심장) 내 예상 보험료 확인',
    
    silbiCalc: '실비 계산기',
    silbiCalcDesc: '1세대부터 4세대까지 내 실손 보험금 비교',
    
    customerCenterDesc: '전 보험사 고객센터 원클릭 전화 연결 서비스',
    
    // Advisor Metadata
    intro: '소개',
    experience: '경력사항',
    experienceVal: '보험경력 3년 이상',
    specialty: '전문분야',
    regStatus: '등록여부',
    regStatusVal: '금융감독원 등록',
    consultation: '상담분야',
    consultationVal: '전 생보/손보',
    mainField: '주요지역',
    mainFieldVal: '전국 상시 가능',

    // Profile Fields
    affiliation: '소속',
    region: '지역',
    contact: '연락처',
    message: '인사말',
    kakaoTalk: '카카오톡 상담',

    // Calculator Common
    hospitalFee: '병원비 입력',
    hospitalization: '입원 치료',
    outpatient: '통원 치료',
    covered: '건강보험 적용(급여) 진료비',
    uncovered: '일반 비급여 진료비',
    threeMajor: '3대 비급여 진료비',
    totalClaim: '총 청구 금액',
    estimatedReward: '세대별 예상 보상금액',
    selfPay: '내가 낼 돈 (공제금액)',
    rewardAmount: '돌려받는 돈 (보상액)',
    currentGen: '현재 가입 세대',
    inputAmount: '진료비를 원 단위로 입력해주세요.',
    calculateNow: '입력 즉시 세대별로 얼마를 돌려받는지 비교해 드립니다.',

    // Premium Calculator
    inputInfo: '가입 정보 입력',
    gender: '성별',
    male: '남성',
    female: '여성',
    birthDate: '생년월일',
    insuranceAge: '보험나이',
    coverageSettings: '보장 금액 설정 (만원)',
    calculatePremium: '보험료 계산하기',
    calcResults: '보험료 산출 결과',
    totalMonthly: '총 월 보험료',
    resetCalc: '다시 계산하기',
    
    // Coverage Labels
    cancerLabel: '암진단비',
    brainLabel: '뇌혈관질환 진단비',
    heartLabel: '허혈성심장질환 진단비',
    injurySurgery: '상해 1~5종 수술비',
    diseaseSurgery: '질병 1~5종 수술비',

    // New tools for Card expansion
    fifthGenSilbi: '5세대 실손보험 가이드',
    fifthGenSilbiDesc: '새롭게 개편된 5세대 실손 의료비 핵심 요약',
    cancerTreatment: '암 치료 통합 가이드',
    cancerTreatmentDesc: '로봇수술부터 중입자치료까지 최신 암 치료 일람',
    diseaseCode: '질병코드 검색',
    diseaseCodeDesc: '진단서의 질병코드로 실무 보상 여부 확인',
  },
  en: {
    // Common
    back: 'Back',
    backToCard: 'Back to Card',
    execute: 'Try it',
    customerCenter: 'Insurance Customer Center',
    premiumCalculator: 'Insurance Premium Calculator',
    silbiCalculator: 'Silbi (Medical) Calculator',
    calculatorDesc: 'Easily check your estimated insurance premium.',
    silbiDesc: 'Check the Silbi coverage limits for different policy generations.',
    
    // Digital Business Card
    toolKitTitle: 'Professional Toolkit',
    toolKitDesc: (name: string) => `Core insurance tools provided by your advisor ${name}.`,
    trustTitle: 'Commitment to Trust',
    trustDesc: 'Your insurance advisor is a reliable partner protecting your assets.',
    
    premiumCalc: 'Premium Calculator',
    premiumCalcDesc: 'Estimate premiums for Cancer, Stroke, and Heart conditions',
    
    silbiCalc: 'Silbi Calculator',
    silbiCalcDesc: 'Compare medical insurance benefits across generations 1-4',
    
    customerCenterDesc: 'One-click call service for all insurance companies',
    
    // Advisor Metadata
    intro: 'Intro',
    experience: 'Experience',
    experienceVal: 'Over 3 Years of Exp',
    specialty: 'Specialty',
    regStatus: 'Registration Status',
    regStatusVal: 'FSS Registered',
    consultation: 'Consultation',
    consultationVal: 'Life & P&C Insurance',
    mainField: 'Primary Region',
    mainFieldVal: 'Nationwide Available',

    // Profile Fields
    affiliation: 'Affiliation',
    region: 'Region',
    contact: 'Contact',
    message: 'Message',
    kakaoTalk: 'KakaoTalk Chat',

    // Calculator Common
    hospitalFee: 'Medical Expenses',
    hospitalization: 'Hospitalization',
    outpatient: 'Outpatient Care',
    covered: 'Covered (National Health)',
    uncovered: 'Non-covered (General)',
    threeMajor: '3 Major Non-covered (MRI/etc)',
    totalClaim: 'Total Claim Amount',
    estimatedReward: 'Estimated Reimbursement',
    selfPay: 'Self-Pay Amount',
    rewardAmount: 'Reimbursed Amount',
    currentGen: 'Current Policy Gen',
    inputAmount: 'Enter medical expenses (KRW)',
    calculateNow: 'Instantly compare payouts by generation',

    // Premium Calculator
    inputInfo: 'Input Coverage Info',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    birthDate: 'Birth Date',
    insuranceAge: 'Insurance Age',
    coverageSettings: 'Coverage Limit (10k KRW)',
    calculatePremium: 'Calculate Premium',
    calcResults: 'Premium Results',
    totalMonthly: 'Total Monthly Premium',
    resetCalc: 'Recalculate',
    
    // Coverage Labels
    cancerLabel: 'Cancer Diagnosis',
    brainLabel: 'Cerebrovascular Diagnosis',
    heartLabel: 'Ischemic Heart Diagnosis',
    injurySurgery: 'Injury Surgery (1-5)',
    diseaseSurgery: 'Disease Surgery (1-5)',

    // New tools for Card expansion
    fifthGenSilbi: '5th Gen Silbi Guide',
    fifthGenSilbiDesc: 'Key summary of the newly reformed 5th generation medical insurance',
    cancerTreatment: 'Cancer Treatment Guide',
    cancerTreatmentDesc: 'From robotic surgery to heavy ion therapy - latest treatments',
    diseaseCode: 'Disease Code Search',
    diseaseCodeDesc: 'Check insurance coverage by medical disease codes',
  },
  cn: {
    // Common
    back: '返回',
    backToCard: '返回名片',
    execute: '立即体验',
    customerCenter: '保险公司客服中心',
    premiumCalculator: '保障性保费测算器',
    silbiCalculator: '医疗险(实报实销)测算器',
    calculatorDesc: '轻松快速查看您的预估保费。',
    silbiDesc: '根据投보时代查看不同的医疗险报销限额。',
    
    // Digital Business Card
    toolKitTitle: '专业保险工具箱',
    toolKitDesc: (name: string) => `由保险专家 ${name} 为您提供的核心工具。`,
    trustTitle: '诚信与信任的承诺',
    trustDesc: '保险规划师是守护您资产的可靠伙伴。',
    
    premiumCalc: '保费计算器',
    premiumCalcDesc: '测算癌症、脑部及心脏三大疾病的预估保费',
    
    silbiCalc: '实费保险计算器',
    silbiCalcDesc: '对比第1代至第4代实费保险的报销额度',
    
    customerCenterDesc: '各大保险公司客服中心一键拨号服务',
    
    // Advisor Metadata
    intro: '简介',
    experience: '从业经历',
    experienceVal: '3年以上保险从业经验',
    specialty: '擅长',
    regStatus: '注册状态',
    regStatusVal: '金监院注册',
    consultation: '咨询领域',
    consultationVal: '全寿险/财险',
    mainField: '主要区域',
    mainFieldVal: '全国随时咨询',

    // Profile Fields
    affiliation: '所属机构',
    region: '工作区域',
    contact: '联系方式',
    message: '寄语',
    kakaoTalk: 'KakaoTalk 咨询',

    // Calculator Common
    hospitalFee: '医院费用输入',
    hospitalization: '住院治疗',
    outpatient: '门诊治疗',
    covered: '医保范围内 (给付)',
    uncovered: '一般非医保 (非给付)',
    threeMajor: '三大非医保 (MRI/徒手/注射)',
    totalClaim: '总申请金额',
    estimatedReward: '各代预估赔付金额',
    selfPay: '自付金额',
    rewardAmount: '赔付金额',
    currentGen: '当前投保世代',
    inputAmount: '请输入以韩元为单位的诊疗费',
    calculateNow: '输入后立即对比各世代赔付款',

    // Premium Calculator
    inputInfo: '请输入加保信息',
    gender: '性别',
    male: '男性',
    female: '女性',
    birthDate: '出生日期',
    insuranceAge: '保险年龄',
    coverageSettings: '保障金额设置 (万韩元)',
    calculatePremium: '测算保费',
    calcResults: '保费测算结果',
    totalMonthly: '每月总保费',
    resetCalc: '重新测算',
    
    // Coverage Labels
    cancerLabel: '癌症确诊金',
    brainLabel: '脑血管疾病确诊金',
    heartLabel: '缺血性心脏病确诊金',
    injurySurgery: '伤害 1~5类 手术费',
    diseaseSurgery: '疾病 1~5类 手术费',

    // New tools for Card expansion
    fifthGenSilbi: '第5代实费保险指南',
    fifthGenSilbiDesc: '全新改版的第5代医疗实费保险核心摘要',
    cancerTreatment: '癌症治疗综合指南',
    cancerTreatmentDesc: '从机器人手术到重离子治疗的最新癌症疗法',
    diseaseCode: '疾病代码查询',
    diseaseCodeDesc: '根据诊断书代码查询保险理赔及实务细节',
  }
};
