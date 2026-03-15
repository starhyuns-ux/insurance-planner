import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalculatorIcon, BoltIcon, PhoneIcon } from '@heroicons/react/24/outline'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default async function PlannerToolsMenuPage({ params }: { params: { id: string } }) {
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link 
              href={`/p/${id}`}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              명함으로 돌아가기
            </Link>
            <div className="text-right">
              <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-widest mb-1 inline-block">
                Professional Tools
              </span>
              <h1 className="text-xl font-black text-gray-900">
                {planner.name} 전용 솔루션
              </h1>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">어떤 도구를 이용할까요?</h2>
            <p className="text-gray-500 font-bold">설계사님이 제공하는 전문 보험 도구 모음입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: Premium Calc */}
            <Link 
              href={`/p/${id}/tools/premium`}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-primary-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-100">
                <CalculatorIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">보험료 계산기</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                3대 진단비(암, 뇌, 심장)<br/>내 예상 보험료 1분 확인
              </p>
              <div className="mt-8 text-primary-600 font-black text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                도구 실행하기
                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
              </div>
            </Link>

            {/* Tool 2: Silbi Calc */}
            <Link 
              href={`/p/${id}/tools/silbi`}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-amber-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-amber-100">
                <BoltIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">실비 계산기</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                1세대부터 4세대까지<br/>내 실손 보험금 즉시 비교
              </p>
              <div className="mt-8 text-amber-600 font-black text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                도구 실행하기
                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
              </div>
            </Link>

            {/* Tool 3: Customer Center */}
            <Link 
              href={`/p/${id}/tools/customer-center`}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100">
                <PhoneIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">전용 고객센터</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                전 보험사 고객센터<br/>원클릭 전화 연결 디렉토리
              </p>
              <div className="mt-8 text-blue-600 font-black text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                도구 실행하기
                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
