'use client'

import React, { useState, useEffect } from 'react'
import ClaimCenter from '../components/ClaimCenter'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function ClaimsPage() {
  const { planner, loading: plannerLoading } = usePlanner()
  const [claims, setClaims] = useState<any[]>([])
  const [transmittingClaimId, setTransmittingClaimId] = useState<string | null>(null)
  const [checkingStatusId, setCheckingStatusId] = useState<string | null>(null)

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
        transmittingClaimId={transmittingClaimId}
        checkingStatusId={checkingStatusId}
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
        onTransmitClaim={async (id, overrideFax) => {
          setTransmittingClaimId(id)
          toast.info('데이터 전송을 시작합니다...')
          try {
            const res = await fetch('/api/claims/transmit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ claimId: id, overrideFax }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            toast.success('송신이 완료되었습니다.')
            fetchClaims()
          } catch (err: any) {
            toast.error('송신 오류: ' + err.message)
          } finally {
            setTransmittingClaimId(null)
          }
        }}
        onCheckStatus={async (id, getPreview) => {
          setCheckingStatusId(id)
          
          let previewWindow: Window | null = null
          if (getPreview) {
            // Pre-open window to bypass popup blockers
            previewWindow = window.open('about:blank', '_blank')
            if (previewWindow) {
              previewWindow.document.write('<p style="font-family:sans-serif; text-align:center; margin-top:100px;">팩스 파일을 불러오는 중입니다...</p>')
            } else {
              toast.error('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.')
              setCheckingStatusId(null)
              return
            }
          } else {
            toast.info('팩스 전송 상태를 확인 중입니다...')
          }
          
          try {
            const res = await fetch('/api/claims/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ claimId: id, getPreview }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            
            if (getPreview && json.previewUrl) {
              if (previewWindow) {
                previewWindow.location.href = json.previewUrl
              }
            } else {
              toast.success(`상태 확인 완료: ${json.status}`)
              fetchClaims()
              if (previewWindow) previewWindow.close()
            }
          } catch (err: any) {
            toast.error('상태 확인 오류: ' + err.message)
            if (previewWindow) previewWindow.close()
          } finally {
            setCheckingStatusId(null)
          }
        }}
        onPreviewClaim={(id) => {
          window.open(`/api/claims/preview?claimId=${id}`, '_blank')
        }}
      />
    </div>
  )
}
