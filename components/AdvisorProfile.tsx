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

  const handleTranslation = (key: any, ...args: any[]) => {
    const val = t(key);
    if (typeof val === 'function') return val(...args);
    return val;
  };

  const points = t('profilePoints') as { title: string, desc: string }[];

  return (
    <section className="py-24 text-white relative overflow-hidden" style={{background: 'linear-gradient(180deg, #0f172a 0%, #172554 100%)'}}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600 rounded-full opacity-10 blur-[130px]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-[110px]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="container max-w-5xl px-4 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="md:col-span-2 relative mx-auto md:mx-0 w-64 h-64 md:w-full md:h-auto md:aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt={name || t('profileExpert')} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="bg-white/10 p-5 rounded-full backdrop-blur-xl mb-6 border border-white/20 shadow-lg">
                  <svg className="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-yellow-400 font-black tracking-[0.2em] text-xs mb-3 uppercase drop-shadow-sm">
                  {region || '전국'} | {affiliation || '인슈닷'}
                </div>
                <div className="text-2xl font-black text-white leading-tight">
                  {name ? `${name}${locale === 'ko' ? '' : ' '}${t('regStatusVal')}` : t('experienceVal')}
                </div>
              </div>
            )}

            {!profileImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none"></div>
            )}

            <div className="absolute bottom-6 inset-x-0 text-center z-10 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[11px] font-black tracking-wide text-white flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                {t('regStatusVal')} {phone && `(${phone})`}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-black mb-10 tracking-tight leading-[1.1] text-white" suppressHydrationWarning>
              {message || (name ? handleTranslation('profileTitlePlanner', name) : t('profileTitleDefault'))}
              {!message && (
                <>
                  <br /> 
                  <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent italic">
                    {name ? t('profilePromisePlanner') : t('profilePromiseDefault')}
                  </span>
                </>
              )}
            </h2>

            <div className="space-y-8">
              {Array.isArray(points) && points.map((p, idx) => (
                <div key={idx} className="flex items-start gap-6 group">
                  <div className="mt-1 bg-white/5 p-3 rounded-2xl text-yellow-400 shrink-0 border border-white/10 shadow-xl group-hover:bg-yellow-400 group-hover:text-amber-900 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-black mb-2 tracking-tight text-white group-hover:text-yellow-300 transition-colors">{p.title}</h4>
                    <p className="text-blue-100/70 leading-relaxed font-bold text-sm md:text-base">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
              
              {kakaoUrl && (
                <div className="mt-12 pt-10 border-t border-white/10">
                  <a 
                    href={kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-yellow-400 text-amber-950 px-10 py-5 rounded-[1.8rem] font-black text-xl hover:bg-yellow-300 hover:-translate-y-1 transition-all shadow-2xl shadow-yellow-900/40 w-fit active:scale-95 group"
                  >
                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.766 1.91 5.148 4.755 6.477-.168 1.488-1.503 3.51-1.637 3.68-.13.167-.17.34-.044.47.126.13.29.145.42.103.13-.042 1.956-.843 4.156-2.316.435.05.88.086 1.35.086 5.523 0 10-3.477 10-7.75S17.523 3 12 3z"/>
                    </svg>
                    {t('kakaoTalk')}
                  </a>
                  <p className="mt-4 text-blue-300/50 text-[11px] font-black pl-2 tracking-widest uppercase font-mono">※ {t('profileKakaoNotice')}</p>
                </div>
              )}

              {businessCard && (
                <div className="mt-12 pt-10 border-t border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-4 bg-yellow-400 rounded-full" />
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{t('profileBusinessCard')}</p>
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className="text-[11px] font-black text-yellow-400 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wider"
                    >
                      {copied ? <CheckIcon className="w-4 h-4" /> : <ShareIcon className="w-4 h-4" />}
                      {copied ? t('profileCopied') : t('profileCopyCard')}
                    </button>
                  </div>
                  <div 
                    onClick={handleCopyLink}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-2xl border border-white/10 max-w-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-white/5"
                  >
                    <img src={businessCard} alt={t('profileCardAlt')} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white text-primary-900 px-6 py-3 rounded-2xl border border-white/20 text-sm font-black shadow-2xl flex items-center gap-3">
                        <ShareIcon className="w-5 h-5" />
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
