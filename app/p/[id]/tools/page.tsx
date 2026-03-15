import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import InsurancePremiumCalculator from '@/components/InsurancePremiumCalculator'
import SilbiCalculator from '@/components/SilbiCalculator'
import CustomerCenter from '@/components/CustomerCenter'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function PlannerToolsPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch planner info for branding
  const { data: planner, error } = await supabaseAdmin
    .from('planners')
    .select('name, affiliation')
    .eq('id', id)
    .single()

  if (error || !planner) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href={`/p/${id}`}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              돌아가기
            </Link>
            <div className="text-right">
              <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-widest mb-1 inline-block">
                Planner Tools
              </span>
              <h1 className="text-xl font-black text-gray-900">
                {planner.name} 설계사 전용 도구
              </h1>
            </div>
          </div>

          <div className="space-y-12">
            {/* Premium Calculator */}
            <section id="premium-calc" className="scroll-mt-24">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">보장성 보험료 계산</h2>
                <p className="text-sm font-bold text-gray-400">나의 예상 보험료를 1분 만에 확인하세요.</p>
              </div>
              <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100">
                <InsurancePremiumCalculator />
              </div>
            </section>

            {/* Silbi Calculator */}
            <SilbiCalculator />

            {/* Customer Center */}
            <CustomerCenter />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
