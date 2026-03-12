interface AdvisorProfileProps {
  name?: string;
  phone?: string;
  profileImage?: string;
  businessCard?: string;
  affiliation?: string;
  region?: string;
}

export default function AdvisorProfile({ name, phone, profileImage, businessCard, affiliation, region }: AdvisorProfileProps) {
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

            {/* Visual gradient effect for image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900 to-transparent h-2/3 pointer-events-none"></div>
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-gray-900 to-transparent h-1/4 pointer-events-none"></div>

            <div className="absolute bottom-6 inset-x-0 text-center text-sm font-medium text-gray-400 z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              금융감독원 정식 등록 설계사 {phone && `(${phone})`}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold mb-8 tracking-tight leading-tight">
              {name ? `${name} 설계사는` : "실적만을 쫓는 영업은"}<br /> <span className="text-primary-400">{name ? "정직과 신뢰를 약속합니다." : "하지 않겠습니다."}</span>
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
              
              {businessCard && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">온라인 명함</p>
                  <img src={businessCard} alt="명함" className="max-w-xs w-full rounded-xl shadow-lg border border-gray-700" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
