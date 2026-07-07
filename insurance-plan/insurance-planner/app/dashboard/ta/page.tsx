'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChatBubbleBottomCenterTextIcon, 
  UserIcon, 
  ClipboardDocumentIcon, 
  CheckIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  StarIcon as StarOutline, 
  TrashIcon, 
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  UserPlusIcon,
  PhoneIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

// --- Data Types ---
interface ScriptStep {
  label: string;
  content: string;
}

interface TAScript {
  id: string;
  category: "analysis" | "retouching" | "referral" | "objection" | "custom";
  title: string;
  description: string;
  steps: ScriptStep[];
  successRate: string;
  difficulty: "쉬움" | "보통" | "어려움";
}

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "analysis", label: "보장분석 제안" },
  { id: "retouching", label: "기존고객 리터칭" },
  { id: "referral", label: "지인/소개 TA" },
  { id: "objection", label: "거절 극복 화법" },
  { id: "custom", label: "나만의 스크립트" }
]

const DEFAULT_SCRIPTS: TAScript[] = [
  {
    id: "def_analysis_01",
    category: "analysis",
    title: "AI 보장분석 완료 안내 및 대면/화상 브리핑 예약",
    description: "고객이 보장분석 요청을 등록한 후 분석 완료를 명분으로 미팅을 성사시키는 표준 스크립트",
    successRate: "82%",
    difficulty: "쉬움",
    steps: [
      {
        label: "1단계: 오프닝",
        content: "안녕하세요, [고객명] 고객님! 이번에 신청해주신 보장분석을 꼼꼼하게 진행해드린 담당 설계사 [설계사명]입니다. 잠시 2~3분 정도 통화 괜찮으실까요?"
      },
      {
        label: "2단계: 도입 및 결과 통보",
        content: "보내주신 기초 데이터를 바탕으로 저희 AI 정밀 분석 시스템을 가동하여 점검을 마쳤는데요. 현재 [고객명] 고객님의 보장 점수가 100점 만점에 [보장점수]점으로 집계되었습니다."
      },
      {
        label: "3단계: 핵심 문제점(흥미 유발)",
        content: "분석표를 보니 매달 귀하게 나가는 비용에 비해 정작 혜택이 중복되거나 너무 좁아서 버려지는 특약들이 일부 보이고요. 반대로 향후 발생할 수 있는 주요 질병에 대한 핵심 보장(진단비, 수술비 등)은 누락되어 있어 보완이 시급한 상황입니다."
      },
      {
        label: "4단계: 가치 제안 및 약속",
        content: "그래서 제가 불필요하게 낭비되는 보험료는 매월 3~5만 원가량 줄여 가계 부담을 덜어드리면서도, 정작 필요할 때 받는 실제 보장 자산은 배 이상 든든하게 채우는 커스텀 포트폴리오를 구성해두었습니다. 이번 주 수요일 오후 2시나 목요일 오전 10시쯤 10분 정도 모바일 화면 보시면서 가볍게 결과표 브리핑을 해드리려 하는데, 어느 시간대가 편하실까요?"
      }
    ]
  },
  {
    id: "def_retouch_01",
    category: "retouching",
    title: "최신 의료 기술 도입에 따른 보장 점검 (리터칭)",
    description: "기존 가입 고객에게 최신 항암 치료비 특약 등 새로운 혜택 보완을 유도하는 안부 TA 스크립트",
    successRate: "78%",
    difficulty: "쉬움",
    steps: [
      {
        label: "1단계: 오프닝",
        content: "안녕하세요, [고객명] 고객님! 항상 든든하게 믿고 맡겨주셔서 감사한 마음으로 연락드렸습니다. 담당 설계사 [설계사명] 위원입니다. 잘 지내셨죠?"
      },
      {
        label: "2단계: 도입(제도/기술 변경)",
        content: "다름이 아니라 예전에 가입해 두신 종합보험과 관련해서, 최근 병원 치료 기술 발달에 따른 아주 중요한 보장 업그레이드 소식이 있어서 먼저 연락드렸습니다."
      },
      {
        label: "3단계: 니즈 환기",
        content: "요즘 부작용이 없고 완치율이 높은 중입자 치료나 표적항암 치료법이 널리 쓰이고 있는데요. 2~3년 전 이전의 기존 보험에는 이 고가의 최신 의료비 보장이 빠져 있습니다. 다행히 기존에 든든하게 들어두신 보험은 절대 건드리지 않고, 해지도 없이 월 1~2만 원 선으로 이 핵심 최신 치료비만 쏙 골라 1억 원까지 한시 보완해 드리는 신규 플랜이 오픈되었습니다."
      },
      {
        label: "4단계: 간편 확인 및 약속",
        content: "고객님의 건강 상태와 나이 기준으로 무심사 바로 승인이 가능한 조건인지 모바일로 3분이면 조회가 가능합니다. 확인 후 관련 안내장과 비교 분석표를 카톡으로 보내드리려 하는데, 오늘 저녁 퇴근 후나 내일 점심시간 중 언제 확인해보시는 게 좋으실까요?"
      }
    ]
  },
  {
    id: "def_referral_01",
    category: "referral",
    title: "소개 고객 개척 - 고정비 다이어트 컨셉",
    description: "소개자 [소개자명] 님을 언급하며 친밀감과 전문성을 동시에 어필해 첫 미팅을 성사시키는 스크립트",
    successRate: "75%",
    difficulty: "보통",
    steps: [
      {
        label: "1단계: 오프닝 및 신원확인",
        content: "안녕하세요, [고객명] 고객님! 고객님의 절친한 회사 동료(혹은 지인)이신 [소개자명] 님의 추천으로 연락드리게 된 보험 자산 관리사 [설계사명] 위원이라고 합니다."
      },
      {
        label: "2단계: 명분(소개자 이야기)",
        content: "다름이 아니라 얼마 전 제가 [소개자명] 님의 기존 보험들을 싹 점검해서 불필요하게 낭비되는 매월 7만 원 상당의 고정 지출을 정리해 드렸는데요. [소개자명] 님이 '내 동료인 [고객명] 님도 보험료만 많이 내고 혜택을 잘 모를 텐데 꼭 무료 진단 기회를 연결해 주고 싶다'고 말씀하셔서 제가 기분 좋게 챙겨 연락드리게 되었습니다."
      },
      {
        label: "3단계: 니즈 자극",
        content: "요즘 고물가 시대라 다들 가계 고정 지출 줄이는 게 최우선 과제잖아요. 저는 어떤 보험을 더 많이 가입해서 지출을 늘리라고 말씀드리는 설계사가 아닙니다. 가지고 계신 증권을 딱 1페이지짜리 깔끔한 분석표로 요약해서, 불필요하게 버려지는 세금 같은 돈이 있는지 잡아드리는 무료 서비스입니다."
      },
      {
        label: "4단계: 친밀 미팅 제안",
        content: "마침 이번 주 목요일 오후에 고객님 직장(혹은 댁) 근처에 다른 계약 미팅이 있어 갈 예정인데요. 오가는 길에 커피 한 잔 사들고 찾아뵙고 5분 정도 작성된 분석 리포트만 직접 전해드리려 합니다. 목요일 오후 2시나 4시쯤에 잠깐 시간 내어 보시는 건 어떨까요?"
      }
    ]
  },
  {
    id: "def_objection_cost",
    category: "objection",
    title: "거절 극복 - '요즘 형편이 어려워서 보험 넣을 돈 없어요'",
    description: "돈이 없어서 상담이나 가입을 꺼리는 고객을 '고정비 절감' 프레임으로 극복하는 스크립트",
    successRate: "68%",
    difficulty: "어려움",
    steps: [
      {
        label: "1단계: 적극적 공감",
        content: "아! 네, 정말 맞습니다. [고객명] 고객님. 요즘 대출 금리도 세고 공과금이나 식비 할 것 없이 물가가 다 올라서 매달 고정적으로 나가는 고금리 지출들이 너무 버거우실 수밖에 없습니다. 충분히 깊게 공감합니다."
      },
      {
        label: "2단계: 고정관념 전환",
        content: "그렇기 때문에 제가 더 연락을 드려야겠다고 생각한 것인데요. 고객님, 저는 오늘 연락드린 이유가 고객님께 매월 추가로 몇만 원씩 더 지불하며 새로운 보험 상품을 추가 가입하라고 말씀드리는 게 절대 아닙니다."
      },
      {
        label: "3단계: 명확한 대안 제시",
        content: "오히려 그 반대입니다. 지금 내고 계시는 종합보험 내역 중에서 쓸데없이 중복되어 돈만 낭비되는 특약, 가성비가 떨어지는 옛날식 적립 보험료 등을 찾아서 다이어트 해드리는 겁니다. 즉, 매월 총 고정 보험 지출액을 5만 원에서 10만 원씩 줄여 고객님 가계 예산에 보탬을 드리는 지출 다이어트 작업입니다."
      },
      {
        label: "4단계: 미팅 제안",
        content: "돈이 더 나가는 게 아니라 도리어 숨은 내 돈을 찾아 지출을 아끼는 점검 서비스이니, 무료로 모바일 리포트 한번 받아보시고 버려지는 돈이 있는지 진단만 먼저 받아보시지 않겠습니까?"
      }
    ]
  },
  {
    id: "def_objection_enough",
    category: "objection",
    title: "거절 극복 - '보험 이미 다 가입해서 든든해요 / 아는 사람 통해 다 했어요'",
    description: "보험이 충분하다며 거절하는 고객의 방어벽을 '사각지대 점검' 및 '비례보상 검증'으로 허무는 화법",
    successRate: "70%",
    difficulty: "어려움",
    steps: [
      {
        label: "1단계: 인정 및 칭찬",
        content: "오, 그러시군요! 준비를 아주 철저하게 해두셨다니 정말 다행이시고 현명하십니다. 보통 보험이 많은 분들이 책임감이 강하고 미래에 대한 대비가 잘 되어 계시더라고요."
      },
      {
        label: "2단계: 사각지대 의문 환기",
        content: "그런데 고객님, 가입하신 보험 개수가 여러 개다 보면 정작 아프거나 다쳤을 때 보험금 청구를 어떻게 해야 하는지, 그리고 겹쳐서 신청하면 보험사에서 삭감되거나 '비례보상'으로 깎여서 일부만 나오는 특약이 어떤 것인지 정확히 알고 유지 중이실까요?"
      },
      {
        label: "3단계: 실상 안내",
        content: "실제로 가입 건수가 많으신 분들일수록 예전 지인분들이 좋은 게 좋은 거다 하며 중복 가입을 무리하게 시켜두어, 실제 청구했을 때 소송이나 지급 거절의 불이익을 당하시는 빈도가 훨씬 높습니다. 또는 비갱신형인 줄 알고 계시다가 60대 이후 월 보험료가 수십만 원 폭탄으로 돌아오는 갱신형 구조가 숨어 있는 경우도 허다합니다."
      },
      {
        label: "4단계: 약속 제안",
        content: "제가 특정 보험사를 홍보하는 게 아니라서 아주 객관적인 3자적 시각에서 '정말 나중에 100% 온전하게 제 돈 다 받을 수 있는지' 검증표를 딱 1장으로 깔끔하게 그려드릴 수 있습니다. 든든하게 가입된 내 보험들을 지키기 위한 검증 절차라 여기시고 딱 한 번 무료 점검표 받아보시는 건 어떨까요?"
      }
    ]
  }
]

