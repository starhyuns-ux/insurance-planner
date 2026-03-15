import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import SilbiCalculator from '@/components/SilbiCalculator'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function PlannerCardSilbiPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const { data: planner } = await supabaseAdmin.from('planners').select('name').eq('id', id).single()
  if (!planner) notFound()

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Link href={`/p/${id}/card`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8">
          <ArrowLeftIcon className="w-5 h-5" /> 명함으로 돌아가기
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">세대별 실비 보험금 계산기</h1>
          <p className="text-sm font-bold text-gray-400">1세대부터 4세대까지 본인부담금을 비교해 드립니다.</p>
        </div>
        <SilbiCalculator />
      </div>
      <Footer />
    </main>
  )
}
