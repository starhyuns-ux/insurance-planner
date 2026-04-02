'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'

interface ChatInboxPanelProps {
  plannerId: string | null
  plannerName: string
}

export default function ChatInboxPanel({ plannerId, plannerName }: ChatInboxPanelProps) {
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
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages', 
        filter: `session_id=eq.${selectedSession.id}` 
      }, p => {
        setMessages(prev => [...prev, p.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [selectedSession?.id])

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages])

  const fetchSessions = async () => {
    const { data } = await supabase.from('chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
    if (data) setSessions(data)
  }

  const fetchMessages = async (sid: string) => {
    const { data } = await supabase.from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at')
    if (data) setMessages(data)
  }

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyInput.trim() || !selectedSession) return
    setSending(true)
    try {
      await supabase.from('chat_messages').insert({ 
        session_id: selectedSession.id, 
        sender_type: 'planner', 
        content: replyInput.trim() 
      })
      await supabase.from('chat_sessions').update({ 
        last_message_at: new Date().toISOString() 
      }).eq('id', selectedSession.id)
      setReplyInput('')
    } catch (err) {
      console.error('Chat send error:', err)
    } finally {
      setSending(false)
      fetchSessions()
    }
  }

  const safeDate = (str: string) => { 
    try { 
      return format(new Date(str), 'M/d HH:mm') 
    } catch { 
      return '' 
    } 
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex" style={{ height: '72vh', minHeight: '550px' }}>
      {/* Session List */}
      <div className="w-80 shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h4 className="font-black text-gray-900 text-sm italic uppercase tracking-widest">Chat Inbox</h4>
          <span className="text-[10px] font-black bg-primary-600 text-white px-2.5 py-0.5 rounded-full shadow-lg shadow-primary-200">{sessions.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 text-xs px-8 text-center italic gap-3">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">💬</div>
               대기 중인 상담이 없습니다.
            </div>
          ) : sessions.map(s => (
            <button 
              key={s.id} 
              onClick={() => setSelectedSession(s)}
              className={`w-full text-left px-6 py-4 border-b border-gray-50 transition-all group ${
                selectedSession?.id === s.id ? 'bg-white shadow-md z-10 border-l-4 border-l-primary-500' : 'hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-black text-sm text-gray-900 truncate">{s.visitor_name}</p>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{safeDate(s.last_message_at || s.created_at)}</p>
              </div>
              {s.visitor_phone && <p className="text-[11px] text-gray-400 font-bold mb-1">{s.visitor_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</p>}
              <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 bg-primary-500 rounded-full" />
                Active Session
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!selectedSession ? (
          <div className="flex-1 flex items-center justify-center text-gray-300 flex-col gap-4">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center shadow-inner opacity-50">
              <span className="text-5xl">📨</span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Select a session to start chatting</p>
          </div>
        ) : (
          <>
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-primary-200">
                  {selectedSession.visitor_name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-lg text-gray-900 tracking-tight">{selectedSession.visitor_name}</p>
                  <p className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Online · Customer
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><span className="text-lg">📞</span></button>
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><span className="text-lg">⚙️</span></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
              <div className="flex justify-center mb-8">
                 <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-gray-300 border border-gray-100 uppercase tracking-widest shadow-sm">Security Encrypted Chat</span>
              </div>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'planner' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  {msg.sender_type === 'visitor' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center text-xs font-black text-gray-500 mr-3 shrink-0 mt-1 shadow-sm">{selectedSession.visitor_name.charAt(0)}</div>
                  )}
                  <div className="max-w-[70%] group">
                    <div className={`rounded-3xl px-5 py-3.5 text-sm font-medium whitespace-pre-wrap break-words leading-relaxed shadow-sm ${
                      msg.sender_type === 'planner' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] font-black text-gray-300 mt-2 tracking-tighter ${msg.sender_type === 'planner' ? 'text-right' : 'text-left'}`}>
                      {safeDate(msg.created_at)} {msg.sender_type === 'planner' && '· Read'}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={sendReply} className="p-6 border-t border-gray-100 bg-white flex gap-4 items-end">
              <div className="flex-1 bg-gray-50 rounded-[2rem] p-2 flex items-end border border-transparent focus-within:border-primary-200 transition-all shadow-inner">
                <textarea 
                  value={replyInput} 
                  onChange={e => setReplyInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(e as any) } }}
                  rows={2} 
                  placeholder={`${plannerName} 님, 답변을 입력하세요...`}
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm font-bold focus:ring-0 resize-none outline-none text-gray-700" 
                />
              </div>
              <button 
                type="submit" 
                disabled={sending || !replyInput.trim()}
                className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-100 hover:bg-primary-700 disabled:opacity-40 transition-all active:scale-90 shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 -rotate-45"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
