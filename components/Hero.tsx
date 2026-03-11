"use client"

import { useState, useEffect } from 'react'

export default function Hero() {
  const [displayText, setDisplayText] = useState("")
  const targetText = "175,000"

  useEffect(() => {
    let i = 0
    let pauseCounter = 0

    const intervalId = setInterval(() => {
      if (pauseCounter > 0) {
        pauseCounter--
        if (pauseCounter === 0) {
          setDisplayText("")
        }
        return
      }

      setDisplayText(targetText.slice(0, i))
      i++

      if (i > targetText.length) {
        pauseCounter = 20 // 약 3초(20틱) 대기
        i = 1 // 다음 주기에 첫 글자가 즉시 찍히도록 세팅
      }
    }, 150) // 타이핑 속도 조절

    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white"></div>

      <div className="container grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="max-w-2xl px-4 md:px-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 backdrop-blur-sm text-primary-700 text-sm font-semibold mb-6 border border-primary-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
            </span>
            <div className="flex">
              {"3월 한정 리모델링 상담 무료".split("").map((char, index) => (
                <span
                  key={index}
                  className={`${char === ' ' ? 'mr-1' : 'animate-drop-bounce'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-6 break-keep">
            보험료는 절약하고<br />
            <span className="text-primary-600">보장은 제대로</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 md:whitespace-pre-line">
            {'전문가의 1:1 맞춤 분석으로\n불필요한 특약은 빼고, 핵심 보장만 든든하게 채워드립니다.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#consultation"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
            >
              무료 리모델링 신청하기
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#reviews"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              절감 사례 보기
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500 md:ml-4">
            * 상담 신청 시 전문 컨설턴트가 카카오톡으로 배정됩니다.
          </p>
        </div>

        {/* Right Illustration/Graphic */}
        <div className="relative mx-auto w-full max-w-lg aspect-square hidden md:block">
          {/* Animated Blobs for visual flare */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob [animation-delay:2s]"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob [animation-delay:4s]"></div>

          {/* Main Card */}
          <div className="relative w-full h-[90%] mt-8 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8 z-10">
            <div className="absolute top-4 right-6 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              분석 완료
            </div>

            <div className="bg-primary-50 p-4 rounded-full mb-6">
              <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">월 평균 절감액</h3>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              {displayText}
              <span className={`inline-block w-1.5 h-10 ml-0.5 align-middle bg-primary-400 opacity-75 ${displayText.length === targetText.length ? 'animate-pulse' : ''}`}></span>
              <span className="text-2xl ml-1 text-gray-600 font-bold">원</span>
            </div>
            <p className="mt-4 text-gray-500 font-medium">쓸데없는 지출은 줄이고,<br />우리가족 필수 보장은 든든하게!</p>
          </div>
        </div>
      </div>
    </section>
  )
}
