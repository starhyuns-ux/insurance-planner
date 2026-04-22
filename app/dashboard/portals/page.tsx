'use client'

import React, { useState, useEffect } from 'react'
import { 
  GlobeAltIcon, 
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  StarIcon as StarOutline,
  UserIcon,
  LockClosedIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

const INSURANCE_PORTALS = {
  life: [
    { name: "미래에셋생명", url: "http://www.loveageplan.com/" },
    { name: "한화생명", url: "https://hmp.hanwhalife.com/online/ga" },
    { name: "삼성생명", url: "https://connectplus.samsunglife.com:10443/gasso/login?contextType=external" },
    { name: "교보생명", url: "https://ga.kyobo.com" },
    { name: "흥국생명", url: "https://sales.heungkuklife.co.kr/login.html" },
    { name: "푸본현대생명", url: "https://wsfa.hyundailife.com/" },
    { name: "iM라이프(DGB)", url: "https://fgs.imlifeins.co.kr:8443/" },
    { name: "KDB생명", url: "http://kss.kdblife.co.kr" },
    { name: "KB라이프", url: "https://sfa.kblife.co.kr/" },
    { name: "DB생명", url: "http://etopia.dongbulife.com" },
    { name: "동양생명", url: "https://1004.myangel.co.kr/" },
    { name: "NH농협생명", url: "https://sfa.nhlife.co.kr:8443/websquare/websquare.jsp#w2xPath=/ui/sf/sc/SFSC0100M00.xml" },
    { name: "ABL생명", url: "https://ga.abllife.co.kr/" },
    { name: "BNP파리바카디프", url: "http://ga.cardif.co.kr" },
    { name: "AIA생명", url: "https://imap.aia.co.kr" },
    { name: "라이나생명", url: "https://ga.lina.co.kr" },
    { name: "메트라이프", url: "http://metplus.metlife.co.kr/" },
    { name: "IBK연금보험", url: "https://sf.ibki.co.kr/" },
    { name: "신한라이프", url: "https://ga.shinhanlife.co.kr/" },
    { name: "푸르덴셜(KB)", url: "https://ga2.prudential.co.kr" },
    { name: "처브라이프", url: "https://esmart.chubblife.co.kr/index.do" },
    { name: "하나생명", url: "https://ga.hanalife.co.kr" },
  ],
  nonLife: [
    { name: "메리츠화재", url: "http://sales.meritzfire.com" },
    { name: "한화손해보험", url: "http://portal.hwgeneralins.com" },
    { name: "롯데손해보험", url: "http://lottero.lotteins.co.kr" },
    { name: "MG손해보험", url: "https://mganet.mggeneralins.com" },
    { name: "흥국화재", url: "http://upride.heungkukfire.co.kr" },
    { name: "삼성화재", url: "https://erp.samsungfire.com/irj/servlet/prt/portal/prtroot/logon.LogonPage" },
    { name: "현대해상", url: "https://sp.hi.co.kr" },
    { name: "KB손해보험", url: "http://sales.kbinsure.co.kr" },
    { name: "DB손해보험", url: "https://www.mdbins.com" },
    { name: "AIG손해보험", url: "https://aigen-ga.aig.co.kr" },
    { name: "라이나손해(처브)", url: "https://ga.linagi.com/" },
    { name: "NH농협손보", url: "https://www.nhfire.co.kr/fc/fd.nhfire" },
    { name: "하나손해보험", url: "https://sfa.saleshana.com" },
  ]
}

export default function PortalsPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [portalIds, setPortalIds] = useState<Record<string, string>>({})
  const [portalPws, setPortalPws] = useState<Record<string, string>>({})
  const [showPws, setShowPws] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const savedFavs = localStorage.getItem('portal_favorites')
    const savedIds = localStorage.getItem('portal_ids')
    const savedPws = localStorage.getItem('portal_pws')
    if (savedFavs) setFavorites(JSON.parse(savedFavs))
    if (savedIds) setPortalIds(JSON.parse(savedIds))
    if (savedPws) setPortalPws(JSON.parse(savedPws))
  }, [])

  const toggleFavorite = (e: React.MouseEvent, portalName: string) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavorites = favorites.includes(portalName)
      ? favorites.filter(f => f !== portalName)
      : [...favorites, portalName]
    setFavorites(newFavorites)
    localStorage.setItem('portal_favorites', JSON.stringify(newFavorites))
  }

  const handleIdChange = (portalName: string, id: string) => {
    const newIds = { ...portalIds, [portalName]: id }
    setPortalIds(newIds)
    localStorage.setItem('portal_ids', JSON.stringify(newIds))
  }

  const handlePwChange = (portalName: string, pw: string) => {
    const newPws = { ...portalPws, [portalName]: pw }
    setPortalPws(newPws)
    localStorage.setItem('portal_pws', JSON.stringify(newPws))
  }

  const toggleShowPw = (portalName: string) => {
    setShowPws(prev => ({ ...prev, [portalName]: !prev[portalName] }))
  }

  const copyToClipboard = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!text) return
    navigator.clipboard.writeText(text)
    alert(`${label}가 복사되었습니다! 로그인 창에 붙여넣기(Ctrl+V) 하세요.`)
  }

  const openAll = (mode: 'all' | 'favorites') => {
    const list = mode === 'all' 
      ? [...INSURANCE_PORTALS.life, ...INSURANCE_PORTALS.nonLife]
      : [...INSURANCE_PORTALS.life, ...INSURANCE_PORTALS.nonLife].filter(p => favorites.includes(p.name))
    
    if (list.length === 0) return alert('대상이 없습니다.')

    const confirm = window.confirm(`${mode === 'all' ? '전체' : '즐겨찾기'} ${list.length}개의 포탈을 엽니다. 계속하시겠습니까?`)
    if (confirm) {
      list.forEach((portal, index) => {
        setTimeout(() => window.open(portal.url, '_blank'), index * 250)
      })
    }
  }

  const PortalCard = ({ portal, isNonLife }: { portal: any, isNonLife?: boolean }) => {
    const isFav = favorites.includes(portal.name)
    const savedId = portalIds[portal.name] || ''
    const savedPw = portalPws[portal.name] || ''
    const isShowingPw = showPws[portal.name] || false

    return (
      <div className={`group relative bg-white p-5 rounded-3xl border transition-all flex flex-col gap-5 shadow-sm hover:shadow-md ${isFav ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-100' : 'border-gray-100 hover:border-primary-200'}`}>
        <button onClick={(e) => toggleFavorite(e, portal.name)} className="absolute top-3 right-3 p-1.5 rounded-lg z-20">
          {isFav ? <StarSolid className="w-5 h-5 text-amber-500" /> : <StarOutline className="w-5 h-5 text-gray-300 hover:text-amber-400" />}
        </button>

        <div className="flex flex-col items-center justify-center gap-1 mt-2">
          <span className={`text-base font-black transition-colors ${isFav ? 'text-amber-700' : isNonLife ? 'text-gray-900 group-hover:text-rose-600' : 'text-gray-900 group-hover:text-primary-600'}`}>{portal.name}</span>
          <a href={portal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-primary-600">포탈 바로가기 <ArrowTopRightOnSquareIcon className="w-3 h-3" /></a>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="ID" value={savedId} onChange={(e) => handleIdChange(portal.name, e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-10 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" />
            {savedId && <button onClick={(e) => copyToClipboard(e, savedId, '아이디')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-primary-500"><ClipboardDocumentIcon className="w-4 h-4" /></button>}
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={isShowingPw ? "text" : "password"} placeholder="PW" value={savedPw} onChange={(e) => handlePwChange(portal.name, e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-20 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button onClick={() => toggleShowPw(portal.name)} className="p-2 text-gray-300 hover:text-gray-500">{isShowingPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}</button>
              {savedPw && <button onClick={(e) => copyToClipboard(e, savedPw, '비밀번호')} className="p-2 text-gray-300 hover:text-primary-500"><ClipboardDocumentIcon className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-primary-600"><GlobeAltIcon className="w-80 h-80" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">보험사 포탈 매니저</h1>
            <p className="text-gray-500 font-medium text-lg">보험사별 계정 정보를 안전하게 관리하고 원클릭으로 접속하세요.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => openAll('favorites')} className={`inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] font-black transition-all shadow-lg hover:scale-105 active:scale-95 ${favorites.length > 0 ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}><StarSolid className="w-6 h-6" /> 즐겨찾기 열기 ({favorites.length})</button>
            <button onClick={() => openAll('all')} className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black transition-all shadow-lg shadow-primary-200 hover:scale-105 active:scale-95"><ArrowTopRightOnSquareIcon className="w-6 h-6" /> 전체 포탈 열기</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><UserIcon className="w-6 h-6" /></div>
          <div><p className="text-sm font-black text-blue-900">아이디/비번 저장</p><p className="text-xs text-blue-700 mt-0.5">내 브라우저에만 안전하게 저장됩니다.</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600"><StarSolid className="w-6 h-6" /></div>
          <div><p className="text-sm font-black text-amber-900">즐겨찾기 배치 실행</p><p className="text-xs text-amber-700 mt-0.5">자주 쓰는 보험사만 골라서 한 번에!</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><ClipboardDocumentIcon className="w-6 h-6" /></div>
          <div><p className="text-sm font-black text-emerald-900">간편 복사 & 붙여넣기</p><p className="text-xs text-emerald-700 mt-0.5">복사 후 로그인 창에서 Ctrl+V 하세요.</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4"><div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-primary-500 shadow-lg shadow-primary-200" /><h2 className="text-2xl font-black text-gray-900">생명보험사</h2></div><span className="text-xs font-bold text-gray-400">{INSURANCE_PORTALS.life.length}개 회사</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INSURANCE_PORTALS.life.map((portal) => (<PortalCard key={portal.name} portal={portal} />))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4"><div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-200" /><h2 className="text-2xl font-black text-gray-900">손해보험사</h2></div><span className="text-xs font-bold text-gray-400">{INSURANCE_PORTALS.nonLife.length}개 회사</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INSURANCE_PORTALS.nonLife.map((portal) => (<PortalCard key={portal.name} portal={portal} isNonLife />))}
          </div>
        </div>
      </div>
    </div>
  )
}
