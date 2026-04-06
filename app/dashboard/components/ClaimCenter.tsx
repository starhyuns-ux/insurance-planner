'use client'

import React from 'react'
import { 
  DocumentCheckIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import DetailedClaimForm from '@/components/DetailedClaimForm'

interface ClaimCenterProps {
  claims: any[]
  plannerId?: string
  transmittingClaimId: string | null
  onTransmitClaim: (id: string) => void
  onUpdateClaimStatus: (id: string, status: string) => void
  onDeleteClaim: (id: string) => void
}

export default function ClaimCenter({
  claims,
  plannerId,
  transmittingClaimId,
  onTransmitClaim,
  onUpdateClaimStatus,
  onDeleteClaim
}: ClaimCenterProps) {
  return (
    <div className="space-y-6">
      {/* Submit New Claim (Detailed) */}
      <DetailedClaimForm onSuccess={() => {}} plannerId={plannerId} />

      {/* Claims List */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900">보상청구 접수 내역 <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg ml-1 font-bold">{claims.length}</span></h3>
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />접수 대기</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />송신 완료</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />지급 완료</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {claims.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-100">
                <DocumentCheckIcon className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-black text-lg">등록된 보상청구 내역이 없습니다.</p>
              <p className="text-xs text-gray-300 mt-2 font-medium">고객이 보상청구 페이지에서 등록하거나, 위의 양식으로 직접 접수해주세요.</p>
            </div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-black text-gray-900 text-xl">{claim.customer_name}</span>
                      {claim.customer_phone && (
                        <a href={`tel:${claim.customer_phone}`} className="text-xs text-primary-600 font-black bg-primary-50 px-3 py-1 rounded-xl hover:bg-primary-100 transition-colors border border-primary-100">
                          {claim.customer_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                        </a>
                      )}
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-lg">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] rounded-full shadow-sm ${
                          claim.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          claim.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-emerald-100'
                        }`}>
                          {claim.status === 'PENDING' ? '접수 대기' : claim.status === 'IN_PROGRESS' ? '처리 중' : '지급 완료'}
                        </span>
                        {claim.transmission_status === 'SENT' && (
                          <span className="px-3 py-1 text-[10px] font-black rounded-full bg-teal-600 text-white shadow-lg shadow-teal-100">📤 보험사 송신완료</span>
                        )}
                      </div>
                    </div>
                    {claim.insurance_company && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary-500 rounded-full" />
                        <span className="text-sm font-black text-primary-900">{claim.insurance_company} 화재/생명</span>
                      </div>
                    )}
                    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 relative shadow-inner">
                      <p className="text-sm text-gray-600 font-medium break-words whitespace-pre-wrap leading-relaxed">{claim.description}</p>
                    </div>
                    
                    {/* Images Viewer */}
                    {claim.image_urls && claim.image_urls.length > 0 && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 border-dashed overflow-x-auto pb-4 custom-scrollbar">
                        {claim.image_urls.map((url: string, idx: number) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 group/img relative rounded-2xl overflow-hidden border border-gray-200 h-24 w-24 bg-white shadow-sm hover:shadow-md transition-all">
                            <img src={url} alt="첨부 사진" className="object-cover w-full h-full group-hover/img:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <span className="text-white text-xs font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">View</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-3 pt-4 md:pt-2 shrink-0">
                    {claim.insurance_company && claim.transmission_status !== 'SENT' && (
                      <button
                        onClick={() => onTransmitClaim(claim.id)}
                        disabled={transmittingClaimId === claim.id}
                        className="px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl text-xs font-black transition-all w-full md:w-auto text-center flex items-center gap-2 justify-center shadow-xl shadow-primary-100 disabled:opacity-50 active:scale-95"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                        {transmittingClaimId === claim.id ? '송신 중...' : `${claim.insurance_company} 송신`}
                      </button>
                    )}
                    {claim.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => onUpdateClaimStatus(claim.id, 'COMPLETED')} 
                        className="px-6 py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs font-black transition-all w-full md:w-auto text-center border border-emerald-100 shadow-sm"
                      >
                        지급 완료 처리
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteClaim(claim.id)} 
                      className="px-6 py-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all w-full md:w-auto text-center hover:shadow-inner"
                    >
                      기록 삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
