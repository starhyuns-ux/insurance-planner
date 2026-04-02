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
  ClockIcon
} from '@heroicons/react/24/outline'
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
  onUpdateState: (key: string, value: any) => void
  onAddCustomer: (e: React.FormEvent) => void
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
  onUpdateState,
  onAddCustomer,
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
  onUpdate
}: CustomerCRMProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

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
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">고객 정보 등록</h3>
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
        </form>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-black text-gray-900 text-xl">내 고객 관리 리스트</h3>
          <span className="text-xs font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">{customers.length}명 관리중</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left">
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">고객 정보</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">연락처/주소</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center whitespace-nowrap">상령일 (D-Day)</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">주요 담보</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">터치 / 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-300 font-bold italic">
                    아직 등록된 고객 정보가 없습니다. 고객을 등록하고 체계적으로 관리해보세요!
                  </td>
                </tr>
              ) : (
                sortedCustomers.map(c => (
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
                        <td className="px-4 py-3"><input value={editCustRiders} onChange={e => onUpdateState('editCustRiders', e.target.value)} placeholder="특약 사항" className="w-full px-3 py-2 border rounded-xl" /></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={onSaveEdit} className="px-3 py-1.5 bg-primary-600 text-white font-black rounded-lg text-xs">저장</button>
                            <button onClick={() => onUpdateState('editingId', null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 font-black rounded-lg text-xs">취소</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 text-base">{c.name}</span>
                              {c.last_touch_at && differenceInDays(new Date(), parseISO(c.last_touch_at)) >= 30 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg border border-rose-100 animate-pulse">
                                  <ExclamationCircleIcon className="w-3 h-3" />
                                  관리 필요
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                              <span>생일: {safeFormat(c.birth_date, 'yy.MM.dd')}</span>
                              <span className="w-px h-2 bg-gray-200" />
                              <span className="text-primary-600">가족: {c.family_count}명</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono tracking-tighter text-gray-600 font-bold">{c.phone || '-'}</span>
                            <span className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]">{c.address || '-'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center whitespace-nowrap">
                          {(() => {
                            const dDay = getInsuranceAge(c.birth_date);
                            return (
                              <div className="flex flex-col items-center justify-center">
                                {dDay ? (
                                  <div className={`px-3 py-1.5 rounded-xl font-black text-xs tracking-tight shadow-sm ${
                                    dDay.includes('-') && parseInt(dDay.split('-')[1]) <= 14 
                                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-100 animate-bounce' 
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
                        <td className="px-8 py-6 text-gray-500 font-bold text-xs whitespace-nowrap">
                          <div className="max-w-[150px] truncate bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            {(c.riders || []).join(', ') || '특약 없음'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-6">
                            <div className="flex flex-col items-end gap-1.5 group/touch">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-gray-50 rounded-xl p-0.5 border border-gray-100 group-hover/touch:border-primary-200 group-hover/touch:bg-white transition-all">
                                  <button 
                                    onClick={() => onDecrementTouch(c.id, c.touch_count)}
                                    className="p-1.5 hover:text-primary-600 text-gray-400 transition-colors"
                                  >
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 text-xs font-black text-primary-600 min-w-[2.5rem] text-center">
                                    {c.touch_count}회
                                  </span>
                                  <button 
                                    onClick={() => onIncrementTouch(c.id, c.touch_count)}
                                    className="p-1.5 hover:text-primary-600 text-gray-400 transition-colors"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleMarkContacted(c.id, c.touch_count)}
                                  disabled={isUpdating === c.id}
                                  className="p-2 bg-primary-100 text-primary-700 rounded-xl font-black text-[10px] hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50"
                                  title="컨택 완료 체크"
                                >
                                  {isUpdating === c.id ? <ClockIcon className="w-4 h-4 animate-spin" /> : '체크'}
                                </button>
                              </div>
                              {c.last_touch_at && (
                                <span className={`text-[10px] font-black underline underline-offset-2 transition-colors ${
                                  differenceInDays(new Date(), parseISO(c.last_touch_at)) >= 30 ? 'text-rose-500' : 'text-gray-300 group-hover/touch:text-primary-400'
                                }`}>
                                  {safeFormat(c.last_touch_at, 'MM.dd')} 컨택완료 ({differenceInDays(new Date(), parseISO(c.last_touch_at))}일전)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                              <button 
                                onClick={() => onToggleMemo(c)}
                                className={`${expandedMemoId === c.id ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-50'} p-2 rounded-xl transition-all`}
                                title="메모 작성"
                              >
                                <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => onShareCard(c.name, c.phone)}
                                className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-xl transition-all"
                                title="명함 메시지 복사"
                              >
                                <ShareIcon className="w-5 h-5" />
                              </button>
                              <button onClick={() => onStartEditing(c)} className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-xl transition-all">
                                <PencilIcon className="w-4 h-4" />
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
                        <div className="flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
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
                            placeholder="이 고객에 대한 영업 인사이트를 기록하세요 (예: 관심 보험 종류, 가입된 담보, 가족 스케줄 등)"
                            className="w-full h-32 p-5 text-sm font-medium border-0 focus:ring-4 focus:ring-primary-500/10 rounded-[1.5rem] bg-white shadow-xl resize-none outline-none leading-relaxed"
                          />
                          <div className="flex justify-end">
                            <button 
                              onClick={() => onSaveMemo(c.id)}
                              className="px-8 py-3 bg-primary-600 text-white text-xs font-black rounded-xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                            >
                              메모 저장하기
                            </button>
                          </div>
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
    </div>
  )
}
