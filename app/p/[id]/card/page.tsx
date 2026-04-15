import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabaseServer'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AdvisorProfile from '@/components/AdvisorProfile'
import AdvisorTrust from '@/components/AdvisorTrust'
import ToolkitMenu from '@/components/ToolkitMenu'
import AttributionSetter from '@/components/AttributionSetter'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params
  const { data: planner } = await supabaseAdmin
    .from('planners')
    .select('name, affiliation, profile_image_url, region')
    .eq('id', id)
    .single()

  if (!planner) return {}

  const title = `${planner.name} | 보험 전문 설계사`
  const description = planner.affiliation 
    ? `${planner.affiliation} ${planner.name} 설계사 | ${planner.region || '전국'} 상담 가능 | 무료 보험 진단 & 리모델링`
    : `${planner.name} 설계사 | 무료 보험 진단 & 리모델링 상담`

  const ogImage = planner.profile_image_url || '/og-image.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: '인슈닷',
      images: [{ url: ogImage, width: 600, height: 600, alt: `${planner.name} 프로필` }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function DigitalBusinessCardPage({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams: { source?: string }
}) {
  const { id } = await params
  const { source } = await searchParams

  // Fetch planner info
  const { data: planner, error } = await supabaseAdmin
    .from('planners')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !planner) {
    notFound()
  }

  // Increment visit_count and track acquisition source
  try {
    // 1. Increment planner specific count
    await supabaseAdmin.rpc('increment_visit_count', { planner_id: id })
    
    // 2. Increment global site visit with source tracking
    await supabaseAdmin.rpc('increment_site_visit', { p_source: source || 'direct' })
  } catch (err) {
    console.error('Increment error:', err)
  }
  
  // Alternative fallback if RPC is not set up
  // await supabaseAdmin.from('planners').update({ visit_count: (planner.visit_count || 0) + 1 }).eq('id', id)

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Attribution: tells all consultation forms sitewide to route to this planner */}
      <AttributionSetter plannerId={planner.id} />
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
        
        {/* Advisor Trust Section (Client Component for Localization) */}
        <AdvisorTrust />
      </div>
      <Footer />
    </main>
  )
}
