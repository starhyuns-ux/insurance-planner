'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAttribution } from '@/lib/attribution'
import {
  DocumentCheckIcon, PhotoIcon, CheckCircleIcon,
  ChevronRightIcon, ChevronLeftIcon, UserIcon, HomeIcon,
  ExclamationTriangleIcon, BanknotesIcon, PaperAirplaneIcon,
  ShieldCheckIcon, PhoneIcon, XMarkIcon, DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { submitClaimAction } from '@/lib/actions/claimActions'

const ConsentItem = ({ label, insured, setInsured, beneficiary, setBeneficiary }: any) => (
  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <p className="text-xs font-black text-gray-700">{label}</p>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={insured} onChange={(e) => setInsured(e.target.checked)} className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
        <span className="text-[11px] font-bold text-gray-500 group-hover:text-primary-600 transition-colors">피보험자 동의</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={beneficiary} onChange={(e) => setBeneficiary(e.target.checked)} className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
        <span className="text-[11px] font-bold text-gray-500 group-hover:text-primary-600 transition-colors">수익자 동의</span>
      </label>
    </div>
  </div>
)

import { INSURANCE_COMPANIES } from '@/lib/constants/insurance'

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
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
    
    // Scale coordinates based on canvas internal width vs visual width
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return { 
      x: (clientX - rect.left) * scaleX, 
      y: (clientY - rect.top) * scaleY 
    }
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
      <div className="border-2 border-dashed border-gray-300 rounded-[2rem] bg-white overflow-hidden relative shadow-inner" style={{ touchAction: 'none' }}>
        <div className="absolute top-4 left-6 text-xs text-gray-300 font-black uppercase tracking-widest pointer-events-none flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4" /> 자필 서명란 (Signature Area)
        </div>
        <canvas
          ref={canvasRef}
          width={520}
          height={180}
          className="w-full h-48 cursor-crosshair"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button type="button" onClick={clear} className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-gray-500 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
          서명 지우기
        </button>
        <button type="button" onClick={save} className="w-full sm:w-auto flex-1 px-8 py-3 text-sm font-black text-white bg-primary-600 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center gap-2">
          <CheckCircleIcon className="w-5 h-5" /> 서명 확인 완료 (저장)
        </button>
      </div>
      <p className="text-[10px] text-primary-500 font-bold text-center">※ 위 버튼을 클릭해야 서명이 최종 저장됩니다.</p>
    </div>
  )
}

interface InsurancePopupProps {
  company: string
  info: any
  onClose: () => void
  claimPdfUrl?: string
}

