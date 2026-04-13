'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

type Message = {
  id: string
  session_id: string
  sender_type: 'visitor' | 'planner'
  content: string
  created_at: string
}

const SESSION_KEY = 'chat_session_id'

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'intro' | 'chat'>('intro')
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const [isPlanner, setIsPlanner] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Restore session from localStorage or Auth
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) {
      setSessionId(saved)
      setStep('chat')
    } else {
      checkAuthAndAutoStart()
    }
  }, [])

  const checkAuthAndAutoStart = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Logged in planner
        const { data: planner } = await supabase
          .from('planners')
          .select('name, phone')
          .eq('id', session.user.id)
          .single()

        if (planner) {
          setIsPlanner(true)
          setVisitorName(planner.name)
          setVisitorPhone(planner.phone)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Auto-start chat for logged-in planners when they open the widget
  useEffect(() => {
    if (open && isPlanner && !sessionId && visitorName) {
      startChat({ preventDefault: () => {} } as React.FormEvent)
    }
  }, [open, isPlanner, sessionId, visitorName])

  // Subscribe to realtime messages
  useEffect(() => {
    if (!sessionId) return
    fetchMessages()
    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, payload => {
        const msg = payload.new as Message
        setMessages(prev => [...prev, msg])
        if (!open && msg.sender_type === 'planner') setUnread(u => u + 1)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  }, [open, messages])

  const fetchMessages = async () => {
    if (!sessionId) return
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at')
    if (data) setMessages(data)
  }

  const startChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorName.trim()) return

    // Get default planner (first active planner)
    const { data: planners } = await supabase.from('planners').select('id').eq('subscription_status', 'active').limit(1)
    const plannerId = planners?.[0]?.id || null

    const { data: session, error } = await supabase.from('chat_sessions').insert({
      visitor_name: isPlanner ? `[설계사] ${visitorName.trim()}` : visitorName.trim(),
      visitor_phone: visitorPhone.trim(),
      planner_id: plannerId,
      last_message_at: new Date().toISOString(),
    }).select('id').single()

    if (session && !error) {
      localStorage.setItem(SESSION_KEY, session.id)
      setSessionId(session.id)
      setStep('chat')
      // Send greeting message from visitor
      await supabase.from('chat_messages').insert({
        session_id: session.id,
        sender_type: 'visitor',
        content: `안녕하세요! 저는 ${visitorName}입니다. 보험 상담 문의드립니다.`,
      })
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId) return
    setSending(true)
    await supabase.from('chat_messages').insert({ session_id: sessionId, sender_type: 'visitor', content: input.trim() })
    await supabase.from('chat_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', sessionId)
    setInput('')
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as any) }
  }

  const safeDate = (str: string) => {
    try { return format(new Date(str), 'HH:mm', { locale: ko }) } catch { return '' }
  }

  // Hide widget on dashboard or admin/login routes
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-32 lg:bottom-28 right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="상담 채팅"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">{unread}</span>
        )}
      </button>
 
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-48 lg:bottom-44 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-primary-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <p className="font-black text-sm">보험 상담 채팅</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80">빠른 답변 드립니다</span>
                </div>
              </div>
            </div>
          </div>

          {/* INTRO step */}
          {step === 'intro' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-black text-gray-900 mb-1">무엇이 궁금하신가요?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">이름을 알려주시면 바로 상담을 시작합니다.</p>
              <form onSubmit={startChat} className="w-full space-y-3">
                <input
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  placeholder="이름 (필수)"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <input
                  value={visitorPhone}
                  onChange={e => setVisitorPhone(e.target.value)}
                  placeholder="연락처 (선택)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button type="submit" className="w-full bg-primary-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-primary-700 transition-colors">
                  상담 시작하기 →
                </button>
              </form>
            </div>
          )}

          {/* CHAT step */}
          {step === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                {messages.length === 0 && (
                  <div className="text-center text-xs text-gray-400 mt-4">상담사가 곧 답변 드립니다 💬</div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender_type === 'planner' && (
                      <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black text-xs mr-2 shrink-0 mt-1">상</div>
                    )}
                    <div className={`max-w-[80%]`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words ${
                        msg.sender_type === 'visitor'
                          ? 'bg-primary-600 text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                      }`}>{msg.content}</div>
                      <p className={`text-[10px] text-gray-300 mt-0.5 ${msg.sender_type === 'visitor' ? 'text-right' : 'text-left ml-1'}`}>{safeDate(msg.created_at)}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="메시지 입력... (Enter 전송)"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                />
                <button type="submit" disabled={sending || !input.trim()}
                  className="px-3 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-40 transition-colors shrink-0">
                  전송
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
