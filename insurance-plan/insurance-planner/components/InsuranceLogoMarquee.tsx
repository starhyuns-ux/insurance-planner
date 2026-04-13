'use client'

const companies = [
  { name: '삼성생명', emoji: '🏛' },
  { name: '한화생명', emoji: '🌟' },
  { name: '교보생명', emoji: '📚' },
  { name: 'DB손해보험', emoji: '🛡' },
  { name: '현대해상', emoji: '🚢' },
  { name: 'KB손해보험', emoji: '💎' },
  { name: '메리츠화재', emoji: '🔥' },
  { name: '흥국화재', emoji: '🌺' },
  { name: 'AIA생명', emoji: '🌏' },
  { name: '신한라이프', emoji: '🏦' },
  { name: 'NH농협생명', emoji: '🌾' },
  { name: '롯데손보', emoji: '🎯' },
  { name: '푸본현대생명', emoji: '💼' },
  { name: '처브라이프', emoji: '🌿' },
  { name: '하나생명', emoji: '🔷' },
  { name: '동양생명', emoji: '🌙' },
  { name: '라이나생명', emoji: '⭐' },
  { name: '미래에셋생명', emoji: '📈' },
]

// Duplicate for seamless loop
const doubled = [...companies, ...companies]

export default function InsuranceLogoMarquee() {
  return (
    <div className="bg-white py-8 border-y border-gray-100 overflow-hidden">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
        30개 이상 보험사 비교 가능
      </p>
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {doubled.map((company, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 text-sm font-bold text-gray-600 shrink-0 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-700 transition-colors cursor-default"
            >
              <span className="text-base">{company.emoji}</span>
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
