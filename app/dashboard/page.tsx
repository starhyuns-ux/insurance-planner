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
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import BoardPage from '@/components/BoardPage'
import DetailedClaimForm from '@/components/DetailedClaimForm'

// New Modular Components
import Overview from './components/Overview'
import LeadPipeline from './components/LeadPipeline'
import CustomerCRM from './components/CustomerCRM'
import ClaimCenter from './components/ClaimCenter'
import CardSettings from './components/CardSettings'
import CalendarManager from './components/CalendarManager'
import KakaoTalkPanel from './components/KakaoTalkPanel'
import SubscriptionTab from './components/SubscriptionTab'
import ChatInboxPanel from './components/ChatInboxPanel'
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
  visit_count?: number
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

// Modular components are imported at the top.


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'leads' | 'customers' | 'calendar' | 'subscription' | 'card' | 'notification' | 'guide' | 'chat' | 'freeboard' | 'referrals' | 'claims' | 'kakaotalk' | 'disclosure'>('calendar')
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
  const [visitStats, setVisitStats] = useState<any[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const fetchVisitStats = async () => {
    try {
      const res = await fetch('/api/site-visit/stats')
      if (res.ok) {
        const { data } = await res.json()
        setVisitStats(data || [])
        const total = (data || []).reduce((acc: number, cur: any) => acc + cur.visit_count, 0)
        setTotalVisits(total)
      }
    } catch (err) {
      console.error('Error fetching visit stats:', err)
    }
  }

  useEffect(() => {
    checkUser()
    checkFreeBoardNewPost()
    fetchVisitStats()

    // Auto-refresh data when bringing the app to the foreground (switching from PC to mobile)
    const handleFocusOrVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUser()
      }
    }

    document.addEventListener('visibilitychange', handleFocusOrVisibilityChange)
    window.addEventListener('focus', handleFocusOrVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleFocusOrVisibilityChange)
      window.removeEventListener('focus', handleFocusOrVisibilityChange)
    }
  }, [])

  // Real-time Subscriptions
  useEffect(() => {
    if (!planner?.id) return

    const todoChannel = supabase.channel(`todos_${planner.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos', filter: `planner_id=eq.${planner.id}` }, () => {
        fetchTodos(planner.id)
      })
      .subscribe()

    const claimChannel = supabase.channel(`claims_${planner.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'claims', filter: `planner_id=eq.${planner.id}` }, () => {
        checkUser() // Also refreshes claims
      })
      .subscribe()

    const consultationChannel = supabase.channel(`consultations_${planner.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations', filter: `planner_id=eq.${planner.id}` }, () => {
        checkUser() // Refreshes leads
      })
      .subscribe()

    return () => {
      supabase.removeChannel(todoChannel)
      supabase.removeChannel(claimChannel)
      supabase.removeChannel(consultationChannel)
    }
  }, [planner?.id])

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
    setIsMobileMenuOpen(false)
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
      setPlanner(profile)
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

  const togglePush = async () => {
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
    const url = `https://stroy.kr/p/${id}/card?source=copy`
    navigator.clipboard.writeText(url)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
  }

  const shareCard = async (targetName: string, targetPhone?: string) => {
    if (!planner) return

    const cardUrl = `https://stroy.kr/p/${planner.id}/card?source=share`
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
          
          {/* Mobile Overlay Background */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar (Slide-over on Mobile / Static on Desktop) */}
          <aside className={`
            fixed inset-y-0 left-0 z-[70] w-72 bg-gray-50 overflow-y-auto shadow-2xl pb-24 transition-transform duration-300 transform 
            lg:translate-x-0 lg:static lg:block lg:pb-0 lg:w-72 lg:shrink-0 lg:p-0 lg:bg-transparent lg:shadow-none lg:h-auto lg:z-auto space-y-3
            ${isMobileMenuOpen ? 'translate-x-0 pt-6 px-6' : '-translate-x-full lg:px-0 lg:pt-0'}
          `}>
            
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between lg:hidden mb-6 px-1">
              <h2 className="text-2xl font-black text-gray-900">플래너 메뉴</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 bg-white rounded-full shadow-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>


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

            {/* ── 업무 지원 ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="w-1 h-4 rounded-full bg-rose-500 inline-block" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">업무 지원</span>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => setActiveTab('disclosure')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === 'disclosure' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4 shrink-0" />
                  상품공시실 (약관)
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
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* ── Dashboard Views ── */}
                {activeTab === 'calendar' && (
                  <>
                    <Overview 
                      leads={leads}
                      customers={customers}
                      planner={planner}
                      totalVisits={totalVisits}
                      visitStats={visitStats}
                      getInsuranceAge={getInsuranceAge}
                    />
                    <CalendarManager 
                      currentMonth={currentMonth}
                      todoDate={todoDate}
                      todos={todos}
                      customers={customers}
                      newTodoContent={newTodoContent}
                      editingTodoId={editingTodoId}
                      editTodoContent={editTodoContent}
                      holidays={HOLIDAYS}
                      onUpdateState={(key, value) => {
                        if (key === 'currentMonth') setCurrentMonth(value)
                        if (key === 'todoDate') setTodoDate(value)
                        if (key === 'newTodoContent') setNewTodoContent(value)
                        if (key === 'editTodoContent') setEditTodoContent(value)
                        if (key === 'editingTodoId') setEditingTodoId(value)
                      }}
                      onAddTodo={addTodo}
                      onToggleTodo={toggleTodo}
                      onDeleteTodo={deleteTodo}
                      onStartEditingTodo={startEditingTodo}
                      onSaveTodoEdit={saveTodoEdit}
                      onCancelEditingTodo={cancelEditingTodo}
                      todoSectionRef={todoSectionRef}
                    />
                  </>
                )}

                {activeTab === 'card' && (
                  <CardSettings 
                    planner={planner}
                    editName={editName}
                    editAffiliation={editAffiliation}
                    editRegion={editRegion}
                    editPhone={editPhone}
                    editMessage={editMessage}
                    editKakaoUrl={editKakaoUrl}
                    isSaving={isSaving}
                    urlCopied={urlCopied}
                    onUpdateState={(key, value) => {
                      if (key === 'editName') setEditName(value)
                      if (key === 'editAffiliation') setEditAffiliation(value)
                      if (key === 'editRegion') setEditRegion(value)
                      if (key === 'editPhone') setEditPhone(value)
                      if (key === 'editMessage') setEditMessage(value)
                      if (key === 'editKakaoUrl') setEditKakaoUrl(value)
                    }}
                    onUpdateProfile={updateProfile}
                    onFileUpload={handleFileUpload}
                    onCopyUrl={handleCopyUrl}
                    onUpdate={checkUser}
                  />
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
                  <CustomerCRM 
                    customers={customers}
                    newCustName={newCustName}
                    newCustPhone={newCustPhone}
                    newCustAddr={newCustAddr}
                    newCustBirth={newCustBirth}
                    newCustFamily={newCustFamily}
                    newCustRiders={newCustRiders}
                    editingId={editingId}
                    expandedMemoId={expandedMemoId}
                    memoValue={memoValue}
                    editCustName={editCustName}
                    editCustPhone={editCustPhone}
                    editCustAddr={editCustAddr}
                    editCustBirth={editCustBirth}
                    editCustFamily={editCustFamily}
                    editCustRiders={editCustRiders}
                    editCustAppt={editCustAppt}
                    onUpdateState={(key, value) => {
                      if (key === 'newCustName') setNewCustName(value)
                      if (key === 'newCustPhone') setNewCustPhone(value)
                      if (key === 'newCustAddr') setNewCustAddr(value)
                      if (key === 'newCustBirth') setNewCustBirth(value)
                      if (key === 'newCustFamily') setNewCustFamily(value)
                      if (key === 'newCustRiders') setNewCustRiders(value)
                      if (key === 'editingId') setEditingId(value)
                      if (key === 'expandedMemoId') setExpandedMemoId(value)
                      if (key === 'memoValue') setMemoValue(value)
                      if (key === 'editCustName') setEditCustName(value)
                      if (key === 'editCustPhone') setEditCustPhone(value)
                      if (key === 'editCustAddr') setEditCustAddr(value)
                      if (key === 'editCustBirth') setEditCustBirth(value)
                      if (key === 'editCustFamily') setEditCustFamily(value)
                      if (key === 'editCustRiders') setEditCustRiders(value)
                      if (key === 'editCustAppt') setEditCustAppt(value)
                    }}
                    onAddCustomer={addCustomer}
                    onIncrementTouch={incrementTouch}
                    onDecrementTouch={decrementTouch}
                    onToggleMemo={toggleMemo}
                    onSaveMemo={saveMemo}
                    onStartEditing={startEditing}
                    onSaveEdit={saveEdit}
                    onDeleteCustomer={deleteCustomer}
                    onShareCard={shareCard}
                    getInsuranceAge={getInsuranceAge}
                    safeFormat={safeFormat}
                    onUpdate={checkUser}
                  />
                )}
            {/* Tab: Disclosure (상품공시실) */}
            {activeTab === 'disclosure' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">상품공시실 (약관 보기)</h3>
                      <p className="text-sm font-bold text-gray-500">각 보험사의 상품공시실로 이동하여 쉽게 전체 상품의 상세 약관을 확인하실 수 있습니다.</p>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {/* 생명보험 */}
                    <div>
                      <h4 className="text-lg font-black text-rose-600 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
                        생명보험
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          { name: '교보생명', url: 'https://www.kyobo.com/dgt/web/product-official/all-product/search' },
                          { name: '동양생명', url: 'https://pbano.myangel.co.kr/paging/WE_AC_WEPAAP020100L' },
                          { name: '라이나생명', url: 'https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales?key=0' },
                          { name: '메트라이프생명', url: 'https://brand.metlife.co.kr/pn/paReal/insuProductDisclMain.do' },
                          { name: '미래에셋생명', url: 'https://life.miraeasset.com/micro/disclosure/product/PC-HO-080301-000000.do' },
                          { name: '삼성생명', url: 'https://www.samsunglife.com/individual/products/disclosure/main/PDO-PRPRC010100M' },
                          { name: '신한라이프', url: 'https://www.shinhanlife.co.kr/hp/cdhi0030.do' },
                          { name: '하나생명', url: 'https://hanalife.co.kr/anm/product/allProduct.do?status=on' },
                          { name: '한화생명', url: 'https://www.hanwhalife.com/main/disclosure/goods/disclosurenotice/DF_GDDN000_P10000.do?MENU_ID1=DF_GDGL000' },
                          { name: '흥국생명', url: 'https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y' },
                          { name: '푸본현대생명', url: 'https://www.fubonhyundai.com/#CUSI150102010101' },
                          { name: '처브생명', url: 'https://www.chubblife.co.kr/front/official/sale/list.do' },
                          { name: 'ABL생명', url: 'https://www.abllife.co.kr/st/pban/prdtPban/whlPrdt/whlPrdt1/whlPrdt11?page=index' },
                          { name: 'BNP파리바카디프생명', url: 'https://www.cardif.co.kr/disclosure/papag101.do' },
                          { name: 'DB생명', url: 'https://www.idblife.com/notice/product/sale' },
                          { name: 'IBK연금보험', url: 'https://www.ibki.co.kr/process/HP_PBANO_PDT_SP_INDV' },
                          { name: 'iM생명', url: 'https://www.imlifeins.co.kr/BA/BA_A020.do' },
                          { name: 'KB라이프', url: 'https://www.kblife.co.kr/customer-common/productList.do' },
                          { name: '농협생명', url: 'https://www.nhlife.co.kr/ho/on/HOON0004M00.nhl' },
                          { name: 'KDB생명', url: 'https://www.kdblife.co.kr/ajax.do?scrId=HDLMA002M02P' }
                        ].map((item, idx) => (
                          <a 
                            key={idx} 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm rounded-2xl transition-all group"
                          >
                            <span className="font-bold text-gray-700 group-hover:text-rose-700 text-sm whitespace-nowrap">{item.name}</span>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* 손해보험 */}
                    <div>
                      <h4 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                        손해보험
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          { name: '라이나손보', url: 'https://www.chubb.com/kr-kr/disclosure/product.html' },
                          { name: '롯데손보', url: 'https://www.lotteins.co.kr/web/C/D/H/cdh190.jsp' },
                          { name: '메리츠화재', url: 'https://www.meritzfire.com/disclosure/product-announcement/product-list.do#!/' },
                          { name: '삼성화재', url: 'https://www.samsungfire.com/vh/page/VH.HPIF0103.do' },
                          { name: '한화손보', url: 'https://www.hwgeneralins.com/notice/ir/product-ing01.do' },
                          { name: '하나손보', url: 'https://www.hanainsure.co.kr/w/disclosure/product/saleProduct' },
                          { name: '현대해상', url: 'https://www.hi.co.kr/serviceAction.do?view=bin/PA/03/HHPA03010M' },
                          { name: '흥국화재', url: 'https://www.heungkukfire.co.kr/FRW/announce/insGoodsGongsiSale.do' },
                          { name: 'AIG손보', url: 'https://www.aig.co.kr/wo/dpwot001.html?menuId=MS702' },
                          { name: 'DB손보', url: 'https://www.idbins.com/FWMAIV1534.do' },
                          { name: 'KB손보', url: 'https://www.kbinsure.co.kr/CG802030001.ec' },
                          { name: 'NH손보', url: 'https://www.nhfire.co.kr/announce/productAnnounce/retrieveInsuranceProductsAnnounce.nhfire' }
                        ].map((item, idx) => (
                          <a 
                            key={idx} 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm rounded-2xl transition-all group"
                          >
                            <span className="font-bold text-gray-700 group-hover:text-blue-700 text-sm whitespace-nowrap">{item.name}</span>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notification' && (
              <LeadPipeline 
                leads={leads} 
                planner={planner} 
                pushEnabled={pushEnabled}
                pushLoading={pushLoading}
                lastSeenAt={lastSeenAt} 
                onShareCard={shareCard}
                onTogglePush={togglePush}
                onUpdate={checkUser}
              />
            )}

            {activeTab === 'subscription' && (
              <SubscriptionTab planner={planner} />
            )}

            {activeTab === 'chat' && (
              <ChatInboxPanel plannerId={planner?.id || null} plannerName={planner?.name || '상담사'} />
            )}

            {activeTab === 'claims' && (
              <ClaimCenter 
                claims={claims}
                transmittingClaimId={transmittingClaimId}
                onTransmitClaim={transmitClaim}
                onUpdateClaimStatus={updateClaimStatus}
                onDeleteClaim={deleteClaim}
              />
            )}


            {/* Tab: 사용 가이드 */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl">📖</div>
                    <h3 className="text-2xl font-black text-gray-900">인슈닷 사용 가이드</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-8 ml-[52px]">
                    디지털 명함부터 상담 관리까지, 인슈닷 플랫폼 활용법을 안내합니다.
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
                <DetailedClaimForm onSuccess={() => {
                  // Realtime sync will handle the list update
                  // Just show a success state/toast inside the form
                }} />

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

          </motion.div>
        </AnimatePresence>
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
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-1 transition-all ${
            isMobileMenuOpen ? 'text-primary-600 scale-110' : 'text-gray-400'
          }`}
        >
          <Bars3Icon className="w-6 h-6" />
          <span className="text-[10px] font-black">전체 메뉴</span>
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
