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
  onUpdateProfile: () => Promise<void>
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'card') => Promise<void>
  onCopyUrl: (id: string) => void
  onUpdate: () => Promise<void>
}

export default function CardSettings({
  planner,
  editName,
  editAffiliation,
  editRegion,
  editPhone,
  editMessage,
  editKakaoUrl,
  isSaving,
  urlCopied,
  onUpdateState,
  onUpdateProfile,
  onFileUpload,
  onCopyUrl
}: CardSettingsProps) {
  return (
    <div className="space-y-8">
      {/* 1. Main Info Form */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-lg shadow-primary-50">
            <IdentificationIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">디지털 명함 프로필 설정</h3>
            <p className="text-xs font-bold text-gray-400 mt-0.5">고객들에게 보여질 전문적인 정보를 입력하세요.</p>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="mb-10">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <UserCircleIcon className="w-4 h-4 text-primary-500" />
            Profile Image
          </h4>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <input type="file" accept="image/*" onChange={(e) => onFileUpload(e, 'profile')} className="hidden" id="card-profile-upload" />
              <label htmlFor="card-profile-upload" className="w-40 h-48 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 transition-all cursor-pointer overflow-hidden relative shadow-inner">
                {planner?.profile_image_url ? (
                  <img src={planner.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <UserCircleIcon className="w-16 h-16 mx-auto opacity-10 mb-3" />
                    <p className="text-xs font-black text-gray-300">이미지 업로드</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg border border-white/30">Edit</span>
                </div>
              </label>
            </div>
            <div className="text-sm text-gray-500 max-w-sm">
              <p className="font-black text-gray-800 text-lg mb-1.5 tracking-tight leading-tight">신뢰감을 주는 전문적인 사진을 추천합니다.</p>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">깔끔한 배경의 증명사진이나 영업 현장에서의 자연스러운 사진이 좋습니다.<br/><span className="text-primary-500">※ 명함 공유 시 카카오톡 미리보기에 표시됩니다.</span></p>
            </div>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input type="text" value={editName} onChange={(e) => onUpdateState('editName', e.target.value)} placeholder="성함을 입력하세요" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Affiliation / Company</label>
            <input type="text" value={editAffiliation} onChange={(e) => onUpdateState('editAffiliation', e.target.value)} placeholder="회사 또는 소속 지점을 입력하세요" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Region / Location</label>
            <input type="text" value={editRegion} onChange={(e) => onUpdateState('editRegion', e.target.value)} placeholder="예: 서울 강남 / 전국 상담 가능" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact Phone</label>
            <input type="text" value={editPhone} onChange={(e) => onUpdateState('editPhone', e.target.value)} placeholder="010-0000-0000" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">One-line Message / Motto</label>
            <input type="text" value={editMessage} onChange={(e) => onUpdateState('editMessage', e.target.value)} placeholder="상담 철학이나 인사말을 짧게 입력하세요 (예: 가족같은 마음으로 관리해 드립니다.)" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Kakao OpenChat URL</label>
            <input type="text" value={editKakaoUrl} onChange={(e) => onUpdateState('editKakaoUrl', e.target.value)} placeholder="https://open.kakao.com/o/..." className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-black shadow-inner" />
          </div>
        </div>

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
      <div className="bg-primary-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
        {/* Glow Decors */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-500 rounded-full opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-[100px]" />
        
        <h4 className="text-lg font-black mb-1.5 flex items-center gap-3 text-white">
          <div className="w-2 h-6 bg-primary-400 rounded-full" />
          나의 공식 디지털 명함 공유 주소
        </h4>
        <p className="text-xs text-primary-200 font-black mb-8 uppercase tracking-[0.2em]">Personalized Digital Card URL</p>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-white/5 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-white/10 font-mono text-xs md:text-sm truncate text-primary-100 flex items-center justify-between group/url">
              <span className="truncate">https://stroy.kr/p/{planner?.id}/card</span>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse group-hover/url:scale-150 transition-transform" />
            </div>
            <button
              onClick={() => planner?.id && onCopyUrl(planner.id)}
              className={`w-full md:w-auto px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-sm shadow-xl active:scale-95 ${
                urlCopied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-primary-950 hover:bg-primary-50'
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
          <Link 
            href={`/p/${planner?.id}/card`} 
            target="_blank"
            className="w-full bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl font-black text-sm text-center hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/20"
          >
            <GlobeAltIcon className="w-5 h-5 text-primary-400" />
            내 명함 페이지 미리보기
          </Link>
        </div>
      </div>
    </div>
  )
}