const DEFAULT_CHECKLIST = [
  {
    title: "1. 통화 전 환경 및 멘탈 세팅",
    details: [
      "밝고 명랑한 솔 톤(Sol Tone)의 미소 짓는 표정 유지 (거울을 보며 연습하세요).",
      "주변의 잡음이 차단되고 인터넷이 안정된 조용한 공간 확보.",
      "오늘의 통화 목표(상담 예약 또는 리포트 링크 읽음 확인)를 뚜렷하게 리마인드."
    ]
  },
  {
    title: "2. 3초 이내에 상대방의 시선 사로잡기",
    details: [
      "지나치게 낮고 딱딱한 상업적인 기계 톤 지양.",
      "도입부에서 고객의 귀가 번뜩 뜨일 '구체적인 숫자'(예: 보장점수 65점, 불필요 보험료 5만 원 절감)를 던지세요.",
      "고객을 칭찬하거나 지인의 이름을 첫 마디에 자연스럽게 배치."
    ]
  },
  {
    title: "3. 거절에 당황하지 않는 유연한 대처",
    details: [
      "고객의 거절(바쁘다, 돈 없다)이 나오면 일단 즉각 '동의 및 공감'한다 ('아, 그렇군요! 충분히 공감합니다').",
      "그러나 물러서지 않고 즉시 반전 화법('그렇기 때문에~')을 활용해 흥미를 이어갑니다.",
      "보험 영업이 아니라 '무상 정보 제공 및 고정비 절감 컨설팅'임을 계속 강조."
    ]
  },
  {
    title: "4. 약속 확정은 이지 초이스(Easy Choice) 기법으로",
    details: [
      "\"언제 시간 괜찮으세요?\" 같은 열린 질문은 피하세요.",
      "\"수요일 오후 2시 혹은 목요일 오전 11시\"처럼 2개의 구체적인 옵션을 던져 선택을 유도하세요.",
      "미팅 시간이 단 10분만 소요되는 부담 없는 만남임을 재차 언급합니다."
    ]
  }
]