function InsurancePopup({ company, info, onClose, claimPdfUrl }: InsurancePopupProps) {
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
              <p className="text-xs text-emerald-600 mt-0.5">
                {info.callFirst ? '콜센터 상담 후 팩스번호를 발급받으세요' : '담당 설계사님이 보험사에 자료를 직접 송신합니다'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              {info.callFirst ? '가상 팩스번호 발급 콜센터' : '보험사 직접 문의 방법'}
            </p>
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

          {claimPdfUrl && (
            <a
              href={claimPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
            >
              <DocumentTextIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              작성된 보상청구서(PDF) 확인하기
            </a>
          )}

          <div className={`border rounded-2xl p-3 text-xs font-medium leading-relaxed ${info.callFirst ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
            {info.callFirst 
              ? '💡 이 보험사는 보안 정책상 콜센터를 통해 당일 전용 팩스번호를 발급받아야 접수가 가능합니다. 지금 바로 전화하여 번호를 안내받으세요.'
              : '📋 보험금 지급까지는 서류 심사 기간이 필요합니다. 설계사님이 진행 상황을 카카오톡/전화로 안내드립니다.'}
          </div>

          <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-colors">
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DetailedClaimForm({ onSuccess, plannerId, initialData }: { onSuccess?: () => void, plannerId?: string, initialData?: any }) {
  const { planner: attributedPlanner } = useAttribution()
  const planner = plannerId ? { id: plannerId } : attributedPlanner
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [submittedCompany, setSubmittedCompany] = useState('')
  const [claimPdfUrl, setClaimPdfUrl] = useState('')

  const [name, setName] = useState('')
  const [residentFront, setResidentFront] = useState('')
  const [residentBack, setResidentBack] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Pre-fill from initialData (Customer CRM)
  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name)
      if (initialData.phone) setPhone(initialData.phone)
      if (initialData.address) setAddress(initialData.address)
      
      if (initialData.resident_number) {
        const parts = initialData.resident_number.split('-')
        if (parts[0]) setResidentFront(parts[0])
        if (parts[1]) setResidentBack(parts[1])
      } else if (initialData.birth_date) {
        // Fallback to birth_date if resident_number is missing
        const birth = initialData.birth_date.replace(/\D/g, '')
        if (birth.length >= 6) setResidentFront(birth.slice(2, 8))
      }
    }
  }, [initialData])

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

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])

  const [signatureSaved, setSignatureSaved] = useState(false)
  const [signatureType] = useState<'FACE'>('FACE')
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('')

  // Granular Consents (5 sections x 2 roles = 10 checkboxes)
  const [c1In, setC1In] = useState(false) // 1. Collection - Insured
  const [c1Be, setC1Be] = useState(false) // 1. Collection - Beneficiary
  const [c2In, setC2In] = useState(false) // 2. Inquiry - Insured
  const [c2Be, setC2Be] = useState(false) // 2. Inquiry - Beneficiary
  const [c3In, setC3In] = useState(false) // 3. Provision - Insured
  const [c3Be, setC3Be] = useState(false) // 3. Provision - Beneficiary
  const [c4In, setC4In] = useState(false) // 4a. Disease info - Insured
  const [c4Be, setC4Be] = useState(false) // 4a. Disease info - Beneficiary
  const [c5In, setC5In] = useState(false) // 4b. Unique ID info - Insured
  const [c5Be, setC5Be] = useState(false) // 4b. Unique ID info - Beneficiary

  const allAgreed = c1In && c1Be && c2In && c2Be && c3In && c3Be && c4In && c4Be && c5In && c5Be;
  const toggleAllConsents = (val: boolean) => {
    setC1In(val); setC1Be(val);
    setC2In(val); setC2Be(val);
    setC3In(val); setC3Be(val);
    setC4In(val); setC4Be(val);
    setC5In(val); setC5Be(val);
  }

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
      case 5: return selectedCompanies.length > 0
      case 6: return allAgreed && signatureSaved
      default: return false
    }
  }

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    setSignatureSaved(true)
  }

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const handleSubmit = async () => {
    if (!allAgreed) return
    if (!signatureSaved) {
      alert('자필 서명을 완료한 후 [서명 확인 완료] 버튼을 눌러주세요.')
      return
    }
    setSubmitting(true)
    try {
      const uploadedUrls: string[] = []

      if (signatureDataUrl) {
        const blob = dataURLtoBlob(signatureDataUrl)
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

      const fullResident = residentBack ? `${residentFront}-${residentBack}` : residentFront

      const successClaims: any[] = []

      // Loop through all selected companies and create individual claims
      for (const company of selectedCompanies) {
        const result = await submitClaimAction({
          planner_id: planner?.id || null,
          customer_name: name,
          customer_phone: phone,
          address,
          resident_number: fullResident,
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
          insurance_company: company,
          image_urls: uploadedUrls,
          signature_type: signatureType,
          consent_third_party: true,
          consent_at: new Date().toISOString(),
          status: 'PENDING',
          transmission_status: 'NOT_SENT',
        })

        if (!result.success) throw new Error(`${company} 데이터 저장에 실패했습니다.`)
        if (result.id) successClaims.push({ id: result.id })
      }

      // Now trigger transmission for the first company (for popup info)
      if (successClaims.length > 0) {
        const response = await fetch('/api/claims/transmit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claimId: successClaims[0].id })
        })

        const transmitResult = await response.json()
        if (transmitResult.claimPdfUrl) {
          setClaimPdfUrl(transmitResult.claimPdfUrl)
        }
      }

      setSubmittedCompany(selectedCompanies[0]) // Always use the first one as representative for the popup
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
          claimPdfUrl={claimPdfUrl}
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
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">청구 대상 보험사 (다중 선택 가능) *</label>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{selectedCompanies.length}개 선택됨</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">손해보험사</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {COMPANY_NAMES.slice(0, 12).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedCompanies(prev => 
                                prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
                              )
                            }}
                            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all text-center ${
                              selectedCompanies.includes(c) 
                                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {c}
                            {selectedCompanies.includes(c) && <CheckCircleIcon className="w-4 h-4 inline-block ml-1" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">생명보험사</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {COMPANY_NAMES.slice(12).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedCompanies(prev => 
                                prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
                              )
                            }}
                            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all text-center ${
                              selectedCompanies.includes(c) 
                                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {c}
                            {selectedCompanies.includes(c) && <CheckCircleIcon className="w-4 h-4 inline-block ml-1" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedCompanies.some(c => INSURANCE_COMPANIES[c]?.callFirst) && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-amber-900">주의: 상담이 필요한 보험사가 포함되어 있습니다</p>
                        <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed font-medium">선택하신 보험사 중 일부는 보안 정책상 콜센터를 통해 팩스번호를 직접 발급받아야 합니다. 접수 완료 후 안내를 확인해 주세요.</p>
                      </div>
                    </div>
                  )}
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
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-gray-800 text-sm flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5 text-primary-600" /> 개인신용정보 동의 처리서
                    </h3>
                  </div>
                  
                  <div className="h-64 overflow-y-auto p-5 text-gray-600 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {/* Intro */}
                    <section className="space-y-2">
                      <h4 className="text-xs font-black text-primary-700 bg-primary-50 inline-block px-2 py-1 rounded">개인(신용)정보 처리 동의서 / 소비자 권익보호에 관한 사항</h4>
                      <p className="text-xs leading-relaxed font-bold text-gray-800">
                        본 동의를 거부하시는 경우에는 보험금 청구 관련 서비스가 일부 제한될 수 있고 본 동의서에 의한 개인(신용)정보 조회는 귀하의 신용등급에 영향을 주지 않습니다.
                      </p>
                    </section>

                    {/* Section 1 */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                        <h5 className="text-sm font-black text-gray-800">개인(신용)정보 수집·이용에 관한 동의사항</h5>
                      </div>
                      <div className="pl-7 space-y-3">
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 개인(신용)정보의 수집·이용 목적 ]</p>
                          <ul className="text-xs space-y-1 list-disc pl-4">
                            <li>보험금지급·심사(보험금청구서류 접수대행 서비스 포함) 및 보험사고 조사(보험사기 조사 포함), 보험계약유지 및 관리, 계좌이체, 보험금 관련 민원처리 및 분쟁대응</li>
                            <li>금융거래(보험료 및 보험금 등 출·수납을 위한 금융거래 신청, 자동이체 등 접수) 관련 업무</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 수집·이용할 개인(신용)정보의 내용 ]</p>
                          <ul className="text-xs space-y-1 list-disc pl-4">
                            <li>개인식별정보(성명, 주민등록번호, 외국인등록번호, 운전면허증번호, 주소, 전화번호, 전자우편주소 등), 계좌정보</li>
                            <li>보험사고 조사(보험사기 조사 포함) 및 손해사정업무 수행과 관련하여 취득한 개인(신용)정보[경찰, 공공기관, 의료기관 등으로부터 본인의 위임을 받아 취득한 각종 조사서, 증명서, 진료기록 등에 포함된 개인(신용)정보 포함]</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 개인(신용)정보의 보유·이용 기간 ]</p>
                          <p className="text-xs leading-relaxed pl-4">
                            수집·이용 동의일로부터 거래종료 후 5년까지(단, 거래종료 후 5년이 경과한 후에는 보험금 지급, 금융사고 조사, 보험사기 방지·적발, 민원처리, 법령상 의무이행을 위한 경우에 한하여 보유·이용하며, 별도 보관)
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                        <h5 className="text-sm font-black text-gray-800">개인(신용)정보의 조회에 관한 사항</h5>
                      </div>
                      <div className="pl-7 space-y-3">
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 개인(신용)정보 조회목적 ]</p>
                          <ul className="text-xs space-y-1 list-disc pl-4">
                            <li>보험금지급·심사(보험금청구서류 접수대행 서비스 포함) 및 보험사고 조사(보험사기 조사 포함)</li>
                            <li>금융거래(보험료 및 보험금 등 출·수납을 위한 금융거래 신청, 자동이체 등 접수) 관련 업무</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 조회할 개인(신용)정보 ]</p>
                          <p className="text-xs leading-relaxed pl-4">보험계약정보, 보험금지급 관련 정보(사고정보 포함), 질병 및 상해관련 정보</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-400 mb-1">[ 조회동의 유효 기간 및 보유·이용 기간 ]</p>
                          <p className="text-xs leading-relaxed pl-4">
                            수집·이용 동의일로부터 거래종료 후 5년까지(단, 거래종료 후 5년이 경과한 후에는 보험금 지급, 금융사고 조사, 분쟁해결, 민원처리, 법령상 의무이행을 위한 경우에 한하여 보유·이용하며, 별도 보관함)
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                        <h5 className="text-sm font-black text-gray-800">개인(신용)정보의 제공에 관한 사항</h5>
                      </div>
                      <div className="pl-7 space-y-3 text-xs leading-relaxed">
                        <p><span className="font-bold text-gray-800">[ 제공받는 자 ] :</span> 생명/손해보험협회, 금융위, 금감원, 국토부, 재보험사, 금융기관, 손해사정업체, 의료기관, 변호사 등</p>
                        <p><span className="font-bold text-gray-800">[ 이용목적 ] :</span> 신용정보집중관리, 법령에 따른 업무수행, 계약이행에 필요한 업무, 보험사고조사, 진료비심사, 구상금분쟁심의 등</p>
                        <p><span className="font-bold text-gray-800">[ 보유·이용기간 ] :</span> 개인(신용)정보를 제공받는 자의 이용목적을 달성할 때까지(최대 거래종료 후 5년까지)</p>
                      </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">4</span>
                        <h5 className="text-sm font-black text-gray-800">고유식별정보의 처리에 관한 사항</h5>
                      </div>
                      <div className="pl-7 text-xs leading-relaxed">
                        <p>
                          「개인정보보호법」 및 「신용정보의 이용 및 보호에 관한 법률」에 따라 상기의 개인(신용)정보에 대한 개별 동의사항에 대하여 귀하의 <span className="font-bold text-primary-600">민감정보(질병·상해정보) 및 고유식별정보(주민번호·외국인등록번호·운전면허증번호)</span>를 처리(수집·이용, 조회, 제공)하는 것에 동의합니다.
                        </p>
                      </div>
                    </section>

                    <div className="p-4 bg-gray-50 rounded-xl text-[10px] text-gray-400 font-bold leading-relaxed border border-gray-100">
                      ※ 본 동의는 당사 및 당사 업무수탁자가 개인정보보호법 및 신용정보의 이용 및 보호에 관한 법률에 따라 본 보상청구와 관련하여 귀하의 정보를 수집·이용·조회·제공하는 데 필요한 법적 절차입니다.
                    </div>
                  </div>
                </div>

                {/* Granular Consent Checkboxes */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => toggleAllConsents(!allAgreed)}
                    className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-black transition-all ${
                      allAgreed ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                    약관 내용을 모두 확인했으며 전체 동의합니다
                  </button>

                  <div className="grid grid-cols-1 gap-3">
                    <ConsentItem label="1. 수집·이용 동의" insured={c1In} setInsured={setC1In} beneficiary={c1Be} setBeneficiary={setC1Be} />
                    <ConsentItem label="2. 조회 동의" insured={c2In} setInsured={setC2In} beneficiary={c2Be} setBeneficiary={setC2Be} />
                    <ConsentItem label="3. 제3자 제공 동의" insured={c3In} setInsured={setC3In} beneficiary={c3Be} setBeneficiary={setC3Be} />
                    <ConsentItem label="4a. 질병·상해정보 처리 동의" insured={c4In} setInsured={setC4In} beneficiary={c4Be} setBeneficiary={setC4Be} />
                    <ConsentItem label="4b. 고유식별정보 처리 동의" insured={c5In} setInsured={setC5In} beneficiary={c5Be} setBeneficiary={setC5Be} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                    <label className="text-sm font-black text-gray-800 uppercase tracking-widest">실명 자필 서명 진행 *</label>
                  </div>
                  
                  {/* Removed Signature Type Selection */}
                  
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
