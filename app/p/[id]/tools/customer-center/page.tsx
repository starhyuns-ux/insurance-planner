import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import CustomerCenter from '@/components/CustomerCenter'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function PlannerCustomerCenterPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch planner info
  const { data: planner, error } = await supabaseAdmin
    .from('planners')
    .select('name')
    .eq('id', id)
    .single()

  if (error || !planner) notFound()

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/p/${id}/tools`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8">
          <ArrowLeftIcon className="w-5 h-5" /> 도구 메뉴로 돌아가기
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">보험사 고객센터 디렉토리</h1>
          <p className="text-sm font-bold text-gray-400">{planner.name} 설계사가 정리한 전 보험사 원클릭 연결 서비스</p>
        </div>
        <CustomerCenter />
      </div>
      <Footer />
    </main>
  )
}
