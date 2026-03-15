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

        {/* Tools Menu Section */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">전문가용 보험 솔루션 메뉴</h2>
            <p className="text-sm font-bold text-gray-400">설계사님이 제공하는 편리한 자동화 도구를 이용해 보세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: Premium Calc */}
            <Link 
              href={`/p/${id}/card/premium`}
              className="group bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-primary-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-lg shadow-primary-100">
                <CalculatorIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">보험료 계산기</h3>
              <p className="text-xs font-bold text-gray-500 leading-relaxed">
                3대 진단비(암, 뇌, 심장)<br/>나의 예상 보험료 확인
              </p>
            </Link>

            {/* Tool 2: Silbi Calc */}
            <Link 
              href={`/p/${id}/card/silbi`}
              className="group bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-amber-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-lg shadow-amber-100">
                <AdjustmentsHorizontalIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">실비 계산기</h3>
              <p className="text-xs font-bold text-gray-500 leading-relaxed">
                1세대부터 4세대까지<br/>내 실손 보험금 즉시 비교
              </p>
            </Link>

            {/* Tool 3: Customer Center */}
            <Link 
              href={`/p/${id}/card/customer-center`}
              className="group bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-100">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">전용 고객센터</h3>
              <p className="text-xs font-bold text-gray-500 leading-relaxed">
                전 보험사 고객센터<br/>원클릭 전화 연결 서비스
              </p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
