'use client'

import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
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
import PlannerBranding from '@/components/PlannerBranding'
import PageTracker from '@/components/PageTracker'
import { useAttribution } from '@/lib/attribution'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { usePathname } from 'next/navigation'

import ReferralRewardBanner from '@/components/ReferralRewardBanner'

export default function Home() {
  const { planner, loading: attrLoading } = useAttribution()
  const { planner: loggedInPlanner, loading: plannerLoading } = usePlanner()
  const pathname = usePathname()

  const showProfessionalContent = (!!planner && planner.id !== loggedInPlanner?.id) || (!!loggedInPlanner && typeof pathname === 'string' && pathname !== '/');
  const isLoading = attrLoading && plannerLoading;

  return (
    <main className="min-h-screen flex flex-col">
      <PageTracker />
      <NavBar key={`navbar-${pathname}`} />
      
      <Hero />

      <div className="bg-white">
        <ConsultationForm id="consultation-top" />
        <Concerns />
        <Services />
        
        {/* Professional Sections: Only shown if attributed or logged-in planner */}
        {showProfessionalContent && !isLoading && (
          <>
            <AdvancedRadiation />
            <Reviews />
            <CaseCollection />
          </>
        )}
        
        {!showProfessionalContent && !isLoading && (
           <Reviews />
        )}
      </div>

      <div className="bg-gray-50">
        <About />
        {showProfessionalContent && !isLoading && (
          <AdvisorProfile />
        )}
      </div>

      <div className="bg-white">
        {showProfessionalContent && !isLoading && (
          <CommunityLinks />
        )}
        <PlannerBranding />
      </div>

      <Footer key={`footer-${pathname}`} />
      
      {/* Referral Reward System for Guests */}
      <ReferralRewardBanner />
    </main>
  )
}
