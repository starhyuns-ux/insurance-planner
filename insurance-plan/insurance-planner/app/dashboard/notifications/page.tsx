'use client'

import React, { useState, useEffect } from 'react'
import LeadPipeline from '../components/LeadPipeline'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [leads, setLeads] = useState<any[]>([])
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null)

  const fetchLeads = async () => {
    if (!planner) return
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: false })
    if (data) setLeads(data)
  }

  useEffect(() => {
    if (planner) {
      fetchLeads()
      const seen = localStorage.getItem('notif_last_seen')
      setLastSeenAt(seen)
      localStorage.setItem('notif_last_seen', new Date().toISOString())
    }
  }, [planner])

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.pushManager.getSubscription().then(sub => setPushEnabled(!!sub))
      }).catch(() => {})
    }
  }, [])

  const urlB64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const handleTogglePush = async () => {
    if (!planner) return
    setPushLoading(true)
    try {
      if (pushEnabled) {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await fetch('/api/push-subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint })
          })
          await sub.unsubscribe()
        }
        setPushEnabled(false)
      } else {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          toast.error('알림 권한을 허용해주세요.')
          return
        }
        
        // VAPID Public Key는 공개키이므로 브라우저 쪽에 하드코딩 되어도 안전합니다.
        // Vercel 환경변수 누락 시 오류를 방지하기 위해 환경변수가 없으면 기본 공개키를 사용합니다.
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BPx5pVaLAyV0IEQLgPjxub8oez-fD-BplWFKQm1mu9olcTEM43uc_XeyBA4oiFrSKOShnwsatqtLxsat0UQC3gY'

        if (!publicKey) {
          toast.error('오류: 푸시 알림 서버 키가 유효하지 않습니다.')
          return
        }

        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(publicKey)
        })
        await fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planner_id: planner.id, subscription: sub.toJSON() })
        })
        setPushEnabled(true)
      }
    } catch (err: any) {
      toast.error('푸시 알림 설정 오류: ' + err.message)
    } finally {
      setPushLoading(false)
    }
  }

  const handleShareCard = (name: string, phone: string) => {
    if (!planner) return
    const msg = `안녕하세요 ${name}님, ${planner.name} 설계사입니다.\n명함을 공유드립니다: https://stroy.kr/p/${planner.id}/card`
    navigator.clipboard.writeText(msg)
    toast.success('메시지가 복사되었습니다.')
  }

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <LeadPipeline
        leads={leads}
        planner={planner}
        pushEnabled={pushEnabled}
        pushLoading={pushLoading}
        lastSeenAt={lastSeenAt}
        onShareCard={handleShareCard}
        onTogglePush={handleTogglePush}
        onUpdate={fetchLeads}
      />
    </div>
  )
}
