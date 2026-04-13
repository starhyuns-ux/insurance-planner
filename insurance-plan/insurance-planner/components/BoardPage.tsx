'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

type Post = {
  id: string
  content: string
  author_name: string
  author_affiliation: string
  planner_id: string | null
  board_type: string
  created_at: string
  like_count: number
}

type Comment = {
  id: string
  post_id: string
  author_name: string
  author_affiliation: string
  planner_id: string | null
  content: string
  created_at: string
}

type PlannerInfo = {
  id: string
  name: string
  affiliation: string
}

const LIKES_KEY = (boardType: string) => `board_likes_${boardType}`

interface BoardPageProps {
  boardType: 'qna' | 'free'
  boardTitle: string
  boardDesc: string
  accentColor: string
  accentBubble: string
  isDashboard?: boolean
}

export default function BoardPage({ boardType, boardTitle, boardDesc, accentColor, accentBubble, isDashboard = false }: BoardPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [planner, setPlanner] = useState<PlannerInfo | null>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { initPage() }, [boardType])
  useEffect(() => {
    // Load liked post IDs from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem(LIKES_KEY(boardType)) || '[]')
      setLikedIds(new Set(saved))
    } catch { }
  }, [boardType])
  useEffect(() => { if (selectedPost) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [comments])

  const initPage = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('planners').select('id, name, affiliation').eq('id', user.id).single()
      if (profile) setPlanner(profile)
    }
    await fetchPosts()
    setLoading(false)
  }

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('board_posts')
      .select('*')
      .eq('board_type', boardType)
      .order('created_at', { ascending: true })
    if (data) setPosts(data as Post[])
  }

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from('board_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const openPost = async (post: Post) => {
    setSelectedPost(post)
    await fetchComments(post.id)
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) { alert('로그인이 필요합니다.'); return }
    if (!content.trim()) return
    setSubmitting(true)
    const { error } = await supabase.from('board_posts').insert({
      board_type: boardType,
      title: content.trim().slice(0, 50),
      content: content.trim(),
      author_name: planner.name,
      author_affiliation: planner.affiliation || '',
      author_password: '',
      planner_id: planner.id,
      view_count: 0,
      like_count: 0,
    })
    setSubmitting(false)
    if (!error) {
      setContent('')
      fetchPosts()
    } else {
      alert('게시글 등록 실패: ' + error.message)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) { alert('로그인이 필요합니다.'); return }
    if (!commentContent.trim()) return
    setCommentSubmitting(true)
    const { error } = await supabase.from('board_comments').insert({
      post_id: selectedPost!.id,
      author_name: planner.name,
      author_affiliation: planner.affiliation || '',
      planner_id: planner.id,
      content: commentContent.trim(),
    })
    setCommentSubmitting(false)
    if (!error) {
      setCommentContent('')
      fetchComments(selectedPost!.id)
    } else {
      alert('댓글 등록 실패: ' + error.message)
    }
  }

  const handleLike = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation()
    if (likedIds.has(post.id)) return // already liked

    const newCount = (post.like_count || 0) + 1
    const { error } = await supabase.from('board_posts').update({ like_count: newCount }).eq('id', post.id)
    if (!error) {
      const newLiked = new Set(likedIds)
      newLiked.add(post.id)
      setLikedIds(newLiked)
      localStorage.setItem(LIKES_KEY(boardType), JSON.stringify([...newLiked]))
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, like_count: newCount } : p))
    }
  }

  const handleDelete = async (postId: string, postPlannerId: string | null) => {
    if (!planner || planner.id !== postPlannerId) { alert('본인 글만 삭제 가능합니다.'); return }
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('board_posts').delete().eq('id', postId)
    setSelectedPost(null)
    fetchPosts()
  }

  const safeDate = (str: string) => {
    try { return format(new Date(str), 'M/d HH:mm', { locale: ko }) } catch { return '' }
  }

  const isMe = (p: Post | Comment) => planner?.id === p.planner_id

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, submit: (ev: React.FormEvent) => void) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(e as any) }
  }

  // Top 3 most liked posts
  const topPosts = [...posts].sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 3).filter(p => (p.like_count || 0) > 0)

  return (
    <main className={`min-h-screen flex flex-col ${isDashboard ? 'bg-transparent' : 'bg-gray-50'}`}>
      {!isDashboard && <NavBar />}
      <div className="flex-1 flex flex-col container max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          {!isDashboard && (
            <div className="flex items-center gap-2 mb-3">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← 대시보드</Link>
              <span className="text-gray-300">/</span>
              {selectedPost ? (
                <button onClick={() => setSelectedPost(null)} className="text-sm text-gray-400 hover:text-gray-600">{boardTitle}</button>
              ) : (
                <span className="text-sm font-bold text-gray-700">{boardTitle}</span>
              )}
              {selectedPost && <><span className="text-gray-300">/</span><span className="text-sm font-bold text-gray-700">댓글</span></>}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{boardTitle}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{boardDesc}</p>
            </div>
            {planner && !selectedPost && (
              <div className="flex items-center gap-2 bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-3 py-1 text-xs">
                <span className="font-black">{planner.name}</span>
                {planner.affiliation && <span className="text-primary-400">{planner.affiliation}</span>}
              </div>
            )}
          </div>
        </div>

        {/* ── FEED VIEW ── */}
        {!selectedPost && (
          <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* 🔥 Top 3 Liked Posts */}
            {topPosts.length > 0 && (
              <div className="border-b border-gray-100 bg-amber-50/60 px-4 py-3">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  🔥 인기 게시글 TOP {topPosts.length}
                </p>
                <div className="space-y-1.5">
                  {topPosts.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => openPost(p)}
                      className="w-full text-left flex items-center gap-2 group"
                    >
                      <span className={`text-xs font-black w-5 shrink-0 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                        #{i + 1}
                      </span>
                      <span className="text-xs text-gray-700 truncate flex-1 group-hover:text-primary-600 transition-colors">
                        {p.content.split('\n')[0].slice(0, 40)}
                      </span>
                      <span className="text-xs text-rose-400 font-bold shrink-0 flex items-center gap-0.5">
                        ❤️ {p.like_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[55vh]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">로딩 중...</div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <p className="text-gray-300 text-3xl">💬</p>
                  <p className="text-gray-400 text-sm font-medium">첫 메시지를 남겨보세요!</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className={`flex ${isMe(post) ? 'justify-end' : 'justify-start'} gap-2`}>
                    {!isMe(post) && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0 mt-1">
                        {post.author_name.charAt(0)}
                      </div>
                    )}
                    <div className={`max-w-[75%] group`}>
                      {!isMe(post) && (
                        <p className="text-xs text-gray-400 font-semibold mb-1 ml-1">
                          {post.author_name}{post.author_affiliation && <span className="text-gray-300 ml-1">{post.author_affiliation}</span>}
                        </p>
                      )}
                      <button
                        onClick={() => openPost(post)}
                        className={`text-left rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words w-full ${
                          isMe(post)
                            ? `${accentBubble} text-white rounded-tr-sm`
                            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        } hover:opacity-90 transition-opacity`}
                      >
                        {post.content}
                      </button>
                      {/* Action row */}
                      <div className={`flex items-center gap-2 mt-1 ${isMe(post) ? 'justify-end' : 'justify-start'}`}>
                        {/* Heart button */}
                        <button
                          onClick={(e) => handleLike(post, e)}
                          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all ${
                            likedIds.has(post.id)
                              ? 'text-rose-500 bg-rose-50'
                              : 'text-gray-300 hover:text-rose-400 hover:bg-rose-50'
                          }`}
                        >
                          <span>{likedIds.has(post.id) ? '❤️' : '🤍'}</span>
                          {(post.like_count || 0) > 0 && <span className="text-rose-400">{post.like_count}</span>}
                        </button>
                        <span className="text-[10px] text-gray-300">{safeDate(post.created_at)}</span>
                        {isMe(post) && (
                          <button onClick={() => handleDelete(post.id, post.planner_id)} className="text-[10px] text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">삭제</button>
                        )}
                        <button onClick={() => openPost(post)} className="text-[10px] text-gray-300 hover:text-primary-400">댓글</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {planner ? (
              <form onSubmit={handlePost} className="border-t border-gray-100 p-3 flex gap-2 items-end bg-gray-50/50">
                <textarea
                  ref={inputRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, handlePost)}
                  rows={2}
                  placeholder="메시지를 입력하세요... (Ctrl+Enter로 전송)"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-white"
                />
                <button type="submit" disabled={submitting || !content.trim()}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white ${accentColor} hover:opacity-90 disabled:opacity-40 transition-all shrink-0`}>
                  전송
                </button>
              </form>
            ) : (
              <div className="border-t border-gray-100 p-4 text-center text-sm text-gray-400 bg-gray-50/50">
                <Link href="/login" className="text-primary-600 font-bold hover:underline">로그인</Link> 후 참여할 수 있습니다.
              </div>
            )}
          </div>
        )}

        {/* ── DETAIL / COMMENT VIEW ── */}
        {selectedPost && (
          <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Original post */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-black text-primary-600 shrink-0">
                  {selectedPost.author_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-600 mb-1">
                    {selectedPost.author_name}
                    {selectedPost.author_affiliation && <span className="font-normal text-gray-400 ml-1">{selectedPost.author_affiliation}</span>}
                    <span className="font-normal text-gray-300 ml-2">{safeDate(selectedPost.created_at)}</span>
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedPost.content}</p>
                  {/* Like on detail */}
                  <button
                    onClick={(e) => handleLike(selectedPost, e)}
                    className={`mt-2 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                      likedIds.has(selectedPost.id)
                        ? 'text-rose-500 bg-rose-50 border border-rose-100'
                        : 'text-gray-400 border border-gray-200 hover:text-rose-400 hover:border-rose-200'
                    }`}
                  >
                    <span>{likedIds.has(selectedPost.id) ? '❤️' : '🤍'}</span>
                    <span>{(posts.find(p => p.id === selectedPost.id)?.like_count || selectedPost.like_count || 0)}개</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[50vh]">
              {comments.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-300 text-sm">아직 댓글이 없습니다.</div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className={`flex ${isMe(c) ? 'justify-end' : 'justify-start'} gap-2`}>
                    {!isMe(c) && (
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0 mt-1">{c.author_name.charAt(0)}</div>
                    )}
                    <div className={`max-w-[75%]`}>
                      {!isMe(c) && <p className="text-[10px] text-gray-400 font-semibold mb-0.5 ml-1">{c.author_name}</p>}
                      <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                        isMe(c) ? `${accentBubble} text-white rounded-tr-sm` : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      }`}>{c.content}</div>
                      <p className={`text-[10px] text-gray-300 mt-0.5 ${isMe(c) ? 'text-right' : 'text-left ml-1'}`}>{safeDate(c.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Comment input */}
            {planner ? (
              <form onSubmit={handleCommentSubmit} className="border-t border-gray-100 p-3 flex gap-2 items-end bg-gray-50/50">
                <textarea
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, handleCommentSubmit)}
                  rows={2}
                  placeholder="댓글 입력... (Ctrl+Enter 전송)"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-white"
                />
                <button type="submit" disabled={commentSubmitting || !commentContent.trim()}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white ${accentColor} hover:opacity-90 disabled:opacity-40 shrink-0`}>
                  전송
                </button>
              </form>
            ) : (
              <div className="border-t border-gray-100 p-3 text-center text-sm text-gray-400 bg-gray-50/50">
                <Link href="/login" className="text-primary-600 font-bold">로그인</Link> 후 댓글 가능
              </div>
            )}
          </div>
        )}
      </div>
      {!isDashboard && <Footer />}
    </main>
  )
}
