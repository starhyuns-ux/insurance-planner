'use client'

import { useState } from 'react';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AdvisorProfileProps {
  name?: string;
  phone?: string;
  profileImage?: string;
  businessCard?: string;
  affiliation?: string;
  region?: string;
  kakaoUrl?: string;
  message?: string | null;
}

export default function AdvisorProfile({ name, phone, profileImage, businessCard, affiliation, region, kakaoUrl, message }: AdvisorProfileProps) {
  const [copied, setCopied] = useState(false);
  const { t, locale } = useLanguage();

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    // Strip hash fragments and query parameters for a clean shared link
    const cleanUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const points = t('profilePoints') as { title: string, desc: string }[];

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

      <div className="container max-w-5xl px-4">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="md:col-span-2 relative mx-auto md:mx-0 w-64 h-64 md:w-full md:h-auto md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl">
            {profileImage ? (
              <img src={profileImage} alt={name || t('profileExpert')} className="absolute inset-0 w-full h-full object-cover" />
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
                <div className="text-2xl font-extrabold text-white">
                  {name ? `${name}${locale === 'ko' ? '' : ' '}${t('regStatusVal')}` : t('experienceVal')}
                </div>
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
              {t('regStatusVal')} {phone && `(${phone})`}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold mb-8 tracking-tight leading-tight">
              {message || (name ? t('profileTitlePlanner')(name) : t('profileTitleDefault'))}
              {!message && (
                <>
                  <br /> 
                  <span className="text-primary-400">
                    {name ? t('profilePromisePlanner') : t('profilePromiseDefault')}
                  </span>
                </>
              )}
            </h2>

            <div className="space-y-6">
              {Array.isArray(points) && points.map((p, idx) => (
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
                    {t('kakaoTalk')}
                  </a>
                  <p className="mt-3 text-gray-500 text-xs font-bold pl-1 font-sans">※ {t('profileKakaoNotice')}</p>
                </div>
              )}

              {businessCard && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('profileBusinessCard')}</p>
                    <button 
                      onClick={handleCopyLink}
                      className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ShareIcon className="w-3.5 h-3.5" />}
                      {copied ? t('profileCopied') : t('profileCopyCard')}
                    </button>
                  </div>
                  <div 
                    onClick={handleCopyLink}
                    className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg border border-gray-700 max-w-xs transition-transform hover:scale-[1.02]"
                  >
                    <img src={businessCard} alt={t('profileCardAlt')} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold text-white flex items-center gap-2">
                        <ShareIcon className="w-4 h-4" />
                        {t('profileCopyAddress')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
