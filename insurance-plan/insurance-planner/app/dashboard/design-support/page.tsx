'use client'

import React, { useState, useEffect } from 'react'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { 
  ClipboardDocumentIcon, 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon,
  DocumentPlusIcon,
  UserIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'

interface RiderItem {
  name: string
  defaultAmount: string
  category: 'diagnosis' | 'surgery' | 'etc' | 'treatment'
}

const DEFAULT_RIDERS: RiderItem[] = [
  // 진단비
  { name: '일반암 진단비', defaultAmount: '5,000만원', category: 'diagnosis' },
  { name: '유사암 진단비', defaultAmount: '1,000만원', category: 'diagnosis' },
  { name: '유방암 진단비', defaultAmount: '3,000만원', category: 'diagnosis' },
  { name: '폐암·췌장·간암 진단비', defaultAmount: '3,000만원', category: 'diagnosis' },
  { name: '전립선암 진단비', defaultAmount: '2,000만원', category: 'diagnosis' },
  { name: '뇌혈관질환 진단비', defaultAmount: '2,000만원', category: 'diagnosis' },
  { name: '허혈성심장질환 진단비', defaultAmount: '2,000만원', category: 'diagnosis' },
  { name: '심·뇌혈관질환 수술비', defaultAmount: '1,000만원', category: 'diagnosis' },
  
  // 치료비
  { name: '암 주요 치료비', defaultAmount: '최대 1억원', category: 'treatment' },
  { name: '순환계 치료비', defaultAmount: '2,000만원', category: 'treatment' },
  { name: '항암방사선 치료비', defaultAmount: '2,000만원', category: 'treatment' },
  { name: '표적항암 약물치료비', defaultAmount: '5,000만원', category: 'treatment' },
  { name: '중입자·양성자 치료비', defaultAmount: '5,000만원', category: 'treatment' },
  
  // 수술비/입원일당
  { name: '질병 수술비', defaultAmount: '30만원', category: 'surgery' },
  { name: '상해 수술비', defaultAmount: '100만원', category: 'surgery' },
  { name: '질병 1-5종 수술비', defaultAmount: '최대 1,000만원', category: 'surgery' },
  { name: '상해 1-5종 수술비', defaultAmount: '최대 1,000만원', category: 'surgery' },
  { name: '질병 입원일당(1일이상)', defaultAmount: '3만원', category: 'surgery' },
  { name: '상해 입원일당(1일이상)', defaultAmount: '3만원', category: 'surgery' },
  
  // 후유장해 및 기타
  { name: '질병 후유장해(3%이상)', defaultAmount: '3,000만원', category: 'etc' },
  { name: '상해 후유장해(3%이상)', defaultAmount: '5,000만원', category: 'etc' },
  { name: '가족 일상생활중 배상책임', defaultAmount: '1억원(대인/대물)', category: 'etc' },
  { name: '독감(인플루엔자) 치료비', defaultAmount: '20만원', category: 'etc' }
]

const INSURANCE_TYPES = [
  '종합건강보험',
  '암보험',
  '운전자보험',
  '어린이(자녀)보험',
  '치아보험',
  '화재/재물보험',
  '펫보험',
  '간편/유병자보험',
  '정기/종신보험'
]

export default function DesignSupportPage() {
  const { planner } = usePlanner()
  
  // Form States
  const [customerName, setCustomerName] = useState('')
  const [gender, setGender] = useState<'M' | 'F'>('M')
  const [birthdate, setBirthdate] = useState('')
  const [insuranceAge, setInsuranceAge] = useState(0)
  const [phone, setPhone] = useState('')
  const [job, setJob] = useState('')
  const [address, setAddress] = useState('')
  const [driving, setDriving] = useState('자가용 운전')
  const [insuranceType, setInsuranceType] = useState('종합건강보험')
  const [extraNotes, setExtraNotes] = useState('최저 보험료 및 가성비 좋은 플랜으로 설계 부탁드립니다.')
  const [editedMessageText, setEditedMessageText] = useState('')

  // Checkbox States for Riders
  const [checkedRiders, setCheckedRiders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    DEFAULT_RIDERS.forEach(r => {
      initial[r.name] = false
    })
    // Check some defaults
    initial['일반암 진단비'] = true
    initial['유사암 진단비'] = true
    initial['뇌혈관질환 진단비'] = true
    initial['허혈성심장질환 진단비'] = true
    return initial
  })

  // Amount States for Riders
  const [riderAmounts, setRiderAmounts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    DEFAULT_RIDERS.forEach(r => {
      initial[r.name] = r.defaultAmount
    })
    return initial
  })

  // Calculate Insurance Age in Korea (보험연령)
  useEffect(() => {
    if (birthdate && birthdate.length === 6) {
      const yy = parseInt(birthdate.substring(0, 2), 10)
      const mm = parseInt(birthdate.substring(2, 4), 10)
      const dd = parseInt(birthdate.substring(4, 6), 10)
      
      const currentYear = new Date().getFullYear()
      
      const birthYear = yy + (yy > (currentYear % 100) ? 1900 : 2000)
      const birthDate = new Date(birthYear, mm - 1, dd)
      const today = new Date()
      
      let diffMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())
      if (today.getDate() < birthDate.getDate()) {
        diffMonths--
      }
      
      const insAge = Math.floor((diffMonths + 3) / 12)
      setInsuranceAge(insAge >= 0 ? insAge : 0)
    } else {
      setInsuranceAge(0)
    }
  }, [birthdate])

  const toggleRider = (name: string) => {
    setCheckedRiders(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const handleAmountChange = (name: string, value: string) => {
    setRiderAmounts(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectAll = (category?: 'diagnosis' | 'surgery' | 'etc' | 'treatment') => {
    setCheckedRiders(prev => {
      const updated = { ...prev }
      DEFAULT_RIDERS.forEach(r => {
        if (!category || r.category === category) {
          updated[r.name] = true
        }
      })
      return updated
    })
  }

  const handleDeselectAll = (category?: 'diagnosis' | 'surgery' | 'etc' | 'treatment') => {
    setCheckedRiders(prev => {
      const updated = { ...prev }
      DEFAULT_RIDERS.forEach(r => {
        if (!category || r.category === category) {
          updated[r.name] = false
        }
      })
      return updated
    })
  }

  // Generate SMS Formatted Text
  const generateMessageText = () => {
    let text = `[매니저 설계 요청서]\n\n`
    text += `■ 고객 정보\n`
    text += `- 성함: ${customerName || '(미입력)'} (${gender === 'M' ? '남' : '여'})\n`
    text += `- 생년월일: ${birthdate || '(미입력)'} (보험연령: ${insuranceAge > 0 ? `${insuranceAge}세` : '계산불가'})\n`
    if (phone) text += `- 연락처: ${phone}\n`
    if (job) text += `- 직업/직무: ${job}\n`
    if (address) text += `- 주소: ${address}\n`
    text += `- 운전 여부: ${driving}\n\n`
    
    text += `■ 요청 보험\n`
    text += `- 구분: ${insuranceType}\n\n`
    
    text += `■ 요청 특약 및 가입금액\n`
    
    const activeRiders = DEFAULT_RIDERS
      .filter(r => checkedRiders[r.name])
      .map(r => `- ${r.name}: ${riderAmounts[r.name] || r.defaultAmount}`)
      
    if (activeRiders.length > 0) {
      text += activeRiders.join('\n') + '\n'
    } else {
      text += `- 선택된 특약 없음 (기본 보장 기준)\n`
    }
    
    if (extraNotes) {
      text += `\n■ 기타 요청사항\n- ${extraNotes}\n`
    }
    
    if (planner) {
      text += `\n담당 설계사: ${planner.name} (연락처: ${planner.phone || '등록대기'})`
    }
    
    return text
  }

  const messageText = generateMessageText()

  useEffect(() => {
    setEditedMessageText(messageText)
  }, [customerName, gender, birthdate, insuranceAge, phone, job, address, driving, insuranceType, checkedRiders, riderAmounts, extraNotes, planner])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedMessageText)
    toast.success('설계 요청서 내용이 클립보드에 복사되었습니다! 카카오톡이나 문자창에 붙여넣기(Ctrl+V) 하세요.')
  }

  const sendSMS = () => {
    // Open native messaging application via sms URI scheme
    const smsUrl = `sms:?body=${encodeURIComponent(editedMessageText)}`
    window.open(smsUrl, '_blank')
    toast.success('문자(SMS) 앱 실행 링크가 열렸습니다. (기기에 문자 연동 프로그램이 필요합니다)')
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header Panel */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-primary-600"><DocumentPlusIcon className="w-80 h-80" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">설계 매니저 지원 시스템</h1>
            <p className="text-gray-500 font-medium text-lg">설계 매니저에게 전달할 가입 특약과 고객 정보를 취합해 설계요청 문자를 작성합니다.</p>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-[2rem] p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><InformationCircleIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-black text-blue-900">간편 설계요청 전송 가이드</p>
            <p className="text-xs text-blue-700 mt-0.5">매니저 요청용 포맷으로 가공된 설계 내역을 복사하거나 문자로 바로 발송해 보세요.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Form: Inputs and Checkboxes */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Section 1: Customer Information */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3 border-gray-50">
              <UserIcon className="w-5 h-5 text-primary-500" />
              피보험자(고객) 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">고객 성함</label>
                <input 
                  type="text" 
                  placeholder="홍길동" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">성별 구분</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setGender('M')}
                    className={`py-3 rounded-2xl text-sm font-bold border transition-all ${gender === 'M' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                  >
                    남성 (M)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setGender('F')}
                    className={`py-3 rounded-2xl text-sm font-bold border transition-all ${gender === 'F' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                  >
                    여성 (F)
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">생년월일 (6자리)</label>
                <input 
                  type="text" 
                  placeholder="900101" 
                  maxLength={6}
                  value={birthdate} 
                  onChange={e => setBirthdate(e.target.value.replace(/[^0-9]/g, ''))} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">보험 연령 (자동 산출)</label>
                <div className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-black text-gray-700">
                  {insuranceAge > 0 ? `${insuranceAge} 세` : '생년월일을 입력해 주세요.'}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">연락처</label>
                <input 
                  type="text" 
                  placeholder="010-1234-5678" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">직업 / 직무 (예: 상해급수 판정)</label>
                <input 
                  type="text" 
                  placeholder="사무원 (1급)" 
                  value={job} 
                  onChange={e => setJob(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black text-gray-500">운전 상태</label>
                <select 
                  value={driving} 
                  onChange={e => setDriving(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                >
                  <option value="자가용 운전">자가용 운전 (승용차)</option>
                  <option value="영업용 운전">영업용 운전 (화물차/택시 등)</option>
                  <option value="미운전 (비운전자)">미운전 (비운전자)</option>
                  <option value="오토바이 운전">이륜차(오토바이) 운전</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black text-gray-500">주소 / 거주지</label>
                <input 
                  type="text" 
                  placeholder="서울시 강남구 테헤란로 123 (선택입력)" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Insurance Type */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-50">설계 요청 상품</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INSURANCE_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInsuranceType(type)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all text-center ${insuranceType === type ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Rider Selection Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-3 border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">설계 요청 특약 선택</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleSelectAll()} className="text-xs font-bold text-primary-600 hover:underline">전체선택</button>
                <span className="text-xs text-gray-300">|</span>
                <button type="button" onClick={() => handleDeselectAll()} className="text-xs font-bold text-gray-400 hover:underline">전체해제</button>
              </div>
            </div>

            {/* Rider Group 1: 진단비 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-full inline-block" />
                  진단비 특약
                </h4>
                <div className="flex gap-2 text-[11px] font-semibold">
                  <button type="button" onClick={() => handleSelectAll('diagnosis')} className="text-primary-500">카테고리 선택</button>
                  <button type="button" onClick={() => handleDeselectAll('diagnosis')} className="text-gray-400">해제</button>
                </div>
              </div>
              <div className="space-y-2">
                {DEFAULT_RIDERS.filter(r => r.category === 'diagnosis').map(r => (
                  <div key={r.name} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${checkedRiders[r.name] ? 'bg-amber-50/20 border-amber-300' : 'bg-white border-gray-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={checkedRiders[r.name]} 
                        onChange={() => toggleRider(r.name)}
                        className="w-4 h-4 rounded text-amber-500 border-gray-300 focus:ring-amber-200"
                      />
                      <span className="text-sm font-bold text-gray-800">{r.name}</span>
                    </label>
                    <input 
                      type="text" 
                      value={riderAmounts[r.name]} 
                      onChange={e => handleAmountChange(r.name, e.target.value)} 
                      disabled={!checkedRiders[r.name]}
                      className="w-28 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Group 1.5: 치료비 */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-purple-500 rounded-full inline-block" />
                  치료비 특약
                </h4>
                <div className="flex gap-2 text-[11px] font-semibold">
                  <button type="button" onClick={() => handleSelectAll('treatment')} className="text-primary-500">카테고리 선택</button>
                  <button type="button" onClick={() => handleDeselectAll('treatment')} className="text-gray-400">해제</button>
                </div>
              </div>
              <div className="space-y-2">
                {DEFAULT_RIDERS.filter(r => r.category === 'treatment').map(r => (
                  <div key={r.name} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${checkedRiders[r.name] ? 'bg-purple-50/20 border-purple-300' : 'bg-white border-gray-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={checkedRiders[r.name]} 
                        onChange={() => toggleRider(r.name)}
                        className="w-4 h-4 rounded text-purple-500 border-gray-300 focus:ring-purple-200"
                      />
                      <span className="text-sm font-bold text-gray-800">{r.name}</span>
                    </label>
                    <input 
                      type="text" 
                      value={riderAmounts[r.name]} 
                      onChange={e => handleAmountChange(r.name, e.target.value)} 
                      disabled={!checkedRiders[r.name]}
                      className="w-28 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-purple-300 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Group 2: 수술비 / 입원일당 */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-500 rounded-full inline-block" />
                  수술비 및 입원일당
                </h4>
                <div className="flex gap-2 text-[11px] font-semibold">
                  <button type="button" onClick={() => handleSelectAll('surgery')} className="text-primary-500">카테고리 선택</button>
                  <button type="button" onClick={() => handleDeselectAll('surgery')} className="text-gray-400">해제</button>
                </div>
              </div>
              <div className="space-y-2">
                {DEFAULT_RIDERS.filter(r => r.category === 'surgery').map(r => (
                  <div key={r.name} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${checkedRiders[r.name] ? 'bg-blue-50/20 border-blue-300' : 'bg-white border-gray-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={checkedRiders[r.name]} 
                        onChange={() => toggleRider(r.name)}
                        className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-200"
                      />
                      <span className="text-sm font-bold text-gray-800">{r.name}</span>
                    </label>
                    <input 
                      type="text" 
                      value={riderAmounts[r.name]} 
                      onChange={e => handleAmountChange(r.name, e.target.value)} 
                      disabled={!checkedRiders[r.name]}
                      className="w-28 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Group 3: 기타 / 후유장해 */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-emerald-500 rounded-full inline-block" />
                  후유장해 및 기타 보장
                </h4>
                <div className="flex gap-2 text-[11px] font-semibold">
                  <button type="button" onClick={() => handleSelectAll('etc')} className="text-primary-500">카테고리 선택</button>
                  <button type="button" onClick={() => handleDeselectAll('etc')} className="text-gray-400">해제</button>
                </div>
              </div>
              <div className="space-y-2">
                {DEFAULT_RIDERS.filter(r => r.category === 'etc').map(r => (
                  <div key={r.name} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${checkedRiders[r.name] ? 'bg-emerald-50/20 border-emerald-300' : 'bg-white border-gray-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={checkedRiders[r.name]} 
                        onChange={() => toggleRider(r.name)}
                        className="w-4 h-4 rounded text-emerald-500 border-gray-300 focus:ring-emerald-200"
                      />
                      <span className="text-sm font-bold text-gray-800">{r.name}</span>
                    </label>
                    <input 
                      type="text" 
                      value={riderAmounts[r.name]} 
                      onChange={e => handleAmountChange(r.name, e.target.value)} 
                      disabled={!checkedRiders[r.name]}
                      className="w-28 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-emerald-300 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Extra Notes */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-50">기타 요청사항</h3>
            <textarea 
              rows={3} 
              placeholder="예: 실손 동시 요청, 무해지형으로 추천, 특정 회사 비교 추천 등" 
              value={extraNotes} 
              onChange={e => setExtraNotes(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all resize-none"
            />
          </div>
        </div>

        {/* Right Preview Box */}
        <div className="xl:col-span-5">
          <div className="sticky top-6 bg-gray-900 text-white rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-2xl border border-gray-800">
            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">설계요청 문자 미리보기</h3>
              <p className="text-xs text-gray-400 font-medium">체크된 가입조건으로 실시간 문자 텍스트가 가공됩니다.</p>
            </div>
            
            <textarea 
              value={editedMessageText}
              onChange={e => setEditedMessageText(e.target.value)}
              className="w-full h-[400px] bg-gray-950/80 rounded-2xl border border-gray-800/80 p-5 font-mono text-xs leading-relaxed text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button 
                type="button" 
                onClick={copyToClipboard}
                className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/30"
              >
                <ClipboardDocumentIcon className="w-5 h-5 text-emerald-400" />
                설계요청서 텍스트 복사
              </button>
              
              <button 
                type="button" 
                onClick={sendSMS}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary-900/50"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                문자로 설계요청 전송 (SMS)
              </button>
            </div>

            <div className="text-[11px] text-gray-500 font-medium text-center space-y-1">
              <p>• 복사된 텍스트는 카카오톡이나 메시지 앱에 직접 붙여넣을 수 있습니다.</p>
              <p>• 문자 전송 기능은 휴대전화 문자 앱이 정상 등록된 기기에서 작동합니다.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
