'use client'

import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
import Concerns from '@/components/Concerns'
import Services from '@/components/Services'
import Reviews from '@/components/Reviews'
import About from '@/components/About'
import AdvisorProfile from '@/components/AdvisorProfile'
import ConsultationForm from '@/components/ConsultationForm'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import PageTracker from '@/components/PageTracker'
import { useAttribution } from '@/lib/attribution'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { usePathname } from 'next/navigation'


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
      </div>

      <Concerns />
      <Services />
      <About />

      <Footer key={`footer-${pathname}`} />
    </main>
  )
}
