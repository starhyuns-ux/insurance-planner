'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { useAttribution } from '@/lib/attribution'
import {
  DocumentCheckIcon, PhotoIcon, CheckCircleIcon,
  ChevronRightIcon, ChevronLeftIcon, UserIcon, HomeIcon,
  ExclamationTriangleIcon, BanknotesIcon, PaperAirplaneIcon,
  ShieldCheckIcon, PhoneIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

const INSURANCE_COMPANIES: Record<string, { phone: string; fax?: string; web?: string }> = {
  '삼성화재':    { phone: '1588-5114', web: 'https://www.samsungfire.com' },
  '현대해상':    { phone: '1588-5656', web: 'https://www.hi.co.kr' },
  'KB손해보험':  { phone: '1544-0114', web: 'https://www.kbinsure.co.kr' },
  'DB손해보험':  { phone: '1588-0100', web: 'https://www.idbins.com' },
  '메리츠화재':  { phone: '1566-7711', web: 'https://www.meritzfire.com' },
  '한화손해보험': { phone: '1566-8000', web: 'https://www.hwgeneralins.com' },
  '롯데손해보험': { phone: '1588-3344', web: 'https://www.lotteins.co.kr' },
  'MG손해보험':  { phone: '1588-5959', web: 'https://www.mgfire.co.kr' },
  '흥국화재':    { phone: '1688-1688', web: 'https://www.흥국화재.kr' },
  '하나손해보험': { phone: '1566-3000', web: 'https://www.hanainsurance.co.kr' },
  '삼성생명':    { phone: '1588-3114', web: 'https://www.samsunglife.com' },
  '교보생명':    { phone: '1588-1001', web: 'https://www.kyobo.co.kr' },
  '한화생명':    { phone: '1577-6301', web: 'https://www.hanwhalife.com' },
  '신한라이프':  { phone: '1588-5580', web: 'https://www.shinhanlife.co.kr' },
  'ABL생명':    { phone: '1588-6500', web: 'https://www.abllife.co.kr' },
  'AIA생명':    { phone: '1588-9898', web: 'https://www.aia.co.kr' },
  '동양생명':    { phone: '1577-1004', web: 'https://www.myangel.co.kr' },
  '메트라이프생명': { phone: '1588-9600', web: 'https://www.metlife.co.kr' },
}

const COMPANY_NAMES = Object.keys(INSURANCE_COMPANIES)
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
  { id: 6, label: '동의 및 서명', icon: ShieldCheckIcon },
]

// ─── Signature Canvas Component ─────────────────────────────────────────────
function SignatureCanvas({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top }
  }

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    drawing.current = true
    const canvas = canvasRef.current!
    lastPos.current = getPos(e, canvas)
  }, [])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!drawing.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e, canvas)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1a1a2e'
    ctx.beginPath()
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }, [])

  const stopDraw = useCallback(() => {
    drawing.current = false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
    canvas.addEventListener('mouseleave', stopDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)
    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDraw)
      canvas.removeEventListener('mouseleave', stopDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDraw)
    }
  }, [startDraw, draw, stopDraw])

  const clear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const save = () => {
    const canvas = canvasRef.current!
    onSave(canvas.toDataURL('image/png'))
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-primary-200 rounded-2xl bg-gray-50 overflow-hidden relative" style={{ touchAction: 'none' }}>
        <div className="absolute top-2 left-3 text-[10px] text-gray-300 font-bold pointer-events-none">여기에 서명하세요</div>
        <canvas
          ref={canvasRef}
          width={520}
          height={180}
          className="w-full h-44 cursor-crosshair"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={clear} className="px-4 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          다시 그리기
        </button>
        <button type="button" onClick={save} className="px-4 py-2 text-xs font-black text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors">
          서명 확인 완료
        </button>
      </div>
    </div>
  )
}

