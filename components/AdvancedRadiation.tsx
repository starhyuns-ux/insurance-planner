import React from 'react';
import Image from 'next/image';

export default function AdvancedRadiation() {
    return (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
            <div className="container max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-bold tracking-wide border border-red-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            준비되지 않은 고액 치료비의 압박
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.3] break-keep">
                            암 치료의 게임 체인저<br />
                            <span className="text-primary-600">첨단 방사선 치료,</span><br className="hidden md:block" />
                            대비하셨나요?
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed md:whitespace-pre-line break-keep">
                            꿈의 암 치료기라 불리는 중입자 치료, 양성자 치료.<br className="hidden md:block" />
                            부작용은 적고 효과는 탁월하지만 <strong className="text-gray-900">1회 치료에 수천만 원</strong>의 고액 비용이 발생합니다.<br />
                            <br />
                            현재 내 보험으로 감당할 수 있는지 <strong>전문가의 세밀한 점검</strong>이 반드시 필요합니다.
                        </p>

                        <div className="pt-4">
                            <ul className="space-y-3 text-left inline-block">
                                <li className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-gray-800 font-medium">수천만 원대 비급여 의료비 특약 확인</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-gray-800 font-medium">실손 통원/입원 한도 부족분 점검</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-gray-800 font-medium">표적항암약물허가치료비 등 핵심 담보 추가</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col items-center justify-center group">
                            <Image
                                src="/images/joongibja.png"
                                alt="암 치료의 게임 체인저 첨단 방사선 치료 (중입자/양성자 치료)"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            />
                        </div>

                        {/* Image shadow/decoration */}
                        <div className="mt-8 relative hidden md:block">
                            <div className="absolute top-0 right-10 w-2/3 h-6 bg-primary-900/10 blur-xl rounded-[100%]"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
