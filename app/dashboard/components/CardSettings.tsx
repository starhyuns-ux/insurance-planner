'use client'

import React from 'react'
import { 
  IdentificationIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShareIcon,
  CheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface CardSettingsProps {
  planner: any | null
  editName: string
  editAffiliation: string
  editRegion: string
  editPhone: string
  editMessage: string
  editKakaoUrl: string
  isSaving: boolean
  urlCopied: boolean
  onUpdateState: (key: string, value: any) => void
  onUpdateProfile: (e?: React.FormEvent) => Promise<void>
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'card') => Promise<void>
  onCopyUrl: (id: string) => void
  onUpdate: () => Promise<void>
}

        <button
          onClick={onUpdateProfile}
          disabled={isSaving}
          className="w-full bg-primary-600 text-white px-8 py-5 rounded-[1.5rem] font-black text-lg hover:bg-primary-700 hover:-translate-y-1 transition-all shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50 group flex items-center justify-center gap-3"
        >
          {isSaving ? '저장 중...' : '디지털 명함 정보 저장하기'}
          <ArrowRightOnRectangleIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform rotate-180" />
        </button>
      </div>

      {/* 2. Business Card Image Upload */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
            <IdentificationIcon className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-black text-gray-900 tracking-tight">실제 지류 명함 디자인 업로드</h4>
        </div>
        <div className="relative group max-w-xl mx-auto">
          <input type="file" accept="image/*" onChange={(e) => onFileUpload(e, 'card')} className="hidden" id="card-card-upload" />
          <label htmlFor="card-card-upload" className="block aspect-[9/5] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 transition-all cursor-pointer overflow-hidden relative shadow-inner">
            {planner?.business_card_url ? (
              <img src={planner.business_card_url} alt="Card" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <IdentificationIcon className="w-16 h-16 mx-auto opacity-10 mb-4" />
                <p className="text-sm font-black text-gray-400">명함 앞면 이미지를 업로드하세요</p>
                <p className="text-xs text-gray-300 mt-2 font-medium">스캔하거나 정면에서 찍은 고화질 이미지를 추천합니다.</p>
              </div>
            )}
            <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl border border-white/30 text-white">Change Image</span>
            </div>
          </label>
        </div>
      </div>

      {/* 3. Personalized URL Section */}
      <div className="rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%)'}}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-violet-400 rounded-full opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-indigo-300 rounded-full opacity-10 blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          <h4 className="text-xl font-black mb-1.5 flex items-center gap-3 text-white drop-shadow">
            <div className="w-2 h-7 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" />
            나의 공식 디지털 명함 공유 주소
          </h4>
          <p className="text-sm text-blue-200 font-bold mb-8 uppercase tracking-[0.2em]">Personalized Digital Card URL</p>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 w-full bg-white/15 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-white/30 font-mono text-xs md:text-sm truncate text-white flex items-center justify-between shadow-inner">
                <span className="truncate font-bold">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/p/{planner?.id}/card
                </span>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/70 ml-3 shrink-0" />
              </div>
              <button
                onClick={() => planner?.id && onCopyUrl(planner.id)}
                className={`w-full md:w-auto px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-sm shadow-xl active:scale-95 ${
                  urlCopied 
                    ? 'bg-green-400 text-green-950 shadow-green-400/40' 
                    : 'bg-yellow-300 text-blue-950 hover:bg-yellow-200 shadow-yellow-300/40'
                }`}
              >
                {urlCopied ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    링크 복사완료
                  </>
                 ) : (
                  <>
                    <ShareIcon className="w-5 h-5" />
                    주소 복사하기
                  </>
                )}
              </button>
            </div>
            <a 
              href={`/p/${planner?.id}/card`} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-2xl font-black text-sm text-center hover:bg-white/30 transition-all flex items-center justify-center gap-3 border border-white/40 shadow-lg"
            >
              <GlobeAltIcon className="w-5 h-5 text-yellow-300" />
              내 명함 페이지 미리보기
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
