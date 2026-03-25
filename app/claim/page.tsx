'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { useAttribution } from '@/lib/attribution'
import {
  DocumentCheckIcon,
  PhotoIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  UserIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

const INSURANCE_COMPANIES = [
  '삼성화재', '현대해상', 'KB손해보험', 'DB손해보험', '메리츠화재',
  '한화손해보험', '롯데손해보험', 'MG손해보험', '흥국화재', '하나손해보험',
  '삼성생명', '교보생명', '한화생명', '신한라이프', 'ABL생명',
  'AIA생명', '동양생명', '메트라이프생명',
]

const BANKS = [
  'KB국민은행', '신한은행', '하나은행', '우리은행', 'IBK기업은행',
  'NH농협은행', '카카오뱅크', '토스뱅크', '케이뱅크', 'SC제일은행',
  '씨티은행', '대구은행', '부산은행', '경남은행', '광주은행',
  '전북은행', '제주은행', '수협은행', '우체국', '저축은행',
]

const STEPS = [
  { id: 1, label: '본인정보', icon: UserIcon },
  { id: 2, label: '계약정보', icon: HomeIcon },
  { id: 3, label: '사고정보', icon: ExclamationTriangleIcon },
  { id: 4, label: '계좌정보', icon: BanknotesIcon },
  { id: 5, label: '서류첨부', icon: PhotoIcon },
  { id: 6, label: '동의 및 제출', icon: ShieldCheckIcon },
]

export default function ClaimPage() {
  const { planner } = useAttribution()
  const [planners, setPlanners] = useState<{ id: string; name: string; affiliation: string }[]>([])
  const [selectedPlannerId, setSelectedPlannerId] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Step 1 — 본인 정보
  const [name, setName] = useState('')
  const [residentFront, setResidentFront] = useState('') // 앞 6자리
  const [residentBack, setResidentBack] = useState('')   // 뒷 7자리
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Step 2 — 계약 정보
  const [sameAsPolicyholder, setSameAsPolicyholder] = useState(true)
  const [policyholderName, setPolicyholderName] = useState('')
  const [notificationPerson, setNotificationPerson] = useState('')

  // Step 3 — 사고 정보
  const [accidentType, setAccidentType] = useState<'질병' | '상해' | '교통사고' | ''>('')
  const [accidentDetail, setAccidentDetail] = useState('')

  // Step 4 — 계좌 정보
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankHolder, setBankHolder] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'GENERAL' | 'AUTO_DEBIT'>('GENERAL')

  // Step 5 — 보험사 + 서류
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [images, setImages] = useState<File[]>([])

  // Step 6 — 동의 및 서명
  const [consentThirdParty, setConsentThirdParty] = useState(false)
  const [signatureType, setSignatureType] = useState<'FACE' | 'NON_FACE'>('NON_FACE')

  useEffect(() => {
    if (planner) {
      setSelectedPlannerId(planner.id)
    } else {
      supabase.from('planners').select('id, name, affiliation').order('name').then(({ data }) => {
        if (data) setPlanners(data)
      })
    }
  }, [planner])

  const canProceed = () => {
    switch (currentStep) {
      case 1: return name && residentFront.length === 6 && residentBack.length >= 1 && phone
      case 2: return (!sameAsPolicyholder ? policyholderName : true) && notificationPerson
      case 3: return accidentType && accidentDetail
      case 4: return bankName && bankAccount && bankHolder
      case 5: return insuranceCompany && selectedPlannerId
      case 6: return consentThirdParty
      default: return false
    }
  }

  const handleSubmit = async () => {
    if (!consentThirdParty) return
    setSubmitting(true)

    try {
      const uploadedUrls: string[] = []
      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `claims/customer/${Date.now()}_${Math.random().toString(36).slice(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('planner-assets').upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('planner-assets').getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }

      const maskedResident = `${residentFront}-${residentBack[0]}******`

      const { error } = await supabase.from('claims').insert({
        planner_id: selectedPlannerId,
        customer_name: name,
        customer_phone: phone,
        address,
        resident_number: maskedResident,
        same_as_policyholder: sameAsPolicyholder,
        policyholder_name: sameAsPolicyholder ? name : policyholderName,
        notification_person: notificationPerson,
        accident_type: accidentType,
        accident_detail: accidentDetail,
        description: `[${accidentType}] ${accidentDetail}`,
        bank_name: bankName,
        bank_account: bankAccount,
        bank_holder: bankHolder,
        payment_method: paymentMethod,
        insurance_company: insuranceCompany,
        image_urls: uploadedUrls,
        signature_type: signatureType,
        consent_third_party: consentThirdParty,
        consent_at: new Date().toISOString(),
        status: 'PENDING',
        transmission_status: 'NOT_SENT',
      })

      if (error) throw error
      setSubmitted(true)
    } catch (err: any) {
      alert('제출 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
              <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">보상청구 접수 완료!</h2>
            <p className="text-gray-500 leading-relaxed mb-2">
              보상청구 내용이 성공적으로 접수되었습니다.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              담당 설계사님이 자료를 검토하여 해당 보험사에 직접 송신해 드립니다.<br />
              카카오톡 또는 전화로 진행 상황을 안내드리겠습니다.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Hero Header */}
      <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container max-w-2xl relative z-10 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-sm font-bold mb-4 border border-white/20">
            <DocumentCheckIcon className="w-4 h-4" />
            온라인 보상청구 접수
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">보험 보상청구 신청서</h1>
          <p className="text-primary-200 text-sm">순서대로 입력하시면 담당 설계사님이 보험사에 직접 접수해 드립니다.</p>
        </div>
      </header>

      {/* Step progress bar */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30 shadow-sm">
        <div className="container max-w-2xl py-3 px-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isDone = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center gap-1 flex-1">
                  <div className={`flex flex-col items-center gap-1 flex-1 ${isActive ? '' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-primary-600 text-white' : isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isDone ? <CheckCircleIcon className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[9px] font-black hidden sm:block ${isActive ? 'text-primary-600' : isDone ? 'text-primary-400' : 'text-gray-300'}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 rounded-full mx-1 mb-3 transition-colors ${isDone ? 'bg-primary-400' : 'bg-gray-100'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="container max-w-2xl px-4 py-8 flex-1">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STEP {currentStep} / {STEPS.length}</p>
            <h2 className="text-xl font-black text-gray-900">{STEPS[currentStep - 1].label}</h2>
          </div>

          <div className="p-8 space-y-6">

            {/* ── STEP 1: 본인 정보 ── */}
            {currentStep === 1 && (
              <>
                {/* Planner Selection */}
                {!planner && (
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">담당 설계사 선택 *</label>
                    <select
                      required
                      value={selectedPlannerId}
                      onChange={e => setSelectedPlannerId(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                    >
                      <option value="">설계사를 선택하세요</option>
                      {planners.map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.affiliation ? `(${p.affiliation})` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}
                {planner && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl">
                    <CheckCircleIcon className="w-5 h-5 text-primary-600 shrink-0" />
                    <div>
                      <p className="text-xs text-primary-500 font-bold">담당 설계사</p>
                      <p className="text-sm font-black text-primary-900">{planner.name} 설계사</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">이름 *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">주민등록번호 *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text" maxLength={6} value={residentFront}
                      onChange={e => setResidentFront(e.target.value.replace(/\D/g, ''))}
                      placeholder="앞 6자리"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest" />
                    <span className="text-gray-400 font-black text-lg">-</span>
                    <input
                      type="password" maxLength={7} value={residentBack}
                      onChange={e => setResidentBack(e.target.value.replace(/\D/g, ''))}
                      placeholder="뒷 7자리"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">⚠️ 주민번호는 앞 7자리만 저장되고 나머지는 마스킹 처리됩니다.</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">연락처 *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">주소</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="서울시 강남구 테헤란로 123"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </>
            )}

            {/* ── STEP 2: 계약 / 피보험자 정보 ── */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">계약자 = 피보험자 동일 여부 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: true, label: '동일합니다' }, { val: false, label: '다릅니다' }].map(opt => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setSameAsPolicyholder(opt.val)}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                          sameAsPolicyholder === opt.val
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!sameAsPolicyholder && (
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">계약자 이름 *</label>
                    <input type="text" value={policyholderName} onChange={e => setPolicyholderName(e.target.value)}
                      placeholder="계약자 이름 입력"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">보상안내 받으실 분 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['본인', '계약자', '설계사', '법정대리인'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNotificationPerson(opt)}
                        className={`py-3.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                          notificationPerson === opt
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: 사고 정보 ── */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">사고 유형 *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['질병', '상해', '교통사고'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccidentType(type)}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                          accidentType === type
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {type === '질병' ? '🏥 질병' : type === '상해' ? '🩹 상해' : '🚗 교통사고'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">사고 내용 *</label>
                  <textarea
                    rows={5}
                    value={accidentDetail}
                    onChange={e => setAccidentDetail(e.target.value)}
                    placeholder={`예시:\n- 병명: 고혈압성 심장질환\n- 입원 기간: 2024년 1월 5일 ~ 1월 12일 (7박 8일)\n- 병원명: OO대학교병원\n- 청구 내용: 입원비, 수술비, 약제비`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none leading-relaxed"
                  />
                </div>
              </>
            )}

            {/* ── STEP 4: 계좌 정보 ── */}
            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">입금 방식 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'GENERAL', label: '일반 입금' },
                      { val: 'AUTO_DEBIT', label: '자동이체' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setPaymentMethod(opt.val as any)}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                          paymentMethod === opt.val
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">은행명 *</label>
                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                    <option value="">은행을 선택하세요</option>
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">계좌번호 *</label>
                  <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                    placeholder="숫자만 입력 (예: 123456789012)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">예금주명 *</label>
                  <input type="text" value={bankHolder} onChange={e => setBankHolder(e.target.value)}
                    placeholder="예금주 이름"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </>
            )}

            {/* ── STEP 5: 보험사 & 서류 첨부 ── */}
            {currentStep === 5 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">청구할 보험사 *</label>
                  <select
                    value={insuranceCompany}
                    onChange={e => setInsuranceCompany(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                    <option value="">보험사를 선택하세요</option>
                    <optgroup label="손해보험사">
                      {INSURANCE_COMPANIES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                    <optgroup label="생명보험사">
                      {INSURANCE_COMPANIES.slice(10).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    청구서류 첨부 <span className="text-gray-300 font-medium normal-case">(진단서, 영수증, 입퇴원확인서 등)</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full min-h-[140px] px-6 py-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all group">
                    <PhotoIcon className="w-10 h-10 text-gray-200 group-hover:text-primary-300 transition-colors mb-3" />
                    {images.length > 0 ? (
                      <div className="text-center">
                        <p className="text-sm font-black text-primary-600">{images.length}개 파일 선택됨</p>
                        <p className="text-xs text-gray-400 mt-1">{images.map(f => f.name).join(', ')}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-400">클릭하여 파일 업로드</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, PDF 등 여러 파일 동시 선택 가능</p>
                      </div>
                    )}
                    <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={e => { if (e.target.files) setImages(Array.from(e.target.files)) }} />
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {images.map((f, i) => (
                        <div key={i} className="shrink-0 rounded-xl overflow-hidden border border-gray-200 h-16 w-16 bg-gray-50 flex items-center justify-center">
                          {f.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(f)} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xs text-gray-400 font-bold">PDF</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── STEP 6: 동의 및 서명 ── */}
            {currentStep === 6 && (
              <>
                {/* Third Party Consent */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary-600" />
                    제3자 정보 제공 및 조회 동의서
                  </h3>
                  <div className="text-xs text-gray-600 leading-relaxed space-y-2 max-h-48 overflow-y-auto pr-1">
                    <p><strong>[수집·이용 목적]</strong> 보험금 청구 및 지급 심사, 보험사기 조사 및 예방</p>
                    <p><strong>[수집 항목]</strong> 성명, 주민등록번호(앞 7자리), 연락처, 주소, 진단명, 진료 내역, 계좌 정보</p>
                    <p><strong>[제공 대상]</strong> 청구 대상 보험회사, 금융감독원, 금융결제원, 보험개발원, 손해보험협회, 생명보험협회</p>
                    <p><strong>[보유·이용 기간]</strong> 보험금 청구 및 지급 완료 후 5년 (관련 법령에 따라 연장될 수 있음)</p>
                    <p><strong>[동의 거부 권리]</strong> 귀하는 제3자 정보 제공에 동의하지 않을 권리가 있습니다. 단, 동의를 거부할 경우 보험금 청구 처리가 불가할 수 있습니다.</p>
                    <p className="text-gray-400">위 내용을 읽고 제3자 정보 제공 및 조회에 동의합니다.</p>
                  </div>
                </div>

                <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${consentThirdParty ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                  <input type="checkbox" checked={consentThirdParty} onChange={e => setConsentThirdParty(e.target.checked)} className="w-5 h-5 mt-0.5 accent-primary-600 shrink-0" />
                  <span className="text-sm font-bold text-gray-700">
                    위 제3자 정보 제공·조회 동의서를 모두 읽었으며, <span className="text-primary-700 font-black">이에 동의합니다. (필수)</span>
                  </span>
                </label>

                {/* Signature type */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">서명 방식</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: 'NON_FACE', label: '📱 비대면 (온라인)' }, { val: 'FACE', label: '🤝 대면 (방문)' }].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setSignatureType(opt.val as any)}
                        className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                          signatureType === opt.val
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100 space-y-1.5">
                  <p className="text-xs font-black text-primary-800 uppercase tracking-widest mb-3">접수 정보 요약</p>
                  {[
                    ['이름', name],
                    ['연락처', phone],
                    ['보험사', insuranceCompany],
                    ['사고 유형', accidentType],
                    ['입금 방식', paymentMethod === 'GENERAL' ? '일반' : '자동이체'],
                    ['첨부 파일', `${images.length}개`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs text-primary-500 font-bold w-20 shrink-0">{label}</span>
                      <span className="text-sm font-black text-primary-900">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              이전
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-100"
              >
                다음 단계
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-200"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {submitting ? '접수 중...' : '보상청구 접수하기'}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
