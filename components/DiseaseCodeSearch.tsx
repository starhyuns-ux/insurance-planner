'use client'

import { useState, useMemo, useEffect } from 'react'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, InformationCircleIcon, FolderIcon, FolderOpenIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

type DiseaseItem = {
  name: string
  code: string
  desc?: string
  isImportant?: boolean
  riders?: string[]
}

type SubCategory = {
  name: string
  items: DiseaseItem[]
}

type TopCategory = {
  id: string
  title: string
  shortTitle: string
  desc: string
  subCategories: SubCategory[]
}

const CANCER_RIDERS = ['암 진단비', '암 수술비', '항암치료비']
const BRAIN_RIDERS = ['뇌혈관질환 진단비', '뇌혈관질환 수술비']
const HEART_RIDERS = ['허혈성심장질환 진단비', '심혈관질환 수술비']
const INJURY_RIDERS = ['상해수술비(1-5종)', '골절진단비', '상해후유장해']
const DISEASE_RIDERS = ['질병수술비(1-5종)', 'N대질병 수술비']

// Grouped Data Structure
const groupedDiseaseData: TopCategory[] = [
  {
    id: 'C',
    title: '[C코드] 암 (악성신생물)',
    shortTitle: 'C코드 (암)',
    desc: '악성 종양(일반암) 분류 코드입니다.',
    subCategories: [
      {
        name: '소화기계 암',
        items: [
          { name: '입술암', code: 'C00', riders: CANCER_RIDERS },
          { name: '구강암', code: 'C02–C06', riders: CANCER_RIDERS },
          { name: '식도암', code: 'C15', riders: CANCER_RIDERS },
          { name: '위암', code: 'C16', riders: CANCER_RIDERS },
          { name: '소장암', code: 'C17', riders: CANCER_RIDERS },
          { name: '대장암', code: 'C18', riders: CANCER_RIDERS },
          { name: '직장암', code: 'C19–C20', riders: CANCER_RIDERS },
          { name: '간암', code: 'C22', riders: CANCER_RIDERS },
          { name: '담낭·담도암', code: 'C23–C24', riders: CANCER_RIDERS },
          { name: '췌장암', code: 'C25', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '호흡기계 암',
        items: [
          { name: '비강·부비동암', code: 'C30–C31', riders: CANCER_RIDERS },
          { name: '후두암', code: 'C32', riders: CANCER_RIDERS },
          { name: '기관·기관지·폐암', code: 'C33–C34', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '여성 생식기 암',
        items: [
          { name: '자궁경부암', code: 'C53', riders: CANCER_RIDERS },
          { name: '자궁체부암', code: 'C54', riders: CANCER_RIDERS },
          { name: '난소암', code: 'C56', riders: CANCER_RIDERS },
          { name: '기타 여성 생식기암', code: 'C51–C57', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '남성 생식기 암',
        items: [
          { name: '전립선암', code: 'C61', riders: CANCER_RIDERS },
          { name: '고환암', code: 'C62', riders: CANCER_RIDERS },
          { name: '음경암', code: 'C60', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '비뇨기계 암',
        items: [
          { name: '신장암', code: 'C64', riders: CANCER_RIDERS },
          { name: '신우암', code: 'C65', riders: CANCER_RIDERS },
          { name: '요관암', code: 'C66', riders: CANCER_RIDERS },
          { name: '방광암', code: 'C67', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '기타 주요 암',
        items: [
          { name: '갑상선암', code: 'C73', riders: ['유사암 진단비', '암 수술비'] },
          { name: '뇌암', code: 'C71', riders: CANCER_RIDERS },
          { name: '림프종', code: 'C81–C85', riders: CANCER_RIDERS },
          { name: '다발성 골수종', code: 'C90', riders: CANCER_RIDERS },
          { name: '백혈병', code: 'C91–C95', riders: CANCER_RIDERS },
          { name: '피부암', code: 'C43–C44', riders: ['기타피부암(유사암) 진단비', '암 수술비'] },
          { name: '유방암', code: 'C50', riders: CANCER_RIDERS },
        ]
      },
      {
        name: '전이암 및 기타 악성신생물 (ICD-10)',
        items: [
          { name: '림프절 전이', code: 'C77', desc: '림프절의 이차성 악성신생물', riders: CANCER_RIDERS },
          { name: '폐 전이', code: 'C78.0', desc: '폐의 이차성 악성신생물', riders: CANCER_RIDERS },
          { name: '흉막 전이', code: 'C78.2', desc: '흉막 전이', riders: CANCER_RIDERS },
          { name: '기타 호흡기·소화기관 전이', code: 'C78', desc: '폐·흉막 등 포함', riders: CANCER_RIDERS },
          { name: '뼈 전이', code: 'C79.5', desc: '뼈 및 골수 전이', riders: CANCER_RIDERS },
          { name: '뇌 전이', code: 'C79.3', desc: '뇌 전이', riders: CANCER_RIDERS },
          { name: '간 전이', code: 'C78.7', desc: '간 전이', riders: CANCER_RIDERS },
          { name: '부신 전이', code: 'C79.7', desc: '부신 전이', riders: CANCER_RIDERS },
          { name: '기타 부위 전이', code: 'C79', desc: '기타 이차성 악성신생물', riders: CANCER_RIDERS },
          { name: '원발부위 불명의 악성신생물', code: 'C80', desc: '암이 존재하지만 최초 발생 부위를 확인할 수 없는 경우', riders: CANCER_RIDERS },
        ]
      }
    ]
  },
  {
    id: 'D',
    title: '[D코드] 양성종양 및 제자리암',
    shortTitle: 'D코드 (용종/제자리암)',
    desc: '수술비 청구가 가장 빈번한 용종, 근종 및 초기암(유사암) 코드입니다.',
    subCategories: [
      {
        name: '제자리암 및 흔한 양성종양',
        items: [
          { name: '위의 제자리암', code: 'D00.2', desc: '위 점막에 국한된 초기암', riders: ['유사암 진단비', ...DISEASE_RIDERS], isImportant: true },
          { name: '대장의 제자리암', code: 'D01.0', desc: '대장 제자리암', riders: ['유사암 진단비', ...DISEASE_RIDERS], isImportant: true },
          { name: '피부의 제자리암', code: 'D04', riders: ['유사암 진단비', ...DISEASE_RIDERS] },
          { name: '유방의 제자리암', code: 'D05', riders: ['유사암 진단비', ...DISEASE_RIDERS] },
          { name: '자궁경부의 제자리암', code: 'D06', riders: ['유사암 진단비', ...DISEASE_RIDERS] },
          { name: '위의 양성신생물', code: 'D13.1', desc: '위 용종(폴립) 등', riders: DISEASE_RIDERS },
          { name: '결장, 직장, 항문의 양성신생물', code: 'D12', desc: '대장 용종(폴립). 수술비 보상 빈도 1위', riders: DISEASE_RIDERS, isImportant: true },
          { name: '자궁의 평활근종', code: 'D25', desc: '자궁근종. 여성 다빈도 수술', riders: DISEASE_RIDERS, isImportant: true },
          { name: '난소의 양성신생물', code: 'D27', riders: DISEASE_RIDERS },
          { name: '갑상선의 양성신생물', code: 'D34', riders: DISEASE_RIDERS },
          { name: '방광의 양성신생물', code: 'D30.3', riders: DISEASE_RIDERS },
        ]
      }
    ]
  },
  {
    id: 'I',
    title: '[I코드] 뇌·심혈관 질환',
    shortTitle: 'I코드 (뇌·심장)',
    desc: '3대 주요 질환인 뇌혈관 질환 및 허혈성 심장 질환 코드입니다.',
    subCategories: [
      {
        name: '허혈성 및 급성 심장 질환',
        items: [
          { name: '협심증', code: 'I20', isImportant: true, riders: HEART_RIDERS },
          { name: '급성 심근경색', code: 'I21', isImportant: true, riders: HEART_RIDERS },
          { name: '만성 허혈성 심질환', code: 'I25', isImportant: true, riders: HEART_RIDERS },
          { name: '폐색전증', code: 'I26', riders: DISEASE_RIDERS },
          { name: '급성 심낭염', code: 'I30', riders: DISEASE_RIDERS },
          { name: '비류마티스 승모판 질환', code: 'I34', riders: DISEASE_RIDERS },
        ]
      },
      {
        name: '심근 및 부정맥, 심부전',
        items: [
          { name: '방실 및 좌각 차단', code: 'I44', riders: ['특정심장질환 진단비', ...DISEASE_RIDERS] },
          { name: '심정지', code: 'I46' },
          { name: '발작성 빈맥', code: 'I47', riders: ['특정심장질환 진단비', ...DISEASE_RIDERS] },
          { name: '심방세동', code: 'I48', riders: ['특정심장질환 진단비', ...DISEASE_RIDERS] },
          { name: '기타 부정맥', code: 'I49', riders: ['부정맥 진단비', ...DISEASE_RIDERS] },
          { name: '심부전', code: 'I50', isImportant: true, riders: ['심부전 진단비', ...DISEASE_RIDERS] },
        ]
      },
      {
        name: '뇌혈관 질환',
        items: [
          { name: '지주막하출혈', code: 'I60', isImportant: true, riders: BRAIN_RIDERS },
          { name: '뇌내출혈', code: 'I61', isImportant: true, riders: BRAIN_RIDERS },
          { name: '기타 두개내출혈', code: 'I62', riders: BRAIN_RIDERS },
          { name: '뇌경색', code: 'I63', isImportant: true, riders: BRAIN_RIDERS },
          { name: '상세불명 뇌졸중', code: 'I64', riders: ['뇌졸중 진단비(해당시)', '뇌혈관질환 진단비'] },
          { name: '뇌혈관 협착', code: 'I65', riders: BRAIN_RIDERS },
          { name: '뇌동맥 폐색', code: 'I66', riders: BRAIN_RIDERS },
          { name: '기타 뇌혈관 질환', code: 'I67', riders: BRAIN_RIDERS },
          { name: '기타 질환에서의 뇌혈관 장애', code: 'I68', riders: BRAIN_RIDERS },
          { name: '뇌혈관질환 후유증', code: 'I69', riders: BRAIN_RIDERS },
        ]
      },
      {
        name: '동맥, 정맥 및 기타 순환계',
        items: [
          { name: '고혈압성 심질환', code: 'I11', riders: DISEASE_RIDERS },
          { name: '고혈압성 신질환', code: 'I12', riders: DISEASE_RIDERS },
          { name: '동맥경화증', code: 'I70', riders: DISEASE_RIDERS },
          { name: '대동맥류', code: 'I71', riders: DISEASE_RIDERS },
          { name: '하지 정맥류', code: 'I83', riders: ['하지정맥류 수술비', '질병수술비'] },
          { name: '치핵', code: 'I84', riders: ['치핵 수술비', '21대/N대 수술비(해당시)'] },
          { name: '저혈압', code: 'I95' },
        ]
      }
    ]
  },
  {
    id: 'M',
    title: '[M코드] 뼈·관절·근골격계 질환',
    shortTitle: 'M코드 (근골격계)',
    desc: '디스크, 관절염, 인대 파열 등 근골격계 질환 코드입니다.',
    subCategories: [
       {
        name: '관절 및 척추 질환',
        items: [
          { name: '화농성 관절염', code: 'M00', riders: DISEASE_RIDERS },
          { name: '류마티스 관절염(혈청양성)', code: 'M05', riders: DISEASE_RIDERS },
          { name: '고관절 관절증', code: 'M16', riders: DISEASE_RIDERS },
          { name: '무릎 관절증', code: 'M17', desc: '퇴행성 관절염 (인공관절수술 다빈도)', riders: ['인공관절수술비', ...DISEASE_RIDERS], isImportant: true },
          { name: '무릎 내부 장애', code: 'M23', desc: '반월상연골파열 등', riders: DISEASE_RIDERS, isImportant: true },
          { name: '척추측만증', code: 'M41', riders: DISEASE_RIDERS },
          { name: '강직성 척추염', code: 'M45', riders: DISEASE_RIDERS },
          { name: '기타 척추병증', code: 'M48', desc: '척추관 협착증 등', riders: ['추간판장애수술비', 'N대질병 수술비', '질병수술비'], isImportant: true },
          { name: '경추 추간판 장애', code: 'M50', desc: '목 디스크 (구형 수술비 면책 주의)', riders: ['추간판장애수술비', 'N대질병 수술비', '질병수술비(신형)'], isImportant: true },
          { name: '기타 추간판 장애', code: 'M51', desc: '허리 디스크 (구형 수술비 면책 주의)', riders: ['추간판장애수술비', 'N대질병 수술비', '질병수술비(신형)'], isImportant: true },
        ]
      },
      {
        name: '근육, 힘줄 및 뼈 질환',
        items: [
          { name: '활막염 및 건초염', code: 'M65', desc: '방아쇠수지, 손목건초염 등', riders: DISEASE_RIDERS },
          { name: '어깨 병변', code: 'M75', desc: '회전근개파열, 오십견 등', riders: DISEASE_RIDERS, isImportant: true },
          { name: '골수염', code: 'M86', riders: DISEASE_RIDERS },
          { name: '무혈성 골괴사', code: 'M87', desc: '대퇴골두무혈성괴사 (인공관절 수술 등)', riders: ['인공관절수술비', ...DISEASE_RIDERS] },
        ]
      }
    ]
  },
  {
    id: 'K',
    title: '[K코드] 소화기계 질환',
    shortTitle: 'K코드 (소화기)',
    desc: '위염, 궤양, 탈장, 충수염, 담석증 등 소화기관 질환 코드입니다.',
    subCategories: [
      {
        name: '위장관 질환',
        items: [
          { name: '구내염', code: 'K12' },
          { name: '위식도 역류질환', code: 'K21', isImportant: true },
          { name: '위궤양', code: 'K25', isImportant: true, riders: DISEASE_RIDERS },
          { name: '십이지장 궤양', code: 'K26', riders: DISEASE_RIDERS },
          { name: '위염 및 십이지장염', code: 'K29', isImportant: true },
          { name: '급성 충수염', code: 'K35', isImportant: true, riders: ['충수염 수술비', ...DISEASE_RIDERS] },
          { name: '서혜부 탈장', code: 'K40', isImportant: true, riders: DISEASE_RIDERS },
          { name: '배꼽 탈장', code: 'K42', riders: DISEASE_RIDERS },
          { name: '크론병', code: 'K50', riders: ['특정희귀난치성질환 진단비', ...DISEASE_RIDERS] },
          { name: '궤양성 대장염', code: 'K51', riders: ['특정희귀난치성질환 진단비', ...DISEASE_RIDERS] },
          { name: '장폐색', code: 'K56', riders: DISEASE_RIDERS },
          { name: '게실 질환', code: 'K57', isImportant: true, riders: DISEASE_RIDERS },
        ]
      },
      {
        name: '간, 담낭, 췌장 질환',
        items: [
          { name: '간 섬유증 및 간경변', code: 'K74', riders: ['말기간경화 진단비', ...DISEASE_RIDERS] },
          { name: '담석증', code: 'K80', isImportant: true, riders: DISEASE_RIDERS },
          { name: '담낭염', code: 'K81', isImportant: true, riders: DISEASE_RIDERS },
          { name: '급성 췌장염', code: 'K85', isImportant: true, riders: DISEASE_RIDERS },
        ]
      }
    ]
  },
  {
    id: 'S',
    title: '[S코드] 외상 및 각종 상해',
    shortTitle: 'S코드 (상해/외상)',
    desc: '외부 요인에 의한 상처, 골절, 인대손상 등 상해 코드입니다.',
    subCategories: [
      {
        name: '머리, 목, 흉부, 복부 손상',
        items: [
          { name: '머리의 표재성 손상', code: 'S00', riders: ['상해통원실비'] },
          { name: '머리의 열린 상처', code: 'S01', riders: ['창상봉합술(수술비)'] },
          { name: '두개골 및 안면골 골절', code: 'S02', riders: INJURY_RIDERS },
          { name: '경추 골절', code: 'S12', riders: INJURY_RIDERS },
          { name: '경부 척수 및 신경 손상', code: 'S14', riders: INJURY_RIDERS },
          { name: '늑골·흉골·흉추 골절', code: 'S22', riders: INJURY_RIDERS },
          { name: '요추 및 골반 골절', code: 'S32', riders: INJURY_RIDERS },
        ]
      },
      {
        name: '팔, 다리 손상',
        items: [
          { name: '어깨 및 위팔 골절', code: 'S42', riders: INJURY_RIDERS },
          { name: '요골·척골 골절', code: 'S52', riders: INJURY_RIDERS },
          { name: '손목 및 손 골절', code: 'S62', riders: INJURY_RIDERS },
          { name: '대퇴골 골절', code: 'S72', riders: INJURY_RIDERS },
          { name: '경골·비골 골절', code: 'S82', riders: INJURY_RIDERS },
          { name: '무릎 탈구·염좌', code: 'S83', riders: INJURY_RIDERS },
          { name: '발목 및 발 골절', code: 'S92', riders: INJURY_RIDERS },
        ]
      }
    ]
  }
]

// Text Highlighter Helper
const Highlighter = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>
  
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-primary-200 text-primary-900 rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export default function DiseaseCodeSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  // activeFolders stores the IDs of folders that are currently EXPANDED
  const [activeFolders, setActiveFolders] = useState<string[]>([])

  // Derived state for filtering
  const filteredData = useMemo(() => {
    // If not searching, return all top categories
    if (!searchTerm.trim()) {
      return groupedDiseaseData
    }

    const lowerSearch = searchTerm.toLowerCase()
    
    return groupedDiseaseData.map(group => {
      // Find subcategories and items that match
      const matchedSubs = group.subCategories.map(sub => {
         const matchedItems = sub.items.filter(item => 
            item.name.toLowerCase().includes(lowerSearch) || 
            item.code.toLowerCase().includes(lowerSearch) ||
            (item.desc && item.desc.toLowerCase().includes(lowerSearch)) ||
            (item.riders && item.riders.some(rider => rider.toLowerCase().includes(lowerSearch)))
         )
         return { ...sub, items: matchedItems }
      }).filter(sub => sub.items.length > 0)

      // Only return groups that have matching items
      if (matchedSubs.length > 0) {
        return { ...group, subCategories: matchedSubs }
      }
      return null
    }).filter(Boolean) as TopCategory[]
  }, [searchTerm])

  // Automatically expand folders when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Auto-expand all that match the search
      const matchedIds = filteredData.map(g => g.id)
      setActiveFolders(matchedIds)
    } else {
      // Collapse all when search is cleared
      setActiveFolders([])
    }
  }, [searchTerm, filteredData])

  const toggleFolder = (id: string) => {
    setActiveFolders(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-8 max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 sm:text-lg border-2 border-primary-200 rounded-2xl focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm transition-all focus:shadow-md outline-none"
          placeholder="질병명(용종), 질병코드(D12), 또는 특약명(수술비) 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

       {/* Disclaimer UI */}
       <div className="max-w-4xl mx-auto mb-10 bg-amber-50 p-5 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">보험금 청구 관련 유의사항</h4>
            <ul className="text-sm text-amber-800 space-y-1 mt-2 list-disc list-inside">
              <li>여기에 매칭된 특약은 참고용이며, 보험사나 가입 시기별 약관에 따라 보상 여부가 다를 수 있습니다.</li>
              <li>동일한 질병코드라 하더라도 <strong>수술의 기법(관혈, 비관혈, 내시경 등)</strong>에 따라 <span className="font-semibold underline">1~5종 수술비</span>의 종결정이 달라지거나 보상에서 제외될 수 있습니다.</li>
              <li>정확한 보상 여부는 반드시 가입하신 보험증권과 약관을 기준으로 전문가의 확인을 받아보시길 권장합니다.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Folders (Accordion) */}
      {filteredData.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-4xl mx-auto">
          <div className="text-gray-400 mb-4 inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500">다른 검색어로 다시 시도해 보세요.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredData.map((group) => {
            const isExpanded = activeFolders.includes(group.id)

            return (
              <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
                
                {/* Accordion Folder Header */}
                <button
                  onClick={() => toggleFolder(group.id)}
                  className={`w-full flex items-center justify-between p-4 md:p-6 transition-colors duration-200
                    ${isExpanded 
                      ? 'bg-primary-50/50 hover:bg-primary-50' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-xl transition-colors shrink-0 ${isExpanded ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isExpanded ? <FolderOpenIcon className="w-6 h-6 md:w-8 md:h-8" /> : <FolderIcon className="w-6 h-6 md:w-8 md:h-8" />}
                     </div>
                     <div>
                       <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                          <Highlighter text={group.title} highlight={searchTerm} />
                       </h3>
                       <p className="text-sm text-gray-500 mt-0.5">
                          <Highlighter text={group.desc} highlight={searchTerm} />
                       </p>
                     </div>
                  </div>
                  <div className={`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 md:p-6 md:pt-4 bg-white border-t border-gray-100">
                      <div className="space-y-8">
                        {group.subCategories.map((sub, sIdx) => (
                            <div key={sIdx}>
                              <h4 className="font-bold text-gray-800 text-lg border-b border-primary-200 inline-block mb-4 pb-1">
                                {sub.name}
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sub.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="p-4 flex flex-col justify-between rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all gap-4 bg-gray-50/30">
                                    <div className="flex justify-between items-start w-full gap-3">
                                      <div className="flex-1 flex flex-col gap-1.5">
                                          <div className="flex items-center gap-2 flex-wrap">
                                              <span className="font-extrabold text-gray-900 text-base">
                                                <Highlighter text={item.name} highlight={searchTerm} />
                                              </span>
                                              {item.isImportant && (
                                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                                                  <ExclamationTriangleIcon className="w-3 h-3" />
                                                  실무빈도 높음
                                              </span>
                                              )}
                                          </div>
                                          {item.desc && (
                                              <span className="text-xs text-gray-500 block break-keep mt-0.5">
                                                <Highlighter text={item.desc} highlight={searchTerm} />
                                              </span>
                                          )}
                                        </div>
                                        <div className={`font-black px-2.5 py-1 rounded-lg text-sm whitespace-nowrap border shadow-sm shrink-0 tracking-wider ${item.isImportant ? 'bg-rose-50 text-rose-700 border-rose-200 selection:bg-rose-200' : 'bg-primary-50 text-primary-700 border-primary-200 selection:bg-primary-200'}`}>
                                          <Highlighter text={item.code} highlight={searchTerm} />
                                        </div>
                                    </div>

                                    {/* Mapped Riders */}
                                    {item.riders && item.riders.length > 0 && (
                                      <div className="pt-3 border-t border-gray-200/60">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                          <span className="text-[10px] font-bold text-gray-400 mr-1">연관특약</span>
                                          {item.riders.map((rider, rIdx) => (
                                              <span key={rIdx} className="bg-white border border-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded font-semibold shadow-sm text-center">
                                                <Highlighter text={rider} highlight={searchTerm} />
                                              </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
