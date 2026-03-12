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
      
      {/* Insurance Premium Calculator Section (Moved to top) */}
      <section id="premium-calculator" className="py-20 bg-gray-50/50 pt-28">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">예상 <span className="text-amber-600">보험료 계산기</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto break-keep text-lg">성별과 생년월일만 입력하면 암·뇌·심장 진단비와 수술비까지 즉시 확인해 드립니다.</p>
          </div>
          <InsurancePremiumCalculator />
        </div>
      </section>

      <Hero />
      <TrustStrip />

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
        <ConsultationForm />
      </div>

      <Footer />
    </main>
  )
}
