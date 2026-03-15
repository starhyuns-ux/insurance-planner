'use client'

import { useState } from 'react';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface AdvisorProfileProps {
  name?: string;
  phone?: string;
  profileImage?: string;
  businessCard?: string;
  affiliation?: string;
  region?: string;
  kakaoUrl?: string;
  message?: string | null;
  plannerId?: string;
}

export default function AdvisorProfile({ 
  name, 
  phone, 
  profileImage, 
  businessCard, 
  affiliation, 
  region, 
  kakaoUrl, 
  message,
  plannerId 
}: AdvisorProfileProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const points = [
    { title: "특정 보험사 가입 강요 NO", desc: "고객님의 입장에서 30여개 보험사를 객관적으로 비교 분석합니다." },
    { title: "초기부터 끝까지 부담 없는 100% 무료", desc: "초기 상담부터 맞춤 설계 제안까지 모든 과정을 무료로 제공합니다." },
    { title: "가입 후에도 철저한 사후 관리", desc: "보험은 가입 후가 더 중요합니다. 청구 대행부터 추가 혜택 체크까지 지속 관리해드립니다." }
  ]

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="md:col-span-2 relative mx-auto md:mx-0 w-64 h-64 md:w-full md:h-auto md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl">
            {profileImage ? (
              <img src={profileImage} alt={name || "전문가"} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="bg-gray-700/50 p-4 rounded-full backdrop-blur-md mb-6 border border-gray-600">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-primary-400 font-bold tracking-widest text-sm mb-2 shadow-sm">
                  {region} | {affiliation}
                </div>
                <div className="text-2xl font-extrabold text-white">{name || "상위 1% 전문가"} 배정</div>
              </div>
            )}

            {!profileImage && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900 to-transparent h-2/3 pointer-events-none"></div>
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-gray-900 to-transparent h-1/4 pointer-events-none"></div>
              </>
            )}

            <div className="absolute bottom-6 inset-x-0 text-center text-sm font-medium text-gray-400 z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              보험협회 정식 등록 설계사 {phone && `(${phone})`}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold mb-8 tracking-tight leading-tight">
              {message || (name ? `${name} 설계사는` : "실적만을 쫓는 영업은")}
              {!message && <><br /> <span className="text-primary-400">{name ? "정직과 신뢰를 약속합니다." : "하지 않겠습니다."}</span></>}
            </h2>

            <div className="space-y-6">
              {points.map((p, idx) => (
                <div key={idx} className="flex items-start gap-5">
                  <div className="mt-1 bg-gray-800/80 p-2.5 rounded-xl text-primary-400 shrink-0 border border-gray-700 shadow-md">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 tracking-tight text-white">{p.title}</h4>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
              
              {kakaoUrl && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <a 
                    href={kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#FEE500] text-gray-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#FADB00] transition-all shadow-xl shadow-yellow-900/20 w-fit"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.766 1.91 5.148 4.755 6.477-.168 1.488-1.503 3.51-1.637 3.68-.13.167-.17.34-.044.47.126.13.29.145.42.103.13-.042 1.956-.843 4.156-2.316.435.05.88.086 1.35.086 5.523 0 10-3.477 10-7.75S17.523 3 12 3z"/>
                    </svg>
                    카카오톡 1:1 실시간 상담
                  </a>
                  <p className="mt-3 text-gray-500 text-xs font-bold pl-1 font-sans">※ 톡 채널 또는 오픈채팅으로 연결됩니다.</p>
                </div>
              )}

              {businessCard && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">온라인 명함</p>
                    <button 
                      onClick={handleCopyLink}
                      className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ShareIcon className="w-3.5 h-3.5" />}
                      {copied ? "링크 복사됨" : "명함 링크 복사하기"}
                    </button>
                  </div>
                  <div 
                    onClick={handleCopyLink}
                    className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg border border-gray-700 max-w-xs transition-transform hover:scale-[1.02]"
                  >
                    <img src={businessCard} alt="명함" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold text-white flex items-center gap-2">
                        <ShareIcon className="w-4 h-4" />
                        주소 복사
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons to Tools Page */}
        {plannerId && (
          <div className="mt-20 pt-12 border-t border-gray-800">
            <p className="text-sm font-black text-primary-400 uppercase tracking-[0.3em] mb-8 text-center">
              전문가 전용 보험 솔루션
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <a 
                href={`/p/${plannerId}/tools#premium-calc`}
                className="flex flex-col items-center justify-center p-8 bg-gray-800/40 rounded-[2rem] border border-gray-700 hover:border-primary-500 hover:bg-gray-800/60 transition-all group lg:p-10"
              >
                <div className="w-14 h-14 bg-primary-900/50 text-primary-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-white">보험료 계산기</p>
                <p className="text-xs font-bold text-gray-500 mt-2">3대 진단비 즉시 확인</p>
              </a>

              <a 
                href={`/p/${plannerId}/tools#silbi-calc`}
                className="flex flex-col items-center justify-center p-8 bg-gray-800/40 rounded-[2rem] border border-gray-700 hover:border-amber-500 hover:bg-gray-800/60 transition-all group lg:p-10"
              >
                <div className="w-14 h-14 bg-amber-900/50 text-amber-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-white">실비 계산기</p>
                <p className="text-xs font-bold text-gray-500 mt-2">4세대 실손의료비 산출</p>
              </a>

              <a 
                href={`/p/${plannerId}/tools#customer-center`}
                className="flex flex-col items-center justify-center p-8 bg-gray-800/40 rounded-[2rem] border border-gray-700 hover:border-blue-500 hover:bg-gray-800/60 transition-all group lg:p-10"
              >
                <div className="w-14 h-14 bg-blue-900/50 text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-white">전용 고객센터</p>
                <p className="text-xs font-bold text-gray-500 mt-2">원클릭 보험사 연결</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