// ─── Insurance Company Popup Modal ─────────────────────────────────────────
function InsurancePopup({ company, info, onClose }: {
  company: string
  info: { phone: string; web?: string }
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 text-xs font-bold mb-0.5">보상청구 접수 완료</p>
              <h3 className="text-xl font-black">{company}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-black text-emerald-800">청구가 성공적으로 접수되었습니다</p>
              <p className="text-xs text-emerald-600 mt-0.5">담당 설계사님이 보험사에 자료를 직접 송신합니다</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">보험사 직접 문의 방법</p>
            <a
              href={`tel:${info.phone}`}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <PhoneIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">보상 고객센터</p>
                <p className="text-sm font-black text-gray-900">{info.phone}</p>
              </div>
            </a>
          </div>

          {info.web && (
            <a
              href={info.web}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center text-sm font-bold text-primary-600 border border-primary-200 rounded-2xl hover:bg-primary-50 transition-colors"
            >
              {company} 홈페이지 바로가기 →
            </a>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-xs text-amber-700 font-medium leading-relaxed">
            📋 보험금 지급까지는 서류 심사 기간이 필요합니다. 설계사님이 진행 상황을 카카오톡/전화로 안내드립니다.
          </div>

          <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-colors">
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function ClaimPage() {
  const { planner } = useAttribution()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Post-submission popup state
  const [showPopup, setShowPopup] = useState(false)
  const [submittedCompany, setSubmittedCompany] = useState('')

  // Step 1
  const [name, setName] = useState('')
  const [residentFront, setResidentFront] = useState('')
  const [residentBack, setResidentBack] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Step 2
  const [sameAsPolicyholder, setSameAsPolicyholder] = useState(true)
  const [policyholderName, setPolicyholderName] = useState('')
  const [notificationPerson, setNotificationPerson] = useState('')

  // Step 3
  const [accidentType, setAccidentType] = useState<'질병' | '상해' | '교통사고' | ''>('')
  const [accidentDetail, setAccidentDetail] = useState('')
  // Car accident extra fields
  const [carAccidentDetail, setCarAccidentDetail] = useState('')
  const [carInsuranceClaim, setCarInsuranceClaim] = useState<boolean | null>(null)
  const [carInsuranceCompany, setCarInsuranceCompany] = useState('')
  const [carAgentPhone, setCarAgentPhone] = useState('')
  const [carPlateNumber, setCarPlateNumber] = useState('')

  // Step 4
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankHolder, setBankHolder] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'GENERAL' | 'AUTO_DEBIT'>('GENERAL')

  // Step 5
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [images, setImages] = useState<File[]>([])

  // Step 6
  const [consentThirdParty, setConsentThirdParty] = useState(false)
  const [signatureType, setSignatureType] = useState<'FACE' | 'NON_FACE'>('NON_FACE')
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('')
  const [signatureSaved, setSignatureSaved] = useState(false)

  const canProceed = () => {
    switch (currentStep) {
      case 1: return name && residentFront.length === 6 && residentBack.length >= 1 && phone
      case 2: return (!sameAsPolicyholder ? policyholderName : true) && notificationPerson
      case 3: {
        if (!accidentType || !accidentDetail) return false
        if (accidentType === '교통사고') {
          if (carInsuranceClaim === null) return false
          if (!carPlateNumber) return false
        }
        return true
      }
      case 4: return bankName && bankAccount && bankHolder
      case 5: return insuranceCompany
      case 6: return consentThirdParty && (signatureType === 'NON_FACE' || signatureSaved)
      default: return false
    }
  }

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    setSignatureSaved(true)
  }

  const handleSubmit = async () => {
    if (!consentThirdParty) return
    if (signatureType === 'FACE' && !signatureSaved) {
      alert('서명을 완료해 주세요.')
      return
    }
    setSubmitting(true)
    try {
      const uploadedUrls: string[] = []

      // Upload signature image if face mode
      if (signatureType === 'FACE' && signatureDataUrl) {
        const blob = await (await fetch(signatureDataUrl)).blob()
        const sigFile = new File([blob], 'signature.png', { type: 'image/png' })
        const sigPath = `claims/customer/sig_${Date.now()}.png`
        const { error: sigErr } = await supabase.storage.from('planner-assets').upload(sigPath, sigFile)
        if (!sigErr) {
          const { data: { publicUrl } } = supabase.storage.from('planner-assets').getPublicUrl(sigPath)
          uploadedUrls.push(publicUrl)
        }
      }

      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `claims/customer/${Date.now()}_${Math.random().toString(36).slice(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('planner-assets').upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('planner-assets').getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }

      const maskedResident = residentBack ? `${residentFront}-${residentBack[0]}******` : residentFront

      const { error } = await supabase.from('claims').insert({
        planner_id: planner?.id || null,
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
        car_accident_detail: accidentType === '교통사고' ? carAccidentDetail : null,
        car_insurance_claim: accidentType === '교통사고' ? carInsuranceClaim : null,
        car_insurance_company: accidentType === '교통사고' ? carInsuranceCompany || null : null,
        car_agent_phone: accidentType === '교통사고' ? carAgentPhone || null : null,
        car_plate_number: accidentType === '교통사고' ? carPlateNumber || null : null,
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

      // Show insurance company popup
      setSubmittedCompany(insuranceCompany)
      setShowPopup(true)
    } catch (err: any) {
      alert('제출 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Insurance Company Popup */}
      {showPopup && submittedCompany && INSURANCE_COMPANIES[submittedCompany] && (
        <InsurancePopup
          company={submittedCompany}
          info={INSURANCE_COMPANIES[submittedCompany]}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Hero */}
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

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30 shadow-sm">
        <div className="container max-w-2xl py-3 px-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isDone = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-primary-600 text-white' : isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400'}`}>
                      {isDone ? <CheckCircleIcon className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[9px] font-black hidden sm:block ${isActive ? 'text-primary-600' : isDone ? 'text-primary-400' : 'text-gray-300'}`}>{step.label}</span>
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

      {/* Form */}
      <div className="container max-w-2xl px-4 py-8 flex-1">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STEP {currentStep} / {STEPS.length}</p>
            <h2 className="text-xl font-black text-gray-900">{STEPS[currentStep - 1].label}</h2>
          </div>

          <div className="p-8 space-y-6">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <>
                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100 flex items-center gap-3">
                  <DocumentCheckIcon className="w-6 h-6 text-primary-600 shrink-0" />
                  <p className="text-xs text-primary-800 font-bold leading-relaxed">
                    본 신청서는 담당 설계사에게 안전하게 전달되어 보험사로 즉시 접수됩니다.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">이름 *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">주민등록번호 *</label>
                  <div className="flex items-center gap-2">
                    <input type="text" maxLength={6} value={residentFront} onChange={e => setResidentFront(e.target.value.replace(/\D/g, ''))} placeholder="앞 6자리" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest" />
                    <span className="text-gray-400 font-black text-lg">-</span>
                    <input type="password" maxLength={7} value={residentBack} onChange={e => setResidentBack(e.target.value.replace(/\D/g, ''))} placeholder="뒷 7자리" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">⚠️ 주민번호는 앞 7자리만 저장되고 나머지는 마스킹 처리됩니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">연락처 *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">주소</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="서울시 강남구 테헤란로 123" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">계약자 = 피보험자 동일 여부 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: true, label: '동일합니다' }, { val: false, label: '다릅니다' }].map(opt => (
                      <button key={String(opt.val)} type="button" onClick={() => setSameAsPolicyholder(opt.val)}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${sameAsPolicyholder === opt.val ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {!sameAsPolicyholder && (
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">계약자 이름 *</label>
                    <input type="text" value={policyholderName} onChange={e => setPolicyholderName(e.target.value)} placeholder="계약자 이름 입력" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">보상안내 받으실 분 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['본인', '계약자', '설계사', '법정대리인'].map(opt => (
                      <button key={opt} type="button" onClick={() => setNotificationPerson(opt)}
                        className={`py-3.5 rounded-2xl text-sm font-bold border-2 transition-all ${notificationPerson === opt ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">사고 유형 *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['질병', '상해', '교통사고'] as const).map(type => (
                      <button key={type} type="button"
                        onClick={() => {
                          setAccidentType(type)
                          setCarInsuranceClaim(null)
                          setCarInsuranceCompany('')
                          setCarAgentPhone('')
                          setCarPlateNumber('')
                          setCarAccidentDetail('')
                        }}
                        className={`py-5 rounded-2xl text-sm font-black border-2 transition-all whitespace-pre-line leading-tight ${
                          accidentType === type ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-500'
                        }`}>
                        {type === '질병' ? '🏥\n질병' : type === '상해' ? '🩹\n상해' : '🚗\n교통사고'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 공통: 사고 내용 */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    {accidentType === '교통사고' ? '진단명 / 치료 내용 *' : '사고 내용 *'}
                  </label>
                  <textarea rows={4} value={accidentDetail} onChange={e => setAccidentDetail(e.target.value)}
                    placeholder={accidentType === '교통사고'
                      ? '예시:\n- 병명: 경추 염좌, 요추 염좌\n- 치료 기간: 2024년 3월 1일 ~ 3월 20일 (20일)\n- 병원명: OO한방병원'
                      : '예시:\n- 병명: 고혈압성 심장질환\n- 입원 기간: 2024년 1월 5일 ~ 1월 12일 (7박 8일)\n- 병원명: OO대학교병원\n- 청구 내용: 입원비, 수술비, 약제비'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none leading-relaxed" />
                </div>

                {/* 교통사고 전용 추가 필드 */}
                {accidentType === '교통사고' && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                      <p className="text-xs font-black text-amber-700">🚗 교통사고 추가 정보</p>
                      <p className="text-xs text-amber-600 mt-0.5">아래 항목을 추가로 입력해 주세요.</p>
                    </div>

                    {/* 사고경위 */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                        사고 경위 *
                        <span className={`ml-2 normal-case font-medium ${ carAccidentDetail.length > 180 ? 'text-rose-400' : 'text-gray-300'}`}>
                          {carAccidentDetail.length}/200
                        </span>
                      </label>
                      <textarea rows={3} maxLength={200} value={carAccidentDetail} onChange={e => setCarAccidentDetail(e.target.value)}
                        placeholder="예시: 2024년 3월 1일 오전 10시경 서울 강남구 삼성동 교차로에서 신호 대기 중 후방 차량이 추돌하여 경추 및 요추 부위에 충격을 받아 인근 병원에서 치료를 받게 됨."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none leading-relaxed" />
                    </div>

                    {/* 자동차보험 처리여부 */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">자동차보험 처리 여부 *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ val: true, label: '✅ 예 (처리함)' }, { val: false, label: '❌ 아니오 (미처리)' }].map(opt => (
                          <button key={String(opt.val)} type="button" onClick={() => setCarInsuranceClaim(opt.val)}
                            className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                              carInsuranceClaim === opt.val ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-500'
                            }`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 자동차보험 처리 시 추가 필드 */}
                    {carInsuranceClaim === true && (
                      <>
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">담당 보험사</label>
                          <select value={carInsuranceCompany} onChange={e => setCarInsuranceCompany(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                            <option value="">보험사를 선택하세요</option>
                            {COMPANY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">담당자 연락처</label>
                          <input type="tel" value={carAgentPhone} onChange={e => setCarAgentPhone(e.target.value)}
                            placeholder="담당 보상 직원 연락처 (예: 010-0000-0000)"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                        </div>
                      </>
                    )}

                    {/* 본인 차량번호 */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">본인 차량번호 *</label>
                      <input type="text" value={carPlateNumber} onChange={e => setCarPlateNumber(e.target.value.toUpperCase())}
                        placeholder="예: 123가 4567"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 tracking-widest font-bold" />
                    </div>
                  </>
                )}
              </>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">입금 방식 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: 'GENERAL', label: '💳 일반 입금' }, { val: 'AUTO_DEBIT', label: '🔄 자동이체' }].map(opt => (
                      <button key={opt.val} type="button" onClick={() => setPaymentMethod(opt.val as any)}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${paymentMethod === opt.val ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">은행명 *</label>
                  <select value={bankName} onChange={e => setBankName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                    <option value="">은행을 선택하세요</option>
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">계좌번호 *</label>
                  <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="숫자만 입력 (예: 123456789012)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">예금주명 *</label>
                  <input type="text" value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder="예금주 이름" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">청구할 보험사 *</label>
                  <select value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                    <option value="">보험사를 선택하세요</option>
                    <optgroup label="손해보험사">
                      {COMPANY_NAMES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                    <optgroup label="생명보험사">
                      {COMPANY_NAMES.slice(10).map(c => <option key={c} value={c}>{c}</option>)}
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
                          {f.type.startsWith('image/') ? <img src={URL.createObjectURL(f)} alt="" className="object-cover w-full h-full" /> : <span className="text-xs text-gray-400 font-bold">PDF</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <>
                {/* Consent */}
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
                    <p><strong>[동의 거부 권리]</strong> 동의를 거부할 경우 보험금 청구 처리가 불가할 수 있습니다.</p>
                  </div>
                </div>
                <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${consentThirdParty ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                  <input type="checkbox" checked={consentThirdParty} onChange={e => setConsentThirdParty(e.target.checked)} className="w-5 h-5 mt-0.5 accent-primary-600 shrink-0" />
                  <span className="text-sm font-bold text-gray-700">위 제3자 정보 제공·조회 동의서에 <span className="text-primary-700 font-black">동의합니다. (필수)</span></span>
                </label>

                {/* Signature Type */}
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">서명 방식</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: 'NON_FACE', label: '📱 비대면 (온라인)' }, { val: 'FACE', label: '✍️ 대면 (직접 서명)' }].map(opt => (
                      <button key={opt.val} type="button" onClick={() => { setSignatureType(opt.val as any); setSignatureSaved(false); setSignatureDataUrl('') }}
                        className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${signatureType === opt.val ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Signature Canvas — shown only for FACE mode */}
                {signatureType === 'FACE' && (
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                      본인 서명 *
                      {signatureSaved && <span className="ml-2 text-emerald-500 normal-case font-bold">✓ 서명 완료</span>}
                    </label>
                    {signatureSaved ? (
                      <div className="relative">
                        <img src={signatureDataUrl} alt="서명" className="w-full h-44 object-contain border-2 border-emerald-200 rounded-2xl bg-gray-50" />
                        <button type="button" onClick={() => { setSignatureSaved(false); setSignatureDataUrl('') }}
                          className="absolute top-2 right-2 px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm">
                          다시 서명
                        </button>
                      </div>
                    ) : (
                      <SignatureCanvas onSave={handleSignatureSave} />
                    )}
                  </div>
                )}

                {/* Summary */}
                <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100 space-y-1.5">
                  <p className="text-xs font-black text-primary-800 uppercase tracking-widest mb-3">접수 정보 요약</p>
                  {[
                    ['이름', name], ['연락처', phone], ['보험사', insuranceCompany],
                    ['사고 유형', accidentType || '-'], ['입금 방식', paymentMethod === 'GENERAL' ? '일반' : '자동이체'],
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

          {/* Navigation */}
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon className="w-4 h-4" />이전
            </button>

            {currentStep < STEPS.length ? (
              <button type="button" onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))} disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-100">
                다음 단계 <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={!canProceed() || submitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-200">
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
