import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import FifthGenGuide from '@/components/FifthGenGuide'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'
import ToolPageHeader from '@/components/ToolPageHeader'
import AttributionSetter from '@/components/AttributionSetter'

export default async function PlannerCardFifthGenPage({ params }: { params: { planner_id: string } }) {
  const { planner_id } = await params

  const { data: planner } = await supabaseAdmin.from('planners').select('name').eq('id', planner_id).single()
  if (!planner) notFound()

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <AttributionSetter plannerId={planner_id} />
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader id={planner_id} type="fifthGen" />
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100">
          <FifthGenGuide />
        </div>
      </div>
      <Footer />
    </main>
  )
}
