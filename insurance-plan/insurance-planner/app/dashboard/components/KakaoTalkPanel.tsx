'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

export default function KakaoTalkPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [isSdkReady, setIsSdkReady] = useState(false)

  // Use dynamic require for client-side only Kakao SDK utility
  const { initKakao, loginWithKakao, fetchKakaoFriends, sendKakaoDefault, getKakaoToken } = require('@/lib/kakao-client')

  useEffect(() => {
    let checkInterval: any;
    
    const initialize = async () => {
      try {
        checkInterval = setInterval(() => {
          if (typeof window !== 'undefined' && (window as any).Kakao) {
            const Kakao = (window as any).Kakao
            if (!Kakao.isInitialized()) {
              initKakao()
            }
            
            if (Kakao.isInitialized()) {
              console.log('Kakao SDK is ready and initialized')
              setIsSdkReady(true)
              clearInterval(checkInterval)
              
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
        <h3 className="text-2xl font-black text-gray-900 mb-2">카카오톡 서비스와 연동</h3>
        <p className="text-gray-500 mb-8 max-w-sm">
          내 카카오톡 계정을 연동하여 고객(친구)들에게<br/>다양한 보험 안내 메시지를 직접 보낼 수 있습니다.
        </p>
        <button
          onClick={handleLogin}
          className="bg-[#FEE500] text-[#3C1E1E] px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#FADA0A] transition-all flex items-center gap-3 shadow-xl shadow-yellow-100"
        >
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" className="w-6 h-6" />
          카카오 로그인으로 연동하기
        </button>
        <p className="mt-6 text-[10px] text-gray-300 font-medium">※ 친구 목록 조회 및 메시지 전송 권한 동의가 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row" style={{ height: '72vh', minHeight: '600px' }}>
      {/* Friend List Side */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h4 className="font-black text-gray-900 text-sm">카카오톡 친구 ({friends.length})</h4>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {loadingFriends ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs animate-pulse italic">목록 로딩 중...</div>
          ) : friends.length === 0 ? (
            <div className="p-8 text-center text-gray-300 text-xs font-bold mt-10">친구가 없거나 권한이 없습니다.</div>
          ) : friends.map(f => (
            <button
              key={f.uuid}
              onClick={() => toggleFriend(f.uuid)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                selectedFriends.includes(f.uuid) ? 'bg-primary-50 border border-primary-100 shadow-sm' : 'hover:bg-white border border-transparent hover:shadow-sm'
              }`}
            >
              <div className="relative">
                <img src={f.profile_thumbnail_image || 'https://via.placeholder.com/40'} alt={f.profile_nickname} className="w-10 h-10 rounded-xl object-cover" />
                {selectedFriends.includes(f.uuid) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <CheckIcon className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-black text-gray-900 truncate">{f.profile_nickname}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kakao Friend</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Compose Area */}
      <div className="flex-1 flex flex-col p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Compose New Message</h4>
             <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Default Template</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="고객님께 전달할 따뜻한 안부 인사를 작성해 보세요..."
            className="w-full p-6 bg-gray-50 border border-transparent rounded-[2rem] text-sm font-black focus:bg-white focus:border-primary-500 transition-all outline-none resize-none shadow-inner leading-relaxed"
          />
        </div>

        <div className="flex-1 flex flex-col justify-end gap-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-200 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Recipient Summary</p>
              <span className="text-sm font-black text-gray-700">총 <span className="text-primary-600 text-lg">{selectedFriends.length}</span> 명의 선택된 친구</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
               <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-primary-500" />
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={sending || selectedFriends.length === 0 || !message.trim()}
            className="w-full bg-primary-600 text-white py-6 rounded-[1.5rem] font-black text-lg hover:bg-primary-700 disabled:opacity-40 shadow-2xl shadow-primary-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            {sending ? 'Sending...' : '메시지 발송하기'}
            <PaperAirplaneIcon className="w-6 h-6 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
