'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  UserCircleIcon,
  ClockIcon,
  ShareIcon,
  LockClosedIcon,
  TrashIcon,
  ScaleIcon,
  KeyIcon,
  EnvelopeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function PrivacyPage() {
  const sections = [
    { id: 'purpose', title: '1. 개인정보의 처리목적', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: 'items', title: '2. 처리하는 개인정보 항목', icon: <UserCircleIcon className="w-5 h-5" /> },
    { id: 'retention', title: '3. 개인정보의 처리 및 보유기간', icon: <ClockIcon className="w-5 h-5" /> },
    { id: 'third-party', title: '4. 개인정보의 제3자 제공', icon: <ShareIcon className="w-5 h-5" /> },
    { id: 'entrust', title: '5. 개인정보 처리의 위탁', icon: <KeyIcon className="w-5 h-5" /> },
    { id: 'rights', title: '6. 정보주체의 권리·의무 및 행사방법', icon: <ScaleIcon className="w-5 h-5" /> },
    { id: 'destruction', title: '7. 개인정보의 파기', icon: <TrashIcon className="w-5 h-5" /> },
    { id: 'security', title: '8. 개인정보의 안전성 확보조치', icon: <LockClosedIcon className="w-5 h-5" /> },
    { id: 'cookies', title: '9. 쿠키의 설치·운영 및 거부', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'officer', title: '10. 개인정보 보호책임자', icon: <EnvelopeIcon className="w-5 h-5" /> },
    { id: 'change', title: '11. 개인정보처리방침의 변경', icon: <InformationCircleIcon className="w-5 h-5" /> },
  ]

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <NavBar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* ── Sidebar: Table of Contents ── */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-32 space-y-2">
                <div className="px-4 mb-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Index</h3>
                  <div className="h-1 w-8 bg-primary-500 rounded-full"></div>
                </div>
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-primary-600 hover:bg-white hover:shadow-sm transition-all text-left group"
                  >
                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">{s.icon}</span>
                    <span className="truncate">{s.title.split('. ')[1]}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16 overflow-hidden relative">
                
                {/* Header Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl pointer-events-none"></div>

                <div className="relative">
                  <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">개인정보처리방침</h1>
                  <p className="text-gray-400 font-medium mb-12 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    시행일자: 2026.03.30
                  </p>
                  
                  <section className="mb-16">
                    <p className="text-lg font-bold text-gray-800 leading-relaxed bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 italic">
                      "인슈닷(이하 “회사”라 합니다)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위하여 최선을 다하고 있습니다. 회사는 본 개인정보처리방침을 통하여 이용자의 개인정보가 어떠한 용도와 방식으로 처리되고 있는지 안내드립니다."
                    </p>
                  </section>

                  <div className="space-y-20 text-gray-600 leading-8">
                    
                    <section id="purpose">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        1. 개인정보의 처리목적
                      </h2>
                      <p className="mb-6 font-medium">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 아래 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 필요한 조치를 이행합니다.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          '회원가입 및 본인확인',
                          '회원관리 및 서비스 제공',
                          '이용자 문의 응대 및 고객지원',
                          '공지사항 전달',
                          '서비스 개선 및 운영 통계 분석',
                          '이벤트 및 마케팅 정보 제공 (별도 동의 시)'
                        ].map(item => (
                          <div key={item} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                            <span className="text-sm font-bold text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="items">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        2. 처리하는 개인정보 항목
                      </h2>
                      <p className="mb-6">회사는 회원가입 및 서비스 제공을 위하여 다음과 같은 개인정보를 수집할 수 있습니다.</p>
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                          <h3 className="font-black text-gray-900 mb-4 text-lg">가. 회원가입 시 수집항목</h3>
                          <ul className="space-y-2 font-medium">
                            <li className="flex gap-2"><span className="text-primary-600 font-black">• 필수항목:</span> 이름, 아이디, 비밀번호, 이메일 주소, 휴대전화번호</li>
                            <li className="flex gap-2"><span className="text-primary-600 font-black">• 보험금 청구 시 추가수집:</span> 주민등록번호(마스킹), 계좌정보, **사고/질병 내역(민감정보)**, 진료비 영수증 이미지</li>
                            <li className="flex gap-2"><span className="text-gray-400 font-black">• 선택항목:</span> 주소, 생년월일, 성별</li>
                          </ul>
                        </div>
                        <div className="p-8 border border-gray-100 rounded-[2rem]">
                          <h3 className="font-black text-gray-900 mb-4 text-lg">나. 서비스 이용 과정에서 자동으로 수집될 수 있는 항목</h3>
                          <div className="flex flex-wrap gap-2">
                            {['IP주소', '쿠키', '접속로그', '서비스 이용기록', '방문일시', '기기정보', '브라우저 정보'].map(tag => (
                              <span key={tag} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-extra-bold text-gray-500">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section id="retention">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        3. 개인정보의 처리 및 보유기간
                      </h2>
                      <p className="mb-6">회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시 동의받은 보유·이용기간 내에서 개인정보를 처리 및 보유합니다.</p>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-6">
                        <p className="font-bold text-gray-800">• 회원정보: 회원 탈퇴 시까지</p>
                        <p className="text-sm text-gray-500 mt-1">다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
                      </div>
                      <div className="overflow-hidden border border-gray-100 rounded-[2rem]">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">항목</th>
                              <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">보유기간</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 font-medium">
                            <tr><td className="px-8 py-4">계약 또는 청약철회 등에 관한 기록</td><td className="px-8 py-4 text-gray-500">5년</td></tr>
                            <tr><td className="px-8 py-4">대금결제 및 재화 등의 공급에 관한 기록</td><td className="px-8 py-4 text-gray-500">5년</td></tr>
                            <tr><td className="px-8 py-4">소비자 불만 또는 분쟁처리에 관한 기록</td><td className="px-8 py-4 text-gray-500">3년</td></tr>
                            <tr><td className="px-8 py-4">표시·광고에 관한 기록</td><td className="px-8 py-4 text-gray-500">6개월</td></tr>
                            <tr><td className="px-8 py-4">접속에 관한 기록</td><td className="px-8 py-4 text-gray-500">3개월</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section id="third-party">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        4. 개인정보의 제3자 제공
                      </h2>
                      <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
                      <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                        <li>이용자가 사전에 동의한 경우</li>
                        <li>**보험금 청구 목적**: 전송 대상 보험사 (청구서 및 증빙 서류 전달)</li>
                        <li>법령에 특별한 규정이 있는 경우</li>
                        <li>수사기관 등 관계기관의 적법한 요청이 있는 경우</li>
                      </ul>
                    </section>

                    <section id="entrust">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        5. 개인정보 처리의 위탁
                      </h2>
                      <p className="mb-6">회사는 원활한 서비스 제공을 위하여 필요한 경우 개인정보 처리업무를 외부에 위탁할 수 있습니다.</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {['호스팅 서비스', '문자 발송', '이메일 발송', '결제 서비스', '팩스 전송(팝빌)'].map(svc => (
                          <div key={svc} className="text-center p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500">
                            {svc}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-400">회사는 위탁계약 체결 시 관련 법령에 따라 개인정보가 안전하게 처리되도록 필요한 사항을 규정하고 관리·감독합니다.</p>
                    </section>

                    <section id="rights">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        6. 정보주체의 권리·의무 및 행사방법
                      </h2>
                      <p className="mb-6">이용자는 언제든지 자신의 개인정보에 대하여 다음의 권리를 행사할 수 있습니다.</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold text-gray-700 mb-6">
                        <li className="bg-white px-4 py-3 rounded-xl border border-gray-100">1. 개인정보 열람 요구</li>
                        <li className="bg-white px-4 py-3 rounded-xl border border-gray-100">2. 개인정보 정정·삭제 요구</li>
                        <li className="bg-white px-4 py-3 rounded-xl border border-gray-100">3. 개인정보 처리정지 요구</li>
                        <li className="bg-white px-4 py-3 rounded-xl border border-gray-100">4. 동의 철회 요구</li>
                      </ul>
                      <p className="text-sm">권리 행사는 회사에 서면, 이메일 등을 통하여 요청할 수 있으며, 회사는 지체 없이 필요한 조치를 하겠습니다.</p>
                    </section>

                    <section id="destruction">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        7. 개인정보의 파기
                      </h2>
                      <p>회사는 개인정보 보유기간의 경과 또는 처리목적 달성 등으로 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="block text-gray-900 font-black mb-1">전자적 파일</span>
                          <p className="text-xs text-gray-500">복구 또는 재생이 불가능한 방법으로 영구 삭제</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="block text-gray-900 font-black mb-1">종이 문서</span>
                          <p className="text-xs text-gray-500">분쇄 또는 소각</p>
                        </div>
                      </div>
                    </section>

                    <section id="security">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        8. 개인정보의 안전성 확보조치
                      </h2>
                      <p className="mb-6">회사는 개인정보의 안전성 확보를 위하여 다음과 같은 조치를 취하고 있습니다.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          '내부관리계획의 수립 및 시행',
                          '개인정보 접근 권한의 관리',
                          '비밀번호 암호화',
                          '보안프로그램 설치 및 운영',
                          '접속기록 보관 및 위변조 방지',
                          '개인정보 보관시설의 접근통제'
                        ].map(measure => (
                          <div key={measure} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <LockClosedIcon className="w-4 h-4 text-primary-500" />
                            <span className="text-xs font-bold text-gray-600">{measure}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="cookies">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        9. 쿠키의 설치·운영 및 거부
                      </h2>
                      <p className="mb-4">회사는 이용자에게 맞춤형 서비스를 제공하기 위하여 쿠키를 사용할 수 있습니다.</p>
                      <p className="text-sm">이용자는 웹브라우저 설정을 통하여 쿠키 저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
                    </section>

                    <section id="officer">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        10. 개인정보 보호책임자
                      </h2>
                      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500 opacity-20 blur-3xl -mr-24 -mt-24 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div>
                            <p className="text-primary-400 font-black uppercase tracking-widest text-[10px] mb-2">Personal Information Manager</p>
                            <h3 className="text-3xl font-black mb-1">인슈닷</h3>
                            <p className="text-gray-400 font-bold">개인정보 보호책임자</p>
                          </div>
                          <div className="space-y-3 font-bold text-sm text-gray-400">
                            <p>홈페이지 내 1:1 채팅 문의</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section id="change">
                      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                        11. 개인정보처리방침의 변경
                      </h2>
                      <div className="bg-primary-50 border border-primary-100 p-8 rounded-[2rem]">
                        <p className="font-bold text-primary-900 mb-2">공지사항</p>
                        <ul className="space-y-2 text-sm text-primary-800 font-medium">
                          <li>• 본 개인정보처리방침은 [2026.03.30]부터 적용됩니다.</li>
                          <li>• 관련 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 시 홈페이지를 통하여 안내드립니다.</li>
                        </ul>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
