import { supabase } from '@/lib/supabaseClient'
import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
import TrustStrip from '@/components/TrustStrip'
import Concerns from '@/components/Concerns'
import Services from '@/components/Services'
import Reviews from '@/components/Reviews'
import About from '@/components/About'
import AdvisorProfile from '@/components/AdvisorProfile'
import CommunityLinks from '@/components/CommunityLinks'
import ConsultationForm from '@/components/ConsultationForm'
import Footer from '@/components/Footer'
import CaseCollection from '@/components/CaseCollection'
import AdvancedRadiation from '@/components/AdvancedRadiation'
import InsurancePremiumCalculator from '@/components/InsurancePremiumCalculator'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import AttributionSetter from '@/components/AttributionSetter'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params
  
  const { data: planner } = await supabase
    .from('planners')
    .select('name, profile_image_url, affiliation')
    .eq('id', id)
    .single()

  if (!planner) return {}

  const title = `${planner.name} 설계사 | 보험 리모델링 전문가`
  const description = `${planner.affiliation} 소속 ${planner.name} 설계사입니다. 정직한 분석과 최적의 보험료 리모델링을 약속드립니다.`
  const ogImage = planner.profile_image_url || '/og-image.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PlannerLandingPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch planner info
  const { data: planner, error } = await supabase
    .from('planners')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !planner) {
    // If not found, show 404
    notFound()
  }

  // Only active subscribers can have a landing page
  if (planner.subscription_status !== 'active') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-amber-50 p-6 rounded-full inline-block mb-6">
            <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">비활성화된 페이지입니다</h1>
          <p className="text-gray-600 mb-8">해당 설계사님의 구독이 만료되었거나 비활성 상태입니다.</p>
          <a href="/" className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">홈으로 돌아가기</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <AttributionSetter plannerId={planner.id} />
      <NavBar />
      
      <Hero />
      <TrustStrip />

      <div className="bg-white">
        {/* Insurance Premium Calculator Section */}
        <section id="premium-calculator" className="py-20 bg-gray-50/50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">보험료 계산기</h2>
              <p className="text-gray-600 max-w-2xl mx-auto break-keep text-lg">성별과 생년월일만 입력하면 암·뇌·심장 진단비와 수술비까지 즉시 확인해 드립니다.</p>
            </div>
            <InsurancePremiumCalculator />
          </div>
        </section>

        <ConsultationForm 
          id="consultation-top" 
          plannerId={planner.id} 
          plannerInfo={{ name: planner.name, phone: planner.phone }}
        />
        <Concerns />
        <Services />
        <AdvancedRadiation />
        <Reviews />
        <CaseCollection />
      </div>

      <div className="bg-gray-50">
        <About />
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
      </div>

      <div className="bg-white">
        <CommunityLinks />
        <ConsultationForm 
          plannerId={planner.id} 
          plannerInfo={{ name: planner.name, phone: planner.phone }}
        />
      </div>

      <Footer />
    </main>
  )
}
