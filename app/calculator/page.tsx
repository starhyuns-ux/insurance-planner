'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import SilbiCalculator from '@/components/SilbiCalculator'
import InsurancePremiumCalculator from '@/components/InsurancePremiumCalculator'
import { useState } from 'react'

export default function CalculatorPage() {
    const [activeTab, setActiveTab] = useState<'silbi' | 'premium'>('silbi')

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-1 py-16 md:py-24 px-4 mt-16">
                
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="inline-block bg-primary-100 text-primary-800 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
                        원클릭 보험 계산기
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        {activeTab === 'silbi' ? '세대별 실손보험 계산기' : '전체 보험료 계산기'}
                    </h1>
                    
                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 inline-flex gap-1">
                            <button 
                                onClick={() => setActiveTab('silbi')}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                                    activeTab === 'silbi' 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                실비 계산기
                            </button>
                            <button 
                                onClick={() => setActiveTab('premium')}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                                    activeTab === 'premium' 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                보험료 계산기
                            </button>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto break-keep leading-relaxed">
                        {activeTab === 'silbi' ? (
                            <>
                                병원비를 입력하면 1세대부터 4세대까지 내야 할 <strong className="text-rose-500">본인부담금</strong>과 돌려받을 <strong className="text-primary-600">보상금액</strong>을 직관적으로 비교해 드립니다.
                            </>
                        ) : (
                            <>
                                성별과 생년월일만으로 <strong className="text-primary-600">주요 3대 질병</strong>과 <strong className="text-primary-600">수술비</strong>를 포함한 내 월 예상 보험료를 즉시 확인해 보세요.
                            </>
                        )}
                    </p>
                </div>

                {/* Calculator Component */}
                {activeTab === 'silbi' ? <SilbiCalculator /> : <InsurancePremiumCalculator />}

            </div>

            <Footer />
        </main>
    )
}
