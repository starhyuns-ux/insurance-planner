export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            보험은 가입보다 <span className="text-primary-600">유지와 관리가 핵심입니다</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            나이, 건강상태, 직업, 가족 구성원이 변했다면 보험도 그에 맞게 옷을 갈아입혀야 합니다. 이를 '보험 리모델링'이라고 합니다.
          </p>
        </div>

        <div className="bg-primary-50 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-inner border border-primary-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-20 -mb-20"></div>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-500 rounded-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                잘못된 예전 고정관념
              </h3>
              <ul className="space-y-4 text-gray-600 font-medium tracking-tight">
                <li className="flex items-start gap-3 opacity-70">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>지인이 추천해서 믿고 가입하면 끝</span>
                </li>
                <li className="flex items-start gap-3 opacity-70">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>보험료는 비쌀수록 무조건 좋은 거다</span>
                </li>
                <li className="flex items-start gap-3 opacity-70">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>한 번 가입한 보험은 무조건 유지해야 손해 안본다</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-primary-900 border-b border-primary-200 pb-3 md:border-none md:pb-0">
                <div className="p-2 bg-primary-500 text-white rounded-xl shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                스마트한 리모델링 공식
              </h3>
              <ul className="space-y-4 text-gray-700 font-medium">
                <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-primary-50">
                  <span className="text-primary-500 mt-0.5 bg-primary-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                  <span>내 상황과 소득에 맞는 적정 보험료 산출</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-primary-50">
                  <span className="text-primary-500 mt-0.5 bg-primary-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                  <span>중복 보장/사망 보장보다는 생존 시 혜택 집중</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-primary-50">
                  <span className="text-primary-500 mt-0.5 bg-primary-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                  <span>3대 진단비(암, 뇌, 심장)와 가족력 필수 대비</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
