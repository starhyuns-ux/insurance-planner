export default function CommunityLinks() {
  const faqs = [
    {
      q: "상담 비용이 따로 발생하나요?",
      a: "상담 비용은 발생하지 않습니다. 전문 컨설턴트와의 1:1 상담 및 상품 안내까지 모든 과정이 진행됩니다. 고객님의 상황을 고려하여 합리적인 방향을 안내해드리는 것이 저희의 목표입니다."
    },
    {
      q: "상담을 받으면 무조건 보험을 가입해야 하나요?",
      a: "아닙니다. 현재 가입된 보험이 잘 유지되고 있다면 절대 해지나 신규 가입을 권유하지 않습니다. 보완이 필요한 경우에 한해 가장 유리한 상품을 추천해드리며, 최종 결정은 온전히 고객님의 몫입니다."
    },
    {
      q: "상담 신청 후 절차는 어떻게 되나요?",
      a: "신청이 접수되면 순차적으로 전문 컨설턴트가 카카오톡 또는 기재하신 연락처로 연락을 드립니다. 이후 원하시는 일정에 맞춰 비대면(유선/카톡) 또는 대면으로 진단 결과를 상세히 안내해드립니다."
    }
  ]

  return (
    <section className="py-24 bg-white border-b border-gray-100" id="faq">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-2 block">FAQ</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">자주 묻는 질문</h2>
          <p className="text-gray-500">보험 리모델링과 관련하여 가장 많이 여쭤보시는 내용입니다.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 transition-all hover:bg-white hover:border-primary-100 hover:shadow-md cursor-pointer">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-3">
                <span className="text-primary-600 font-serif text-xl leading-none pt-0.5">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <div className="text-gray-600 pl-8 leading-relaxed mt-3 flex items-start gap-2 border-t border-gray-100 pt-3 group-hover:border-primary-50 transition-colors">
                <span className="font-bold text-gray-400 font-serif leading-none mt-1">A.</span>
                <span className="text-[15px]">{faq.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
