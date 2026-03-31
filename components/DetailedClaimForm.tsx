'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

export default function DetailedClaimForm({ onSuccess }: { onSuccess?: () => void }) {
  const { planner } = useAttribution()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [submittedCompany, setSubmittedCompany] = useState('')

  const [name, setName] = useState('')
  const [residentFront, setResidentFront] = useState('')
  const [residentBack, setResidentBack] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const [sameAsPolicyholder, setSameAsPolicyholder] = useState(true)
  const [policyholderName, setPolicyholderName] = useState('')
  const [notificationPerson, setNotificationPerson] = useState('')

  const [accidentType, setAccidentType] = useState<'질병' | '상해' | '교통사고' | ''>('')
  const [accidentDetail, setAccidentDetail] = useState('')
  const [carAccidentDetail, setCarAccidentDetail] = useState('')
  const [carInsuranceClaim, setCarInsuranceClaim] = useState<boolean | null>(null)
  const [carInsuranceCompany, setCarInsuranceCompany] = useState('')
  const [carAgentPhone, setCarAgentPhone] = useState('')
  const [carPlateNumber, setCarPlateNumber] = useState('')

  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankHolder, setBankHolder] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'GENERAL' | 'AUTO_DEBIT'>('GENERAL')

  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [images, setImages] = useState<File[]>([])

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

      setSubmittedCompany(insuranceCompany)
      setShowPopup(true)
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 3000)
      }
    } catch (err: any) {
      alert('제출 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col relative w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white">
      {/* Insurance Company Popup */}
      {showPopup && submittedCompany && INSURANCE_COMPANIES[submittedCompany] && (
        <InsurancePopup
          company={submittedCompany}
          info={INSURANCE_COMPANIES[submittedCompany]}
          onClose={() => {
            setShowPopup(false)
            if (onSuccess) onSuccess()
          }}
        />
      )}

      {/* Hero Header */}
      <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden py-8 px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-[10px] sm:text-xs font-bold mb-3 border border-white/20">
            <DocumentCheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            상세 보상청구서 작성란
          </div>
          <h1 className="text-xl sm:text-2xl font-black mb-1.5">보험 보상청구 신청서</h1>
          <p className="text-primary-200 text-xs sm:text-sm">고객 정보를 상세히 입력하여 청구서를 안전하게 처리합니다.</p>
        </div>
      </header>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 z-30 shadow-sm py-4 px-6 lg:px-8">
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isDone = currentStep > step.id
            return (
              <div key={step.id} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-primary-600 text-white' : isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400'}`}>
                    {isDone ? <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className={`text-[9px] sm:text-xs font-black hidden sm:block ${isActive ? 'text-primary-600' : isDone ? 'text-primary-400' : 'text-gray-300'}`}>{step.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full mx-1 sm:mx-2 mb-3.5 sm:mb-5 transition-colors ${isDone ? 'bg-primary-400' : 'bg-gray-100'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 w-full bg-gray-50 pb-8 flex justify-center">
        <div className="w-full max-w-3xl mt-6 lg:mt-8 px-4 lg:px-8">
          <div className="px-6 py-5 rounded-t-2xl border-b border-gray-100 bg-white">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">STEP {currentStep} / {STEPS.length}</p>
            <h2 className="text-lg md:text-xl font-black text-gray-900 mt-1">{STEPS[currentStep - 1].label}</h2>
          </div>

          <div className="p-6 md:p-8 space-y-6 bg-white rounded-b-2xl border border-gray-50 shadow-sm">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <>
                <div className="bg-primary-50 rounded-2xl p-4 md:p-5 border border-primary-100 flex items-center gap-3 md:gap-4">
                  <DocumentCheckIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-600 shrink-0" />
                  <p className="text-xs md:text-sm text-primary-800 font-bold leading-relaxed">
                    본 신청서는 담당 설계사에게 안전하게 전달되어 보험사로 즉시 접수됩니다.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">이름 *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">연락처 *</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">주민등록번호 *</label>
                  <div className="flex items-center gap-3">
                    <input type="text" maxLength={6} value={residentFront} onChange={e => setResidentFront(e.target.value.replace(/\D/g, ''))} placeholder="앞 6자리" className="flex-1 max-w-[150px] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest font-bold font-mono transition-shadow" />
                    <span className="text-gray-400 font-black text-lg">-</span>
                    <input type="password" maxLength={7} value={residentBack} onChange={e => setResidentBack(e.target.value.replace(/\D/g, ''))} placeholder="뒷 7자리" className="flex-1 max-w-[170px] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-center tracking-widest font-bold font-mono transition-shadow" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-emerald-500" /> 주민번호는 안전하게 뒷자리가 부분 암호화되어 저장됩니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">기본 주소</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="서울시 강남구 테헤란로 123 (선택입력)" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow" />
                </div>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <>
                <div className="p-1" />
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">계약자(보험료 납입자) = 피보험자 동일 여부 *</label>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {[{ val: true, label: '동일합니다' }, { val: false, label: '다릅니다' }].map(opt => (
                      <button key={String(opt.val)} type="button" onClick={() => setSameAsPolicyholder(opt.val)}
                        className={`py-4 md:py-5 rounded-2xl text-sm font-black border-2 transition-all ${sameAsPolicyholder === opt.val ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-500 hover:border-gray-300'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {!sameAsPolicyholder && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">실제 계약자 이름 *</label>
                    <input type="text" value={policyholderName} onChange={e => setPolicyholderName(e.target.value)} placeholder="계약자명" className="w-full md:w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                )}
                <div className="pt-4">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">보상 처리에 대한 안내를 받으실 분 *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['본인', '계약자', '설계사', '대리인'].map(opt => (
                      <button key={opt} type="button" onClick={() => setNotificationPerson(opt)}
                        className={`py-3 md:py-4 rounded-xl text-sm font-bold border-2 transition-all ${notificationPerson === opt ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'}`}>
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
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">사고 유형 (필수 항목) *</label>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {(['질병', '상해', '교통사고'] as const).map(type => (
                      <button key={type} type="button"
                        onClick={() => {
                          setAccidentType(type)
                          setCarInsuranceClaim(null)
                        }}
                        className={`py-5 md:py-6 rounded-2xl text-sm font-black border-2 transition-all whitespace-pre-line leading-tight shadow-sm ${
                          accidentType === type ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-100' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}>
                        {type === '질병' ? '🏥\n의료지원\n(질병)' : type === '상해' ? '🩹\n골절·파손\n(상해)' : '🚗\n차량충돌\n(교통사고)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    {accidentType === '교통사고' ? '사고로 인한 진단명 및 치료 내역 *' : '진단 및 상세 사고 내용 *'}
                  </label>
                  <textarea rows={5} value={accidentDetail} onChange={e => setAccidentDetail(e.target.value)}
                    placeholder={accidentType === '교통사고'
                      ? '상세하게 입력할수록 보상 처리가 빠릅니다.\n\n예시:\n- 병명 (의증): 경추 및 요추 염좌\n- 치료 (입원) 기간: 2024.03.01 ~ 진행중\n- 방문 병원명: OO정형외과'
                      : '상세하게 입력할수록 보상 처리가 빠릅니다.\n\n예시:\n- 주요 병명: 독감 (인플루엔자 A형)\n- 입원 또는 통원 날짜\n- 주요 청구 항목: 수액 주사, 입원비, 약제비'}
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none leading-relaxed transition-shadow" />
                </div>

                {accidentType === '교통사고' && (
                  <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 md:p-6 mt-6 space-y-5">
                    <p className="text-sm font-black text-amber-800 flex items-center gap-2 border-b border-amber-200/50 pb-3"><ExclamationTriangleIcon className="w-5 h-5" /> 자동차 사고 추가 기록란</p>
                    
                    <div>
                      <label className="block text-xs font-black text-amber-900/60 uppercase tracking-widest mb-2">상세 사고 경위 *</label>
                      <textarea rows={3} maxLength={200} value={carAccidentDetail} onChange={e => setCarAccidentDetail(e.target.value)}
                        placeholder="예: 정관대로에서 신호 대기 정차 중 가해차량이 후진으로 추돌함"
                        className="w-full border border-white bg-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label className="block text-xs font-black text-amber-900/60 uppercase tracking-widest mb-2">자보(자동차보험) 접수 유무 *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ val: true, label: '✅ 처리중(완료)' }, { val: false, label: '❌ 미접수상태' }].map(opt => (
                            <button key={String(opt.val)} type="button" onClick={() => setCarInsuranceClaim(opt.val)}
                              className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                                carInsuranceClaim === opt.val ? 'border-amber-500 bg-amber-100 text-amber-800 font-black' : 'border-white bg-white/80 text-gray-500'
                              }`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {carInsuranceClaim && (
                        <div>
                          <label className="block text-xs font-black text-amber-900/60 uppercase tracking-widest mb-2">상대방 차량 번호</label>
                          <input type="text" value={carPlateNumber} onChange={e => setCarPlateNumber(e.target.value.toUpperCase())}
                            placeholder="예: 321차 9876" className="w-full border border-white bg-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 font-bold tracking-widest" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-center gap-6 md:gap-8 mb-6">
                  {[{ val: 'GENERAL', label: '💳 본인계좌 입금' }, { val: 'AUTO_DEBIT', label: '🔄 기존 자동이체 계좌' }].map(opt => (
                    <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" checked={paymentMethod === opt.val} onChange={() => setPaymentMethod(opt.val as any)}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer" />
                      <span className={`text-sm md:text-base transition-colors ${paymentMethod === opt.val ? 'font-black text-primary-700' : 'font-bold text-gray-400 group-hover:text-gray-600'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="space-y-5 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">수령 은행 *</label>
                      <select value={bankName} onChange={e => setBankName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white shadow-sm font-medium">
                        <option value="">은행을 선택하세요</option>
                        {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">수령인 (예금주) *</label>
                      <input type="text" value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder="홍길동" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">입금 계좌 번호 *</label>
                    <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value.replace(/\D/g, ''))} placeholder="'-' 하이픈 없이 숫자만 연속해서 입력" className="w-full md:w-2/3 border border-gray-200 rounded-xl px-4 py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm tracking-wider font-mono" />
                  </div>
                </div>
              </>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <>
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">청구 대상 보험사 *</label>
                  <select value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} className="w-full md:w-1/2 border-2 border-primary-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50 text-primary-900 font-bold shadow-sm">
                    <option value="">이곳을 눌러 보험사를 찾아주세요</option>
                    <optgroup label="손해보험사">
                      {COMPANY_NAMES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                    <optgroup label="생명보험사">
                      {COMPANY_NAMES.slice(10).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  </select>
                </div>
                
                <div className="h-px bg-gray-100 mb-8" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-800 uppercase tracking-widest">
                      <PhotoIcon className="w-5 h-5 text-primary-500" /> 증빙 서류 원본 업로드 구역
                    </label>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">{images.length}/15</span>
                  </div>
                  <label className="flex flex-col items-center justify-center w-full min-h-[160px] px-8 py-8 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-white hover:bg-primary-50 hover:border-primary-400 transition-all group overflow-hidden relative">
                    <PhotoIcon className="w-12 h-12 text-gray-300 group-hover:text-primary-400 transition-colors mb-4 group-hover:scale-110" />
                    {images.length > 0 ? (
                      <div className="text-center z-10 relative">
                        <p className="text-base font-black text-primary-700 bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm box-shadow-sm">{images.length}개의 서류가 준비되었습니다</p>
                      </div>
                    ) : (
                      <div className="text-center z-10 relative">
                        <p className="text-sm font-black text-gray-600 mb-1">여기를 클릭하여 촬영된 사진을 선택하세요</p>
                        <p className="text-xs text-gray-400 font-medium">영수증, 진료비 세부내역서, 처방전 등</p>
                      </div>
                    )}
                    <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={e => { if (e.target.files) setImages(Array.from(e.target.files)) }} />
                  </label>
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 w-full">
                      {images.map((f, i) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden border border-gray-200 h-20 w-20 md:h-24 md:w-24 bg-gray-100 flex items-center justify-center transition-all hover:ring-2 hover:ring-primary-500 hover:shadow-lg">
                          {f.type.startsWith('image/') ? <img src={URL.createObjectURL(f)} alt="" className="object-cover w-full h-full" /> : <span className="text-xs font-black text-gray-400">PDF</span>}
                          <button type="button" onClick={(e) => { e.preventDefault(); setImages(images.filter((_, idx) => idx !== i)) }} className="absolute top-1 right-1 bg-black/50 hover:bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-primary-50/50 rounded-2xl p-5 md:p-6 border border-primary-100/50">
                  <h3 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2 border-b border-primary-100 pb-3">
                    <ShieldCheckIcon className="w-5 h-5 text-primary-600" /> 개인정보 및 제3자 제공 동의 요약
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-600/90 leading-relaxed font-medium">
                    보험금 청구 및 지급 심사를 목적으로 담당 설계사와 보험사 및 관련 기간에 제출해주신 서류와 인적사항의 내용이 제공됨을 확인하고 동의합니다. (보유 기간: 5년)
                  </div>
                </div>
                
                <label className={`flex items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${consentThirdParty ? 'border-primary-600 bg-primary-100/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="checkbox" checked={consentThirdParty} onChange={e => setConsentThirdParty(e.target.checked)} className="w-6 h-6 outline-none text-primary-600 focus:ring-0 rounded cursor-pointer" />
                  <span className="text-sm md:text-base font-black text-gray-800">모든 사항을 이해했으며 이에 동의합니다. (필수)</span>
                </label>

                <div className="border-t border-gray-100 pt-6">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">자필 서명 진행</label>
                  
                  {/* Signature Type */}
                  <div className="flex gap-4 mb-5 border-b border-gray-100 pb-5">
                    {[{ val: 'NON_FACE', label: '모바일 비대면 인증 (자동 동의 처리)' }, { val: 'FACE', label: '단말기에 직접 자필 서명하여 첨부' }].map(opt => (
                      <label key={opt.val} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" checked={signatureType === opt.val} onChange={() => { setSignatureType(opt.val as any); setSignatureSaved(false); setSignatureDataUrl('') }} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                        <span className={`text-sm tracking-tight transition-colors ${signatureType === opt.val ? 'font-black text-primary-700' : 'font-bold text-gray-500 group-hover:text-gray-700'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  {signatureType === 'FACE' && (
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                      {signatureSaved ? (
                        <div className="relative">
                          <img src={signatureDataUrl} alt="서명" className="w-full h-40 md:h-56 object-contain bg-emerald-50" />
                          <div className="absolute inset-0 border-2 border-emerald-400 rounded-2xl pointer-events-none" />
                          <button type="button" onClick={() => { setSignatureSaved(false); setSignatureDataUrl('') }}
                            className="absolute top-3 right-3 px-4 py-2 text-xs font-bold text-white bg-black/60 rounded-xl hover:bg-black transition-colors backdrop-blur-sm shadow-xl flex items-center gap-1.5">
                            <XMarkIcon className="w-3.5 h-3.5" /> 다시 서명하기
                          </button>
                        </div>
                      ) : (
                        <div className="p-1"><SignatureCanvas onSave={handleSignatureSave} /></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="px-6 md:px-8 py-5 flex items-center justify-between gap-4 mt-4 bg-transparent border-t border-transparent">
            <button type="button" onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}
              className={`flex items-center justify-center gap-1.5 px-5 md:px-6 py-3.5 rounded-2xl text-sm font-black transition-all w-24 md:w-32 ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-white border text-gray-600 border-gray-200 shadow-sm hover:bg-gray-50'}`}>
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />이전
            </button>

            {currentStep < STEPS.length ? (
              <button type="button" onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))} disabled={!canProceed()}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-sm md:text-base font-black disabled:opacity-40 transition-all flex-1 md:flex-none shadow-xl hover:bg-gray-800 disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0">
                다음 <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={!canProceed() || submitting}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl text-sm md:text-base font-black disabled:opacity-40 transition-all flex-1 shadow-2xl shadow-primary-500/30 hover:bg-primary-700 disabled:shadow-none animate-pulse hover:animate-none group">
                {submitting ? (
                  '로딩 중...'
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5 md:w-6 md:h-6 -rotate-12 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    보상청구 접수하기
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
