'use client'

import { useAttribution } from '@/lib/attribution'
import AdvisorProfile from '@/components/AdvisorProfile'
import ConsultationForm from '@/components/ConsultationForm'

export default function PlannerBranding() {
  const { planner, loading } = useAttribution()

  if (loading || !planner) return null

  return (
    <div className="bg-white border-t border-gray-100">
      <div className="bg-gray-50/50 py-12">
        <div className="container px-4 mx-auto text-center">
            <div className="inline-block bg-primary-100 text-primary-800 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
                Attributed Consultant
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{planner.name} 설계사와 함께하는 보험 다이어트</h2>
            <p className="text-gray-600">지금 바로 궁금한 점을 문의하거나 맞춤 진단을 신청하세요.</p>
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
      />

      <ConsultationForm 
        plannerId={planner.id} 
        plannerInfo={{ name: planner.name, phone: planner.phone }}
      />
    </div>
  )
}