export default function TAPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCat, setSelectedCat] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)
  const [expandedChecklist, setExpandedChecklist] = useState<Record<number, boolean>>({ 0: true })

  const [variables, setVariables] = useState({
    customerName: "홍길동",
    plannerName: "김설계 위원",
    introducerName: "이소개",
    score: "65"
  })

  const [myScripts, setMyScripts] = useState<TAScript[]>()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newSteps, setNewSteps] = useState([
    { label: "1단계: 오프닝", content: "" },
    { label: "2단계: 본론", content: "" },
    { label: "3단계: 클로징", content: "" }
  ])

  const [scriptViewMode, setScriptViewMode] = useState<Record<string, string | number>>({})
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null)

  // Load from localStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem("ta_favorites")
    if (savedFavs) setFavorites(JSON.parse(savedFavs))
    
    const savedCustoms = localStorage.getItem("ta_custom_scripts")
    if (savedCustoms) setMyScripts(JSON.parse(savedCustoms))
    else setMyScripts([])
  }, [])

  const saveFavorites = (newFavs: string[]) => {
    setFavorites(newFavs)
    localStorage.setItem("ta_favorites", JSON.stringify(newFavs))
  }

  const saveCustomScripts = (newCustoms: TAScript[]) => {
    setMyScripts(newCustoms)
    localStorage.setItem("ta_custom_scripts", JSON.stringify(newCustoms))
  }

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isFav = favorites.includes(id)
    const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id]
    saveFavorites(updated)
  }

  const replaceVariables = (text: string) => {
    return text
      .replace(/\[고객명\]/g, variables.customerName || "고객")
      .replace(/\[설계사명\]/g, variables.plannerName || "설계사")
      .replace(/\[소개자명\]/g, variables.introducerName || "소개자")
      .replace(/\[보장점수\]/g, `${variables.score || "65"}`)
  }

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyStepToClipboard = (stepKey: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepKey)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const handleSaveCustomScript = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return alert("제목을 입력해 주세요.")

    const activeSteps = newSteps.filter(s => s.content.trim() !== "")
    if (activeSteps.length === 0) return alert("적어도 한 개 이상의 단계를 작성해 주세요.")

    if (editingScriptId) {
      const updated = (myScripts || []).map(s => {
        if (s.id === editingScriptId) {
          return {
            ...s,
            title: newTitle,
            description: newDesc || "사용자 맞춤 정의 스크립트",
            steps: activeSteps
          }
        }
        return s
      })
      saveCustomScripts(updated)
    } else {
      const newScript: TAScript = {
        id: `custom_${Date.now()}`,
        category: "custom",
        title: newTitle,
        description: newDesc || "사용자 맞춤 정의 스크립트",
        steps: activeSteps,
        successRate: "준비 중",
        difficulty: "보통"
      }
      const updated = [newScript, ...(myScripts || [])]
      saveCustomScripts(updated)
    }
    
    setNewTitle("")
    setNewDesc("")
    setNewSteps([
      { label: "1단계: 오프닝", content: "" },
      { label: "2단계: 본론", content: "" },
      { label: "3단계: 클로징", content: "" }
    ])
    setEditingScriptId(null)
    setIsAddModalOpen(false)
  }

  const handleEditScript = (script: TAScript, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNewTitle(script.title)
    setNewDesc(script.description)
    setNewSteps(script.steps.map(s => ({ ...s })))
    setEditingScriptId(script.id)
    setIsAddModalOpen(true)
  }

  const handleCopyAndEditScript = (script: TAScript, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNewTitle(`[사본] ${script.title}`)
    setNewDesc(script.description)
    setNewSteps(script.steps.map(s => ({ ...s })))
    setEditingScriptId(null)
    setIsAddModalOpen(true)
  }

  const handleDeleteCustomScript = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("이 스크립트를 정말 삭제하시겠습니까?")) {
      const updated = (myScripts || []).filter(s => s.id !== id)
      saveCustomScripts(updated)
    }
  }

  const toggleChecklist = (index: number) => {
    setExpandedChecklist(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const allScripts = [...DEFAULT_SCRIPTS, ...(myScripts || [])]

  const filteredScripts = allScripts.filter(script => {
    const categoryMatch = selectedCat === "all" || script.category === selectedCat
    const rawSearch = searchQuery.toLowerCase().trim()
    const searchMatch = !rawSearch || 
      script.title.toLowerCase().includes(rawSearch) ||
      script.description.toLowerCase().includes(rawSearch) ||
      script.steps.some(step => step.content.toLowerCase().includes(rawSearch))

    return categoryMatch && searchMatch
  })

  const sortedScripts = [...filteredScripts].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0
    const bFav = favorites.includes(b.id) ? 1 : 0
    return bFav - aFav
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-primary-600">
          <PhoneIcon className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">통화 스크립트 / TA 라이브러리</h1>
            <p className="text-gray-500 font-medium text-lg">전화 약속(TA) 및 거절 유형 극복을 위한 설계사 맞춤형 영업 스크립트 모음입니다.</p>
          </div>
          <div>
            <button 
              onClick={() => {
                setNewTitle("")
                setNewDesc("")
                setNewSteps([
                  { label: "1단계: 오프닝", content: "" },
                  { label: "2단계: 본론", content: "" },
                  { label: "3단계: 클로징", content: "" }
                ])
                setEditingScriptId(null)
                setIsAddModalOpen(true)
              }} 
              className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black transition-all shadow-lg shadow-primary-200 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <PlusIcon className="w-6 h-6" /> 나만의 스크립트 등록
            </button>
          </div>
        </div>
      </div>

      {/* TA GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-8">
        
        {/* LEFT COLUMN: CONTROLS & CHECKLIST */}
        <div className="space-y-6">
          
          {/* CUSTOMIZABLE TEMPLATE VARIABLES */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <UserPlusIcon className="w-5 h-5 text-primary-500" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">실시간 치환 변수 설정</h2>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
              아래에 입력한 정보가 모든 대사 스크립트 내 <code>[고객명]</code>, <code>[설계사명]</code> 등에 실시간으로 자동 대입됩니다.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">고객 성함</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                  value={variables.customerName} 
                  onChange={e => setVariables({...variables, customerName: e.target.value})}
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">설계사 성함</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                  value={variables.plannerName} 
                  onChange={e => setVariables({...variables, plannerName: e.target.value})}
                  placeholder="예: 김설계 위원"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">소개 지인명</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                  value={variables.introducerName} 
                  onChange={e => setVariables({...variables, introducerName: e.target.value})}
                  placeholder="예: 이소개"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">보장 분석 점수</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                  value={variables.score} 
                  onChange={e => setVariables({...variables, score: e.target.value})}
                  placeholder="예: 65"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* CATEGORIES SIDEBAR */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-sm font-black text-gray-900 tracking-wide px-1">카테고리 필터</h2>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all text-xs ${
                    selectedCat === cat.id ? "bg-primary-600 text-white shadow-md shadow-primary-100" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.id === "custom" && myScripts && myScripts.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedCat === "custom" ? "bg-white text-primary-600" : "bg-primary-50 text-primary-600"}`}>{myScripts.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PRE-CALL CHECKLIST */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <CheckIcon className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">TA 성공 자가진단표</h2>
            </div>
            <div className="space-y-2">
              {DEFAULT_CHECKLIST.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                  <button 
                    onClick={() => toggleChecklist(idx)} 
                    className="w-full flex items-center justify-between p-4 text-[11px] font-black text-gray-700 hover:bg-gray-50/80 transition-all text-left"
                  >
                    <span>{item.title}</span>
                    {expandedChecklist[idx] ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedChecklist[idx] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-white"
                      >
                        <ul className="p-4 space-y-3">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex gap-2 text-[10px] font-bold text-gray-400 leading-relaxed align-top">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCRIPTS LIST */}
        <div className="space-y-6">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              className="w-full bg-white border border-gray-100 rounded-[2rem] pl-12 pr-6 py-4 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" 
              placeholder="스크립트 제목이나 대사 내용을 검색하세요..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* SCRIPTS STACK */}
          <div className="space-y-6">
            {sortedScripts.length > 0 ? (
              sortedScripts.map(script => {
                const isFav = favorites.includes(script.id)
                const activeTab = scriptViewMode[script.id] ?? "full"
                
                const fullText = script.steps
                  .map(step => `[${step.label}]\n${replaceVariables(step.content)}`)
                  .join("\n\n")

                return (
                  <div key={script.id} className={`group bg-white rounded-3xl border transition-all flex flex-col gap-5 p-6 shadow-sm hover:shadow-md ${isFav ? 'border-amber-400 bg-amber-50/10 ring-1 ring-amber-100/50' : 'border-gray-100 hover:border-primary-200'}`}>
                    
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                          script.category === "analysis" ? "bg-blue-50 text-blue-600" :
                          script.category === "retouching" ? "bg-indigo-50 text-indigo-600" :
                          script.category === "referral" ? "bg-emerald-50 text-emerald-600" :
                          script.category === "objection" ? "bg-amber-50 text-amber-600" :
                          "bg-rose-50 text-rose-600"
                        }`}>
                          {CATEGORIES.find(c => c.id === script.category)?.label || "기타"}
                        </span>
                        <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                          <span>성공률: <strong className="text-emerald-500">{script.successRate}</strong></span>
                          <span>|</span>
                          <span>난이도: <strong>{script.difficulty}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => handleToggleFavorite(script.id, e)} className="p-1.5 rounded-lg text-gray-300 hover:text-amber-500">
                          {isFav ? <StarSolid className="w-5 h-5 text-amber-500" /> : <StarOutline className="w-5 h-5" />}
                        </button>
                        {script.category === "custom" ? (
                          <>
                            <button onClick={(e) => handleEditScript(script, e)} className="p-1.5 rounded-lg text-gray-300 hover:text-primary-500" title="수정">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDeleteCustomScript(script.id, e)} className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500" title="삭제">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button onClick={(e) => handleCopyAndEditScript(script, e)} className="p-1.5 rounded-lg text-gray-300 hover:text-primary-500" title="복사 후 편집">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">{script.title}</h3>
                      <p className="text-xs font-semibold text-gray-400">{script.description}</p>
                    </div>

                    {/* INTERACTIVE STEP TABS */}
                    <div className="flex gap-1.5 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-none">
                      <button 
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${activeTab === "full" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-700"}`}
                        onClick={() => setScriptViewMode({...scriptViewMode, [script.id]: "full"})}
                      >
                        전체 보기
                      </button>
                      {script.steps.map((step, sIdx) => (
                        <button 
                          key={sIdx}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${activeTab === sIdx ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-700"}`}
                          onClick={() => setScriptViewMode({...scriptViewMode, [script.id]: sIdx})}
                        >
                          {step.label.split(":")[0] || step.label}
                        </button>
                      ))}
                    </div>

                    {/* CONTENT DISPLAY */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 min-h-[100px]">
                      {activeTab === "full" ? (
                        <div className="space-y-4">
                          {script.steps.map((step, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <span className="text-[9px] font-black text-primary-500 uppercase tracking-wider block">{step.label}</span>
                              <p className="text-xs font-semibold text-gray-700 leading-relaxed text-justify">{replaceVariables(step.content)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        (() => {
                          const activeStepIndex = Number(activeTab)
                          const activeStep = (script.steps && script.steps[activeStepIndex]) ? script.steps[activeStepIndex] : null
                          if (!activeStep) return null
                          
                          return (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-wider">{activeStep.label}</span>
                                <button 
                                  onClick={() => {
                                    const stepText = replaceVariables(activeStep.content)
                                    copyStepToClipboard(`${script.id}_${activeTab}`, stepText)
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-[10px] font-bold text-gray-400 hover:text-primary-600 hover:border-primary-200 transition-all"
                                >
                                  {copiedStep === `${script.id}_${activeTab}` ? <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                                  <span>{copiedStep === `${script.id}_${activeTab}` ? "복사 완료" : "복사"}</span>
                                </button>
                              </div>
                              <p className="text-sm font-black text-gray-800 leading-relaxed text-justify">{replaceVariables(activeStep.content)}</p>
                            </div>
                          )
                        })()
                      )}
                    </div>

                    {/* CARD FOOTER */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-1">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex-1">
                        <InformationCircleIcon className="w-4 h-4 text-primary-500 shrink-0" />
                        <span className="text-[10px] font-bold text-gray-400">
                          {script.category === "analysis" && "보장 점수를 가볍게 흘리듯이 말해야 거부감이 낮아집니다."}
                          {script.category === "retouching" && "기존 상품을 나쁜 상품으로 깎아내리지 않는 멘트가 매너입니다."}
                          {script.category === "referral" && "소개자를 방패막이 삼아 신뢰감을 앞세워 가볍게 대화를 푸세요."}
                          {script.category === "objection" && "거절 시 공감한 후 1초 쉬고 바로 반격 포인트를 꺼내세요."}
                          {script.category === "custom" && "작성하신 나만의 소중한 시크릿 영업 노하우 스크립트입니다."}
                        </span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(script.id, fullText)} 
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-primary-200 shrink-0"
                      >
                        {copiedId === script.id ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                        <span>{copiedId === script.id ? "전체 복사완료!" : "전체 복사하기"}</span>
                      </button>
                    </div>

                  </div>
                )
              })
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                <DocumentTextIcon className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-black text-gray-500">검색어에 맞는 대화 스크립트가 존재하지 않습니다.</p>
                <span className="text-xs font-semibold text-gray-400">단어 철자를 확인하거나 필터 조건을 조정해 주세요.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ADD CUSTOM SCRIPT MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-primary-500" />
                {editingScriptId ? "나만의 스크립트 수정" : "나만의 스크립트 등록"}
              </h2>
              
              <form onSubmit={handleSaveCustomScript} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">스크립트 제목</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" 
                    required 
                    placeholder="예: 실직 후 해지 고민 거절 극복 화법"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wide">스크립트 설명</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" 
                    placeholder="예: 고객이 실직으로 힘들어할 때 납입 유예나 감액을 권하는 화법"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-gray-400 mb-0.5 uppercase tracking-wide">대화 흐름 단계 구성</label>
                  <p className="text-[9px] text-gray-400 font-bold leading-normal">
                    텍스트 안에 <code>[고객명]</code>, <code>[설계사명]</code>, <code>[소개자명]</code> 등을 삽입하면 실시간으로 치환됩니다.
                  </p>
                  
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {newSteps.map((step, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-2.5 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-primary-500">{step.label}</span>
                          {newSteps.length > 1 && (
                            <button 
                              type="button" 
                              className="text-[10px] font-black text-rose-500 hover:underline"
                              onClick={() => {
                                const updated = newSteps.filter((_, i) => i !== idx).map((s, i) => {
                                  const parts = s.label.split(":")
                                  const subName = parts[1] ? parts[1].trim() : "대화"
                                  return {
                                    ...s,
                                    label: `${i + 1}단계: ${subName}`
                                  }
                                })
                                setNewSteps(updated)
                              }}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        {(() => {
                          const parts = step.label.split(":")
                          const subName = parts[1] ? parts[1].trim() : ""
                          return (
                            <input 
                              type="text" 
                              className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" 
                              placeholder="단계 구체적 제목 (예: 오프닝)" 
                              value={subName}
                              onChange={e => {
                                const updated = [...newSteps]
                                const target = updated[idx]
                                if (target) {
                                  target.label = `${idx + 1}단계: ${e.target.value}`
                                  setNewSteps(updated)
                                }
                              }}
                            />
                          )
                        })()}
                        <textarea
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all h-[60px] resize-none"
                          placeholder="대화 대사 내용을 입력하세요..."
                          value={step.content}
                          onChange={e => {
                            const updated = [...newSteps]
                            const target = updated[idx]
                            if (target) {
                              target.content = e.target.value
                              setNewSteps(updated)
                            }
                          }}
                          required={idx === 0}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    type="button" 
                    className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 rounded-2xl text-[11px] font-black transition-all bg-white"
                    onClick={() => {
                      setNewSteps([...newSteps, { label: `${newSteps.length + 1}단계: 대화`, content: "" }])
                    }}
                  >
                    + 다음 단계 추가
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95" onClick={() => setIsAddModalOpen(false)}>취소</button>
                  <button type="submit" className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-primary-200 hover:scale-105 active:scale-95">
                    {editingScriptId ? "수정 완료" : "저장하기"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
