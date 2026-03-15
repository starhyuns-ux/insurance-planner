import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalculatorIcon, AdjustmentsHorizontalIcon, PhoneIcon } from '@heroicons/react/24/outline'
import AdvisorProfile from '@/components/AdvisorProfile'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function DigitalBusinessCardPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch planner info
  const { data: planner, error } = await supabaseAdmin
    .from('planners')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !planner) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1">
        {/* Profile Section */}
        <AdvisorProfile 
          name={planner.name}
          phone={planner.phone}
          profileImage={planner.profile_image_url}
          businessCard={planner.business_card_url}
          affiliation={planner.affiliation}
          region={planner.region}
          kakaoUrl={planner.kakao_url}
          message={planner.advisor_message}
        />

        {/* Tools Menu Section - Integrated as requested */}
        <div className="bg-white border-t border-gray-100 py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">
                Professional Toolkit
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">전문가 보험 솔루션 메뉴</h2>
              <p className="text-gray-500 font-bold max-w-xl mx-auto leading-relaxed">
                {planner.name} 설계사가 제공하는 스마트 분석 도구입니다.<br/>원하시는 도구를 선택해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tool 1: Premium Calc */}
              <Link 
                href={`/p/${id}/card/tools/premium`}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-primary-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-100">
                  <CalculatorIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">보험료 계산기</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  3대 진단비(암, 뇌, 심장)<br/>내 예상 보험료 확인
                </p>
                <div className="mt-8 text-primary-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  실행하기 →
                </div>
              </Link>

              {/* Tool 2: Silbi Calc */}
              <Link 
                href={`/p/${id}/card/tools/silbi`}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-amber-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-amber-100">
                  <AdjustmentsHorizontalIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">실비 계산기</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  1세대부터 4세대까지<br/>내 실손 보험금 비교
                </p>
                <div className="mt-8 text-amber-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  실행하기 →
                </div>
              </Link>

              {/* Tool 3: Customer Center */}
              <Link 
                href={`/p/${id}/card/tools/customer-center`}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100">
                  <PhoneIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">전용 고객센터</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  전 보험사 고객센터<br/>원클릭 전화 연결 서비스
                </p>
                <div className="mt-8 text-blue-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  실행하기 →
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional Trust Section */}
        <div className="bg-gray-50 py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-12">설계사 인증 정보</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">등록 상태</p>
                <p className="text-sm font-bold text-gray-900">정식 등록 완료</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">상담 가능</p>
                <p className="text-sm font-bold text-gray-900">전국 비대면</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">주요 분야</p>
                <p className="text-sm font-bold text-gray-900">종합 자산 관리</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">경력 사항</p>
                <p className="text-sm font-bold text-gray-900">전문성 인증</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
