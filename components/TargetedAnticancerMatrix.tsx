'use client'

import React, { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

type DrugEntry = {
  id: number;
  name: string;
  lung: string;
  breast: string;
  gi: string; // 위/대장
  liver: string;
  kidney: string;
  blood: string;
  other: string;
};

const matrixData: DrugEntry[] = [
  { id: 1, name: "애플리버셉트 (잘트랩)", lung: "❌", breast: "❌", gi: "✅", liver: "❌", kidney: "❌", blood: "❌", other: "전이성 대장암 중심" },
  { id: 2, name: "알렉티닙 (알레센자)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "ALK 양성 비소세포폐암" },
  { id: 3, name: "아파티닙/아파티닙이말레산염 (지오트립)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "EGFR 변이 비소세포폐암, 일부 두경부암 기타에서 사용" },
  { id: 4, name: "엑시티닙 (인라이타)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "✅", blood: "❌", other: "신세포암(RCC)" },
  { id: 5, name: "보르테조밉 (벨케이드 등)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종, 림프종 등" },
  { id: 6, name: "카보잔티닙 (카보메틱스)", lung: "❌", breast: "❌", gi: "❌", liver: "✅", kidney: "✅", blood: "❌", other: "간세포암, 신세포암, 갑상선암 등" },
  { id: 7, name: "카르필조밉 (키프롤리스)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 8, name: "세리티닙 (자이카디아)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "ALK 양성 폐암" },
  { id: 9, name: "코비메티닙 (코텔릭)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 흑색종(BRAF) 병용요법" },
  { id: 10, name: "크리조티닙 (잴코리)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "ALK/ROS1 양성 폐암" },
  { id: 11, name: "다브라페닙 (라핀나)", lung: "⚠️", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 흑색종·BRAF 변이 폐암·갑상선암 등" },
  { id: 12, name: "다사티닙 (스프라이셀)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CML, Ph+ ALL" },
  { id: 13, name: "엘로티닙 (타쎄바/제네릭)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "폐암, 췌장암(기타)" },
  { id: 14, name: "에베로리무스 (아피니토)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "✅", blood: "❌", other: "NET 등 기타 고형암에도 사용" },
  { id: 15, name: "게피티니브 (이레사 등)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "EGFR 변이 폐암" },
  { id: 16, name: "이브루티닙 (임브루비카)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CLL, MCL, WM 등" },
  { id: 17, name: "이매티닙 (글리벡 계열)", lung: "❌", breast: "❌", gi: "⚠️", liver: "❌", kidney: "❌", blood: "✅", other: "GIST 등 위장관간질종양(기타)" },
  { id: 18, name: "익사조밉 (닌라로)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 19, name: "라파티닙 (타이커브)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "HER2 양성 유방암" },
  { id: 20, name: "렌바티닙 (렌비마)", lung: "❌", breast: "❌", gi: "❌", liver: "✅", kidney: "⚠️", blood: "❌", other: "갑상선암, 간암, 신장암 등" },
  { id: 21, name: "닐로티닙 (타시그나)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CML" },
  { id: 22, name: "올라파립 (린파자)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "난소암, 췌장암, 전립선암 등 기타 고형암" },
  { id: 23, name: "올무티닙 (올리타)", lung: "⚠️", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "EGFR 폐암용이었으나 국내 사용·허가 변경 이력, 실제 사용 제한적" },
  { id: 24, name: "오시머티닙 (타그리소)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "EGFR 변이 폐암 1·2·보조요법 등" },
  { id: 25, name: "팔보시클립 (입랜스)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "HR+ 진행성 유방암" },
  { id: 26, name: "파조파닙 (보트리엔트)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "✅", blood: "❌", other: "연조직육종(기타)도 포함" },
  { id: 27, name: "포나티닙 (아이클루시그)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CML, Ph+ ALL (T315I 등)" },
  { id: 28, name: "라도티닙 (슈펙트)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CML" },
  { id: 29, name: "레고라페닙 (스티바가)", lung: "❌", breast: "❌", gi: "✅", liver: "✅", kidney: "❌", blood: "❌", other: "GIST 포함 기타" },
  { id: 30, name: "룩소리티닙 (자카비)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "골수섬유증, PV 등" },
  { id: 31, name: "소라페닙 (넥사바)", lung: "❌", breast: "❌", gi: "❌", liver: "✅", kidney: "✅", blood: "❌", other: "갑상선암 등 기타 포함" },
  { id: 32, name: "수니티닙 (수텐)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "✅", blood: "❌", other: "GIST, pNET 등 기타" },
  { id: 33, name: "템시롤리무스 (토리셀)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "✅", blood: "❌", other: "신세포암" },
  { id: 34, name: "트라메티닙 (매큐셀)", lung: "⚠️", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "흑색종, BRAF 변이 폐암 등 기타" },
  { id: 35, name: "반데타닙 (카프렐사)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 갑상선 수질암" },
  { id: 36, name: "베무라페닙 (젤보라프)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 흑색종 등" },
  { id: 37, name: "비스모데깁 (에리벳지)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 기저세포암" },
  { id: 38, name: "파노비노스타트 (파리닥)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 39, name: "레날리도마이드 (레블리미드 등)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "골수종, MDS, 림프종 등" },
  { id: 40, name: "보리노스타트 (졸린자)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "주로 CTCL 등 혈액계 악성 질환" },
  { id: 41, name: "브리가티닙 (알룬브릭)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "ALK 양성 폐암" },
  { id: 42, name: "미도스타우린 (라이답)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "FLT3 변이 AML, 골수세포증 등" },
  { id: 43, name: "니라파립 (제줄라)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "✅ 난소암 등" },
  { id: 44, name: "퍼투주맙 (퍼제타)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "HER2 양성 유방암" },
  { id: 45, name: "트라스투주맙 엠탄신 (캐싸일라)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "HER2 양성 유방암" },
  { id: 46, name: "트라스투주맙 (허셉틴/허쥬마 등)", lung: "❌", breast: "✅", gi: "✅", liver: "❌", kidney: "❌", blood: "❌", other: "HER2 유방암·위암" },
  { id: 47, name: "올라라투맙 (라트루보)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "⚠️ 연조직육종용이었으나 글로벌 판매중단 이력, 국내 실제 사용 제한적" },
  { id: 48, name: "오비누투주맙 (가싸이바)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "FL 등 림프종, CLL" },
  { id: 49, name: "엘로투주맙 (엠플리시티)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 50, name: "실툭시맙 (실반트)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "카슬만병(림프 증식성 질환)" },
  { id: 51, name: "세툭시맙 (얼비툭스)", lung: "❌", breast: "❌", gi: "✅", liver: "❌", kidney: "❌", blood: "❌", other: "두경부암 등 기타 포함" },
  { id: 52, name: "블리나투모맙 (블린사이토)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "B-ALL" },
  { id: 53, name: "브렌툭시맙베도틴 (애드세트리스)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "호지킨/ALCL 등" },
  { id: 54, name: "베바시주맙 (아바스틴)", lung: "✅", breast: "❌", gi: "✅", liver: "❌", kidney: "❌", blood: "❌", other: "난소암, 뇌종양 등 기타에서도 사용" },
  { id: 55, name: "리툭시맙 (맙테라/트룩시마 등)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "B세포 림프종, CLL 등" },
  { id: 56, name: "라무시루맙 (사이람자)", lung: "✅", breast: "❌", gi: "✅", liver: "❌", kidney: "❌", blood: "❌", other: "위암·대장암·폐암에서 병용요법" },
  { id: 57, name: "다라투무맙 (다잘렉스)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 58, name: "아테졸리주맙 (티쎈트릭)", lung: "✅", breast: "❌", gi: "⚠️", liver: "✅", kidney: "❌", blood: "❌", other: "방광암 등 기타 고형암 포함" },
  { id: 59, name: "니볼루맙 (옵디보)", lung: "✅", breast: "❌", gi: "⚠️", liver: "⚠️", kidney: "✅", blood: "❌", other: "흑색종 등 기타 다수" },
  { id: 60, name: "펨브롤리주맙 (키트루다)", lung: "✅", breast: "❌", gi: "⚠️", liver: "⚠️", kidney: "⚠️", blood: "❌", other: "MSI-H·PD-L1 등 바이오마커 기반 여러 고형암" },
  { id: 61, name: "탈리도마이드 (탈라이드 등)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 62, name: "포말리도마이드 (포말리스트)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "다발성골수종" },
  { id: 63, name: "이필리무맙 (여보이)", lung: "⚠️", breast: "❌", gi: "❌", liver: "❌", kidney: "⚠️", blood: "❌", other: "흑색종, 폐암·신장암 병용요법 등" },
  { id: 64, name: "더발루맙 (임핀지)", lung: "✅", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "비소세포폐암, 소세포폐암, 방광암 등" },
  { id: 65, name: "이노투주맙오조가마이신 (베스폰사)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "B-ALL" },
  { id: 66, name: "아벨루맙 (바벤시오)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "⚠️", blood: "❌", other: "메르켈세포암, 요로상피암, RCC 병용 등" },
  { id: 67, name: "테르토모타이드 (리아백스)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "⚠️ 국내 특이 암백신, 실제 급여·적용범위 매우 제한적" },
  { id: 68, name: "아베마시클립 (버제니오)", lung: "❌", breast: "✅", gi: "❌", liver: "❌", kidney: "❌", blood: "❌", other: "HR+ 진행성 유방암" },
  { id: 69, name: "베네토클락스 (벤클렉스타)", lung: "❌", breast: "❌", gi: "❌", liver: "❌", kidney: "❌", blood: "✅", other: "CLL, AML 등" }
];

export default function TargetedAnticancerMatrix() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    return matrixData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.other.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="w-full space-y-8 mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            69개 표적항암제 실무 매트릭스
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            암종별 주요 표적 및 면역 항암제 적용 여부 한눈에 보기
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            placeholder="항암제명 또는 암종 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">성분명 (주요 제품)</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">폐암</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">유방암</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">위·대장</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">간</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">신장</th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">혈액암</th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">기타·비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((drug) => (
                  <tr key={drug.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 text-center text-xs text-gray-400 font-mono">{drug.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{drug.name}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.lung}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.breast}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.gi}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.liver}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.kidney}</td>
                    <td className="px-3 py-3 text-center text-base">{drug.blood}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium leading-relaxed">{drug.other}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">엔허투 (트라스투주맙 데룩스테칸)</h4>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                유방암(HER2 양성·저발현)과 위암에서 급여 및 급여 확대가 진행 중입니다. HER2 변이 폐암의 경우 허가는 있으나 급여 범위는 시점별로 달라질 수 있어 항상 최신 고시 확인이 필요합니다. (본 표에는 69개 목록 외 별도 예외 약제로 취급)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">키트루다 (펨브롤리주맙, 60번)</h4>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                폐암, 위암, MSI-H 대장암, 식도암, 두경부암 등 적응증이 매우 광범위하며, 암종·PD-L1 발현율·MSI 여부·치료 라인에 따라 급여/비급여가 세밀하게 나뉩니다. 위·대장, 간, 신장 등은 ⚠️ 표시이며, 실무 시 개별 조건 확인이 필수입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <span className="inline-flex items-center gap-2 text-[10px] text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
          ✅ 주요 적응증 / ⚠️ 조건부 또는 병용 / ❌ 해당 없음
        </span>
      </div>
    </div>
  )
}
