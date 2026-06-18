import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import CustomerCenter from '@/components/CustomerCenter'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'
import ToolPageHeader from '@/components/ToolPageHeader'

export default async function PlannerCardCustomerCenterPage({ params }: { params: { planner_id: string } }) {
  const { planner_id } = await params

  const { data: planner } = await supabaseAdmin.from('planners').select('name').eq('id', planner_id).single()
  if (!planner) notFound()

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader id={planner_id} type="customer" />
        <CustomerCenter />
      </div>
      <Footer />
    </main>
  )
}
