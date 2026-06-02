import InsuranceCalculator from "@/components/InsuranceCalculator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">IP</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Insurance Planner</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">서비스 안내</a>
            <a href="#" className="hover:text-white transition-colors">보험료 비교</a>
            <a href="#" className="hover:text-white transition-colors">자주 묻는 질문</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              대시보드
            </Link>
            <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors">
              상담 신청하기
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI 기반 보험 분석 업데이트
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              똑똑한 보험 시작,<br /> 
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                내 보험료 1분 확인
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              복잡한 보험료 계산은 이제 그만. 성별과 생년월일만으로 <br className="hidden md:block" /> 
              나에게 꼭 맞는 핵심 진단비 예상 보험료를 즉시 확인하세요.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <InsuranceCalculator />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 bg-zinc-950/50 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold">정확한 요율 반영</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">회신에서 제공하는 최신 보험나이별 요율표를 기반으로 가장 근접한 예상 보험료를 산출합니다.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3 className="text-xl font-bold">1분 내 결과 확인</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">성별과 생년월일만으로 별도의 로그인 없이 즉시 결과를 확인할 수 있어 빠르고 편리합니다.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-purple-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </div>
              <h3 className="text-xl font-bold">핵심 3대 진단비</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">한국인이 가장 많이 준비하는 암, 뇌, 심장 핵심 3대 진단비를 중심으로 최적의 설계를 돕습니다.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="font-bold text-black text-[10px]">IP</span>
              </div>
              <span className="text-lg font-bold">Insurance Planner</span>
            </div>
            <p className="text-zinc-600 text-xs">© 2026 Insurance Planner. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-zinc-500 text-xs">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">회사소개</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
