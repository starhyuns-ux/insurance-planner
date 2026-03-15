import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import AdvisorProfile from '@/components/AdvisorProfile'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function AdvisorIntroPage({ params }: { params: { id: string } }) {
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
        {/* Focused Introduction Section */}
        <div className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">
              Expert Introduction
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              전문 설계사 상세 프로필
            </h1>
            <p className="mt-4 text-gray-500 font-bold max-w-xl mx-auto leading-relaxed">
              고객님의 소중한 자산과 미래를 함께 설계할 전문 파트너를 소개합니다.
            </p>
          </div>
        </div>

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
        
        {/* Additional Trust Section for this dedicated page */}
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
