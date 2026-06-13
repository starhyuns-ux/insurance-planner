'use client'

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function AdvancedRadiation() {
  const { t } = useLanguage();
  const checklist = t('radiationChecklist') as string[];

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-bold tracking-wide border border-red-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {t('radiationBadge')}
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.3] break-keep">
              {t('radiationTitle')}<br className="md:hidden" />
              <span className="text-primary-600"> {t('radiationTitleHighlight')}</span><br className="hidden md:block" />
              {t('radiationTitleSub')}
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed md:whitespace-pre-line break-keep">
              {t('radiationDescPart1')}<br className="hidden md:block" />
              {' '}<strong className="text-gray-900">{t('radiationDescCost')}</strong>{t('radiationDescPart2')}<br className="hidden md:block" />
              <br className="md:hidden" />
              {t('radiationDescPart3')} <strong>{t('radiationDescExpert')}</strong>{t('radiationDescPart4')}
            </p>

            <div className="pt-4">
              <ul className="space-y-3 text-left inline-block">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col items-center justify-center group">
              <Image
                src="/images/joongibja.png"
                alt={t('radiationImageAlt') as string}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>

            {/* Image shadow/decoration */}
            <div className="mt-8 relative hidden md:block">
              <div className="absolute top-0 right-10 w-2/3 h-6 bg-primary-900/10 blur-xl rounded-[100%]"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
