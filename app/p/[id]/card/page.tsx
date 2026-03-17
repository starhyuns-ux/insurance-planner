import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import AdvisorProfile from '@/components/AdvisorProfile'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import ToolkitMenu from '@/components/ToolkitMenu'

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

        {/* Toolkit Section (Client Component) */}
        <ToolkitMenu id={id} plannerName={planner.name} />
        
        {/* Additional Trust Section (Keep as Server part for SEO/Speed) */}
        <div className="bg-gray-50 py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-12">정직과 신뢰의 약속</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">등록여부</p>
                <p className="text-sm font-bold text-gray-900">금융감독원 등록</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">상담분야</p>
                <p className="text-sm font-bold text-gray-900">전 생보/손보</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">주요지역</p>
                <p className="text-sm font-bold text-gray-900">전국 상시 가능</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">경력사항</p>
                <p className="text-sm font-bold text-gray-900">보험경력 3년 이상</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
