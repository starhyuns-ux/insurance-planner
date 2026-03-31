'use client'

import React, { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { 
  UserCircleIcon, 
  UsersIcon, 
  CreditCardIcon, 
  ArrowRightOnRectangleIcon,
  CloudArrowUpIcon,
  PlusIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon,
  IdentificationIcon,
  ShareIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  DocumentCheckIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import BoardPage from '@/components/BoardPage'
import DetailedClaimForm from '@/components/DetailedClaimForm'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addDays,
  differenceInCalendarDays,
  getDay 
} from 'date-fns'
import { ko } from 'date-fns/locale'

const HOLIDAYS: Record<string, string> = {
  '2024-01-01': '신정',
  '2024-02-09': '설날',
  '2024-02-10': '설날',
  '2024-02-11': '설날',
  '2024-02-12': '대체공휴일',
  '2024-03-01': '삼일절',
  '2024-04-10': '총선',
  '2024-05-05': '어린이날',
  '2024-05-06': '대체공휴일',
  '2024-05-15': '부처님오신날',
  '2024-06-06': '현충일',
  '2024-08-15': '광복절',
  '2024-09-16': '추석',
  '2024-09-17': '추석',
  '2024-09-18': '추석',
  '2024-10-01': '임시공휴일',
  '2024-10-03': '개천절',
  '2024-10-09': '한글날',
  '2024-12-25': '성탄절',
  '2025-01-01': '신정',
  '2025-01-28': '설날',
  '2025-01-29': '설날',
  '2025-01-30': '설날',
  '2025-03-01': '삼일절',
  '2025-03-03': '대체공휴일',
  '2025-05-05': '어린이날/부처님오신날',
  '2025-05-06': '대체공휴일',
  '2025-06-06': '현충일',
  '2025-08-15': '광복절',
  '2025-10-03': '개천절',
  '2025-10-05': '추석',
  '2025-10-06': '추석/개천절',
  '2025-10-07': '추석',
  '2025-10-08': '대체공휴일',
  '2025-10-09': '한글날',
  '2025-12-25': '성탄절',
  '2026-01-01': '신정',
  '2026-02-16': '설날',
  '2026-02-17': '설날',
  '2026-02-18': '설날',
  '2026-03-01': '삼일절',
  '2026-03-02': '대체공휴일',
  '2026-05-05': '어린이날',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-06-03': '지방선거',
  '2026-06-06': '현충일',
  '2026-08-15': '광복절',
  '2026-08-17': '대체공휴일',
  '2026-09-24': '추석',
  '2026-09-25': '추석',
  '2026-09-26': '추석',
  '2026-09-28': '대체공휴일',
  '2026-10-03': '개천절',
  '2026-10-05': '대체공휴일',
  '2026-10-09': '한글날',
  '2026-12-25': '성탄절',
  '2027-01-01': '신정',
  '2027-02-06': '설날',
  '2027-02-07': '설날',
  '2027-02-08': '설날',
  '2027-02-09': '대체공휴일',
  '2027-03-01': '삼일절',
  '2027-03-03': '대통령선거',
  '2027-05-05': '어린이날',
  '2027-05-13': '부처님오신날',
  '2027-06-06': '현충일',
  '2027-08-15': '광복절',
  '2027-08-16': '대체공휴일',
  '2027-09-14': '추석',
  '2027-09-15': '추석',
  '2027-09-16': '추석',
  '2027-10-03': '개천절',
  '2027-10-04': '대체공휴일',
  '2027-10-09': '한글날',
  '2027-10-11': '대체공휴일',
  '2027-12-25': '성탄절',
  '2027-12-27': '대체공휴일',
}

// Safe Date Formatter helper
const safeFormat = (dateStr: string | null | undefined, formatStr: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    return format(d, formatStr)
  } catch (e) {
    return '-'
  }
}

// Insurance Age Helper (Birthday + 6 months)
const getInsuranceAge = (birthDateStr: string | null | undefined) => {
  if (!birthDateStr) return null
  try {
    // birthDateStr is typically YYYY-MM-DD
    const parts = birthDateStr.split('-')
    if (parts.length !== 3) return null
    
    // Use manual date construction to avoid UTC/Local issues with Hyphenated strings
    const bYear = parseInt(parts[0])
    const bMonth = parseInt(parts[1]) - 1 // 0-indexed
    const bDay = parseInt(parts[2])
    
    const birthDate = new Date(bYear, bMonth, bDay)
    if (isNaN(birthDate.getTime())) return null
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Standard Insurance Birthday: (Birth Month + 6) % 12
    let targetMonth = (bMonth + 6) % 12
    let targetDay = bDay
    
    // Find the NEXT occurrence of this Month/Day
    let targetYear = today.getFullYear()
    let insDate = new Date(targetYear, targetMonth, targetDay)
    insDate.setHours(0, 0, 0, 0)

    // If it already passed this year, the next one is next year
    if (insDate < today) {
      insDate = new Date(targetYear + 1, targetMonth, targetDay)
      insDate.setHours(0, 0, 0, 0)
    }

    const dDayCount = differenceInCalendarDays(insDate, today)
    
    return dDayCount === 0 ? 'D-Day' : `D-${dDayCount}`
  } catch (e) {
    return null
  }
}

type Planner = {
  id: string
  name: string
  phone: string
  profile_image_url: string | null
  business_card_url: string | null
  affiliation: string
  region: string
  kakao_url: string
  advisor_message: string | null
  subscription_status: 'active' | 'inactive'
  notification_email: string | null
  gmail_app_password: string | null
  referral_code?: string
}

type Lead = {
  id: string
  name: string
  phone: string
  created_at: string
}

type Customer = {
  id: string
  name: string
  phone: string
  address: string
  birth_date: string | null
  family_count: number
  touch_count: number
  last_touch_at: string | null
  appointment_at: string | null;
  riders: string[];
  memo?: string;
  created_at: string;
}

interface Todo {
  id: string;
  planner_id: string;
  content: string;
  is_completed: boolean;
  target_date: string;
  created_at: string;
}

interface Referral {
  id: string;
  referee_name: string;
  referee_phone: string;
  referee_type: 'CONSULTATION' | 'SIGNUP';
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  reward_amount: number;
  created_at: string;
}

interface Claim {
  id: string;
  planner_id: string;
  customer_name: string;
  customer_phone?: string;
  description: string;
  image_urls: string[];
  insurance_company?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  transmission_status: 'NOT_SENT' | 'SENT';
  created_at: string;
}

