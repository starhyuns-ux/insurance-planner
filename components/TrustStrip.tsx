export default function TrustStrip() {
  return (
    <section className="py-10 bg-gray-900 text-white relative z-10 -mt-2">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-gray-800">
          <div className="text-center px-2">
            <div className="text-3xl lg:text-4xl font-extrabold text-primary-400 mb-1">10,000<span className="text-xl">+</span></div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">누적 컨설팅 건수</div>
          </div>
          <div className="text-center px-2">
            <div className="text-3xl lg:text-4xl font-extrabold text-primary-400 mb-1">17<span className="text-xl">만원</span></div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">고객 평균 월 절감액</div>
          </div>
          <div className="text-center px-2">
            <div className="text-3xl lg:text-4xl font-extrabold text-primary-400 mb-1">98<span className="text-xl">%</span></div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">서비스 만족도</div>
          </div>
          <div className="text-center px-2">
            <div className="text-3xl lg:text-4xl font-extrabold text-primary-400 mb-1">10<span className="text-xl">년+</span></div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">금융/보험 전문 경력</div>
          </div>
        </div>
      </div>
    </section>
  )
}
