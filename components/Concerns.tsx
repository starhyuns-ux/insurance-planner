export default function Concerns() {
  const concerns = [
    "매달 나가는 보험료가 부담스러운데, 해지하자니 왠지 불안해요.",
    "지인에게 가입한 보험, 도대체 무슨 보장인지 1도 모르겠어요.",
    "갱신형 보험이라 나중에 보험료가 얼마나 오를지 겁나요.",
    "홈쇼핑이나 전화로 가입한 보험, 정말 나에게 맞는 걸까요?"
  ]

  return (
    <section className="py-24 bg-white" id="about">
      <div className="container max-w-4xl">
        {/* Top CTA Banner */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary-200 shadow-sm mb-20 group">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              내 보험, 잘 가입된 걸까? 꼼꼼하게 점검해드릴게요!
            </h3>
            <p className="text-gray-600 font-medium">
              불필요한 지출은 줄이고 든든한 보장만 채우세요.
            </p>
          </div>
          <a
            href="#consultation"
            className="shrink-0 bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2"
          >
            1분만에 무료 진단 신청
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            혹시 이런 고민,<br className="md:hidden" /> 해보신 적 있나요?
          </h2>
          <p className="text-lg text-gray-500">
            하나라도 해당된다면, 보험 점검이 꼭 필요한 시점입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {concerns.map((text, idx) => (
            <div key={idx} className="bg-gray-50 rounded-3xl p-6 md:p-8 flex items-start gap-4 hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-1 transition-all border border-gray-100 group">
              <div className="bg-red-50 text-red-500 p-2.5 rounded-2xl shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-lg leading-relaxed pt-1 flex-1">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-x-0 bottom-1 sm:bottom-2 h-3 sm:h-4 bg-primary-200 -z-10 rotate-1"></div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              몰라서 낭비하는 돈,<br className="md:hidden" /> <span className="text-primary-600">이제는 멈춰야 합니다.</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