// ── 1:1 Chat Inbox Panel ──────────────────────────────────
function ChatInboxPanel({ plannerId, plannerName }: { plannerId: string | null; plannerName: string }) {
  const [sessions, setSessions] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [replyInput, setReplyInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchSessions() }, [plannerId])
  useEffect(() => {
    if (!selectedSession) return
    fetchMessages(selectedSession.id)
    const ch = supabase.channel(`inbox_${selectedSession.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSession.id}` }, p => {
        setMessages(prev => [...prev, p.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [selectedSession?.id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const fetchSessions = async () => {
    const { data } = await supabase.from('chat_sessions').select('*').order('last_message_at', { ascending: false, nullsFirst: false })
    if (data) setSessions(data)
  }
  const fetchMessages = async (sid: string) => {
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at')
    if (data) setMessages(data)
  }
  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyInput.trim() || !selectedSession) return
    setSending(true)
    await supabase.from('chat_messages').insert({ session_id: selectedSession.id, sender_type: 'planner', content: replyInput.trim() })
    await supabase.from('chat_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', selectedSession.id)
    setReplyInput('')
    setSending(false)
    fetchSessions()
  }
  const safeDate = (str: string) => { try { return format(new Date(str), 'M/d HH:mm') } catch { return '' } }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex" style={{ height: '72vh', minHeight: '500px' }}>
      {/* Session List */}
      <div className="w-64 shrink-0 border-r border-gray-100 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">1:1 채팅 인박스</span>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{sessions.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm px-4 text-center">아직 채팅 문의가 없습니다.</div>
          ) : sessions.map(s => (
            <button key={s.id} onClick={() => setSelectedSession(s)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedSession?.id === s.id ? 'bg-primary-50' : ''}`}>
              <p className="font-bold text-sm text-gray-900 truncate">{s.visitor_name}</p>
              {s.visitor_phone && <p className="text-xs text-gray-400">{s.visitor_phone}</p>}
              <p className="text-[10px] text-gray-300 mt-0.5">{safeDate(s.last_message_at || s.created_at)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedSession ? (
          <div className="flex-1 flex items-center justify-center text-gray-300 flex-col gap-2">
            <span className="text-4xl">💬</span>
            <span className="text-sm">세션을 선택하면 채팅이 표시됩니다.</span>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black text-sm">{selectedSession.visitor_name.charAt(0)}</div>
              <div>
                <p className="font-bold text-sm text-gray-900">{selectedSession.visitor_name}</p>
                {selectedSession.visitor_phone && <p className="text-xs text-gray-400">{selectedSession.visitor_phone}</p>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'planner' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender_type === 'visitor' && (
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 mr-2 shrink-0 mt-1">{selectedSession.visitor_name.charAt(0)}</div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words ${
                      msg.sender_type === 'planner' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                    }`}>{msg.content}</div>
                    <p className={`text-[10px] text-gray-300 mt-0.5 ${msg.sender_type === 'planner' ? 'text-right' : ''}`}>{safeDate(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendReply} className="p-3 border-t border-gray-100 flex gap-2 items-end bg-gray-50/50">
              <textarea value={replyInput} onChange={e => setReplyInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(e as any) } }}
                rows={2} placeholder={`${plannerName}으로 답변... (Enter 전송)`}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-white" />
              <button type="submit" disabled={sending || !replyInput.trim()}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-40 shrink-0">전송</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
// ── KakaoTalk Messaging Panel ───────────────────────────────────
function KakaoTalkPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [isSdkReady, setIsSdkReady] = useState(false)

  const { initKakao, loginWithKakao, fetchKakaoFriends, sendKakaoDefault, getKakaoToken } = require('@/lib/kakao-client')

  useEffect(() => {
    let checkInterval: any;
    
    const initialize = async () => {
      try {
        // Wait for window.Kakao to be ready (it's loaded async in layout.tsx)
        checkInterval = setInterval(() => {
          if (typeof window !== 'undefined' && window.Kakao) {
            if (!window.Kakao.isInitialized()) {
              initKakao()
            }
            
            if (window.Kakao.isInitialized()) {
              console.log('Kakao SDK is ready and initialized')
              setIsSdkReady(true)
              clearInterval(checkInterval)
              
              // Now check for existing session
              const token = getKakaoToken()
              if (token) {
                setIsLoggedIn(true)
                fetchFriends()
              }
            }
          }
        }, 300)
      } catch (e) {
        console.error('Kakao init error:', e)
      }
    }

    initialize()
    return () => { if (checkInterval) clearInterval(checkInterval) }
  }, [])

  const handleLogin = async () => {
    if (!isSdkReady) {
      alert('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.')
      return
    }
    try {
      await loginWithKakao()
      setIsLoggedIn(true)
      fetchFriends()
    } catch (err) {
      console.error('Kakao login detailed error:', err)
      alert('카카오 로그인에 실패했습니다. 권한 동의를 확인하거나 개발자 콘솔의 설정을 확인해 주세요.')
    }
  }

  const fetchFriends = async () => {
    if (!isSdkReady) return
    setLoadingFriends(true)
    try {
      const friendList = await fetchKakaoFriends()
      setFriends(friendList)
    } catch (err) {
      console.error('Failed to fetch Kakao friends:', err)
      // If unauthorized, reset login state
      if (err && (err as any).code === -401) {
        setIsLoggedIn(false)
      }
    } finally {
      setLoadingFriends(false)
    }
  }

  const toggleFriend = (uuid: string) => {
    setSelectedFriends(prev => 
      prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
    )
  }

  const handleSendMessage = async () => {
    if (selectedFriends.length === 0 || !message.trim()) return
    setSending(true)
    try {
      await sendKakaoDefault(selectedFriends, message, 'https://stroy.kr')
      alert(`${selectedFriends.length}명의 친구에게 메시지를 보냈습니다.`)
      setMessage('')
      setSelectedFriends([])
    } catch (err) {
      alert('메시지 전송에 실패했습니다.')
    } finally {
      setSending(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-[2rem] shadow-xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#FEE500] rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-[#3C1E1E]" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">카카오톡 연동하기</h3>
        <p className="text-gray-500 mb-8 max-w-sm">
          내 카카오톡 계정을 연동하여 고객(친구)들에게<br/>다양한 보험 안내 메시지를 직접 보낼 수 있습니다.
        </p>
        <button
          onClick={handleLogin}
          className="bg-[#FEE500] text-[#3C1E1E] px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#FADA0A] transition-all flex items-center gap-3 shadow-xl shadow-yellow-100"
        >
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" className="w-6 h-6" />
          카카오 로그인으로 시작하기
        </button>
        <p className="mt-6 text-[10px] text-gray-300 font-medium">※ 친구 목록 조회 및 메시지 전송 권한 동의가 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row" style={{ height: '72vh', minHeight: '600px' }}>
      {/* Friend List Side */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-black text-gray-900 text-sm">카카오톡 친구 목록</h4>
          <span className="text-[10px] font-black bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">{friends.length}명</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingFriends ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs animate-pulse italic">목록 불러오는 중...</div>
          ) : friends.length === 0 ? (
            <div className="p-8 text-center text-gray-300 text-xs">친구 목록을 불러올 수 없거나 친구가 없습니다.</div>
          ) : friends.map(f => (
            <button
              key={f.uuid}
              onClick={() => toggleFriend(f.uuid)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                selectedFriends.includes(f.uuid) ? 'bg-primary-50 border border-primary-100 shadow-sm' : 'hover:bg-white border border-transparent'
              }`}
            >
              <div className="relative">
                <img src={f.profile_thumbnail_image || 'https://via.placeholder.com/40'} alt={f.profile_nickname} className="w-10 h-10 rounded-xl object-cover" />
                {selectedFriends.includes(f.uuid) && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                    <CheckIcon className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">{f.profile_nickname}</p>
                <p className="text-[10px] text-gray-400">카카오톡 친구</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Compose Area */}
      <div className="flex-1 flex flex-col p-6 md:p-8 space-y-6">
        <div>
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">메시지 작성</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="친구에게 보낼 메시지 내용을 입력하세요..."
            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-medium focus:bg-white focus:border-primary-500 transition-all outline-none resize-none shadow-inner"
          />
        </div>

        <div className="flex-1 flex flex-col justify-end gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">발송 요약</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">선택된 친구</span>
              <span className="text-sm font-black text-primary-600">{selectedFriends.length}명</span>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={sending || selectedFriends.length === 0 || !message.trim()}
            className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 disabled:opacity-40 shadow-xl shadow-primary-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {sending ? '메시지 전송 중...' : '메시지 전송하기'}
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          </button>
        </div>
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────

// ── Subscription Tab Component ────────────────────────────────────
function SubscriptionTab({ planner }: { planner: { id: string; name: string; subscription_status: string } | null }) {
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  // 카카오페이는 별도 SDK 불필요 (서버 side API 호출 후 리다이렉트)

  const fetchPaymentHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/payment/history', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPayments(data.data || [])
      }
    } catch (e) {
      console.error('Failed to fetch payment history:', e)
    } finally {
      setLoadingPayments(false)
    }
  }

  const handlePayment = async () => {
    if (!planner || checkingOut) return
    setCheckingOut(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { alert('로그인이 필요합니다.'); return }

      // 카카오페이 Ready API 호출 → 리다이렉트 URL 수신
      const prepRes = await fetch('/api/payment/prepare', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const prepData = await prepRes.json()
      if (!prepRes.ok) throw new Error(prepData.error || '결제 준비 실패')

      // 모바일/PC 분기하여 카카오페이 결제창으로 리다이렉트
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      const redirectUrl = isMobile ? prepData.mobileRedirectUrl : prepData.redirectUrl
      if (!redirectUrl) throw new Error('결제 URL을 받지 못했습니다.')

      window.location.href = redirectUrl
    } catch (err: any) {
      alert(err.message || '결제 중 오류가 발생했습니다.')
      setCheckingOut(false)
    }
    // 리다이렉트 후에는 setCheckingOut(false) 호출이 의미 없으므로 생략
  }

  const isActive = planner?.subscription_status === 'active'
  const latestPayment = payments.find(p => p.status === 'DONE')
  const periodEnd = latestPayment?.period_end
    ? new Date(latestPayment.period_end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const daysLeft = latestPayment?.period_end
    ? Math.max(0, Math.ceil((new Date(latestPayment.period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const FEATURES = [
    { icon: '🏢', label: '디지털 명함 & 랜딩페이지' },
    { icon: '👥', label: '고객 관리 (무제한)' },
    { icon: '📅', label: '일정 캘린더 & 할일 관리' },
    { icon: '📋', label: '보험청구 자동화 서비스' },
    { icon: '📊', label: '상담 신청 실시간 알림' },
    { icon: '🎁', label: '친구 추천 리워드 시스템' },
    { icon: '💬', label: '1:1 채팅 & 카카오톡 연동' },
    { icon: '📌', label: '자유게시판 & 공지사항' },
  ]

  return (
    <div className="space-y-6">
      {/* 현재 구독 상태 카드 */}
      <div className={`rounded-[2rem] p-8 relative overflow-hidden ${
        isActive
          ? 'bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white'
          : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
      }`}>
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                {isActive ? (
                  <span className="px-4 py-1.5 bg-emerald-400 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    구독 활성
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-gray-600 text-white text-xs font-black uppercase tracking-widest rounded-full">
                    미구독
                  </span>
                )}
                <span className="px-4 py-1.5 bg-white/10 text-white/80 text-xs font-black uppercase tracking-widest rounded-full backdrop-blur-sm">
                  PREMIUM PLAN
                </span>
              </div>

              <h3 className="text-3xl font-black mb-1">프리미엄 설계사 플랜</h3>
              <p className="text-white/60 font-medium mb-6">
                {isActive
                  ? '모든 기능을 제한 없이 이용하고 있습니다.'
                  : '구독을 시작하면 모든 프리미엄 기능을 이용할 수 있습니다.'}
              </p>

              {/* 구독 정보 (활성일 때) */}
              {isActive && (
                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">다음 갱신일</p>
                    <p className="text-lg font-black text-white">{periodEnd || '—'}</p>
                  </div>
                  <div className="px-5 py-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">남은 기간</p>
                    <p className="text-lg font-black text-emerald-300">{daysLeft}일</p>
                  </div>
                  <div className="px-5 py-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">월 이용료</p>
                    <p className="text-lg font-black text-white">5,900원</p>
                  </div>
                </div>
              )}
            </div>

            {/* 가격 + 결제 버튼 */}
            <div className="flex flex-col items-center gap-4 md:items-end">
              <div className="text-right">
                <p className="text-white/40 text-sm font-bold line-through mb-1">월 29,900원</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">5,900</span>
                  <span className="text-white/60 font-bold">원/월</span>
                </div>
                <p className="text-amber-300 text-xs font-black mt-1">🔥 베타 출시 특별가</p>
              </div>
              <button
                onClick={handlePayment}
                disabled={checkingOut}
                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-base transition-all shadow-2xl flex items-center gap-2 whitespace-nowrap ${
                  checkingOut
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FADA0A] hover:scale-105 active:scale-95 shadow-yellow-500/20'
                }`}
              >
                {checkingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#3C1E1E]/40 border-t-[#3C1E1E] rounded-full animate-spin" />
                    카카오페이 연동 중...
                  </>
                ) : isActive ? (
                  <>
                    {/* 카카오페이 로고 아이콘 */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.68 5.88 4.24 7.52L5.2 22l4.56-2.36c.72.16 1.48.24 2.24.24 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/>
                    </svg>
                    구독 연장하기
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.12 1.68 5.88 4.24 7.52L5.2 22l4.56-2.36c.72.16 1.48.24 2.24.24 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/>
                    </svg>
                    카카오페이로 시작하기
                  </>
                )}
              </button>
              {!isActive && (
                <p className="text-white/40 text-xs font-medium text-center">화살표 카카오페이 · 안전한 간편결제</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 플랜 포함 기능 */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <h4 className="text-lg font-black text-gray-900 mb-6">플랜에 포함된 기능</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((feat, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-primary-50 hover:border-primary-100 transition-all group">
              <span className="text-2xl">{feat.icon}</span>
              <span className="text-xs font-bold text-gray-700 group-hover:text-primary-700 leading-snug">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 내역 */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="text-lg font-black text-gray-900">결제 내역</h4>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">최근 12건</span>
        </div>

        {loadingPayments ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">결제 내역을 불러오는 중...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCardIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold">결제 내역이 없습니다.</p>
            <p className="text-gray-300 text-sm mt-1">구독을 시작하면 이곳에 내역이 표시됩니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">결제일</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">내용</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">금액</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">상태</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">구독 기간</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">영수증</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-gray-700">
                      {p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString('ko-KR')
                        : new Date(p.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900 text-sm">보험 플래너 구독</p>
                      {p.card_company && (
                        <p className="text-xs text-gray-400 mt-0.5">{p.card_company} {p.card_number ? `••••${p.card_number.slice(-4)}` : ''}</p>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-900">
                      {(p.amount || 5900).toLocaleString()}원
                    </td>
                    <td className="px-8 py-5 text-center">
                      {p.status === 'DONE' && (
                        <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">결제완료</span>
                      )}
                      {p.status === 'PENDING' && (
                        <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">처리중</span>
                      )}
                      {p.status === 'CANCELED' && (
                        <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest">취소됨</span>
                      )}
                      {p.status === 'FAILED' && (
                        <span className="inline-flex px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-black rounded-full uppercase tracking-widest">실패</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-gray-500">
                      {p.period_start && p.period_end
                        ? `${new Date(p.period_start).toLocaleDateString('ko-KR')} ~ ${new Date(p.period_end).toLocaleDateString('ko-KR')}`
                        : '—'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {p.receipt_url ? (
                        <a
                          href={p.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          영수증
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <h4 className="text-lg font-black text-gray-900 mb-6">자주 묻는 질문</h4>
        <div className="space-y-4">
          {[
            { q: '구독은 언제 시작되나요?', a: '결제 완료 즉시 구독이 활성화됩니다. 매월 같은 날짜에 자동 갱신됩니다.' },
            { q: '어떤 결제 수단을 지원하나요?', a: '신용카드, 체크카드를 지원합니다. 토스 페이먼츠를 통해 안전하게 처리됩니다.' },
            { q: '구독을 중간에 해지할 수 있나요?', a: '언제든지 해지할 수 있습니다. 해지 시 이미 결제된 기간은 정상적으로 이용 가능합니다.' },
            { q: '영수증은 어떻게 받나요?', a: '결제 내역에서 \'영수증\' 버튼을 클릭하면 토스 페이먼츠 영수증 페이지로 이동합니다.' },
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-1.5">Q. {faq.q}</p>
              <p className="text-gray-500 text-sm font-medium">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'leads' | 'customers' | 'calendar' | 'subscription' | 'card' | 'notification' | 'guide' | 'chat' | 'freeboard' | 'referrals' | 'claims' | 'kakaotalk'>('calendar')
  const [planner, setPlanner] = useState<Planner | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [newClaimName, setNewClaimName] = useState('')
  const [newClaimDesc, setNewClaimDesc] = useState('')
  const [newClaimImages, setNewClaimImages] = useState<File[]>([])
  const [uploadingClaim, setUploadingClaim] = useState(false)
  const [newTodoContent, setNewTodoContent] = useState('')
  const [todoDate, setTodoDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
  const [editTodoContent, setEditTodoContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [transmittingClaimId, setTransmittingClaimId] = useState<string | null>(null)
  const router = useRouter()
  const todoSectionRef = useRef<HTMLDivElement>(null)

  // ... (existing state)

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) return
    if (!compPhone || !compAffiliation) {
      alert('휴대폰 번호와 소속은 필수 입력 사항입니다.')
      return
    }

    setCompSaving(true)
    try {
      const cleanPhone = compPhone.replace(/-/g, '')
      const { error } = await supabase
        .from('planners')
        .update({
          phone: cleanPhone,
          affiliation: compAffiliation,
          region: compRegion
        })
        .eq('id', planner.id)

      if (error) throw error

      // Update local state
      setPlanner({
        ...planner,
        phone: cleanPhone,
        affiliation: compAffiliation,
        region: compRegion
      })
      setEditPhone(cleanPhone)
      setEditAffiliation(compAffiliation)
      setEditRegion(compRegion)
      setShowProfileModal(false)
      alert('프로필 정보가 업데이트되었습니다.')
    } catch (err: any) {
      alert('저장 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setCompSaving(false)
    }
  }

  // Profile Edit State
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAffiliation, setEditAffiliation] = useState('')
  const [editRegion, setEditRegion] = useState('')
  const [editKakaoUrl, setEditKakaoUrl] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  // Profile Completion Modal State
  const [compPhone, setCompPhone] = useState('')
  const [compAffiliation, setCompAffiliation] = useState('')
  const [compRegion, setCompRegion] = useState('')
  const [compSaving, setCompSaving] = useState(false)

  // Notification Settings State
  const [editNotificationEmail, setEditNotificationEmail] = useState('')
  const [editGmailAppPassword, setEditGmailAppPassword] = useState('')
  const [isNotifSaving, setIsNotifSaving] = useState(false)
  const [notifTestResult, setNotifTestResult] = useState<string | null>(null)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)
  const [recentConsultations, setRecentConsultations] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null)

  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustAddr, setNewCustAddr] = useState('')
  const [newCustBirth, setNewCustBirth] = useState('')
  const [newCustFamily, setNewCustFamily] = useState('1')
  const [newCustRiders, setNewCustRiders] = useState('')
  const [newCustAppt, setNewCustAppt] = useState('')

  // Edit Customer State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedMemoId, setExpandedMemoId] = useState<string | null>(null)
  const [memoValue, setMemoValue] = useState('')
  const [editCustName, setEditCustName] = useState('')
  const [editCustPhone, setEditCustPhone] = useState('')
  const [editCustAddr, setEditCustAddr] = useState('')
  const [editCustBirth, setEditCustBirth] = useState('')
  const [editCustFamily, setEditCustFamily] = useState('1')
  const [editCustRiders, setEditCustRiders] = useState('')
  const [editCustAppt, setEditCustAppt] = useState('')
  const [hasNewBoardPost, setHasNewBoardPost] = useState(false)

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    checkUser()
    checkFreeBoardNewPost()
  }, [])

  const checkFreeBoardNewPost = async () => {
    try {
      const { data } = await supabase
        .from('board_posts')
        .select('created_at')
        .eq('board_type', 'free')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        const lastSeen = localStorage.getItem('last_seen_free_board')
        if (!lastSeen || new Date(data.created_at) > new Date(lastSeen)) {
          setHasNewBoardPost(true)
        }
      }
    } catch (e) {
      console.error('Error checking new board posts:', e)
    }
  }

  const handleTabChange = (tab: any) => {
    setActiveTab(tab)
    if (tab === 'freeboard') {
      setHasNewBoardPost(false)
      localStorage.setItem('last_seen_free_board', new Date().toISOString())
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('planners')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      // BETA TEST OVERRIDE: Always treat as active subscriber
      const betaProfile = { ...profile, subscription_status: 'active' }
      setPlanner(betaProfile)
      setEditName(profile.name)
      setEditPhone(profile.phone || '')
      setEditAffiliation(profile.affiliation || '')
      setEditRegion(profile.region || '')
      setEditKakaoUrl(profile.kakao_url || '')
      setEditMessage(profile.advisor_message || '')
      setEditNotificationEmail(profile.notification_email || '')
      setEditGmailAppPassword(profile.gmail_app_password || '')

      // Social Login Check: If phone or affiliation is missing, show completion modal
      if (!profile.phone || !profile.affiliation) {
        setShowProfileModal(true)
        setCompRegion(profile.region || '')
      }
    }

    // Fetch Manual Customers
    const { data: custs } = await supabase
      .from('customers')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: false })

    if (custs) setCustomers(custs)

    // Fetch Consultation Leads
    const { data: leadData } = await supabase
      .from('consultations')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: false })

    if (leadData) {
      setLeads(leadData)
      setRecentConsultations(leadData.slice(0, 10))

      // Calculate unread count
      const lastSeen = localStorage.getItem('notif_last_seen')
      setLastSeenAt(lastSeen)
      if (lastSeen) {
        const unread = leadData.filter((l: any) => new Date(l.created_at) > new Date(lastSeen)).length
        setUnreadCount(unread)
      } else {
        setUnreadCount(leadData.length)
      }
    }

    // Fetch Todos
    const { data: todoData } = await supabase
      .from('todos')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: true })

    if (todoData) setTodos(todoData)

    // Fetch Referrals
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const refRes = await fetch('/api/referrals/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (refRes.ok) {
        const refData = await refRes.json()
        setReferrals(refData.data || [])
      }
    }

    // Fetch Claims
    const { data: claimsData } = await supabase
      .from('claims')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: false })

    if (claimsData) setClaims(claimsData)

    // Check push subscription status
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        const subscription = await registration.pushManager.getSubscription()
        setPushEnabled(!!subscription)
      } catch (err) {
        console.log('Service worker registration skipped:', err)
      }
    }
    
    setLoading(false)
  }

  const fetchTodos = async (plannerId: string) => {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('planner_id', plannerId)
      .order('created_at', { ascending: true })
    if (data) setTodos(data)
  }

  const addTodo = async () => {
    if (!newTodoContent.trim() || !planner) return
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        planner_id: planner.id,
        content: newTodoContent.trim(),
        target_date: todoDate,
        is_completed: false
      }])
      .select()
    if (!error && data) {
      setTodos([...todos, data[0]])
      setNewTodoContent('')
    }
  }

  const toggleTodo = async (id: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !isCompleted })
      .eq('id', id)
    if (!error) {
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !isCompleted } : t))
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    if (!error) {
      setTodos(todos.filter(t => t.id !== id))
    }
  }

  const startEditingTodo = (todo: Todo) => {
    setEditingTodoId(todo.id)
    setEditTodoContent(todo.content)
  }

  const saveTodoEdit = async (id: string) => {
    if (!editTodoContent.trim()) return
    const { error } = await supabase
      .from('todos')
      .update({ content: editTodoContent.trim() })
      .eq('id', id)
    
    if (!error) {
      setTodos(todos.map(t => t.id === id ? { ...t, content: editTodoContent.trim() } : t))
      setEditingTodoId(null)
    }
  }

  const cancelEditingTodo = () => {
    setEditingTodoId(null)
    setEditTodoContent('')
  }

  const handleClaimImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewClaimImages(Array.from(e.target.files))
    }
  }

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner || !newClaimName.trim()) return
    setUploadingClaim(true)
    try {
      const uploadedUrls: string[] = []
      
      for (const file of newClaimImages) {
        const fileExt = file.name.split('.').pop()
        const fileName = `claims/${planner.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('planner-assets')
          .upload(fileName, file)
          
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('planner-assets')
          .getPublicUrl(fileName)
          
        uploadedUrls.push(publicUrl)
      }

      const { data, error } = await supabase
        .from('claims')
        .insert({
          planner_id: planner.id,
          customer_name: newClaimName,
          description: newClaimDesc,
          image_urls: uploadedUrls,
          status: 'PENDING'
        })
        .select()

      if (error) throw error
      if (data) {
        setClaims([data[0], ...claims])
        setNewClaimName('')
        setNewClaimDesc('')
        setNewClaimImages([])
        alert('보상청구가 접수되었습니다.')
      }
    } catch (err: any) {
      alert('보상청구 접수 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setUploadingClaim(false)
    }
  }

  const updateClaimStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('claims').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus as any } : c))
    }
  }

  const deleteClaim = async (id: string) => {
    if(!confirm('정말 이 청구건을 삭제하시겠습니까?')) return
    const { error } = await supabase.from('claims').delete().eq('id', id)
    if (!error) setClaims(claims.filter(c => c.id !== id))
  }

  const transmitClaim = async (id: string) => {
    setTransmittingClaimId(id)
    try {
      const res = await fetch('/api/claims/transmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId: id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setClaims(claims.map(c => c.id === id ? { ...c, transmission_status: 'SENT', status: 'IN_PROGRESS' } : c))
      alert(json.message || '송신이 완료되었습니다.')
    } catch (err: any) {
      alert('송신 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setTransmittingClaimId(null)
    }
  }

  const handleCopyUrl = (id: string) => {
    const url = `https://stroy.kr/p/${id}/card`
    navigator.clipboard.writeText(url)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
  }

  const shareCard = async (targetName: string, targetPhone?: string) => {
    if (!planner) return

    const cardUrl = `https://stroy.kr/p/${planner.id}/card`
    const message = `[${planner.name} 설계사] 안녕하세요, ${targetName}님! 제 모바일 명함을 보내드립니다.\n\n🔗 명함 보기: ${cardUrl}`

    try {
      await navigator.clipboard.writeText(message)
      alert('명함 홍보 메시지가 클립보드에 복사되었습니다! ✅\n\n카카오톡이나 문자 메시지에 붙여넣어(Ctrl+V) 전송해 주세요.')
    } catch (err) {
      console.error('Clipboard copy failed:', err)
      alert(`메시지 복사에 실패했습니다.\n\n직접 복사해서 보내주세요:\n${message}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const updateProfile = async () => {
    if (!planner) return
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.')
      setIsSaving(false)
      router.push('/login')
      return
    }

    const { error: updateError } = await supabase
      .from('planners')
      .update({
        name: editName,
        phone: editPhone,
        affiliation: editAffiliation,
        region: editRegion,
        kakao_url: editKakaoUrl
      })
      .eq('id', user.id)

    if (!updateError) {
      alert('프로필이 수정되었습니다.')
      checkUser()
    } else {
      alert('프로필 업데이트 중 오류가 발생했습니다: ' + updateError.message)
    }
    setIsSaving(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'card') => {
    const file = e.target.files?.[0]
    if (!file || !planner) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${planner.id}/${type}_${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('planner-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('planner-assets')
        .getPublicUrl(filePath)

      // 3. Update Planners table
      const updateData = type === 'profile' 
        ? { profile_image_url: publicUrl } 
        : { business_card_url: publicUrl }

      const { error: updateError } = await supabase
        .from('planners')
        .update(updateData)
        .eq('id', planner.id)

      if (updateError) throw updateError

      alert(`${type === 'profile' ? '프로필 이미지가' : '명함이'} 성공적으로 업로드되었습니다.`)
      checkUser()
    } catch (err: any) {
      alert('업로드 중 오류가 발생했습니다: ' + err.message)
    }
  }

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) return

    const { error } = await supabase
      .from('customers')
      .insert({
        planner_id: planner.id,
        name: newCustName,
        phone: newCustPhone,
        address: newCustAddr,
        birth_date: newCustBirth || null,
        family_count: parseInt(newCustFamily) || 1,
        riders: newCustRiders.split(',').map(r => r.trim()).filter(r => r !== ''),
        touch_count: 0,
        appointment_at: null
      })

    if (!error) {
      alert('고객 정보가 등록되었습니다.')
      setNewCustName('')
      setNewCustPhone('')
      setNewCustAddr('')
      setNewCustBirth('')
      setNewCustFamily('1')
      setNewCustRiders('')
      setNewCustAppt('')
      checkUser()
    }
  }

  const incrementTouch = async (id: string, currentCount: number) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          touch_count: currentCount + 1,
          last_touch_at: new Date().toISOString()
        })
        .eq('id', id)

      if (!error) {
        setCustomers(prev => prev.map(c => c.id === id ? { 
          ...c, 
          touch_count: c.touch_count + 1,
          last_touch_at: new Date().toISOString() 
        } : c))
      } else {
        alert('터치 횟수 업데이트 중 오류가 발생했습니다.')
      }
    } catch (err) {
      alert('오류가 발생했습니다.')
    }
  }

  const decrementTouch = async (id: string, currentCount: number) => {
    if (currentCount <= 0) return
    try {
      const { error } = await supabase
        .from('customers')
        .update({ touch_count: currentCount - 1 })
        .eq('id', id)

      if (!error) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, touch_count: c.touch_count - 1 } : c))
      }
    } catch (err) {
      alert('오류가 발생했습니다.')
    }
  }

  const toggleMemo = (customer: any) => {
    if (expandedMemoId === customer.id) {
      setExpandedMemoId(null)
      setMemoValue('')
    } else {
      setExpandedMemoId(customer.id)
      setMemoValue(customer.memo || '')
    }
  }

  const saveMemo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ memo: memoValue })
        .eq('id', id)
      
      if (error) throw error
      
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, memo: memoValue } : c))
      setExpandedMemoId(null)
      setMemoValue('')
    } catch (err) {
      console.error('Error saving memo:', err)
      alert('메모 저장 중 오류가 발생했습니다.')
    }
  }

  const startEditing = (customer: Customer) => {
    setEditingId(customer.id)
    setEditCustName(customer.name)
    setEditCustPhone(customer.phone)
    setEditCustAddr(customer.address)
    setEditCustBirth(customer.birth_date ? customer.birth_date.slice(0, 10) : '')
    setEditCustFamily(customer.family_count.toString())
    setEditCustRiders(customer.riders.join(', '))
    setEditCustAppt(customer.appointment_at ? customer.appointment_at.slice(0, 10) : '')
  }

  const saveEdit = async () => {
    if (!editingId) return
    const { error } = await supabase
      .from('customers')
      .update({
        name: editCustName,
        phone: editCustPhone,
        address: editCustAddr,
        birth_date: editCustBirth || null,
        family_count: parseInt(editCustFamily) || 1,
        riders: editCustRiders.split(',').map(r => r.trim()).filter(r => r !== ''),
        appointment_at: editCustAppt || null
      })
      .eq('id', editingId)

    if (!error) {
      setEditingId(null)
      checkUser()
    } else {
      alert('수정 중 오류가 발생했습니다.')
    }
  }

  const deleteCustomer = async (id: string) => {
    if (!confirm('정말로 이 고객 정보를 삭제하시겠습니까?')) return
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (!error) {
      checkUser()
    } else {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 pb-24 lg:pb-0">
      <NavBar />
      
      <div className="flex-1 container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-full lg:w-72 shrink-0 space-y-3">


            {/* ── 홈 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-primary-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">홈</span>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'calendar' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  일정 관리 (달력)
                </button>
              </div>
            </div>

            {/* ── 영업 관리 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">영업 관리</span>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => { setActiveTab('notification'); setUnreadCount(0); localStorage.setItem('notif_last_seen', new Date().toISOString()); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'notification' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <UsersIcon className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left">상담 알림 / 현황</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unreadCount}건</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'customers' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <UsersIcon className="w-4 h-4 shrink-0" />
                  고객 관리
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'claims' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <DocumentCheckIcon className="w-4 h-4 shrink-0" />
                  보상청구 관리
                </button>
                <button
                  onClick={() => setActiveTab('kakaotalk')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'kakaotalk' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4 shrink-0" />
                  카카오톡 보내기
                </button>
              </div>
            </div>

            {/* ── 내 설정 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">내 설정</span>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'profile' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <UserCircleIcon className="w-4 h-4 shrink-0" />
                  프로필 관리
                </button>
                <button
                  onClick={() => setActiveTab('card')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'card' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IdentificationIcon className="w-4 h-4 shrink-0" />
                  명함 만들기
                </button>
              </div>
            </div>

            {/* ── 커뮤니티 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-green-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">커뮤니티</span>
              </div>
              <div className="p-2 space-y-0.5">
                <Link
                  href="/board/qna"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  Q&amp;A 게시판
                </Link>
                <Link
                  href="/board/free"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-teal-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  자유 게시판
                </Link>
                <button
                  onClick={() => handleTabChange('chat')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'chat' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 shrink-0 ${activeTab === 'chat' ? 'text-white' : 'text-violet-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  1:1 채팅 인박스
                </button>
              </div>
            </div>

            {/* ── 시스템 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-gray-400 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">시스템</span>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'subscription' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCardIcon className="w-4 h-4 shrink-0" />
                  멤버십 구독
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'guide' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                  사용 가이드
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'referrals' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <GiftIcon className="w-4 h-4 shrink-0" />
                  친구추천 리워드
                </button>
                <a
                  href="http://www.gasupport.co.kr/Gasys/mega/inc/pop_insuCon.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm text-gray-600 hover:bg-gray-50"
                >
                  <GlobeAltIcon className="w-4 h-4 shrink-0 text-gray-400" />
                  전보험사 바로가기
                </a>
              </div>
            </div>

            {/* Planner Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
              <p className="font-cursive text-lg text-primary-600/80 leading-tight">
                &ldquo;I can do all this through him who gives me strength.&rdquo;
              </p>
              <p className="font-cursive text-xs text-gray-400 mt-1">Philippians 4:13</p>
            </div>

            {/* Footer actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-0.5">
              {planner?.id && (
                <Link
                  href={`/p/${planner.id}`}
                  target="_blank"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-all text-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 rotate-180 shrink-0" />
                  본인 사이트 보러가기
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-rose-500 hover:bg-rose-50 transition-all text-sm"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
                로그아웃
              </button>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {/* Tab: Profile */}
            {activeTab === 'card' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                      <IdentificationIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">명함 정보 만들기</h3>
                  </div>

                  {/* 1. Profile Photo - resume style, bigger */}
                  <div className="mb-8">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <UserCircleIcon className="w-4 h-4 text-primary-500" />
                      프로필 사진
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} className="hidden" id="card-profile-upload" />
                        <label htmlFor="card-profile-upload" className="w-36 h-44 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 transition-all cursor-pointer overflow-hidden relative shadow-sm">
                          {planner?.profile_image_url ? (
                            <img src={planner.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3">
                              <UserCircleIcon className="w-14 h-14 mx-auto opacity-20 mb-2" />
                              <p className="text-xs font-bold">사진 업로드</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm rounded-2xl">
                            변경
                          </div>
                        </label>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p className="font-bold text-gray-700 mb-1">프로필 사진을 업로드하세요</p>
                        <p className="text-xs text-gray-400 leading-relaxed">이력서용 증명사진이나 신뢰감을 주는 사진을 추천합니다.<br/>명함 URL 공유 시 이 사진이 미리보기에 표시됩니다.</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. 성함 / 소속 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">성함</label>
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="성함을 입력하세요" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">소속 (회사명)</label>
                      <input type="text" value={editAffiliation} onChange={(e) => setEditAffiliation(e.target.value)} placeholder="예: 삼성생명 / 메리츠화재" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                    </div>
                  </div>

                  {/* 3. 활동지역 / 연락처 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">활동 지역 / 주소</label>
                      <input type="text" value={editRegion} onChange={(e) => setEditRegion(e.target.value)} placeholder="예: 서울 강남구 / 전국 상담 가능" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">연락처</label>
                      <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                    </div>
                  </div>

                  {/* 4. 설계사 한마디 */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">설계사 한마디 (인사말)</label>
                    <input type="text" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} placeholder="정직하게 분석하고 고객님의 소중한 보험료를 아껴드립니다." className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                  </div>

                  {/* 5. 카카오톡 오픈채팅 주소 */}
                  <div className="mb-8">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">카카오톡 오픈채팅 주소</label>
                    <input type="text" value={editKakaoUrl} onChange={(e) => setEditKakaoUrl(e.target.value)} placeholder="https://open.kakao.com/o/..." className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-bold shadow-inner" />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={updateProfile}
                    disabled={isSaving}
                    className="w-full bg-primary-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 hover:shadow-primary-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                  >
                    {isSaving ? '정보 저장 중...' : '명함 정보 저장하기'}
                    <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
                  </button>
                </div>

                {/* 6. Business Card Upload - landscape, separate card */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <IdentificationIcon className="w-4 h-4 text-primary-500" />
                    실제 명함 업로드
                  </h4>
                  <div className="relative group max-w-lg">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'card')} className="hidden" id="card-card-upload" />
                    <label htmlFor="card-card-upload" className="block aspect-[9/5] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 transition-all cursor-pointer overflow-hidden relative shadow-sm">
                      {planner?.business_card_url ? (
                        <img src={planner.business_card_url} alt="Card" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6">
                          <IdentificationIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
                          <p className="text-sm font-bold text-gray-400">실제 명함 이미지를 업로드하세요</p>
                          <p className="text-xs text-gray-300 mt-1">가로 형태의 명함 이미지를 권장합니다</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm rounded-2xl">
                        이미지 변경
                      </div>
                    </label>
                  </div>
                </div>

                {/* Card URL Section */}
                <div className="bg-primary-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-600 rounded-full opacity-20 blur-2xl"></div>
                  <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                    내 명함 주소 (랜딩 페이지)
                  </h4>
                  <p className="text-xs text-primary-200 mb-6 italic opacity-80">고객들에게 공유할 설계사님만의 고유 페이지입니다.</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 font-mono text-xs truncate">
                        stroy.kr/p/{planner?.id}/card
                      </div>
                      <button
                        onClick={() => planner?.id && handleCopyUrl(planner.id)}
                        className={`shrink-0 p-3 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-xs ${
                          urlCopied ? 'bg-green-500 text-white border-green-400' : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {urlCopied ? (
                          <>
                            <CheckIcon className="w-4 h-4" />
                            복사됨
                          </>
                         ) : (
                          <>
                            <ShareIcon className="w-4 h-4" />
                            주소 복사
                          </>
                        )}
                      </button>
                    </div>
                    <Link 
                      href={`/p/${planner?.id}/card`} 
                      target="_blank"
                      className="w-full bg-white text-primary-900 py-3 rounded-xl font-black text-sm text-center hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                    >
                      <GlobeAltIcon className="w-4 h-4" />
                      공개 페이지 확인하기
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">기본 정보 관리</h3>
                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">이름</label>
                      <input type="text" value={editName} readOnly className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-gray-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">연락처</label>
                      <input type="text" value={editPhone} readOnly className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-gray-500 outline-none" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">※ 이름과 연락처는 계정 정보 보호를 위해 명함 만들기 탭에서 수정하실 수 있습니다.</p>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'kakaotalk' && <KakaoTalkPanel />}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900">고객 정보 등록</h3>
                  </div>
                  <form onSubmit={addCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">고객명</label>
                      <input
                        type="text"
                        required
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="이름"
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">전화번호</label>
                      <input
                        type="tel"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">주소</label>
                      <input
                        type="text"
                        value={newCustAddr}
                        onChange={(e) => setNewCustAddr(e.target.value)}
                        placeholder="주소"
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">생년월일</label>
                      <input
                        type="date"
                        value={newCustBirth}
                        onChange={(e) => setNewCustBirth(e.target.value)}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">가족 수</label>
                      <input
                        type="number"
                        min="1"
                        value={newCustFamily}
                        onChange={(e) => setNewCustFamily(e.target.value)}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">특약 사항 (콤마로 구분)</label>
                      <input
                        type="text"
                        value={newCustRiders}
                        onChange={(e) => setNewCustRiders(e.target.value)}
                        placeholder="암, 뇌혈관..."
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white p-4 rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      등록
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">내 고객 리스트</h3>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{customers.length}명</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left">
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">고객 정보</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">연락처/주소</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">상령일 (D-Day)</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">약속</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">주요 특약</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">터치 / 관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {customers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                              등록된 고객 정보가 없습니다.
                            </td>
                          </tr>
                        ) : (
                          customers.map(c => (
                            <Fragment key={c.id}>
                              <tr className="hover:bg-gray-50/50 transition-colors group">
                              {editingId === c.id ? (
                                <>
                                  <td className="px-4 py-3">
                                    <div className="space-y-2">
                                      <input value={editCustName} onChange={e => setEditCustName(e.target.value)} placeholder="이름" className="w-full px-3 py-2 border rounded-xl" />
                                      <input type="date" value={editCustBirth} onChange={e => setEditCustBirth(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-2">
                                      <input value={editCustPhone} onChange={e => setEditCustPhone(e.target.value)} placeholder="전화번호" className="w-full px-3 py-2 border rounded-xl" />
                                      <input value={editCustAddr} onChange={e => setEditCustAddr(e.target.value)} placeholder="주소" className="w-full px-3 py-2 border rounded-xl" />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <input type="number" min="1" value={editCustFamily} onChange={e => setEditCustFamily(e.target.value)} className="w-full px-2 py-2 border rounded-xl text-center" />
                                    <span className="text-[10px] block mt-1 text-gray-400">가족 수</span>
                                  </td>
                                  <td className="px-4 py-3"><input type="date" value={editCustAppt} onChange={e => setEditCustAppt(e.target.value)} className="w-full px-3 py-2 border rounded-xl" /></td>
                                  <td className="px-4 py-3"><input value={editCustRiders} onChange={e => setEditCustRiders(e.target.value)} placeholder="특약 사항" className="w-full px-3 py-2 border rounded-xl" /></td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button onClick={saveEdit} className="text-primary-600 font-bold hover:underline">저장</button>
                                      <button onClick={() => setEditingId(null)} className="text-gray-400 font-bold hover:underline">취소</button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-8 py-5 whitespace-nowrap">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold text-gray-900">{c.name}</span>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                        <span>생일: {safeFormat(c.birth_date, 'yy.MM.dd')}</span>
                                        <span className="w-px h-2 bg-gray-200" />
                                        <span className="font-bold">가족: {c.family_count}명</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 whitespace-nowrap">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-mono tracking-tighter text-gray-600">{c.phone || '-'}</span>
                                      <span className="text-[11px] text-gray-400 truncate max-w-[180px]">{c.address || '-'}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 text-center whitespace-nowrap">
                                    {(() => {
                                      const dDay = getInsuranceAge(c.birth_date);
                                      return (
                                        <div className="flex flex-col items-center justify-center">
                                          {dDay ? (
                                            <span className={`text-[11px] font-black tracking-tight ${
                                              dDay.includes('-') && parseInt(dDay.split('-')[1]) <= 30 
                                                ? 'text-rose-500 animate-pulse' 
                                                : dDay === 'D-Day' ? 'text-rose-600 font-bold' : 'text-primary-600'
                                            }`}>
                                              {dDay}
                                            </span>
                                          ) : (
                                            <span className="text-gray-300">-</span>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </td>
                                  <td className="px-8 py-5 font-bold text-primary-600 whitespace-nowrap">
                                    {safeFormat(c.appointment_at, 'MM-DD')}
                                  </td>
                                  <td className="px-8 py-5 text-gray-500 font-medium text-xs whitespace-nowrap">
                                    <div className="max-w-[150px] truncate">
                                      {(c.riders || []).join(', ') || '-'}
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-6">
                                      <div className="flex flex-col items-end gap-1 group">
                                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100 group-hover:border-primary-200 transition-colors">
                                          <button 
                                            onClick={() => decrementTouch(c.id, c.touch_count)}
                                            className="p-1 hover:text-primary-600 text-gray-400 transition-colors"
                                          >
                                            <MinusIcon className="w-3.5 h-3.5" />
                                          </button>
                                          <span className="px-2 text-xs font-black text-primary-600 min-w-[2rem] text-center">
                                            {c.touch_count}회
                                          </span>
                                          <button 
                                            onClick={() => incrementTouch(c.id, c.touch_count)}
                                            className="p-1 hover:text-primary-600 text-gray-400 transition-colors"
                                          >
                                            <PlusIcon className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        {c.last_touch_at && (
                                          <span className="text-[9px] font-bold text-gray-300 group-hover:text-primary-400 transition-colors">
                                            {safeFormat(c.last_touch_at, 'MM.dd')} 터치함
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                                        <button 
                                          onClick={() => toggleMemo(c)}
                                          className={`${expandedMemoId === c.id ? 'text-primary-600' : 'text-gray-400'} hover:text-primary-600 transition-colors`}
                                          title="메모 작성"
                                        >
                                          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                          onClick={() => shareCard(c.name, c.phone)}
                                          className="text-gray-400 hover:text-primary-600 transition-colors"
                                          title="명함 메시지 복사"
                                        >
                                          <ShareIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => startEditing(c)} className="text-gray-400 hover:text-primary-600 transition-colors">
                                          <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteCustomer(c.id)} className="text-gray-400 hover:text-rose-500 transition-colors">
                                          <TrashIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                            {expandedMemoId === c.id && (
                              <tr className="bg-primary-50/30">
                                <td colSpan={6} className="px-8 py-4">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-primary-600 uppercase tracking-widest">고객 메모 ({c.name})</span>
                                      <button 
                                        onClick={() => setExpandedMemoId(null)}
                                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                                      >
                                        닫기
                                      </button>
                                    </div>
                                    <textarea
                                      value={memoValue}
                                      onChange={(e) => setMemoValue(e.target.value)}
                                      placeholder="이 고객에 대한 메모를 입력하세요 (예: 가족관계, 관심 상품, 상담 특이사항 등)"
                                      className="w-full h-24 p-4 text-sm border-0 focus:ring-2 focus:ring-primary-500 rounded-2xl bg-white shadow-sm resize-none"
                                    />
                                    <div className="flex justify-end">
                                      <button 
                                        onClick={() => saveMemo(c.id)}
                                        className="px-6 py-2 bg-primary-600 text-white text-xs font-black rounded-xl shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all"
                                      >
                                        메모 저장하기
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Calendar */}
            {activeTab === 'calendar' && (
              <div className="space-y-8">
                {/* Calendar View — 2 months */}
                <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-gray-100">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">일정 관리</h3>
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl">
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <span className="font-bold text-sm md:text-base min-w-[180px] text-center">
                        {format(currentMonth, 'yyyy년 MM월')} – {format(addMonths(currentMonth, 1), 'MM월')}
                      </span>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* 2 calendars side by side */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {[currentMonth, addMonths(currentMonth, 1)].map((monthRef, monthIdx) => {
                      const monthStart = startOfMonth(monthRef)
                      const monthEnd = endOfMonth(monthStart)
                      const startDate = startOfWeek(monthStart)
                      const endDate = endOfWeek(monthEnd)
                      const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

                      const MONTH_PASTELS = [
                        // 인접 달(N, N+1)이 보색이 되도록 따뜻↔차가운 교차 배열
                        'bg-rose-100',     // 1월 (빨강)
                        'bg-sky-100',      // 2월 (파랑 — 빨강 보색)
                        'bg-amber-100',    // 3월 (주황/노랑)
                        'bg-violet-100',   // 4월 (보라 — 노랑 보색)
                        'bg-lime-100',     // 5월 (연두)
                        'bg-pink-100',     // 6월 (핑크 — 녹색 보색)
                        'bg-cyan-100',     // 7월 (청록)
                        'bg-orange-100',   // 8월 (주황 — 청록 보색)
                        'bg-emerald-100',  // 9월 (초록)
                        'bg-purple-100',   // 10월 (자주 — 초록 보색)
                        'bg-yellow-100',   // 11월 (노랑)
                        'bg-blue-100',     // 12월 (파랑 — 노랑 보색)
                      ]

                      const getStripeMonth = (day: Date): number => {
                        for (let offset = -1; offset <= 1; offset++) {
                          const m = addMonths(monthStart, offset)
                          const mStart = startOfMonth(m)
                          const week2Start = startOfWeek(addDays(mStart, 7))
                          const nextWeek2Start = startOfWeek(addDays(startOfMonth(addMonths(m, 1)), 7))
                          if (day >= week2Start && day < nextWeek2Start) return m.getMonth()
                        }
                        return day.getMonth()
                      }

                      return (
                        <div key={monthIdx}>
                          <p className="text-sm font-black text-gray-500 mb-2 text-center">{format(monthStart, 'yyyy년 MM월')}</p>
                          <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-xl overflow-hidden">
                            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                              <div key={day} className={`px-1 py-2 bg-gray-50/50 border-r border-b border-gray-100 text-center text-[10px] font-bold uppercase tracking-widest ${idx === 0 ? 'text-rose-400' : 'text-gray-400'}`}>
                                {day}
                              </div>
                            ))}
                            {calendarDays.map((day, i) => {
                              const dayCustomers = customers.filter(c => {
                                if (!c.appointment_at) return false
                                const d = new Date(c.appointment_at)
                                return !isNaN(d.getTime()) && isSameDay(d, day)
                              })
                              const dayTodos = todos.filter(t => {
                                const d = new Date(t.target_date)
                                return !isNaN(d.getTime()) && isSameDay(d, day)
                              })
                              const isOutside = !isSameMonth(day, monthStart)
                              const isSelected = isSameDay(day, new Date(todoDate))
                              const isToday = isSameDay(day, new Date())
                              const stripeColor = MONTH_PASTELS[getStripeMonth(day)]
                              const holidayName = HOLIDAYS[format(day, 'yyyy-MM-dd')]
                              const isSunday = getDay(day) === 0
                              const isRedDay = !!holidayName || isSunday

                              return (
                                <div
                                  key={i}
                                  className={`min-h-[72px] md:min-h-[90px] p-1 border-r border-b border-gray-100 transition-all cursor-pointer relative ${
                                    isOutside ? 'opacity-30' :
                                    isSelected ? 'ring-1 ring-inset ring-primary-300 z-10' : ''
                                  } ${isOutside ? 'bg-gray-50/30' : stripeColor}`}
                                  onClick={() => {
                                    setTodoDate(format(day, 'yyyy-MM-dd'))
                                    todoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                  }}
                                >
                                  <div className="flex flex-col items-center">
                                    <span className={`text-[10px] font-bold flex items-center justify-center w-5 h-5 rounded-full ${
                                      isToday ? 'bg-primary-600 text-white' :
                                      isSelected ? 'bg-primary-100 text-primary-700' :
                                      isRedDay ? 'text-rose-500' : 'text-gray-500'
                                    }`}>
                                      {format(day, 'd')}
                                    </span>
                                    {holidayName && (
                                      <span className="text-[8px] font-black text-rose-400 mt-0.5 whitespace-nowrap">
                                        {holidayName}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-1 border-t border-gray-100/50" />
                                  <div className="mt-1 space-y-0.5">
                                    {dayCustomers.map(cust => (
                                      <div key={cust.id} className="bg-primary-50 text-primary-700 px-1 py-0.5 rounded text-[9px] font-bold truncate border border-primary-100" title={cust.name}>
                                        👤 <span className="hidden md:inline">{cust.name}</span>
                                      </div>
                                    ))}
                                    {dayTodos.map(todo => (
                                      <div key={todo.id} className={`${todo.is_completed ? 'bg-white/80 text-gray-400 line-through' : 'bg-white/90 text-amber-700'} px-1 py-0.5 rounded text-[9px] font-black truncate border ${todo.is_completed ? 'border-gray-100' : 'border-amber-100'}`} title={todo.content}>
                                        📝 <span className="hidden md:inline">{todo.content}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Todo List Content */}
                <div ref={todoSectionRef} className="bg-white rounded-[2rem] shadow-xl p-4 md:p-8 border border-gray-100">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                       To-do List
                      <span className="text-xs font-bold text-primary-500 bg-primary-50 px-2 py-1 rounded-lg">
                        {format(new Date(todoDate), 'MM.dd')}
                      </span>
                    </h3>

                    {/* Add Todo Input */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">날짜 선택</label>
                        <input 
                          type="date" 
                          value={todoDate}
                          onChange={(e) => setTodoDate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">새로운 할 일</label>
                        <div className="flex flex-col md:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="할 일을 입력하세요..."
                            value={newTodoContent}
                            onChange={(e) => setNewTodoContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                          />
                          <button 
                            onClick={addTodo}
                            className="w-full md:w-auto px-6 py-4 md:py-0 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-500 transition-all group font-black text-sm whitespace-nowrap"
                          >
                            추가하기
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Todo Items */}
                    <div className="space-y-4">
                      {todos.filter(t => isSameDay(new Date(t.target_date), new Date(todoDate))).length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-gray-50 rounded-[2rem]">
                          <p className="text-gray-300 font-bold text-sm italic">등록된 할 일이 없습니다.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {todos.filter(t => isSameDay(new Date(t.target_date), new Date(todoDate))).map(todo => (
                              <div 
                                key={todo.id} 
                                className={`flex items-center gap-3 p-4 rounded-3xl border transition-all group ${
                                  todo.is_completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:shadow-md hover:border-primary-100'
                                }`}
                              >
                                <button 
                                  onClick={() => toggleTodo(todo.id, todo.is_completed)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                    todo.is_completed ? 'bg-green-500 text-white shadow-green-100' : 'bg-gray-100 text-transparent hover:bg-gray-200'
                                  } shadow-lg`}
                                >
                                  <span className="text-[10px] font-black">✓</span>
                                </button>
                                
                                {editingTodoId === todo.id ? (
                                  <div className="flex-1 flex gap-2">
                                    <input 
                                      type="text"
                                      value={editTodoContent}
                                      onChange={(e) => setEditTodoContent(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && saveTodoEdit(todo.id)}
                                      className="flex-1 px-3 py-1 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                      autoFocus
                                    />
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={() => saveTodoEdit(todo.id)}
                                        className="p-1 text-primary-600 hover:text-primary-700 font-black text-xs"
                                      >
                                        저장
                                      </button>
                                      <button 
                                        onClick={cancelEditingTodo}
                                        className="p-1 text-gray-400 hover:text-gray-600 font-black text-xs"
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <span className={`flex-1 text-sm font-bold transition-all ${
                                      todo.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'
                                    }`}>
                                      {todo.content}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                      <button 
                                        onClick={() => startEditingTodo(todo)}
                                        className="p-1 text-gray-300 hover:text-primary-500 transition-all"
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => deleteTodo(todo.id)}
                                        className="p-1 text-gray-300 hover:text-rose-500 transition-all"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Subscription */}
            {activeTab === 'subscription' && (
              <SubscriptionTab planner={planner} />
            )}

            {/* Tab: 상담 알림 / 현황 (통합) */}
            {activeTab === 'notification' && (
              <div className="space-y-6">
                {/* Push Notification Toggle */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">브라우저 푸시 알림</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-6 ml-[52px]">
                    상담 신청이 들어오면 브라우저 알림으로 실시간 알려드립니다.
                  </p>

                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">푸시 알림 {pushEnabled ? '활성화됨 ✅' : '비활성화됨'}</p>
                      <p className="text-xs text-gray-500 mt-1">{pushEnabled ? '이 브라우저에서 알림을 받고 있습니다.' : '알림을 켜면 상담 접수 시 바로 알림을 받을 수 있습니다.'}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!planner) return
                        setPushLoading(true)
                        try {
                          if (pushEnabled) {
                            const registration = await navigator.serviceWorker.ready
                            const subscription = await registration.pushManager.getSubscription()
                            if (subscription) {
                              await fetch('/api/push-subscribe', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ endpoint: subscription.endpoint })
                              })
                              await subscription.unsubscribe()
                            }
                            setPushEnabled(false)
                          } else {
                            const permission = await Notification.requestPermission()
                            if (permission !== 'granted') {
                              alert('알림 권한을 허용해주세요. 브라우저 설정에서 이 사이트의 알림을 허용해주세요.')
                              setPushLoading(false)
                              return
                            }
                            const registration = await navigator.serviceWorker.ready
                            const subscription = await registration.pushManager.subscribe({
                              userVisibleOnly: true,
                              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                            })
                            await fetch('/api/push-subscribe', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                planner_id: planner.id,
                                subscription: subscription.toJSON()
                              })
                            })
                            setPushEnabled(true)
                          }
                        } catch (err) {
                          console.error('Push toggle error:', err)
                          alert('푸시 알림 설정 중 오류가 발생했습니다.')
                        }
                        setPushLoading(false)
                      }}
                      disabled={pushLoading}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap disabled:opacity-50 ${
                        pushEnabled
                          ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                          : 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700'
                      }`}
                    >
                      {pushLoading ? '처리 중...' : pushEnabled ? '알림 끄기' : '🔔 알림 켜기'}
                    </button>
                  </div>
                </div>

                {/* Full Consultation List */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-xl">실시간 상담 신청 현황</h3>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{leads.length}건 접수</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left">
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">이름</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">연락처</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">신청 시각</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">명함 전송</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {leads.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                              아직 접수된 상담 신청이 없습니다.
                            </td>
                          </tr>
                        ) : (
                          leads.map(l => {
                            const isNew = lastSeenAt ? new Date(l.created_at) > new Date(lastSeenAt) : false
                            return (
                              <tr key={l.id} className={`transition-colors ${isNew ? 'bg-primary-50/50' : 'hover:bg-gray-50/50'}`}>
                                <td className="px-8 py-5 font-bold text-gray-900">
                                  <div className="flex items-center gap-2">
                                    {isNew && <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shrink-0" />}
                                    {l.name}
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-gray-600 font-mono tracking-tight">{l.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                                <td className="px-8 py-5 text-gray-400 text-sm">{new Date(l.created_at).toLocaleString()}</td>
                                <td className="px-8 py-5 text-right">
                                  <button 
                                    onClick={() => shareCard(l.name, l.phone)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg font-bold text-xs hover:bg-primary-100 transition-colors"
                                    title="명함 메시지 복사"
                                  >
                                    <ShareIcon className="w-4 h-4" />
                                    전송
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            {/* Tab: 사용 가이드 */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl">📖</div>
                    <h3 className="text-2xl font-black text-gray-900">보험다이어트 사용 가이드</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-8 ml-[52px]">
                    디지털 명함부터 상담 관리까지, 보험다이어트 플랫폼 활용법을 안내합니다.
                  </p>

                  <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">1</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">내 프로필 관리</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          <strong>내 프로필 관리</strong> 메뉴에서 이름, 소속, 지역, 연락처, 카카오톡 오픈채팅 주소를 입력해주세요.
                          여기에 입력한 정보가 디지털 명함에 표시됩니다.
                        </p>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-medium">
                          💡 카카오톡 오픈채팅방을 만든 후 주소를 넣으면, 고객이 명함에서 바로 카톡 상담을 요청할 수 있습니다.
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">2</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">디지털 명함 만들기</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          <strong>명함 만들기</strong> 메뉴에서 프로필 사진과 명함 이미지를 업로드하세요.
                          업로드 후 나만의 디지털 명함 URL이 생성됩니다.
                        </p>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 font-medium">
                          📱 명함 URL을 카카오톡, 문자, SNS 등에 공유하면 고객이 내 명함을 확인할 수 있습니다.
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">3</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">명함 공유 & 상담 접수</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          고객이 명함에서 <strong>무료 상담 신청</strong>을 하면, 자동으로 <strong>상담 알림 / 현황</strong>에 접수됩니다.
                          접수된 고객의 이름과 전화번호를 확인하고 바로 연락하세요.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">4</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">🔔 브라우저 푸시 알림 설정</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          <strong>상담 알림 / 현황</strong> 메뉴에서 <strong>알림 켜기</strong> 버튼을 클릭하면,
                          상담 신청이 들어올 때 브라우저에서 실시간 알림을 받을 수 있습니다.
                        </p>
                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-800 font-medium">
                          ✅ 알림을 켜면 브라우저를 닫아도 새 상담이 접수될 때 바로 알림이 뜹니다!
                        </div>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">5</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">고객 관리</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          <strong>내 고객 직접 등록</strong> 메뉴에서 기존 고객 정보를 직접 입력하고 관리할 수 있습니다.
                          고객명, 전화번호, 메모를 입력하면 고객 목록이 만들어집니다.
                        </p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">6</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">일정 관리 (달력)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          달력에서 날짜를 선택하고 할 일을 추가해보세요.
                          상담 일정, 미팅, 계약 예정 등을 효율적으로 관리할 수 있습니다.
                        </p>
                      </div>
                    </div>

                    {/* Step 7 */}
                    <div className="flex gap-5">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0">7</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg mb-2">보험 도구 활용</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          디지털 명함에는 고객이 직접 사용할 수 있는 보험 도구가 포함되어 있습니다:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2"><span className="text-primary-600 font-bold mt-0.5">•</span>보험료 계산기 — 암/뇌/심장 예상 보험료 산출</li>
                          <li className="flex items-start gap-2"><span className="text-primary-600 font-bold mt-0.5">•</span>실비 계산기 — 실손보험 환급 금액 시뮬레이션</li>
                          <li className="flex items-start gap-2"><span className="text-primary-600 font-bold mt-0.5">•</span>5세대 실손 가이드 — 5세대 실손보험 전환 안내</li>
                          <li className="flex items-start gap-2"><span className="text-primary-600 font-bold mt-0.5">•</span>질병코드 검색 — 산정특례/중증질환 질병코드 조회</li>
                          <li className="flex items-start gap-2"><span className="text-primary-600 font-bold mt-0.5">•</span>암 치료비 가이드 — 암 종류별 실제 치료비 정보</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-[2rem] shadow-xl p-8 text-white">
                  <h4 className="font-black text-lg mb-4">💡 활용 팁</h4>
                  <div className="space-y-3 text-sm font-medium text-white/90">
                    <p>• 명함 URL을 카카오톡 프로필에 링크로 걸어두세요.</p>
                    <p>• 고객 상담 후 <strong>내 고객 직접 등록</strong>에서 고객 정보를 기록해두세요.</p>
                    <p>• 달력에 팔로업 일정을 등록하면 고객 관리가 쉬워집니다.</p>
                    <p>• 상담 신청이 들어오면 30분 이내에 연락하세요 — 계약 확률이 높아집니다!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Referrals */}
            {activeTab === 'referrals' && (
              <div className="space-y-6">
                {/* Referral Link & Code Card */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                        <GiftIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">내 친구추천 링크 공유하기</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-6">
                      내 추천 링크로 신규 설계사가 가입하거나, 일반 고객이 무료 상담을 신청하면 포인트가 적립됩니다!
                    </p>
                    
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4">
                      <div className="flex-1 font-mono text-sm tracking-tight text-gray-700 font-bold truncate">
                        https://stroy.kr/?ref={planner?.referral_code || 'CODE'}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://stroy.kr/?ref=${planner?.referral_code || ''}`);
                          alert('추천 링크가 복사되었습니다!');
                        }}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-sm rounded-xl shadow-md transition-all whitespace-nowrap"
                      >
                        링크 복사
                      </button>
                    </div>
                  </div>
                  
                  {/* Summary Box */}
                  <div className="w-full md:w-64 bg-rose-50 border border-rose-100 rounded-[2rem] p-6 text-center shadow-inner shrink-0">
                    <p className="text-[10px] font-black tracking-widest uppercase text-rose-400 mb-2">총 누적/적립 포인트</p>
                    <p className="text-3xl font-black text-rose-600">
                      {referrals.filter(r => r.status === 'APPROVED' || r.status === 'PAID').reduce((acc, curr) => acc + curr.reward_amount, 0).toLocaleString()} <span className="text-lg">P</span>
                    </p>
                    <p className="text-xs font-semibold text-rose-400 mt-2 bg-white/50 py-1 px-3 rounded-full inline-block">
                      총 {referrals.length}건 추천완료
                    </p>
                  </div>
                </div>

                {/* Referral History List */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-xl">나의 추천 이력</h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">최근 순</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">신청일</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">추천 대상 (이름/연락처)</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">유형</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">적립 P</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {referrals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-medium">
                              아직 추천 이력이 없습니다.
                            </td>
                          </tr>
                        ) : (
                          referrals.map((ref) => (
                            <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5 text-gray-400 font-medium font-mono text-xs">
                                {new Date(ref.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-5">
                                <span className="font-bold text-gray-900 mr-2">{ref.referee_name}</span>
                                <span className="text-xs text-gray-400">{ref.referee_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</span>
                              </td>
                              <td className="px-8 py-5">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                  ref.referee_type === 'SIGNUP' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {ref.referee_type === 'SIGNUP' ? '플래너 가입' : '무료 상담'}
                                </span>
                              </td>
                              <td className="px-8 py-5 font-black text-rose-500">
                                {ref.reward_amount > 0 ? `+${ref.reward_amount.toLocaleString()}` : '-'}
                              </td>
                              <td className="px-8 py-5 text-right">
                                {ref.status === 'PENDING' && <span className="text-amber-500 font-bold text-xs bg-amber-50 px-3 py-1 rounded-full">심사중</span>}
                                {ref.status === 'APPROVED' && <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">적립대기</span>}
                                {ref.status === 'PAID' && <span className="text-primary-600 font-black text-xs bg-primary-50 px-3 py-1 rounded-full">지급완료</span>}
                                {ref.status === 'REJECTED' && <span className="text-gray-400 font-bold text-xs bg-gray-100 px-3 py-1 rounded-full">반려됨</span>}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Chat Inbox ─── */}
            {activeTab === 'chat' && (
              <ChatInboxPanel plannerId={planner?.id || null} plannerName={planner?.name || '상담사'} />
            )}

            {/* ─── Free Board ─── */}
            {/* Tab: 보상청구 관리 */}
            {activeTab === 'claims' && (
              <div className="space-y-6">
                {/* Submit New Claim (Detailed) */}
                <DetailedClaimForm onSuccess={() => window.location.reload()} />

                {/* Claims List */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900">보상청구 접수 내역 <span className="text-primary-600">{claims.length}</span></h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1" />접수 대기</span>
                      <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 mr-1" />송신 완료</span>
                      <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1" />지급 완료</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {claims.map((claim) => (
                      <div key={claim.id} className="p-8 hover:bg-gray-50/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-gray-900 text-lg">{claim.customer_name}</span>
                              {claim.customer_phone && (
                                <a href={`tel:${claim.customer_phone}`} className="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-lg hover:bg-primary-100 transition-colors">
                                  {claim.customer_phone}
                                </a>
                              )}
                              <span className="text-xs font-bold text-gray-400">{new Date(claim.created_at).toLocaleDateString()}</span>
                              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                claim.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                claim.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                'bg-emerald-50 text-emerald-600'
                              }`}>
                                {claim.status === 'PENDING' ? '접수 대기' : claim.status === 'IN_PROGRESS' ? '처리 중' : '지급 완료'}
                              </span>
                              {claim.transmission_status === 'SENT' ? (
                                <span className="px-3 py-1 text-[10px] font-black rounded-full bg-teal-50 text-teal-600">📤 보험사 송신완료</span>
                              ) : (
                                <span className="px-3 py-1 text-[10px] font-black rounded-full bg-gray-50 text-gray-400">송신 전</span>
                              )}
                            </div>
                            {claim.insurance_company && (
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block" />
                                <span className="text-sm font-black text-primary-700">{claim.insurance_company}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">{claim.description}</p>
                            
                            {/* Images Viewer */}
                            {claim.image_urls && claim.image_urls.length > 0 && (
                              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 border-dashed overflow-x-auto pb-2">
                                {claim.image_urls.map((url, idx) => (
                                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 group relative rounded-lg overflow-hidden border border-gray-200 h-20 w-20">
                                    <img src={url} alt="첨부 사진" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">확대</span>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-2 pt-2 md:pt-0 shrink-0">
                            {/* Send to insurance button */}
                            {claim.insurance_company && claim.transmission_status !== 'SENT' && (
                              <button
                                onClick={() => transmitClaim(claim.id)}
                                disabled={transmittingClaimId === claim.id}
                                className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-xs font-black transition-colors w-full md:w-auto text-center flex items-center gap-1.5 justify-center shadow-sm disabled:opacity-50"
                              >
                                <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                {transmittingClaimId === claim.id ? '송신 중...' : `${claim.insurance_company}으로 송신`}
                              </button>
                            )}
                            {claim.status === 'IN_PROGRESS' && (
                              <button onClick={() => updateClaimStatus(claim.id, 'COMPLETED')} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-black transition-colors w-full md:w-auto text-center">
                                지급 완료로
                              </button>
                            )}
                            <button onClick={() => deleteClaim(claim.id)} className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors w-full md:w-auto text-center border border-rose-100 md:border-transparent">
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {claims.length === 0 && (
                      <div className="p-16 text-center">
                        <DocumentCheckIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">등록된 보상청구 내역이 없습니다.</p>
                        <p className="text-xs text-gray-300 mt-1">고객이 보상청구 페이지에서 등록하거나, 위의 양식으로 직접 접수해주세요.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'freeboard' && (
              <BoardPage 
                boardType="free" 
                boardTitle="자유 게시판" 
                boardDesc="보험, 재테크, 일상 이야기 등 자유롭게 공유하세요." 
                accentColor="bg-primary-600" 
                accentBubble="bg-primary-500"
                isDashboard={true}
              />
            )}

          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-3 py-3 flex items-center justify-between z-50 transition-all">
        <button
          onClick={() => handleTabChange('calendar')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'calendar' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <CalendarIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">일정</span>
        </button>

        <button
          onClick={() => handleTabChange('customers')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'customers' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <UsersIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">고객</span>
        </button>

        <button
          onClick={() => handleTabChange('claims')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'claims' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <DocumentCheckIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">보상청구</span>
        </button>

        <button
          onClick={() => handleTabChange('freeboard')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'freeboard' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            {hasNewBoardPost && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-[10px] font-black">게시판</span>
        </button>

        <button
          onClick={() => handleTabChange('card')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'card' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <IdentificationIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">명함</span>
        </button>

        <button
          onClick={() => handleTabChange('referrals')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'referrals' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <GiftIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">리워드</span>
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'profile' ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <UserCircleIcon className="w-6 h-6" />
          <span className="text-[10px] font-black">설정</span>
        </button>
      </nav>

      {/* ── Profile Completion Modal (Social Login Users) ── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-50">
                <IdentificationIcon className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">프로필 정보를 완성해 주세요!</h2>
              <p className="text-gray-500 font-medium">
                디지털 명함 생성과 서비스 이용을 위해<br/>
                추가 정보 입력이 필요합니다.
              </p>
            </div>

            <form onSubmit={handleCompleteProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">휴대폰 번호 <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={compPhone}
                  onChange={(e) => setCompPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold placeholder:font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">소속 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={compAffiliation}
                    onChange={(e) => setCompAffiliation(e.target.value)}
                    placeholder="삼성생명 등"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">지역</label>
                  <input
                    type="text"
                    value={compRegion}
                    onChange={(e) => setCompRegion(e.target.value)}
                    placeholder="서울 강남구 등"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={compSaving}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {compSaving ? '저장 중...' : '프로필 완성하고 대시보드 가기'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-xs text-gray-400 font-medium">
              ※ 입력하신 정보는 디지털 명함과 상담 신청 알림 등에 사용됩니다.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
