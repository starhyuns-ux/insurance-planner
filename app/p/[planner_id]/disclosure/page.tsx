'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  DocumentMagnifyingGlassIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { toast, Toaster } from 'sonner'

function DisclosureContent() {
  const { planner_id } = useParams()
  const searchParams = useSearchParams()
  const customerId = searchParams.get('c')
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchedRecords, setFetchedRecords] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    answers: {
      recent_3m: false,
      recent_1y: false,
      recent_5y_surgery: false,
      recent_5y_chronic: false,
    },
    detail_records: [] as any[]
  })

  const [submitted, setSubmitted] = useState(false)

  const handleFetchRecords = async () => {
    setFetchLoading(true)
    // Simulate simple auth UI
    toast.info('국민건강보험공단 인증을 시작합니다...')
    
    try {
      const res = await fetch('/api/disclosure?mock=true')
      const data = await res.json()
      if (data.success) {
        setFetchedRecords(data.records)
        setFormData(prev => ({ ...prev, detail_records: data.records }))
        toast.success('진료 기록 4건을 성공적으로 불러왔습니다.')
      }
    } catch (err) {
      toast.error('기록을 불러오는데 실패했습니다.')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/disclosure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planner_id,
          customer_id: customerId,
          disclosure_data: formData
        })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      }
    } catch (err) {
      toast.error('제출 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">고지 제출 완료</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            건강 상태 고지가 안전하게 제출되었습니다.<br/>
            담당 플래너가 빠르게 검토 후 연락드리겠습니다.
          </p>
          <button 
            disabled
            className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold"
          >
            창 닫기
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-10 rounded-b-[40px] shadow-lg">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <HeartIcon className="w-8 h-8" />
            <span className="font-black text-xl">안심 건강 고지</span>
          </div>
          <h1 className="text-3xl font-black mb-2 leading-tight">빠르고 정확한<br/>보험 가입을 위한 고지 폼</h1>
          <p className="text-primary-100/80 text-sm font-medium">
            작성하신 내용은 보험 가입 심사 목적으로만 안전하게 사용됩니다.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[32px] p-8 shadow-xl space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-900">본인 인증 및 정보 확인</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 ml-1">성함</label>
                    <input 
                      type="text" 
                      placeholder="성함을 입력하세요"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 ml-1">연락처</label>
                    <input 
                      type="tel" 
                      placeholder="'-' 없이 입력하세요"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <DocumentMagnifyingGlassIcon className="w-6 h-6 text-primary-600" />
                  <span className="text-sm font-black text-gray-700">진료 기록 자동 불러오기</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  일일이 기억하기 힘든 최근 5년 내의 진료 및 투약 이력을 건강보험공단으로부터 안전하게 불러옵니다.
                </p>
                <button 
                  onClick={handleFetchRecords}
                  disabled={fetchLoading}
                  className="w-full py-3 bg-white text-primary-600 border border-primary-200 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                >
                  {fetchLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <ShieldCheckIcon className="w-5 h-5" />}
                  인증하고 기록 가져오기
                </button>

                {fetchedRecords.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-2"
                  >
                    <div className="text-[10px] font-black text-gray-400 ml-1">성공적으로 불러온 내역 ({fetchedRecords.length}건)</div>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1 slim-scrollbar">
                      {fetchedRecords.map((r, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-black text-gray-800">{r.hospital}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{r.date} · {r.disease}</p>
                          </div>
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone}
                className="w-full py-5 bg-primary-600 text-white rounded-[20px] font-black text-lg shadow-lg shadow-primary-500/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
              >
                다음 단계로 이동
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[32px] p-8 shadow-xl space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">주요 고지 항목 체크</h2>
                  <p className="text-xs text-gray-400 mt-1 font-medium">최근 건강 상태에 대해 답변해 주세요.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'recent_3m', label: '최근 3개월 이내 의사로부터 진찰 또는 검사를 통해 치료, 입원, 수술을 받은 적이 있습니까?' },
                    { id: 'recent_1y', label: '최근 1년 이내 의사로부터 진찰 또는 검사를 통해 추가 검사(제검사)를 받은 적이 있습니까?' },
                    { id: 'recent_5y_surgery', label: '최근 5년 이내 의사로부터 진찰 또는 검사를 통해 입원, 수술, 7일 이상 치료, 30일 이상 투약을 받은 적이 있습니까?' },
                    { id: 'recent_5y_chronic', label: '최근 5년 이내 암, 고혈압, 당뇨병 등의 질환으로 치료, 입원, 수술을 받은 적이 있습니까?' },
                  ].map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-100 space-y-4">
                      <p className="text-sm font-bold text-gray-700 leading-relaxed">{item.label}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setFormData({...formData, answers: {...formData.answers, [item.id]: true}})}
                          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.answers[item.id as keyof typeof formData.answers] === true ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                          예
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, answers: {...formData.answers, [item.id]: false}})}
                          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.answers[item.id as keyof typeof formData.answers] === false ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
                        >
                          아니오
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl flex gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-[11px] text-orange-700 font-bold leading-relaxed">
                    사실대로 고지하지 않을 경우 보험금 지급이 거절되거나 계약이 해지될 수 있으니 주의해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold"
                >
                  이전으로
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  {loading && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
                  고지 제출하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .slim-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .slim-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .slim-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default function PublicDisclosurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    }>
      <DisclosureContent />
    </Suspense>
  )
}
