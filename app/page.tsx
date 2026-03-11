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

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <Hero />
      <TrustStrip />

      <div className="bg-white">
        <ConsultationForm id="consultation-top" />
        <Concerns />
        <Services />
        
        {/* Insurance Premium Calculator Section */}
        <section id="premium-calculator" className="py-20 bg-gray-50/50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">내 예상 보험료 확인하기</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">간단한 정보 입력으로 주요 보장에 대한 예상 보험료를 즉시 확인해 보세요.</p>
            </div>
            <InsurancePremiumCalculator />
          </div>
        </section>

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
        <ConsultationForm />
      </div>

      <Footer />
    </main>
  )
}
