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

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <PageTracker />
      <NavBar />
      
      <Hero />

      <div className="bg-white">
        <ConsultationForm id="consultation-top" />
        <Concerns />
        <Services />
        <AdvancedRadiation />
        <Reviews />
        <CaseCollection />
      </div>

      <div className="bg-gray-50">
        <About />
        <AdvisorProfile />
      </div>

      <div className="bg-white">
        <CommunityLinks />
        <PlannerBranding />
      </div>

      <Footer />
    </main>
  )
}
