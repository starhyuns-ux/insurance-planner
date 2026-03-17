'use client'

import { useState } from 'react'
import { 
  PhoneIcon, 
  MagnifyingGlassIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'

const insuranceCompanies = [
  { name: '삼성화재', name_en: 'Samsung Fire', phone: '1588-5114', category: '손해' },
  { name: 'DB손해보험', name_en: 'DB Insurance', phone: '1588-0100', category: '손해' },
  { name: '현대해상', name_en: 'Hyundai Marine', phone: '1588-5656', category: '손해' },
  { name: 'KB손해보험', name_en: 'KB Insurance', phone: '1544-0114', category: '손해' },
  { name: '메리츠화재', name_en: 'Meritz Fire', phone: '1566-7711', category: '손해' },
  { name: '한화손해보험', name_en: 'Hanwha General', phone: '1566-8000', category: '손해' },
  { name: 'NH농협손해', name_en: 'NH Non-life', phone: '1644-9000', category: '손해' },
  { name: '삼성생명', name_en: 'Samsung Life', phone: '1588-3114', category: '생명' },
  { name: '한화생명', name_en: 'Hanwha Life', phone: '1588-6363', category: '생명' },
  { name: '교보생명', name_en: 'Kyobo Life', phone: '1588-1001', category: '생명' },
  { name: '신한라이프', name_en: 'Shinhan Life', phone: '1588-5588', category: '생명' },
  { name: '흥국생명', name_en: 'Heungkuk Life', phone: '1588-2288', category: '생명' },
  { name: '동양생명', name_en: 'Tongyang Life', phone: '1577-1004', category: '생명' },
  { name: 'AIA생명', name_en: 'AIA Life', phone: '1588-9898', category: '생명' },
];

export default function CustomerCenter() {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState('')

  const filtered = insuranceCompanies.filter(c => 
    c.name.includes(search) || (c.name_en && c.name_en.toLowerCase().includes(search.toLowerCase())) || c.phone.includes(search)
  );

  return (
    <div id="customer-center" className="scroll-mt-24 mb-16">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <PhoneIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">{t('customerCenter')}</h3>
              <p className="text-xs font-bold text-blue-600/70">
                {locale === 'ko' ? '주요 보험사 전화번호 바로연결' : locale === 'en' ? 'Direct call to insurance companies' : '快速拨打各大保险公司电话'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={locale === 'ko' ? '보험사 이름을 검색하세요...' : locale === 'en' ? 'Search insurance company...' : '搜索保险公司名称...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((company, idx) => (
            <a
              key={idx}
              href={`tel:${company.phone.replace(/-/g, '')}`}
              className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  company.category === '생명' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {locale === 'ko' ? company.category : (company.category === '생명' ? (locale === 'en' ? 'Life' : '寿险') : (locale === 'en' ? 'Non-life' : '损险'))}
                </span>
                <div>
                  <p className="text-sm font-black text-gray-900">{locale === 'ko' ? company.name : company.name_en}</p>
                  <p className="text-xs font-bold text-gray-400">{company.phone}</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <PhoneArrowUpRightIcon className="w-5 h-5" />
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-bold italic">
               {locale === 'ko' ? '검색 결과가 없습니다.' : locale === 'en' ? 'No results found.' : '未找到相关结果。'}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
