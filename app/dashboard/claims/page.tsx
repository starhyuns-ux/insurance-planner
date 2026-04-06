'use client'

import React, { useState, useEffect } from 'react'
import ClaimCenter from '../components/ClaimCenter'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function ClaimsPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [claims, setClaims] = useState<any[]>([])

  const fetchClaims = async () => {
    if (!planner) return
    const { data } = await supabase
      .from('claims')
      .select('*')
      .eq('planner_id', planner.id)
      .order('created_at', { ascending: false })
    if (data) setClaims(data)
  }

  useEffect(() => {
    if (planner) fetchClaims()
  }, [planner])

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <ClaimCenter 
        claims={claims}
        plannerId={planner?.id}
        transmittingClaimId={null}
        onDeleteClaim={async (id) => {
          if (!confirm('삭제하시겠습니까?')) return
          const { error } = await supabase.from('claims').delete().eq('id', id)
          if (!error) {
            toast.success('삭제되었습니다.')
            fetchClaims()
          }
        }}
        onUpdateClaimStatus={async (id, status) => {
          const { error } = await supabase.from('claims').update({ status }).eq('id', id)
          if (!error) {
            toast.success('상태가 업데이트되었습니다.')
            fetchClaims()
          }
        }}
        onTransmitClaim={async (id) => {
          toast.info('데이터 전송을 시작합니다...')
          try {
            const res = await fetch('/api/claims/transmit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ claimId: id }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            toast.success('송신이 완료되었습니다.')
            fetchClaims()
          } catch (err: any) {
            toast.error('송신 오류: ' + err.message)
          }
        }}
      />
    </div>
  )
}
