import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import CustomerCenter from '@/components/CustomerCenter'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function PlannerCardCustomerCenterPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const { data: planner } = await supabaseAdmin.from('planners').select('name').eq('id', id).single()
  if (!planner) notFound()

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/p/${id}/intro`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8">
          <ArrowLeftIcon className="w-5 h-5" /> 명함으로 돌아가기
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">보험사 고객센터 디렉토리</h1>
          <p className="text-sm font-bold text-gray-400">전 보험사 고객센터로 즉시 전화를 연결합니다.</p>
        </div>
        <CustomerCenter />
      </div>
      <Footer />
    </main>
  )
}
