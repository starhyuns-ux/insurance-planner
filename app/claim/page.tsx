'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { useAttribution } from '@/lib/attribution'
import { DocumentCheckIcon, PhotoIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const INSURANCE_COMPANIES = [
  // 손해보험
  '삼성화재', '현대해상', 'KB손해보험', 'DB손해보험', '메리츠화재',
  '한화손해보험', '롯데손해보험', 'MG손해보험', '흥국화재', '하나손해보험',
  // 생명보험
  '삼성생명', '교보생명', '한화생명', '신한라이프', 'ABL생명',
  'AIA생명', '동양생명', '메트라이프생명',
]

export default function ClaimPage() {
  const { planner } = useAttribution()
  const [planners, setPlanners] = useState<{ id: string; name: string; affiliation: string }[]>([])
  const [selectedPlannerId, setSelectedPlannerId] = useState<string>('')

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Pre-fill planner if attributed
    if (planner) {
      setSelectedPlannerId(planner.id)
    } else {
      // Fetch available planners for selection
      supabase
        .from('planners')
        .select('id, name, affiliation')
        .order('name', { ascending: true })
        .then(({ data }) => {
          if (data) setPlanners(data)
        })
    }
  }, [planner])

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlannerId || !customerName || !insuranceCompany) return
    setSubmitting(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `claims/customer/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('planner-assets')
          .upload(fileName, file)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('planner-assets')
          .getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }

      const { error } = await supabase.from('claims').insert({
        planner_id: selectedPlannerId,
        customer_name: customerName,
        customer_phone: customerPhone,
        description,
        insurance_company: insuranceCompany,
        image_urls: uploadedUrls,
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
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">보상청구 접수 완료!</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              보상청구가 성공적으로 접수되었습니다.<br />
              담당 설계사님이 확인 후 보험사에 자료를 송신할 예정입니다.<br />
              카카오톡 또는 전화로 빠르게 안내드리겠습니다.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setCustomerName('')
                setCustomerPhone('')
                setInsuranceCompany('')
                setDescription('')
                setImages([])
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-colors"
            >
              추가 청구 접수하기
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Header */}
      <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container max-w-3xl relative z-10 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-sm font-bold mb-6 border border-white/20">
            <DocumentCheckIcon className="w-4 h-4" />
            온라인 보상청구
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            보험 보상청구를<br />
            <span className="text-primary-200">간편하게 접수하세요</span>
          </h1>
          <p className="text-primary-100 opacity-90 max-w-xl leading-relaxed">
            청구 서류(진단서, 영수증, 입퇴원확인서 등)를 사진으로 찍어 올려주시면, 담당 설계사님이 보험사에 직접 전송해 드립니다.
          </p>
        </div>
      </header>

      {/* Form */}
      <div className="container max-w-3xl px-4 py-12 flex-1">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50">
            <h2 className="text-xl font-black text-gray-900">청구 정보 입력</h2>
            <p className="text-sm text-gray-500 mt-1">모든 * 항목은 필수입니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Planner selection if no attribution */}
            {!planner && (
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  담당 설계사 선택 *
                </label>
                <select
                  required
                  value={selectedPlannerId}
                  onChange={(e) => setSelectedPlannerId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                >
                  <option value="">설계사를 선택하세요</option>
                  {planners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.affiliation ? `(${p.affiliation})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {planner && (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-primary-500 font-bold uppercase tracking-wide">담당 설계사 확인됨</p>
                  <p className="text-sm font-black text-primary-900">{planner.name} 설계사</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">고객명 *</label>
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">연락처</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">청구할 보험사 *</label>
              <select
                required
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
              >
                <option value="">보험사를 선택하세요</option>
                <optgroup label="손해보험사">
                  {INSURANCE_COMPANIES.slice(0, 10).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="생명보험사">
                  {INSURANCE_COMPANIES.slice(10).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">청구 내용 / 병명 *</label>
              <textarea
                required
                rows={4}
                placeholder="예시: 2024년 3월 고혈압으로 인한 입원 치료비 청구 (입원 7일, OO병원)&#10;청구 금액 또는 기타 전달 사항을 자유롭게 입력해 주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                청구 서류 첨부 (진단서, 영수증, 입퇴원확인서 등)
              </label>
              <label className="flex flex-col items-center justify-center w-full min-h-[120px] px-6 py-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all group">
                <PhotoIcon className="w-8 h-8 text-gray-300 group-hover:text-primary-400 transition-colors mb-2" />
                {images.length > 0 ? (
                  <div className="text-center">
                    <p className="text-sm font-black text-primary-600">{images.length}개 파일 선택됨</p>
                    <p className="text-xs text-gray-400 mt-1">{images.map((f) => f.name).join(', ')}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-500">사진 파일을 클릭하여 업로드</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF 등 여러 파일 동시 선택 가능</p>
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </label>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800">
              <p className="font-black mb-1">📋 접수 후 처리 안내</p>
              <ul className="space-y-1 text-xs font-medium leading-relaxed">
                <li>• 접수 후 담당 설계사님이 자료를 검토하여 해당 보험사에 직접 송신합니다.</li>
                <li>• 서류가 불충분한 경우 설계사님이 개별 연락드릴 수 있습니다.</li>
                <li>• 보험사 심사 기간 등에 따라 실제 지급까지 기간이 소요될 수 있습니다.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-base hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              {submitting ? '접수 중...' : '보상청구 접수하기'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
