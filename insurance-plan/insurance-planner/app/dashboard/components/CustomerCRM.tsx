'use client'

import React, { Fragment, useState } from 'react'
import { 
  PlusIcon,
  MinusIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import DetailedClaimForm from '@/components/DetailedClaimForm'
import { supabase } from '@/lib/supabaseClient'
import { differenceInDays, parseISO } from 'date-fns'

interface CustomerCRMProps {
  customers: any[]
  newCustName: string
  newCustPhone: string
  newCustAddr: string
  newCustBirth: string
  newCustFamily: string
  newCustRiders: string
  editingId: string | null
  expandedMemoId: string | null
  memoValue: string
  editCustName: string
  editCustPhone: string
  editCustAddr: string
  editCustBirth: string
  editCustFamily: string
  editCustRiders: string
  editCustAppt: string
  editCustIsContracted: boolean
  newCustIsContracted: boolean
  newCustPremium: string
  editCustPremium: string
  activeTab: 'all' | 'contracted' | 'prospect'
  setActiveTab: (tab: 'all' | 'contracted' | 'prospect') => void
  onUpdateState: (key: string, value: any) => void
  onAddCustomer: (e: React.FormEvent) => void
  onAddCustomersBulk: (data: any[]) => void
  onIncrementTouch: (id: string, count: number) => void
  onDecrementTouch: (id: string, count: number) => void
  onToggleMemo: (customer: any) => void
  onSaveMemo: (id: string) => void
  onStartEditing: (customer: any) => void
  onSaveEdit: () => void
  onDeleteCustomer: (id: string) => void
  onShareCard: (name: string, phone: string) => void
  getInsuranceAge: (birthDate: string | null) => string | null
  safeFormat: (date: string | null, format: string) => string
  onUpdate: () => Promise<void>
  planner: any | null
}

export default function CustomerCRM({
  customers,
  newCustName,
  newCustPhone,
  newCustAddr,
  newCustBirth,
  newCustFamily,
  newCustRiders,
  editingId,
  expandedMemoId,
  memoValue,
  editCustName,
  editCustPhone,
  editCustAddr,
  editCustBirth,
  editCustFamily,
  editCustRiders,
  editCustAppt,
  editCustIsContracted,
  newCustIsContracted,
  newCustPremium,
  editCustPremium,
  activeTab,
  setActiveTab,
  onUpdateState,
  onAddCustomer,
  onAddCustomersBulk,
  onIncrementTouch,
  onDecrementTouch,
  onToggleMemo,
  onSaveMemo,
  onStartEditing,
  onSaveEdit,
  onDeleteCustomer,
  onShareCard,
  getInsuranceAge,
  safeFormat,
  onUpdate,
  planner
}: CustomerCRMProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<'memo' | 'medical'>('memo')
  const [newDisease, setNewDisease] = useState({ name: '', date: '', hospital: '', status: '완치' })
  const [isScanning, setIsScanning] = useState(false)
  const [analyzedHistory, setAnalyzedHistory] = useState<any[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const scanDocRef = React.useRef<HTMLInputElement>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimingCustomer, setClaimingCustomer] = useState<any | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const XLSX = await import('xlsx')
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      const parsedData = jsonData.map((row: any) => {
        // Smart parse column names with spaces removed
        const getVal = (keywords: string[]) => {
          for (const key of Object.keys(row)) {
            if (keywords.some(k => key.replace(/\s+/g, '').includes(k))) {
              return row[key]
            }
          }
          return ''
        }

        const name = getVal(['이름', '고객명', '성명', 'name'])
        const phone = getVal(['전화', '연락처', '휴대폰', 'phone', '번호'])
        const address = getVal(['주소', 'address', '거주지'])
        let rawBirth = getVal(['생년월일', '생일', 'birth', '주민'])
        let birth_date = null
        if (typeof rawBirth === 'number') {
           const dateInfo = XLSX.SSF.parse_date_code(rawBirth)
           if (dateInfo) {
              birth_date = `${dateInfo.y}-${String(dateInfo.m).padStart(2, '0')}-${String(dateInfo.d).padStart(2, '0')}`
           }
        } else if (rawBirth) {
           birth_date = String(rawBirth).replace(/\./g, '-').slice(0, 10)
        }

        const rawRiders = getVal(['특약', '보장', '담보', '가입내역'])
        const riders = rawRiders ? String(rawRiders).split(',').map(r => r.trim()).filter(Boolean) : []

        const is_contracted = getVal(['구분', '계약', '유형', '상태'])
        const contracted = String(is_contracted).includes('계약') || String(is_contracted).includes('기존')

        const family_countStr = getVal(['가족', '가구', '식구'])
        const family_count = parseInt(family_countStr as string) || 1

        return { name: name || '이름없음', phone, address, birth_date, riders, is_contracted: contracted, family_count }
      })

      if (parsedData.length > 0) {
         if (confirm(`총 ${parsedData.length}명의 고객 정보를 대량 등록하겠습니까?`)) {
            onAddCustomersBulk(parsedData)
         }
      } else {
         alert('추출할 수 있는 행 데이터가 존재하지 않습니다. 엑셀 파일 형식을 확인해주세요.')
      }
    } catch (err) {
      console.error(err)
      alert('엑셀 파싱 중 오류가 발생했습니다. 파일 형식이 맞지 않거나 내용에 오류가 있을 수 있습니다.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx')
      const templateData = [
        { '고객명': '홍길동', '전화번호': '010-1234-5678', '생년월일': '1980-01-01', '주소': '서울시 강남구 테헤란로', '특약사항': '암, 뇌혈관질환, 허혈성', '고객구분': '계약고객', '가족수': 3 },
        { '고객명': '김영희', '전화번호': '010-9876-5432', '생년월일': '1992-05-15', '주소': '부산시 해운대구', '특약사항': '실손의료비', '고객구분': '가망고객', '가족수': 1 }
      ]
      const worksheet = XLSX.utils.json_to_sheet(templateData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '고객일괄등록양식')
      XLSX.writeFile(workbook, '고객일괄등록_양식.xlsx')
    } catch (err) {
      console.error(err)
      alert('양식을 다운로드하는 중 오류가 발생했습니다.')
    }
  }

  const handleMarkContacted = async (id: string, currentTouchCount: number) => {
    setIsUpdating(id)
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          last_touch_at: new Date().toISOString(),
          touch_count: (currentTouchCount || 0) + 1
        })
        .eq('id', id)
      
      if (error) throw error
      await onUpdate()
    } catch (err) {
      console.error('Error updating customer touch:', err)
      alert('컨택 기록 중 오류가 발생했습니다.')
    } finally {
      setIsUpdating(null)
    }
  }

  // Enhanced sorting: Priority (D-Day < 14 or Needs Management) > Name
  const sortedCustomers = [...customers].sort((a, b) => {
    const getPriority = (c: any) => {
      const dDayStr = getInsuranceAge(c.birth_date)
      const dDay = dDayStr && dDayStr.startsWith('D-') ? parseInt(dDayStr.split('-')[1]) : 999
      const lastTouch = c.last_touch_at ? differenceInDays(new Date(), parseISO(c.last_touch_at)) : 999
      
      if (dDay <= 14) return 1
      if (lastTouch >= 30) return 2
      return 3
    }
    
    return getPriority(a) - getPriority(b)
  })

  const filteredCustomers = sortedCustomers.filter(c => {
    if (activeTab === 'all') return true
    if (activeTab === 'contracted') return c.is_contracted === true
    if (activeTab === 'prospect') return c.is_contracted !== true
    return true
  })

  const handleScanDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsScanning(true)
    // Simulate AI extraction delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock extracted data based on the file name/type simulation
    const mockExtracted = [
      { name: '고혈압', date: '2023-05-10', hospital: '강남세브란스', status: '약복용중' },
      { name: '제2형 당뇨병', date: '2023-05-10', hospital: '강남세브란스', status: '약복용중' }
    ]
    
    setAnalyzedHistory(prev => [...prev, ...mockExtracted])
    setIsScanning(false)
    if (scanDocRef.current) scanDocRef.current.value = ''
    alert(`${file.name} 서류에서 2건의 건강 기록을 분류하여 추출했습니다.\n하단 리스트에서 확인 후 저장해 주세요.`)
  }
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">고객 정보 등록</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadTemplate} 
              className="text-sm px-4 py-2 bg-gray-50 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              title="엑셀(XLSX) 업로드용 기본 양식을 다운로드합니다."
            >
              <ArrowDownTrayIcon className="w-5 h-5" /> 양식 다운로드
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="text-sm px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
              title="엑셀(XLSX, CSV) 파일을 업로드하여 다수의 고객을 한 번에 추가합니다."
            >
              <DocumentArrowUpIcon className="w-5 h-5" /> 엑셀 파일 올리기
            </button>
          </div>
        </div>
        <form onSubmit={onAddCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">고객명</label>
            <input
              type="text"
              required
              value={newCustName}
              onChange={(e) => onUpdateState('newCustName', e.target.value)}
              placeholder="성함 입력"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">전화번호</label>
            <input
              type="tel"
              value={newCustPhone}
              onChange={(e) => onUpdateState('newCustPhone', e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">생년월일</label>
            <input
              type="date"
              value={newCustBirth}
              onChange={(e) => onUpdateState('newCustBirth', e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-1">
             <button
              type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-100"
            >
              <PlusIcon className="w-5 h-5" />
              고객 등록하기
            </button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">주소</label>
            <input
              type="text"
              value={newCustAddr}
              onChange={(e) => onUpdateState('newCustAddr', e.target.value)}
              placeholder="상세 주소 입력"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">특약 사항 (콤마로 구분)</label>
            <input
              type="text"
              value={newCustRiders}
              onChange={(e) => onUpdateState('newCustRiders', e.target.value)}
              placeholder="암, 뇌혈관, 허혈성, 질병후유장해..."
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">고객 구분</label>
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-transparent">
              <button
                type="button"
                onClick={() => onUpdateState('newCustIsContracted', false)}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${!newCustIsContracted ? 'bg-white shadow-sm text-gray-900 border border-gray-100' : 'text-gray-400'}`}
              >
                가망고객
              </button>
              <button
                type="button"
                onClick={() => onUpdateState('newCustIsContracted', true)}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${newCustIsContracted ? 'bg-primary-600 shadow-sm text-white' : 'text-gray-400'}`}
              >
                계약고객
              </button>
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">월 보험료 (원)</label>
            <input
              type="number"
              value={newCustPremium}
              onChange={(e) => onUpdateState('newCustPremium', e.target.value)}
              placeholder="0"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h3 className="font-black text-gray-900 text-xl">내 고객 관리 리스트</h3>
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { id: 'all', label: '전체' },
                { id: 'contracted', label: '계약고객' },
                { id: 'prospect', label: '가망고객' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">{filteredCustomers.length}명 관리중</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left">
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">고객 정보</th>
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">연락처/주소</th>
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center whitespace-nowrap">상령일 (D-Day)</th>
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">주요 담보</th>
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">월 보험료</th>
                <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">터치 / 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-300 font-bold italic">
                    {activeTab === 'all' ? '아직 등록된 고객 정보가 없습니다. 고객을 등록하고 체계적으로 관리해보세요!' : `${activeTab === 'contracted' ? '계약고객' : '가망고객'} 데이터가 없습니다.`}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <Fragment key={c.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors group">
                    {editingId === c.id ? (
                      <>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            <input value={editCustName} onChange={e => onUpdateState('editCustName', e.target.value)} placeholder="이름" className="w-full px-3 py-2 border rounded-xl" />
                            <input type="date" value={editCustBirth} onChange={e => onUpdateState('editCustBirth', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            <input value={editCustPhone} onChange={e => onUpdateState('editCustPhone', e.target.value)} placeholder="전화번호" className="w-full px-3 py-2 border rounded-xl" />
                            <input value={editCustAddr} onChange={e => onUpdateState('editCustAddr', e.target.value)} placeholder="주소" className="w-full px-3 py-2 border rounded-xl" />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-bold text-gray-400">가족수</span>
                          <input type="number" min="1" value={editCustFamily} onChange={e => onUpdateState('editCustFamily', e.target.value)} className="w-full px-2 py-2 border rounded-xl text-center" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            <input value={editCustRiders} onChange={e => onUpdateState('editCustRiders', e.target.value)} placeholder="특약 사항" className="w-full px-3 py-2 border rounded-xl" />
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => onUpdateState('editCustIsContracted', false)}
                                className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all ${!editCustIsContracted ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                              >
                                가망고객
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateState('editCustIsContracted', true)}
                                className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all ${editCustIsContracted ? 'bg-primary-600 shadow-sm text-white' : 'text-gray-400'}`}
                              >
                                계약고객
                              </button>
                            </div>
                            <input type="number" value={editCustPremium} onChange={e => onUpdateState('editCustPremium', e.target.value)} placeholder="보험료" className="w-full px-3 py-2 border rounded-xl" />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={onSaveEdit} className="px-3 py-1.5 bg-primary-600 text-white font-black rounded-lg text-xs">저장</button>
                            <button onClick={() => onUpdateState('editingId', null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 font-black rounded-lg text-xs">취소</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 whitespace-nowrap border-b border-gray-50">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 text-sm leading-none">{c.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${c.is_contracted ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                {c.is_contracted ? '계약고객' : '가망고객'}
                              </span>
                              {c.last_touch_at && differenceInDays(new Date(), parseISO(c.last_touch_at)) >= 30 && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black rounded-md border border-rose-100">
                                  <ExclamationCircleIcon className="w-2.5 h-2.5" />
                                  관리필요
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              <span>생일: {safeFormat(c.birth_date, 'yy.MM.dd')}</span>
                              <span className="w-px h-2 bg-gray-200" />
                              <span className="text-primary-600">가족: {c.family_count}명</span>
                              {(c.memo || '').includes('[질병고지 제출완료]') && (
                                <>
                                  <span className="w-px h-2 bg-gray-200" />
                                  <span className="text-emerald-500 flex items-center gap-0.5">
                                    <CheckCircleIcon className="w-2.5 h-2.5" /> 고지완료
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-b border-gray-50">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono tracking-tighter text-gray-600 font-bold text-xs">{c.phone || '-'}</span>
                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]" title={c.address || ''}>{c.address || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap border-b border-gray-50">
                          {(() => {
                            const dDay = getInsuranceAge(c.birth_date);
                            return (
                              <div className="flex flex-col items-center justify-center">
                                {dDay ? (
                                  <div className={`px-2 py-1 rounded-lg font-black text-[10px] tracking-tight shadow-sm ${
                                    dDay.includes('-') && parseInt(dDay.split('-')[1]) <= 14 
                                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' 
                                      : dDay === 'D-Day' ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-primary-50 text-primary-600 border border-primary-100'
                                  }`}>
                                    {dDay}
                                  </div>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-bold text-xs whitespace-nowrap border-b border-gray-50">
                          <div className="max-w-[130px] truncate bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            {(c.riders || []).join(', ') || '특약 없음'}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-900 font-black text-xs whitespace-nowrap border-b border-gray-50">
                          {c.monthly_premium ? `${c.monthly_premium.toLocaleString()}원` : '-'}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap border-b border-gray-50">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => {
                                if (!planner) return
                                const url = `${window.location.origin}/p/${planner.id}/disclosure?c=${c.id}`
                                navigator.clipboard.writeText(url)
                                alert('질병고지 요청 URL이 복사되었습니다.\n고객에게 전달하여 작성을 요청하세요.')
                              }}
                              className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-all"
                              title="질병고지 요청 링크 복사"
                            >
                              <ClipboardDocumentListIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setClaimingCustomer(c)
                                setShowClaimModal(true)
                              }}
                              className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-all"
                              title="보상청구 신청서 작성"
                            >
                              <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col items-end gap-1 group/touch">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100 group-hover/touch:border-primary-200 group-hover/touch:bg-white transition-all">
                                  <button 
                                    onClick={() => onDecrementTouch(c.id, c.touch_count)}
                                    className="p-1 hover:text-primary-600 text-gray-400 transition-colors"
                                  >
                                    <MinusIcon className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="px-2 text-[10px] font-black text-primary-600 min-w-[2rem] text-center">
                                    {c.touch_count}회
                                  </span>
                                  <button 
                                    onClick={() => onIncrementTouch(c.id, c.touch_count)}
                                    className="p-1 hover:text-primary-600 text-gray-400 transition-colors"
                                  >
                                    <PlusIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleMarkContacted(c.id, c.touch_count)}
                                  disabled={isUpdating === c.id}
                                  className="px-2 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-black text-[9px] hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50"
                                  title="컨택 완료 체크"
                                >
                                  {isUpdating === c.id ? <ClockIcon className="w-3.5 h-3.5 animate-spin" /> : '체크'}
                                </button>
                              </div>
                              {c.last_touch_at && (
                                <span className={`text-[9px] font-black underline underline-offset-2 transition-colors ${
                                  differenceInDays(new Date(), parseISO(c.last_touch_at)) >= 30 ? 'text-rose-500' : 'text-gray-300 group-hover/touch:text-primary-400'
                                }`}>
                                  {safeFormat(c.last_touch_at, 'MM.dd')} ({differenceInDays(new Date(), parseISO(c.last_touch_at))}일전)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
                              <button 
                                onClick={() => onToggleMemo(c)}
                                className={`${expandedMemoId === c.id ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-50'} p-1.5 rounded-lg transition-all`}
                                title="메모 작성"
                              >
                                <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => onShareCard(c.name, c.phone)}
                                className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-all"
                                title="명함 메시지 복사"
                              >
                                <ShareIcon className="w-4 h-4" />
                              </button>
                              <button onClick={() => onStartEditing(c)} className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-all">
                                <PencilIcon className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => onDeleteCustomer(c.id)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                  {expandedMemoId === c.id && (
                    <tr className="bg-primary-50/40">
                      <td colSpan={5} className="px-8 py-6">
                        <div className="flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
                          
                          {/* Sub Tabs */}
                          <div className="flex items-center gap-4 border-b border-gray-100">
                            <button 
                              onClick={() => setActiveSubTab('memo')}
                              className={`px-4 py-2 text-xs font-black transition-all border-b-2 ${activeSubTab === 'memo' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400'}`}
                            >
                              상담 메모
                            </button>
                            <button 
                              onClick={() => setActiveSubTab('medical')}
                              className={`px-4 py-2 text-xs font-black transition-all border-b-2 ${activeSubTab === 'medical' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
                            >
                              질병 및 진료 이력
                            </button>
                          </div>

                          {activeSubTab === 'memo' ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <div className="w-1.5 h-4 bg-primary-500 rounded-full" />
                                  고객 상세 메모 ({c.name})
                                </span>
                                <button 
                                  onClick={() => onUpdateState('expandedMemoId', null)}
                                  className="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm"
                                >
                                  Close
                                </button>
                              </div>
                              <textarea
                                value={memoValue}
                                onChange={(e) => onUpdateState('memoValue', e.target.value)}
                                placeholder="이 고객에 대한 영업 인사이트를 기록하세요..."
                                className="w-full h-32 p-5 text-sm font-medium border-0 focus:ring-4 focus:ring-primary-500/10 rounded-[1.5rem] bg-white shadow-xl resize-none outline-none leading-relaxed"
                              />
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => onSaveMemo(c.id)}
                                  className="px-8 py-3 bg-primary-600 text-white text-xs font-black rounded-xl shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all"
                                >
                                  메모 저장하기
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-6">
                              {/* Disease History Table */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                      <HeartIcon className="w-4 h-4" /> 질병 및 진료 이력 (데이터)
                                    </h4>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">파일은 서버에 저장되지 않으며 데이터만 기록됩니다</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <input type="file" ref={scanDocRef} className="hidden" onChange={handleScanDocument} accept=".pdf,.jpg,.png" />
                                    <button 
                                      onClick={() => scanDocRef.current?.click()}
                                      disabled={isScanning}
                                      className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                      {isScanning ? <ClockIcon className="w-3 h-3 animate-spin" /> : <SparklesIcon className="w-3 h-3" />}
                                      서류 분석(분류)
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                  <table className="w-full text-[11px]">
                                    <thead className="bg-gray-50 text-gray-400 font-black">
                                      <tr>
                                        <th className="px-3 py-2 text-left">질병명 / 분류</th>
                                        <th className="px-3 py-2 text-left">진료일(진단일)</th>
                                        <th className="px-3 py-2 text-left">병원명</th>
                                        <th className="px-3 py-2 text-center">현재 상태</th>
                                        <th className="px-3 py-2 text-right">관리</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {/* Combined History: Analyzed + Manual */}
                                      {[
                                        { name: '급성 위염', date: '2023.10.12', hospital: '서울내과', status: '완치', type: 'manual' },
                                        ...analyzedHistory.map(h => ({ ...h, type: 'analyzed' }))
                                      ].map((h, idx) => (
                                        <tr key={idx} className={`${h.type === 'analyzed' ? 'bg-emerald-50/30' : ''} transition-colors`}>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                              <span className="font-bold text-gray-800">{h.name}</span>
                                              {h.type === 'analyzed' && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1 rounded uppercase">Scan</span>}
                                            </div>
                                          </td>
                                          <td className="px-3 py-3 text-gray-500">{h.date}</td>
                                          <td className="px-3 py-3 text-gray-500">{h.hospital}</td>
                                          <td className="px-3 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${h.status === '완치' ? 'bg-gray-100 text-gray-500' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                              {h.status}
                                            </span>
                                          </td>
                                          <td className="px-3 py-3 text-right">
                                            <button className="text-gray-300 hover:text-rose-500 transition-colors">
                                              <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                      
                                      {/* Inline Add Form */}
                                      <tr className="bg-gray-50/30">
                                        <td className="px-3 py-3" colSpan={5}>
                                          <div className="flex gap-2">
                                            <input 
                                              type="text" 
                                              placeholder="질병명 입력" 
                                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] outline-none focus:border-indigo-500 transition-all font-bold"
                                            />
                                            <input 
                                              type="text" 
                                              placeholder="진료일 (YYYY-MM-DD)" 
                                              className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] outline-none focus:border-indigo-500 transition-all font-bold"
                                            />
                                            <input 
                                              type="text" 
                                              placeholder="병원명" 
                                              className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] outline-none focus:border-indigo-500 transition-all font-bold"
                                            />
                                            <button className="px-6 py-2 bg-indigo-600 text-white font-black rounded-xl text-[10px] shadow-lg shadow-indigo-100">기록 추가</button>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>

      {/* Claim Request Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-6 right-8 z-[110]">
              <button 
                onClick={() => setShowClaimModal(false)}
                className="p-3 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-400 rounded-2xl transition-all shadow-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
              <DetailedClaimForm 
                plannerId={planner?.id} 
                initialData={claimingCustomer}
                onSuccess={() => {
                  setShowClaimModal(false)
                  onUpdate()
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

