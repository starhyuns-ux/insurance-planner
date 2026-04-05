'use client'

import React, { useState, useEffect } from 'react'
import CardSettings from '../components/CardSettings'
import { usePlanner } from '@/lib/providers/PlannerProvider'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function CardPage() {
  const { planner, loading: plannerLoading, refreshPlanner } = usePlanner()
  
  // Local Edit State
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAffiliation, setEditAffiliation] = useState('')
  const [editRegion, setEditRegion] = useState('')
  const [editKakaoUrl, setEditKakaoUrl] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  useEffect(() => {
    if (planner) {
      setEditName(planner.name)
      setEditPhone(planner.phone || '')
      setEditAffiliation(planner.affiliation || '')
      setEditRegion(planner.region || '')
      setEditKakaoUrl(planner.kakao_url || '')
      setEditMessage(planner.advisor_message || '')
    }
  }, [planner])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planner) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('planners')
        .update({
          name: editName,
          phone: editPhone,
          affiliation: editAffiliation,
          region: editRegion,
          kakao_url: editKakaoUrl,
          advisor_message: editMessage
        })
        .eq('id', planner.id)
      
      if (error) throw error
      toast.success('프로필 정보가 저장되었습니다.')
      refreshPlanner()
    } catch (err: any) {
      toast.error('저장 중 오류: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'card') => {
    if (!planner || !e.target.files?.[0]) return
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `planner_assets/${planner.id}/${type}_${Date.now()}.${fileExt}`

    toast.info('파일 업로드 중...')
    try {
      const { error: uploadError } = await supabase.storage
        .from('planner-assets')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('planner-assets')
        .getPublicUrl(filePath)

      const updateKey = type === 'profile' ? 'profile_image_url' : 'business_card_url'
      const { error: updateError } = await supabase
        .from('planners')
        .update({ [updateKey]: publicUrl })
        .eq('id', planner.id)
      
      if (updateError) throw updateError
      
      toast.success('이미지가 업로드되었습니다.')
      refreshPlanner()
    } catch (err: any) {
      toast.error('업로드 오류: ' + err.message)
    }
  }

  if (plannerLoading) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
        onUpdateProfile={handleUpdateProfile}
        onFileUpload={handleFileUpload}
        onCopyUrl={(id) => {
          const url = `https://stroy.kr/p/${id}/card?source=copy`
          navigator.clipboard.writeText(url)
          setUrlCopied(true)
          toast.success('공유 URL이 복사되었습니다.')
          setTimeout(() => setUrlCopied(false), 2000)
        }}
        onUpdate={refreshPlanner}
      />
    </div>
  )
}
